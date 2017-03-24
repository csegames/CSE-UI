/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-11 19:11:44
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 20:55:01
 */

import * as React from 'react';
import * as sinon from 'sinon';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { StyleSheetTestUtils } from 'aphrodite';

import PaperDoll from './index';
import { testCharacterSheetState } from '../../test';

describe('<PaperDoll />', () => {
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
      <PaperDoll
        dispatch={dispatch}
        characterSheetState={testCharacterSheetState}
      />,
    );
    expect(enzymeToJson(component)).toMatchSnapshot();
  });

  test('Renders properly', async () => {
    const dispatch = sinon.spy();
    const component = mount(
      <PaperDoll
        dispatch={dispatch}
        characterSheetState={testCharacterSheetState}
      />,
    );

    expect(component.find('skull-armor-container')).toBeTruthy();
    expect(component.find('face-armor-container')).toBeTruthy();
    expect(component.find('neck-armor-container')).toBeTruthy();
    expect(component.find('shoulderLeft-armor-container')).toBeTruthy();
    expect(component.find('shoulderRight-armor-container')).toBeTruthy();
    expect(component.find('forearmLeft-armor-container')).toBeTruthy();
    expect(component.find('forearmRight-armor-container')).toBeTruthy();
    expect(component.find('handLeft-armor-container')).toBeTruthy();
    expect(component.find('handRight-armor-container')).toBeTruthy();
    expect(component.find('chest-armor-container')).toBeTruthy();
    expect(component.find('back-armor-container')).toBeTruthy();
    expect(component.find('waist-armor-container')).toBeTruthy();
    expect(component.find('thighs-armor-container')).toBeTruthy();
    expect(component.find('shins-armor-container')).toBeTruthy();
    expect(component.find('feet-armor-container')).toBeTruthy();

    expect(component.find('InnerOuterContainer').length).toBe(15);
    expect(component.find('ItemSlot').length).toBe(35);
  });
});
