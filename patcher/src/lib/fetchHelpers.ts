/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Promise} from 'es6-promise';
import 'isomorphic-fetch';

import ResponseError from './ResponseError';

export function checkStatus(response: any) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    let error = new ResponseError(response, response.statusText);
    throw error;
  }
}

export function parseJSON(response: any) {
  return response.json();
}

export function fetchJSON(url: string, options?: any) {
  return fetch(url, options).then(checkStatus).then(parseJSON);
}
