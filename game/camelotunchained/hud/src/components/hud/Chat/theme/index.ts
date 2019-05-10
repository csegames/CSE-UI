/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useReducer, useEffect } from 'react';

export function useChatTheme(): ChatTheme {
  const [, forceUpdate] = useReducer(_ => _ + 1, 0);
  useEffect(() => {
    const handle = game.on('__CSE_update-theme', forceUpdate);
    return () => handle.clear();
  }, []);
  return window.currentTheme.chat;
}

type VARIABLE<T> = {
  hd: T;
  uhd: T;
}

type ImageSrc = VARIABLE<string>;

declare global {
  interface ChatTheme {
    chatline: {
      color: {
        timestamp: string;
        author: string;
        content: string;
        cseAuthor: string; // color CSE names differently
      };
      fontFamily: string;
    };
    input: {
      color: string;
      fontFamily: string;
    };
    tab: {
      activeOrnament: ImageSrc;
      fontFamily: string;
    };
    pane: {
      style: VARIABLE<{
        background: string;
      }>;
    }
  }

  interface Theme {
    chat: ChatTheme;
  }

  interface Window {
    currentTheme: Theme;
  }
}
