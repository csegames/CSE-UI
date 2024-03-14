/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Headers, HttpMethod, QueryParams, RequestResult } from '../types/Request';

function buildParamString(params: QueryParams) {
  return Object.keys(params)
    .map((k) => {
      const stringParam = typeof params[k] !== 'string' ? JSON.stringify(params[k]) : params[k];
      return encodeURIComponent(k) + '=' + encodeURIComponent(stringParam);
    })
    .join('&');
}

function appendParams(url: string, params: QueryParams) {
  const queryString = buildParamString(params);
  if (queryString) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') + queryString;
  }
  return url;
}

function parseHeaders(xhr: XMLHttpRequest): Headers {
  const headers: Headers = {};
  const raw = xhr
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/);
  for (const header of raw) {
    const parts = header.split(': ');
    headers[parts.shift()] = parts.join(': ');
  }
  return headers;
}

// format required by our current generated code
export function legacyRequest(
  method: HttpMethod,
  url: string,
  paramData: any = {},
  body: any = null,
  options: { headers: any }
): Promise<RequestResult> {
  const headers: Headers = {};
  Object.keys(options.headers).forEach((key) => (headers[key] = options.headers[key]));
  const params: QueryParams = {};
  Object.keys(paramData).forEach((key) => (params[key] = paramData[key]));
  return request(method, url, headers, params, body);
}

// better constrained parameter types
export function request(
  method: HttpMethod,
  url: string,
  headers: Headers,
  queryParams: QueryParams,
  body: any | null
): Promise<RequestResult> {
  return new Promise<RequestResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, appendParams(url, queryParams));

    Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]));

    xhr.onload = (evt) =>
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr),
        data: xhr.responseText,
        json: <T>() => JSON.parse(xhr.responseText) as T
      });

    xhr.onerror = (evt) =>
      resolve({
        ok: false,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr),
        data: 'Request failed',
        json: () => null
      });

    if (method === 'post' && body) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send();
    }
  });
}
