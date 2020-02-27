/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { mount } from 'enzyme';
import { Play } from '../index';
import { InputContextProvider } from 'context/InputContext';
import { ColossusProfileProvider } from 'context/ColossusProfileContext';
import { ChampionInfoContextProvider } from 'context/ChampionInfoContext';
import { MatchmakingContextProvider } from 'context/MatchmakingContext';
import { MyUserContextProvider } from 'context/MyUserContext';
import { WarbandContextProvider } from 'context/WarbandContext';

jest.mock('@csegames/linaria');

beforeEach(() => {
  jest.resetModules();
});

describe('Play', () => {
  it ('Handles Default Context Data', () => {
    mount(
      <InputContextProvider>
        <ColossusProfileProvider>
          <ChampionInfoContextProvider>
            <MatchmakingContextProvider>
              <MyUserContextProvider>
                <WarbandContextProvider>
                  <Play />
                </WarbandContextProvider>
              </MyUserContextProvider>
            </MatchmakingContextProvider>
          </ChampionInfoContextProvider>
        </ColossusProfileProvider>
      </InputContextProvider>
    );
  });
});
