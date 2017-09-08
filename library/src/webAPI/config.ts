/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-29 15:44:07
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-30 11:50:47
 */

import { RequestConfig } from './definitions';
import client from '../core/client';

export const defaultConfig: RequestConfig = {
  url: client.apiHost + '/',
};
