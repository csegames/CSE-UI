import * as React from 'react';

import { ReceivedResponse } from '@csegames/library/dist/chat/generated/uce-chat-v3';
import { ChatLine } from '../ChatLine';
import { ChatScope } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';
import { allChatScopeDisplayData, getCSSProperties } from '../ChatScopes';
import { getStringTableValue, StringIDGeneralUnnamed } from '../../../helpers/stringTableHelpers';
import { store } from '../../../redux/store';
import { ContextMenuItem, showContextMenu } from '../../../redux/contextMenuSlice';
import { callCreateInvitation } from '../../../helpers/rest/warbandsRestCalls';
// Guild invite disabled until chat messages carry an account ID.
// Re-enable with callCreateGuildInvitation(message.senderAccountID).
// import { callCreateGuildInvitation } from '../../../helpers/rest/guildsRestCalls';

const SenderName = 'HUD-Chat-SenderName';

// Reuse the unit-frame string IDs so the chat menu labels match the portrait menu.
const StringIDChatInviteParty = 'UnitFrameContextInviteParty';
// const StringIDChatInviteGuild = 'UnitFrameContextInviteGuild';

export class ChatLineMessage extends ChatLine {
  constructor(
    scope: ChatScope,
    readonly message: ReceivedResponse,
    readonly segments: React.ReactChild[],
    private readonly startWhisper: (name: string) => void
  ) {
    super(scope, message.sentAt);
  }

  render(): React.ReactChild {
    const scope = this.message.room.scope as ChatScope;

    const scopeDisplayData = allChatScopeDisplayData[scope];

    const scopeName = getStringTableValue(
      scopeDisplayData?.nameStringID ?? StringIDGeneralUnnamed,
      store.getState().stringTable.stringTable
    );

    return (
      <div key={this.id} style={getCSSProperties(scope)}>
        <span>{`<${scopeName}> [`}</span>
        <span className={SenderName} onMouseDown={(e) => this.handleNameMouseDown(e)}>
          {this.message.senderName}
        </span>
        <span>{`]:\xa0`}</span>
        <span>{this.segments}</span>
      </div>
    );
  }

  private handleNameMouseDown(e: React.MouseEvent): void {
    const self = store.getState().entities.self;
    // No actions on your own characters (current or any alt on your account).
    const myCharacters = store.getState().characters.characters;
    if (this.message.senderID === self.characterID || myCharacters.some((c) => c.id === this.message.senderID)) {
      return;
    }
    // No actions on players from another faction (a Factionless/0 value is skipped).
    if (this.message.senderFaction && this.message.senderFaction !== self.faction) {
      return;
    }

    // Left click opens a whisper to this player.
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      this.startWhisper(this.message.senderName);
      return;
    }

    // Right click opens the invite menu. Coherent does not reliably fire onContextMenu, so we detect the button here.
    if (e.button !== 2) {
      return;
    }

    const stringTable = store.getState().stringTable.stringTable;
    const content: ContextMenuItem[] = [
      {
        title: getStringTableValue(StringIDChatInviteParty, stringTable),
        onClick: (dispatch) => dispatch(callCreateInvitation(this.message.senderID))
      }
      // Guild invite disabled until the account ID is available
      // {
      //   title: getStringTableValue(StringIDChatInviteGuild, stringTable),
      //   onClick: (dispatch) => dispatch(callCreateGuildInvitation(this.message.senderAccountID))
      // }
    ];

    store.dispatch(
      showContextMenu({
        id: `ChatSenderMenu:${this.id}`,
        content,
        mouseX: e.clientX,
        mouseY: e.clientY
      })
    );
    e.stopPropagation();
  }
}
