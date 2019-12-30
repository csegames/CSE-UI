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
  window.chat.initialize({
    // url: `ws://localhost:8100/chat`,
    url: () => `wss://${game.serverHost}:4543/chat`,
    // url: `ws://${game.serverHost}:8100/chat`,
    characterID: () => game.characterID,
    shardID: () => game.shardID,
    onerror: err => console.error(`Chat | ${err.message}`),
    protocols: 'chat-ws',
    token: () => game.accessToken,
    debug: false,
  });
  window.chat.connect();
}

export function useChat() {
  if (!window.chat) {
    window.chat = new CSEChat();
    setTimeout(initChat, 1000);
  }
  return window.chat;
}
