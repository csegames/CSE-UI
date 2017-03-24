/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-12 09:42:34
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 10:46:21
 */

import * as React from 'react';
import * as sinon from 'sinon';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { StyleSheetTestUtils } from 'aphrodite';

import InnerOuterContainer from './index';
import { testCharacterSheetState, testArmorItem, testWeaponItem } from '../../../../test';

describe('<InnerOuterContainer />', () => {
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
      <InnerOuterContainer
        dispatch={dispatch}
        outerSlotName={'neck'}
        innerSlotName={'neckUnder'}
        characterSheetState={testCharacterSheetState}
      />,
    );
    expect(enzymeToJson(component)).toMatchSnapshot();
  });

  test('Renders properly', async () => {
    const dispatch = sinon.spy();
    const component = mount(
      <InnerOuterContainer
        dispatch={dispatch}
        outerSlotName={'neck'}
        innerSlotName={'neckUnder'}
        characterSheetState={testCharacterSheetState}
      />,
    );
    expect(component.find('ItemSlot').length).toBe(2);
  });
});
