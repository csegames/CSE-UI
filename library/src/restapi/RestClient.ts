/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import { Promise } from 'es6-promise';

import CoreSettings from '../core/CoreSettings';
import channelId from '../core/constants/channelId';
import client, { hasClientAPI } from '../core/client';
import { emitter }  from '../events/EventEmitter';
import * as RestUtil from './RestUtil';

class Settings {
  public core: CoreSettings;
  public url: string;
  public port: number;
  public channelId: channelId;
  public apiToken: string;
  public timeout: number;

  constructor(channel: channelId) {
    this.core = new CoreSettings();
    this.timeout = 2000;
    if (hasClientAPI()) {
      emitter.on('init', () => {
        this.apiToken = client.loginToken;
        this.channelId = client.patchResourceChannel;
        this.determineApiDetails();
      });
    } else if ('patcherAPI' in window) {
      // running under the patcher, loginToken is not yet available, so
      // define apiToken as a getter and fetch loginToken when we actually
      // need it.
      const patcherAPI: any = (window as any).patcherAPI;
      this.url = 'https://api.camelotunchained.com';
      this.port = 443;
      Object.defineProperty(this, 'apiToken', {
        get: () => {
          return patcherAPI.loginToken;
        },
      });
    }
  }

  private determineApiDetails() {
    // TODO remove this when there are channel based API's
    this.url = this.core.publicApiUrl;
    this.port = this.core.publicApiPort;
    // TODO enable below when there are channel based API's
    // switch (this.channelId) {
    //   case channelId.HATCHERY:
    //     this.url = this.core.hatcheryApiUrl;
    //     this.port = this.core.hatcheryApiPort;
    //     break;
    //   case channelId.WYRMLING:
    //     this.url = this.core.wyrmlingApiUrl;
    //     this.port = this.core.wyrmlingApiPort;
    //     break;
    // }
  }
}

// default to Hatchery
const settings = new Settings(4);

function makeAPIUrl(endpoint: string): string {
  if (endpoint.indexOf('://') !== -1) return endpoint; // we already have a fully formed url, skip
  let url = settings.url || 'http://hatchery.camelotunchained.com';
  // only add port if it is required
  if ((url.indexOf('https://') === 0 && settings.port !== 443) || (url.indexOf('http://') === 0 && settings.port !== 80)) {
    url = url + ':' + settings.port;
  }
  return url + '/' + endpoint.replace(/^\//, '');
}

function addDefaultHeaders(headers: any, requireAuth: boolean, version: number = 1): any {
  if (headers.hasOwnProperty('Accept') === false) {
    headers['accept'] = `application/json;version=${version}`;
  }
}

function addDefaultQueryParameters(query: any, requireAuth: boolean): any {
  if (requireAuth && query.hasOwnProperty('loginToken') === false) {
    query.loginToken = settings.apiToken;
  }
}

export function getJSON(endpoint: string, requireAuth: boolean = false, query: any = {}, version: number = 1): Promise<any> {
  const headers = {};
  addDefaultHeaders(headers, requireAuth, version);
  addDefaultQueryParameters(query, requireAuth);
  return fetch(RestUtil.makeQueryString(makeAPIUrl(endpoint), query), {
    headers,
    method: 'get',
  } as any)
    .then(RestUtil.checkStatus)
    .then(RestUtil.parseJSON);
}

export function deleteJSON(endpoint: string,
                           requireAuth: boolean = false,
                           query: any = {},
                           version: number = 1): Promise<any> {
  const headers = {};
  addDefaultHeaders(headers, requireAuth, version);
  addDefaultQueryParameters(query, requireAuth);
  return fetch(RestUtil.makeQueryString(makeAPIUrl(endpoint), query), {
    headers,
    method: 'delete',
  } as any)
    .then(RestUtil.checkStatus);    // no response body for a DELETE
}

export function postJSON(endpoint: string,
                         requireAuth: boolean = false,
                         data: any = {},
                         query: any = {},
                         version: number = 1): Promise<any> {
  const headers = {
    'Content-Type': 'application/json',
  };
  addDefaultHeaders(headers, requireAuth, version);
  addDefaultQueryParameters(query, requireAuth);
  return fetch(RestUtil.makeQueryString(makeAPIUrl(endpoint), query), {
    headers,
    method: 'post',
    body: JSON.stringify(data),
  } as any)
    .then(RestUtil.checkStatus)
    .then(RestUtil.parseJSON);
}
