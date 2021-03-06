/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { CSEChat } from "@csegames/library/lib/_baseGame/chat/CSEChat";

declare global {
  interface Window {
    chat: CSEChat;
    initChat: () => void;
  }
}

async function initChat() {

  try {
    // const response = await game.webAPI.GameDataAPI.GetChatAddressV1(game.webAPI.defaultConfig, game.shardID);
    // const result = response.json<ChatServerAddress>();
    // console.log(`chat address from api ${result.Address}`);
    window.chat.initialize({
      url: () => `wss://${game.serverHost}:4543/chat`,
      // url: `ws://${game.serverHost}:8100/chat`,
      characterID: () => game.characterID,
      onerror: err => console.error(`Chat | ${err.message}`),
      protocols: 'chat-ws',
      token: () => game.accessToken,
      debug: false,
    });
    window.chat.connect();
  } catch (err) {
    console.error('Failed to get chat server address from WebApi with error ' + JSON.stringify(err));
  }
}

export function useChat() {
  if (!window.chat) {
    window.chat = new CSEChat();
    setTimeout(initChat, 1);
  }
  return window.chat;
}
