/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Theme } from './themeConstants';

export const defaultTheme: Theme = {
  name: 'default',
  description: 'The default UCE theme.',
  author: 'Unchained Entertainment, LLC',

  chat: {
    chatline: {
      color: {
        timestamp: '#999',
        author: 'yellow',
        content: '#ccc',
        cseAuthor: 'green',
        dm: 'cyan'
      },
      fontFamily: 'TitilliumWeb'
    },
    input: {
      color: 'white',
      fontFamily: 'TitilliumWeb'
    },
    tab: {
      activeOrnamentURL: '',
      fontFamily: 'TitilliumWeb'
    },
    pane: {
      backgroundURL: 'url(images/chat/hd/modal-bg.jpg)'
    }
  },

  unitFrames: {
    color: {
      health: '#3FA7FF',
      blood: '#DF2E00',
      stamina: '#53FF64',
      panic: '#FFF153',
      wound: '#A02106',
      fortitude: '#008080'
    }
  },

  abilityButtons: {
    color: {
      ready: 'cyan',
      unavailable: '#C1000E',
      error: 'red',
      queued: '#FF7C24',
      coolDown: 'white',
      modalOn: '#aaa',

      beginCast: '#ffdf00',
      preparation: '#FF9F19',
      recovery: '#19abff',
      active: '#fff570',
      disruption: '#d700ff',
      hit: '#fff570',
      channelling: '#C5FFC5',

      bgOuterRing: '#111',
      bgInnerRing: '#000'
    },
    display: {
      ringStrokeWidth: 0.226, //vmin
      radius: 2.49 //vmin
    }
  },

  scenarioScoreboard: {
    color: {
      progressText: '#FEF4CB'
    }
  }
};
