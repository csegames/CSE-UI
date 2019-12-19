/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export function checkAPIServer(apiHost: string) {
  const http = new XMLHttpRequest();
  const url = apiHost + '/';
  http.open('GET', url);
  http.send();

  return new Promise((res) => {
    const requestTimeout = window.setTimeout(() => {
      res(false);
    }, 5000);

    http.onreadystatechange = (e) => {
      // If we reach this point, then the api server is online and has sent back the GraphiQL page.
      if (http.responseText) {
        window.clearTimeout(requestTimeout);
        res(true);
      }
    };
  });
}
