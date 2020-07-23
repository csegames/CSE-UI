/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { mount } from 'enzyme';
import { ChampionProfile } from '../index';
import { InputContextProvider } from 'context/InputContext';
import { ColossusProfileProvider } from 'context/ColossusProfileContext';
import { ChampionInfoContextProvider } from 'context/ChampionInfoContext';

jest.mock('@csegames/linaria');

beforeEach(() => {
  jest.resetModules();
});

describe('Champion Profile', () => {
  it ('Handles Default Context Data', () => {
    mount(
      <InputContextProvider>
        <ChampionInfoContextProvider>
          <ColossusProfileProvider>
            <ChampionProfile />
          </ColossusProfileProvider>
        </ChampionInfoContextProvider>
      </InputContextProvider>
    );
  });
});
