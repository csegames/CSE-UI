/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-11 16:30:24
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 18:20:55
 */

import * as React from 'react';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { ql } from 'camelot-unchained';
import { StyleSheetTestUtils } from 'aphrodite';
import { createStore } from 'redux';

import Item from './index';
import { ItemInfo } from '../../../../services/types/inventoryTypes';
import { testWeaponItem, testArmorItem } from '../../../../test';

const mockStore = createStore(() => {});

describe('<Item />', () => {
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
      <Item item={testWeaponItem} stack={[]} characterSheetState={null} onClick={() => {}} expandedId='' />,
    );
    expect(enzymeToJson(component)).toMatchSnapshot();
  });

  test('Render items properly', async () => {
    const emptyComponent = mount(
      <Item characterSheetState={null} onClick={() => {}} expandedId='' />,
    );
    const filledComponent = mount(
      <Item item={testWeaponItem} stack={[]} characterSheetState={null} onClick={() => {}} expandedId='' />,
    );

    expect(filledComponent.find('.itemContainer')).toBeTruthy();
    
    expect(emptyComponent.find('#empty-item').length > 0).toBeTruthy();
    expect(filledComponent.find('#empty-item').length === 0).toBeTruthy();
  });
});
