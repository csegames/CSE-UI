/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events, core } from '@csegames/camelot-unchained';
import * as React from 'react';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';

import Announcement from './index';

describe('<Announcement />', () => {

  test('Matches Snapshot', async () => {

    const component = mount(<Announcement />);

    expect(enzymeToJson(component)).toMatchSnapshot();

    events.fire('handlesAnnouncements', new core.Announcement('Hello World', core.announcementType.POPUP));

    expect(enzymeToJson(component)).toMatchSnapshot();

  });

  test('Contains Correct Message', async () => {

    const component = mount(<Announcement />);

    expect(component.text()).toEqual('');

    events.fire('handlesAnnouncements', new core.Announcement('Hello World', core.announcementType.POPUP));

    expect(component.text()).toEqual('Hello World');
  });

  test('Removes Messages After Set Time', async () => {

    jest.useFakeTimers();

    const component = mount(<Announcement />);

    expect(component.text()).toEqual('');

    events.fire('handlesAnnouncements', new core.Announcement('Hello World', core.announcementType.POPUP));

    expect(component.text()).toEqual('Hello World');

    // fast forward to when message is removed from state
    jest.runTimersToTime(20000);
    expect(component.text()).toEqual('Hello World');

    // fast forward to just before transitionLeaveTimeout finishes
    jest.runTimersToTime(299);
    expect(component.text()).toEqual('Hello World');

    // fast forward to transitionLeaveTimeout
    jest.runTimersToTime(1);
    expect(component.text()).toEqual('');

  });

  test('Adds Correct Classes For Short Messages', async () => {

    const component = mount(<Announcement />);

    events.fire('handlesAnnouncements', new core.Announcement('Hello World', core.announcementType.POPUP));

    expect(component.find('.message').hasClass('large')).toBeTruthy();

  });

  test('Adds Correct Classes For Long Messages', async () => {

    const component = mount(<Announcement />);

    events.fire('handlesAnnouncements', new core.Announcement('Hello World Hello World', core.announcementType.POPUP));

    expect(component.find('.message').hasClass('large')).toBeFalsy();

  });

});
