/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { CSEChat, TimedMessage } from '@csegames/library/dist/_baseGame/chat/CSEChat';
import { chat } from '@csegames/library/dist/_baseGame/chat/chat_proto';
import { Dispatch } from 'redux';
import { RootState } from '../redux/store';
import { FeatureFlags } from '../redux/featureFlagsSlice';
import { game } from '@csegames/library/dist/_baseGame';

import { PresenceAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { showError } from '../redux/navigationSlice';
import {
  DEFAULT_CHAT_ROOM_ID,
  MessageParsingRequest,
  RoomState,
  addDMSenderName,
  clearChatHistory,
  clearChatRequests,
  logChatMessageSent,
  updateChatReceived,
  updateChatRooms,
  updateJoinedRooms
} from '../redux/chatSlice';
import { tryParseJSON } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { CircularArray } from '@csegames/library/dist/_baseGame/types/CircularArray';
import { getAccountID } from '@csegames/library/dist/_baseGame/utils/accountUtils';
import { webConf } from './networkConfiguration';
import { isMatch } from '../redux/matchSlice';

const RoomCategory = chat.RoomInfo.RoomCategory;
const DEFAULT_CHAT_SERVER_PORT = 4543;

interface ReactProps {
  slashCommands: SlashCommandRegistry<RootState>;
}

interface ChatServerRecord {
  Address: string;
  Transport: string;
}

// These are some default roomIDs that are reserved by the system for particular types of messages.
// As such, they get assigned special shortcuts.
const GLOBAL = [DEFAULT_CHAT_ROOM_ID, '0000000000000000000002', '0000000000000000000003'];
const PLAYER_HELP = ['0000000000000000000010', '0000000000000000000011', '0000000000000000000012'];
const CUBE = ['0000000000000000000014', '0000000000000000000015', '0000000000000000000016'];

// These are some default shortcuts for a few RoomCategories.
const defaultShortcutPrefixes = {
  warband: ['w', 'p'],
  order: ['o', 'g'],
  campaign: ['c'],
  custom: ['k'],
  help: ['h']
};

// We assign default shortcuts based on a room's RoomCategory, but multiple rooms
// may have the same category.  We resolve this by adding a number (index) to the
// shortcuts for all rooms in a category beyond the first.  E.g. the first Party
// room gets `/p`, the second Party room gets `/p1`, then `/p2`, etc.
interface ShortcutIndices {
  general: number;
  warband: number;
  order: number;
  campaign: number;
  custom: number;
  global: number;
  help: number;
  cube: number;
}

function defaultShortcutIndices(): ShortcutIndices {
  return {
    general: 0,
    warband: 0,
    order: 0,
    campaign: 0,
    custom: 0,
    global: 0,
    help: 0,
    cube: 0
  };
}

function getCustomShortcuts(roomID: string): string[] {
  const stringVal = localStorage.getItem(`CSE_CHAT_Room_Shortcut_${roomID}`);
  if (!stringVal) {
    return null;
  }
  return tryParseJSON<string[]>(stringVal, false);
}

// Note : this is expected to be late bound when the hud is created, which should occur
// after initialization is complete.
export class ChatService extends ExternalDataSource<ReactProps> implements ListenerHandle {
  private service: CSEChat = new CSEChat();
  private connecting: boolean = false;
  private indices: ShortcutIndices = defaultShortcutIndices();
  private shortcuts: Dictionary<string> = {};

  protected async bind(): Promise<ListenerHandle[]> {
    this.service.onDirectory(this.handleChatDirectoryUpdate.bind(this));
    this.service.onRoomJoined(this.handleChatRoomJoined.bind(this));
    this.service.onChatMessage(this.handleChatReceived.bind(this));
    return [this];
  }

  close(): void {
    if (this.service.connected) {
      this.service.disconnect();
    }
    this.dispatch(clearChatHistory());
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);

    const { initialization } = this.reduxState;

    if (initialization.completed && !this.connecting) {
      this.setup();
    }

    if (this.reduxState.chat.incomingText.length > 0) {
      const msgs = this.reduxState.chat.incomingText;
      this.dispatch(clearChatRequests());
      window.setTimeout(() => this.parseMessages(msgs), 0);
    }
  }

  private setup(): void {
    if (FeatureFlags.FFA.isEnabled(this.reduxState)) {
      this.connecting = true;
      window.setTimeout(this.lookupHost.bind(this), 0);
      return;
    }

    if (!isMatch(this.reduxState.match.currentRound)) {
      return;
    }

    const chatServerAddress = this.reduxState.match.currentRound?.chatServerAddress;
    if (chatServerAddress) {
      this.connecting = true;
      const fragments = chatServerAddress.split(':');
      const host = fragments[0];
      const port = Number(fragments[1]);
      window.setTimeout(this.connect.bind(this, host, port), 0);
      return;
    }
    if (game.isAutoConnectEnabled && game.serverHost) {
      this.connecting = true;
      window.setTimeout(this.connect.bind(this, game.serverHost, DEFAULT_CHAT_SERVER_PORT), 0);
      return;
    }
  }

  private async lookupHost(): Promise<void> {
    const res = await PresenceAPI.GetChatServer(webConf);
    if (!res.ok) {
      this.dispatch(showError(res));
      return;
    }
    try {
      const data = res.json<ChatServerRecord>();
      const fragments = data.Address.split(':');
      const host = fragments[0];
      const port = fragments.length > 1 ? Number(fragments[1]) : 4553;
      this.connect(host, port);
    } catch (e) {
      this.dispatch(
        showError({
          severity: 'standard',
          title: 'Chat Error',
          message: 'Unable to parse chat host',
          code: 'chat_error'
        })
      );
    }
  }

  private connect(host: string, port: number): void {
    this.service.connect({
      getUrl: () => `wss://${host}:${port}/chat`,
      getToken: () => game.accessToken,
      getCharacterID: () => game.characterID,
      verboseLogging: game.debug
    });
  }

  private handleChatDirectoryUpdate(directory: chat.RoomDirectory) {
    this.indices = defaultShortcutIndices();
    this.shortcuts = {};
    const rooms: Dictionary<RoomState> = {};
    for (const src of directory.rooms) {
      const room: RoomState = {
        ...src,
        color: 'white',
        shortcuts: this.generateShortcuts(src),
        joined: false,
        messageCounter: 0,
        messages: new CircularArray<TimedMessage>()
      };
      rooms[src.roomID] = room;
      for (const s in room.shortcuts) {
        this.shortcuts[s] = src.roomID;
      }
    }

    // FSR only has one active channel in its UI, the first global channel
    window.setTimeout(() => this.service.joinRoom(DEFAULT_CHAT_ROOM_ID), 1);

    this.dispatch(updateChatRooms(rooms));
  }

  private handleChatRoomJoined(result: chat.RoomJoined) {
    if (result.userID === getAccountID(game.accessToken)) {
      this.dispatch(updateJoinedRooms(result));
    }
  }

  private handleChatReceived(message: TimedMessage) {
    // For DMs, also keep track of senders so we can /r at them.
    if (message.type === chat.ChatMessage.MessageTypes.Direct) {
      // But don't add yourself to the sender list.
      if (this.reduxState.player.name !== message.senderName) {
        this.dispatch(addDMSenderName(message.senderName));
      }
    }
    this.dispatch(updateChatReceived(message));
  }

  private generateShortcuts(info: chat.IRoomInfo): string[] {
    // If there is a user-designated override, use that.
    let shortcuts = getCustomShortcuts(info.roomID);
    if (shortcuts) {
      return shortcuts;
    }

    if (GLOBAL.includes(info.roomID)) {
      let i = this.indices['global']++;
      return i === 0 ? ['g', 'global'] : ['g' + i, 'global' + i];
    }

    if (PLAYER_HELP.includes(info.roomID)) {
      let i = this.indices['help']++;
      return i === 0 ? ['h', 'help'] : ['h' + i, 'help' + i];
    }

    if (CUBE.includes(info.roomID)) {
      let i = this.indices['cube']++;
      return i === 0 ? ['c', 'cube'] : ['c' + i, 'cube' + i];
    }

    switch (info.category) {
      case RoomCategory.GENERAL:
        // Just converting numbers to strings.  So these shortcuts are /0, /1, /2, etc.
        return [this.indices['general']++ + ''];
      case RoomCategory.WARBAND: {
        let i = this.indices['warband']++;
        return defaultShortcutPrefixes.warband.map((s) => (i === 0 ? s : s + i));
      }
      case RoomCategory.ORDER: {
        let i = this.indices['order']++;
        return defaultShortcutPrefixes.order.map((s) => (i === 0 ? s : s + i));
      }
      case RoomCategory.CAMPAIGN: {
        let i = this.indices['campaign']++;
        return defaultShortcutPrefixes.campaign.map((s) => (i === 0 ? s : s + i));
      }
      case RoomCategory.CUSTOM: {
        let i = this.indices['custom']++;
        return defaultShortcutPrefixes.custom.map((s) => (i === 0 ? s : s + i));
      }
    }
  }

  private parseMessages(msgs: MessageParsingRequest[]): void {
    for (const msg of msgs) {
      // note that we're passing a filter as a roomID here; in practice
      // the only source of messages will be the first global room and
      // that ID is also what is set as the active filter in our only
      // context.
      this.parseMessage(msg.content, msg.fromFilter);
    }
  }

  private parseMessage(content: string, fromRoomID: string): void {
    if (content.length < 1) {
      return;
    }

    this.dispatch(logChatMessageSent(content));

    if (!content.startsWith('/')) {
      this.service.sendMessageToRoom(content, fromRoomID);
      return;
    }

    var split = content.split(' ');
    var shortcut = split[0].slice(1).trim();

    if (shortcut === 'dm' || shortcut === 'pm' || shortcut === 'r') {
      var textOffset = 1;
      var target: string = undefined;
      if (split.length > 2) {
        target = split[1].trim();
        textOffset = 2;
      }
      const text = split.slice(textOffset).join(' ');
      this.service.sendDirectMessage(text, null, target);
      return;
    }

    // Do not allow a user to speak into a room they haven't joined
    const rooms = this.reduxState.chat.rooms;
    const roomID = this.shortcuts[shortcut];
    if (roomID && rooms[roomID]?.joined) {
      const text = split.slice(1).join(' ');
      this.service.sendMessageToRoom(text, roomID);
      return;
    }

    // The leading slash token isn't an alias for a joined room,
    // treat it like a console command, either UI or back end
    const cmd = content.slice(1);
    if (!this.props.slashCommands.parse(cmd)) {
      game.sendSlashCommand(cmd);
    }
  }
}
