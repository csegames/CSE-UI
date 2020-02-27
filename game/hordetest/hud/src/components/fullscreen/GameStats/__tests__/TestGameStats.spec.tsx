/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { mount } from 'enzyme';
import { GameStats } from '../index';
import { ChampionInfoContextProvider } from 'context/ChampionInfoContext';
import { MatchmakingContextProvider } from 'context/MatchmakingContext';

jest.mock('@csegames/linaria');

beforeEach(() => {
  jest.resetModules();
});

describe('Play', () => {
  it ('Handles Default Context Data', () => {
    mount(
      <ChampionInfoContextProvider>
        <MatchmakingContextProvider>
          <GameStats scenarioID='' onLeaveClick={() => {}} />
        </MatchmakingContextProvider>
      </ChampionInfoContextProvider>
    );
  });
});
