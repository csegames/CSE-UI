/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-11 16:51:06
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 19:07:35
 */

import * as React from 'react';
import * as sinon from 'sinon';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { ql, events } from 'camelot-unchained';
import { StyleSheetTestUtils } from 'aphrodite';

import TabPanel from './index';
import { testCharacterSheetState } from '../../test';

describe('<TabPanel />', () => {
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
    const dispatch = sinon.spy();
    const component = mount(
      <TabPanel
        dispatch={dispatch}
        inventoryRef={null}
        characterSheetState={testCharacterSheetState}
        tabPanelState={{ currentTabIndex: 0 }}
      />,
    );
    expect(enzymeToJson(component)).toMatchSnapshot();
  });

  test('Render items properly', async () => {
    const dispatch = sinon.spy();
    const statComponent = mount(
      <TabPanel
        dispatch={dispatch}
        inventoryRef={null}
        characterSheetState={testCharacterSheetState}
        tabPanelState={{ currentTabIndex: 0 }}
      />,
    );
    const inventoryComponent = mount(
      <TabPanel
        dispatch={dispatch}
        inventoryRef={null}
        characterSheetState={testCharacterSheetState}
        tabPanelState={{ currentTabIndex: 1 }}
      />,
    );

    expect(statComponent.find('#stat-content')).toBeTruthy();
    expect(statComponent.find('Inventory').length).toBeFalsy();

    expect(inventoryComponent.find('Inventory')).toBeTruthy();
    expect(inventoryComponent.find('#stat-content').length).toBeFalsy();
  });

  test('Test event fire', async () => {
    const dispatch = sinon.spy();
    const component = mount(
      <TabPanel
        dispatch={dispatch}
        inventoryRef={null}
        characterSheetState={testCharacterSheetState}
        tabPanelState={{ currentTabIndex: 1 }}
      />,
    );
    events.fire('hudnav--navigate', 'character');
    expect(dispatch.calledOnce).toBeTruthy();
  });
});
