/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { BaseGameInterface } from '@csegames/library/dist/_baseGame/BaseGameInterface';
import { CSEChat } from '@csegames/library/dist/_baseGame/chat/CSEChat';

export var chat: CSEChat | undefined;
var chatTimeoutID: NodeJS.Timeout = null;

export function disconnectChat() {
  if (!chat || !chat.disconnect) {
    console.log("Tried to disconnect from chat when there wasn't a connection");
    return;
  }

  console.log('disconnecting from chat...');
  chat.disconnect();
}

export function initChat(game: BaseGameInterface, serverHost: string) {
  if (!serverHost) {
    return false;
  }

  console.log(`Initializing chat connection with ${serverHost}`);

  if (!chat) {
    chat = new CSEChat(game);
  }
  chat.initialize({
    getUrl: () => `wss://${serverHost}:4543/chat`,
    getCharacterID: () => game.characterID,
    getToken: () => game.accessToken,
    protocols: ['chat-ws']
  });
  chat.connect();
  return true;
}

export function useChat(game: BaseGameInterface, host?: string): CSEChat {
  const serverHost = host ? host : game.serverHost;
  if (chatTimeoutID !== null) {
    return chat;
  } else if (!chat) {
    chat = new CSEChat(game);
    chatTimeoutID = setTimeout(() => initChat(game, serverHost), 1000);
    clearTimeout(chatTimeoutID);
    chatTimeoutID = null;
  } else if (!chat.hasSender()) {
    // chat was made but still has default values
    initChat(game, serverHost);
  }
  return chat;
}
