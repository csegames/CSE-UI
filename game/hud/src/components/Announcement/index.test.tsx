/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Announcement from './index';

describe('<Announcement />', () => {

  test('Matches Snapshot', () => {
    const component = renderer.create(
      <Announcement />,
    );

    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});
