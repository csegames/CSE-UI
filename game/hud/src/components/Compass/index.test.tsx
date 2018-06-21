/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client } from '@csegames/camelot-unchained';
import * as React from 'react';
import { mount } from 'enzyme';
import enzymeToJson from 'enzyme-to-json';

import Compass from './index';

describe('<Compass />', () => {


  test('Matches Snapshot', async () => {

    jest.useFakeTimers();

    const component = mount(<Compass setVisibility={() => {}} />);
    const facing0Json = enzymeToJson(component);
    expect(facing0Json).toMatchSnapshot();

    // test facing = 90
    client.facing = 90;
    jest.runOnlyPendingTimers(); // fast forward the compass setInterval
    const facing90Json = enzymeToJson(component);
    expect(facing90Json).toMatchSnapshot();
    expect(facing90Json).not.toMatchObject(facing0Json);

    // test facing = 180
    client.facing = 180;
    jest.runOnlyPendingTimers(); // fast forward the compass setInterval
    const facing180Json = enzymeToJson(component);
    expect(facing180Json).toMatchSnapshot();
    expect(facing180Json).not.toMatchObject(facing0Json);
    expect(facing180Json).not.toMatchObject(facing90Json);

    // test facing = 270
    client.facing = 270;
    jest.runOnlyPendingTimers(); // fast forward the compass setInterval
    const facing270Json = enzymeToJson(component);
    expect(facing270Json).toMatchSnapshot();
    expect(facing270Json).not.toMatchObject(facing0Json);
    expect(facing270Json).not.toMatchObject(facing90Json);
    expect(facing270Json).not.toMatchObject(facing180Json);

    // test facing = 360
    client.facing = 360;
    jest.runOnlyPendingTimers(); // fast forward the compass setInterval
    const facing360Json = enzymeToJson(component);
    expect(facing360Json).toMatchSnapshot();
    expect(facing360Json).toMatchObject(facing0Json); // should be the same as 0
    expect(facing360Json).not.toMatchObject(facing90Json);
    expect(facing360Json).not.toMatchObject(facing180Json);
    expect(facing360Json).not.toMatchObject(facing270Json);

  });

});
