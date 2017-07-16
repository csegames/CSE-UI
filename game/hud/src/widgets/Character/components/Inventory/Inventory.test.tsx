/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-11 11:57:51
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-07-11 16:20:49
 */

import * as React from 'react';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { StyleSheetTestUtils } from 'aphrodite';

import Inventory from './Inventory';

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
      <Inventory />,
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
