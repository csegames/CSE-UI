/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-10 18:44:07
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 12:34:54
 */

import * as React from 'react';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';
import { StyleSheetTestUtils } from 'aphrodite';
import TooltipContent from './index';

describe('<TooltipContent />', () => {
  beforeEach(() => {
    StyleSheetTestUtils.suppressStyleInjection();
  });
  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });
  test('Matches Snapshot', async () => {
    const component = mount(<TooltipContent itemId={''} />);
    expect(enzymeToJson(component)).toMatchSnapshot();
  });

  test('Only displays stats that are greater than 0 other than general stats', async () => {
    const component = mount(<TooltipContent itemId={''} />);

    // Tests item stats and make sure they show up if more than 0
    expect(component.find('#quality').exists()).toBeTruthy();
    expect(component.find('#mass').exists()).toBeTruthy();

    // Make sure resistances are shown if more than 0
    expect(component.find('#slashing-resistance').exists()).toBeTruthy();
    expect(component.find('#piercing-resistance').exists()).toBeTruthy();

    // Make sure resistances are NOT shown if 0
    expect(component.find('#crushing-resistance').exists()).toBeFalsy();
    expect(component.find('#physical-resistance').exists()).toBeFalsy();
  });

  test('Display slotName prop if given rather than gearSlot', async () => {
    const component = mount(<TooltipContent itemId={''} slotName={'face'} />);
    const slotName = component.find('#item-slot-name').text();

    // Make sure if slotName is provided, then display prettified slotName
    expect(slotName === 'Face').toBeTruthy();
  });

  test('Display prettified gearSlots if slotName prop not provided', async () => {
    const component = mount(<TooltipContent itemId={''} />);
    const gearSlotName = component.find('#item-slot-name').text();

    // Make sure if slotName isn't provided, then display prettified gearSlot
    expect(gearSlotName === 'Neck, Face, Shoulder Right Under, Neck Under').toBeTruthy();
  });
});
