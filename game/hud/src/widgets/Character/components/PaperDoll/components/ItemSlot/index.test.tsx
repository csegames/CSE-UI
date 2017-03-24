/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-12 09:42:34
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 11:55:39
 */

import * as React from 'react';
import * as sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { StyleSheetTestUtils } from 'aphrodite';

import ItemSlot from './index';
import { testCharacterSheetState, testArmorItem, testWeaponItem } from '../../../../test';

describe('<ItemSlot />', () => {
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
      <ItemSlot
        dispatch={dispatch}
        item={testArmorItem}
        characterSheetState={testCharacterSheetState}
        slotName={'neck'}
        slotType={'major'}
      />,
    );
    expect(enzymeToJson(component)).toMatchSnapshot();
  });

  test('Renders major slot', async () => {
    const dispatch = sinon.spy();
    const component = mount(
      <ItemSlot
        dispatch={dispatch}
        item={testArmorItem}
        characterSheetState={testCharacterSheetState}
        slotName={'neck'}
        slotType={'major'}
      />,
    );
    expect(component.find('#major-container').length).toBe(1);
    expect(component.find('#minor-container').length).toBe(0);
  });

  test('Renders minor slot', async () => {
    const dispatch = sinon.spy();
    const component = mount(
      <ItemSlot
        dispatch={dispatch}
        item={testArmorItem}
        characterSheetState={testCharacterSheetState}
        slotName={'neckUnder'}
        slotType={'minor'}
      />,
    );
    expect(component.find('#minor-container').length).toBe(1);
    expect(component.find('#major-container').length).toBe(0);
  });

  test('Renders empty slot', async () => {
    const dispatch = sinon.spy();
    const component = mount(
      <ItemSlot
        dispatch={dispatch}
        item={null}
        characterSheetState={testCharacterSheetState}
        slotName={'neck'}
        slotType={'major'}
      />,
    );
    expect(component.find('#empty-container').length).toBe(1);
    expect(component.find('#major-container').length).toBe(0);
    expect(component.find('#minor-container').length).toBe(0);
  });

  test('If potential gear slot then highlight', async () => {
    const dispatch = sinon.spy();
    const characterSheetState = {
      ...testCharacterSheetState,
      potentialCharacterSlots: testArmorItem.gearSlot,
    };
    const component = mount(
      <ItemSlot
        dispatch={dispatch}
        item={testArmorItem}
        characterSheetState={characterSheetState}
        slotName={'neck'}
        slotType={'major'}
      />,
    );
    expect(component.find('#major-container-potential-slot').length).toBe(1);
  });
});
