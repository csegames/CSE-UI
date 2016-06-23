/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import {Promise} from 'es6-promise';

import CoreSettings from '../core/CoreSettings';
import channelId from '../core/constants/channelId';
import client, {hasClientAPI} from '../core/client';
import events from '../events/events';
import * as RestUtil from './RestUtil';

// TODO remove this when the API's are updated

// TODO: I wanted this to extend CoreSettings but CoreSettings
// won't allow super to access its memebers, or pass anything
// but a default CoreSettings object to its constructor, so
// you can't customise the settings at all (e.g. like define
// the api key or current channel)
class Settings {
  core: CoreSettings;
  url: string;
  port: number;
  apiKey: string;
  channelId: channelId;
  timeout: number;
  constructor(channel: channelId) {
    this.core = new CoreSettings();			// TODO: This class is a bit weird
    this.channelId = channel;
    this.timeout = 2000;					// default timeout
    switch (channel) {
      case channelId.HATCHERY:
        this.url = 'hatchery.camelotunchained.com';
        // BUG: (returns https://) this.url = this.core.hatcheryApiUrl;
        this.port = this.core.hatcheryApiPort;
        break;
      case channelId.WYRMLING:
        this.url = 'wyrmling.camelotunchained.com';
        // BUG: (returns https://) this.url = this.core.wyrmlingApiUrl;
        this.port = this.core.wyrmlingApiPort;
        break;
    }
  }
  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = client.loginToken;		// in fake API will prompt for token
    }
    return this.apiKey;
  }
}

// default to Hatchery
let settings = new Settings(4);
if (hasClientAPI()) {
  events.on('init', () => {
    settings = new Settings(client.patchResourceChannel);
  })
}

function makeAPIUrl(endpoint: string, useHttps: boolean): string {
  if (endpoint.indexOf('://') != -1) return endpoint; // we already have a fully formed url, skip
  var protocol = useHttps ? 'https' : 'http';
  var port = useHttps ? '4443' : '8000';
  return protocol + '://' + settings.url + ':' + port + '/api/' + endpoint.replace(/^\//, '');
}

export function getJSON(endpoint: string, useHttps: boolean = false, query: any = {}): Promise<any> {
  return fetch(RestUtil.makeQueryString(makeAPIUrl(endpoint, useHttps), query))
    .then(RestUtil.checkStatus)
    .then(RestUtil.parseJSON);
}

// old API requires loginToken to be in the data object
export function postJSON(endpoint: string, useHttps: boolean = false, requireAuth: boolean = false, data: any = {}, version: number = 1): Promise<any> {
  return fetch(makeAPIUrl(endpoint, useHttps), {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-version': `${version}`,
      'loginToken': client.loginToken
    },
    body: JSON.stringify(data)
  })
    .then(RestUtil.checkStatus)
    .then(RestUtil.parseJSON);
}
