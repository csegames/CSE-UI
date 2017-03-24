/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-12 16:07:02
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 16:11:31
 */

import reducer, { getInitialState, types } from './index';

describe('Tabpanel reducer', () => {
  test('Should return initial state', async () => {
    expect(reducer(undefined, {} as any)).toEqual({
      ...getInitialState(),
    });
  });

  test('Should set tab', async () => {
    expect(reducer(undefined, {
      type: types.SET_TAB_INDEX,
      tabIndex: 1,
    } as any)).toEqual({
      currentTabIndex: 1,
    });
  });
});
