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
      fontFamily: 'TitilliumWeb',
    },
    input: {
      color: 'white',
      fontFamily: 'TitilliumWeb',
    },
    tab: {
      activeOrnament: {
        hd: '',
        uhd: '',
      },
      fontFamily: 'TitilliumWeb',
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
