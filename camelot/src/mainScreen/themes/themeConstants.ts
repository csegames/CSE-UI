/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface ChatTheme {
  chatline: {
    color: {
      timestamp: string;
      author: string;
      content: string;
      cseAuthor: string; // color UCE names differently
      dm: string; // color Direct Messages differently
    };
    fontFamily: string;
  };
  input: {
    color: string;
    fontFamily: string;
  };
  tab: {
    activeOrnamentURL: string;
    fontFamily: string;
  };
  pane: {
    backgroundURL: string;
  };
}

export interface Theme {
  name: string;
  description: string;
  author: string;

  chat: ChatTheme;

  unitFrames: {
    color: {
      health: string;
      blood: string;
      stamina: string;
      panic: string;
      wound: string;
      fortitude: string;
    };
  };

  abilityButtons: {
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
    display: {
      ringStrokeWidth: number; //vmin
      radius: number; //vmin
    };
  };

  scenarioScoreboard: {
    color: {
      progressText: string;
    };
  };
}
