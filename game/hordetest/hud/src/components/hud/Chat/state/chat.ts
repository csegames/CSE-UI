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

export function disconnectChat() {
  if (!window.chat || !window.chat.disconnect) {
    console.log('Tried to disconnect from chat when there wasnt a connection');
    return;
  }

  console.log('disconnecting from chat...')
  window.chat.disconnect();
}

export function initChat(serverHost: string) {
  console.log(`Initializing chat connection with ${serverHost}`);

  if (!serverHost || serverHost === 'hatchery.camelotunchained.com') {
    console.error('Failed to initialize chat. game.serverHost is returning an invalid URL');
    return;
  }

  if (!window.chat) {
    window.chat = new CSEChat();
  }
  window.chat.initialize({
    url: () => `ws://${serverHost}:4543/chat`,
    characterID: () => game.characterID,
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
    setTimeout(() => initChat(game.serverHost), 1000);
  }
  return window.chat;
}
