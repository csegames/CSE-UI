/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export type Headers = { [key: string]: string };

export type QueryParams = { [key: string]: any };

export type RequestConfig = () => {
  url: string;
  headers: Headers;
};

export interface RequestResult {
  ok: boolean;
  status: number;
  statusText: string;
  data: string;
  json: <T>() => T;
  headers: Headers;
}
