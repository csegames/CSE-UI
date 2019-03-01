/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default function(): Theme {
  return {
    name: 'cse',
    description: 'The default CSE theme.',
    author: 'City State Entertainment',

    unitFrames: {
      color: {
        health: '#3FA7FF',
        blood: '#DF2E00',
        stamina: '#53FF64',
        panic: '#FFF153',
      },
    },

    actionButtons: {
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
        bgInnerRing: 'transparent',
      },
      display: {
        hd: {
          ringStrokeWidth: 2,
          radius: 22,
        },
        uhd: {
          ringStrokeWidth: 3,
          radius: 33,
        },
      },
    },

    toolTips: {
      color: {
        [Faction.Arthurian]: 'rgba(247, 33, 33, 0.25)',
        [Faction.TDD]: 'rgba(196, 216, 1, 0.25)',
        [Faction.Viking]: 'rgba(35, 155, 242, 0.25)',
        [Faction.Factionless]: 'rgba(20, 20, 20, 0.25)',
      },
    },

    scenarioScoreboard: {
      color: {
        background: {
          [Faction.Arthurian]: 'rgba(247, 33, 33, 0.15)',
          [Faction.TDD]: 'rgba(196, 216, 1, 0.15)',
          [Faction.Viking]: 'rgba(35, 155, 242, 0.15)',
        },
        text: {
          progress: '#FEF4CB',
          [Faction.Arthurian]: '#FF9F9F',
          [Faction.Viking]: '#AADAFF',
          [Faction.TDD]: '#E7FF9F',
        },
      },
    },
  };
}
