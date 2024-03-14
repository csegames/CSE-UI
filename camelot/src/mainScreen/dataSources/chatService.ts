/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';
import { game } from '@csegames/library/dist/_baseGame';
import { Client, Element } from 'node-xmpp-client';
import {
  clearRoomSends,
  joinRoom,
  receiveCombatEvent,
  receiveConsoleText,
  receiveStanza
} from '../redux/chatSlice';
import { RootState } from '../redux/store';
import { Dispatch } from '@reduxjs/toolkit';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

const chatAddress = 'chat.camelotunchained.com';
const chatWebsocketURL = `ws://${chatAddress}:8222/api/chat`;
const chatService = 'conference';

export const chatGlobalRoomID = '_global';
export const chatCombatRoomID = 'combat';
export const chatSystemRoomID = 'system';

export class ChatService extends ExternalDataSource {
  private client: Client | null = null;
  private combatEventHandle: ListenerHandle | null = null;
  private consoleTextHandle: ListenerHandle | null = null;

  protected bind(): Promise<ListenerHandle[]> {
    this.createClient();
    this.listenForCombatEvents();
    this.listenForConsoleText();

    return Promise.resolve([
      {
        close: () => {
          this.closeClient();
          this.closeCombatEventHandle();
          this.closeConsoleTextHandle();
        }
      }
    ]);
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);
    if (this.client && reduxState.chat.roomSends.length > 0) {
      for (const send of reduxState.chat.roomSends) {
        try {
          this.client.send(
            new Element('message', {
              to: `${send.roomID}@${chatService}.${chatAddress}`,
              type: 'groupchat'
            })
              .c('body')
              .t(send.contents)
          );
        } catch (error) {
          console.error('Failed to send message', error);
        }
      }
      this.dispatch(clearRoomSends());
    }
  }

  private createClient(): void {
    function cseLoginTokenMechanism() {}
    cseLoginTokenMechanism.prototype.name = 'CSELOGINTOKEN';
    cseLoginTokenMechanism.prototype.authAttrs = function () {
      return {};
    };
    cseLoginTokenMechanism.prototype.auth = function () {
      return game.accessToken;
    };
    cseLoginTokenMechanism.prototype.match = function (options: any) {
      if (options.loginToken) {
        return true;
      }
      return false;
    };

    this.client = new Client({
      websocket: { url: chatWebsocketURL },
      jid: `none@${chatAddress}/${genID()}`,
      loginToken: true,
      access_token: game.accessToken
    });
    this.client.registerSaslMechanism(cseLoginTokenMechanism);

    this.client.on('error', (error) => {
      console.error('Chat client error', error);
    });

    this.client.on('online', () => {
      this.joinRoom(chatGlobalRoomID);
    });

    this.client.on('stanza', (stanza) => {
      if (stanza.name === 'message' && stanza.attrs.type === 'groupchat') {
        this.dispatch(receiveStanza(stanza));
      }
    });
  }

  private listenForCombatEvents(): void {
    this.combatEventHandle = game.onCombatEvent((combatEvents) => {
      for (const combatEvent of combatEvents) {
        this.dispatch(receiveCombatEvent(combatEvent));
      }
    });
  }

  private listenForConsoleText(): void {
    this.consoleTextHandle = game.onConsoleText((consoleText) => {
      this.dispatch(receiveConsoleText(consoleText));
    });
  }

  private joinRoom(roomID: string): void {
    this.dispatch(joinRoom(chatGlobalRoomID));
    const to = `${roomID}@${chatService}.${chatAddress}/${this.client.jid._local}`;
    this.client.send(new Element('presence', { to }).c('x', { xmlns: 'http://jabber.org/protocol/muc' }));
  }

  private closeClient(): void {
    if (this.client) {
      this.client.removeAllListeners('error');
      this.client.removeAllListeners('online');
      this.client.removeAllListeners('stanza');
      this.client = null;
    }
  }

  private closeCombatEventHandle(): void {
    if (this.combatEventHandle) {
      this.combatEventHandle.close();
      this.combatEventHandle = null;
    }
  }

  private closeConsoleTextHandle(): void {
    if (this.consoleTextHandle) {
      this.consoleTextHandle.close();
      this.consoleTextHandle = null;
    }
  }
}
