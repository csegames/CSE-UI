/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ResponseError from './ResponseError';

function checkStatus(response: any) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new ResponseError(response, response.statusText);
    throw error;
  }
}

function parseJSON(response: any) {
  return response.json();
}

export function fetchJSON(url: string, options?: any) {
  return fetch(url, options).then(checkStatus).then(parseJSON);
}
