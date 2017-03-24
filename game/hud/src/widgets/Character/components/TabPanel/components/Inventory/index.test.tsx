/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-11 11:57:51
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 17:29:42
 */

import * as React from 'react';
import * as sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { ql } from 'camelot-unchained';
import { StyleSheetTestUtils } from 'aphrodite';
import { createStore } from 'redux';

import Inventory from './index';
import { ItemInfo } from '../../../../services/types/inventoryTypes';
import { testInventoryItems } from '../../../../test';

const mockStore = createStore(() => {});

describe('<Inventory />', () => {
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
      <Inventory
        items={testInventoryItems}
        stacks={{}}
        expandedSlots={[]}
        expandedId={''}
        inventoryRef={null}
        characterSheetState={null}
      />,
    );
    expect(enzymeToJson(component)).toMatchSnapshot();
  });
  /*test('Test filter functionality', async () => {
    const component = mount(
      <Inventory
        items={testInventoryItems}
        stacks={{}}
        expandedSlots={[]}
        expandedId={''}
        inventoryRef={null}
        characterSheetState={null}
      />
    );
  });*/
});
