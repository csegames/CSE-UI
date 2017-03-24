/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-11 18:54:43
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 19:01:45
 */

import * as React from 'react';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { StyleSheetTestUtils } from 'aphrodite';

import CharacterMain from './index';
import { testCharacterSheetState } from '../../test';

describe('<CharacterMain />', () => {
  beforeEach(() => {
      StyleSheetTestUtils.suppressStyleInjection();
  });
  afterEach(() => {
    return new Promise((resolve) => {
      StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
      return process.nextTick(resolve);
    });
  });

  test('Matches Snapshot', async () => {
    const component = mount(
      <CharacterMain
        tabPanelState={{ currentTabIndex: 1 }}
        characterSheetState={testCharacterSheetState}
      />,
    );
    expect(enzymeToJson(component)).toMatchSnapshot();
  });

  test('Render properly', async () => {
    const component = mount(
      <CharacterMain
        tabPanelState={{ currentTabIndex: 1 }}
        characterSheetState={testCharacterSheetState}
      />,
    );

    expect(component.find('.container')).toBeTruthy();
    expect(component.find('PaperDoll')).toBeTruthy();
    expect(component.find('TabPanel')).toBeTruthy();
  });
});
