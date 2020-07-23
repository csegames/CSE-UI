/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { mount } from 'enzyme';
import { ChampionSelect } from '../index';
import { ChampionInfoContextProvider } from 'context/ChampionInfoContext';
import { MatchmakingContextProvider } from 'context/MatchmakingContext';
import { InputContextProvider } from 'context/InputContext';
import { ColossusProfileProvider } from 'context/ColossusProfileContext';

jest.mock('@csegames/linaria');

beforeEach(() => {
  jest.resetModules();
});

describe('Champion Select', () => {
  it ('Handles Default Context Data', () => {
    mount(
      <ChampionInfoContextProvider>
        <MatchmakingContextProvider>
          <InputContextProvider>
            <ColossusProfileProvider>
              <ChampionSelect
                gameMode={'Survival'}
                difficulty={'Normal'}
                onSelectionTimeOver={() => {}}
              />
            </ColossusProfileProvider>
          </InputContextProvider>
        </MatchmakingContextProvider>
      </ChampionInfoContextProvider>
    );
  });
});
