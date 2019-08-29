/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import cse from './cse';

export {
  cse,
};

interface DisplayOpts<T> {
  hd: T;
  uhd: T;
}

declare global {
  interface Theme {

    name: string;
    description: string;
    author: string;

    unitFrames: {
      color: {
        health: string;
        blood: string;
        stamina: string;
        panic: string;
        wound: string;
      };
    };

    actionButtons: {
      color: {
        ready: string;
        unavailable: string;
        error: string;
        queued: string;
        coolDown: string;
        modalOn: string;

        beginCast: string;
        preparation: string;
        recovery: string;
        active: string;
        disruption: string;
        hit: string;
        channelling: string;

        bgOuterRing: string;
        bgInnerRing: string;
      };
      display: DisplayOpts<{
        ringStrokeWidth: number,
        radius: number;
      }>;
    };

    toolTips: {
      color: {
        [Faction.Arthurian]: string;
        [Faction.TDD]: string;
        [Faction.Viking]: string;
        [Faction.Factionless]: string;
      },
    };

    scenarioScoreboard: {
      color: {
        background: {
          [Faction.Arthurian]: string;
          [Faction.TDD]: string;
          [Faction.Viking]: string;
        },
        text: {
          progress: string;
          [Faction.Arthurian]: string;
          [Faction.TDD]: string;
          [Faction.Viking]: string;
        },
      };
    };
  }
}

