/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default function(): ChatTheme {
  return {
    chatline: {
      color: {
        timestamp: '#999',
        author: 'cyan',
        content: '#ccc',
        cseAuthor: 'yellow',
      },
      fontFamily: 'Lato',
    },
    input: {
      color: 'white',
      fontFamily: 'Lato',
    },
    tab: {
      activeOrnament: {
        hd: '',
        uhd: '',
      },
      fontFamily: 'Lato',
    },
    pane: {
      style: {
        hd: {
          background: 'url(images/chat/hd/modal-bg.jpg)'
        },
        uhd: {
          background: 'url(images/chat/uhd/modal-bg.jpg)'
        },
      },
    },
  };
}
