/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// cut down on spam with this cache
type CacheEntry = { ok: Promise<boolean>; expires: number };
const serverCache = new Map<string, CacheEntry>();
const tenSeconds = 10000;

export function checkAPIServer(apiHost: string): Promise<boolean> {
  if (!apiHost) return Promise.resolve(false);
  const cacheEntry = serverCache.get(apiHost);
  const now = new Date().getTime();
  if (cacheEntry && cacheEntry.expires > now) {
    return cacheEntry.ok;
  }
  const result = queryAPIServer(apiHost);
  serverCache.set(apiHost, { ok: result, expires: now + tenSeconds });
  return result;
}

function queryAPIServer(apiHost: string): Promise<boolean> {
  const http = new XMLHttpRequest();
  http.open('GET', apiHost);
  http.send();

  return new Promise((res) => {
    const requestTimeout = window.setTimeout(() => {
      res(false);
    }, 5000);

    http.onreadystatechange = (ev: Event) => {
      if (http.readyState === XMLHttpRequest.DONE) {
        const status = http.status;
        if (status >= 200 && status < 500) {
          // consider success, redirect, or client error proof of life
          window.clearTimeout(requestTimeout);
          res(true);
        }
      }
    };
  });
}
