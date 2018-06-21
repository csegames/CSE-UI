/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import channelId from './constants/channelId';

const defaults = {
  // CSE API - for servers ect
  cseApiUrl: 'http://api.citystateentertainment.com',
  cseApiPort: 8001,

  // GAME API - for server info, this will be merged into the single
  // api source in the future.
  publicApiUrl: 'https://api.camelotunchained.com',
  publicApiPort: 443,
  hatcheryApiUrl: 'https://hatchery.camelotunchained.com',
  hatcheryApiPort: 8000,
  fledglingApiUrl: 'https://fledgling.camelotunchained.com',
  fledglingApiPort: 8000,
  wyrmlingApiUrl: 'https://wyrmling.camelotunchained.com',
  wyrmlingApiPort: 8000,

  // SAMPLE API TOKEN
  // TODO: replace accessToken with API KEY system
  apiToken: '1234567890',

  // Working Channel - defaults to hatchery
  channelId: channelId.HATCHERY,
};

class CoreSettings {
  public cseApiUrl: string = defaults.cseApiUrl;
  public cseApiPort: number = defaults.cseApiPort;
  public publicApiUrl: string = defaults.publicApiUrl;
  public publicApiPort: number = defaults.publicApiPort;
  public hatcheryApiUrl: string = defaults.hatcheryApiUrl;
  public hatcheryApiPort: number = defaults.hatcheryApiPort;
  public fledglingApiUrl: string = defaults.fledglingApiUrl;
  public fledglingApiPort: number = defaults.fledglingApiPort;
  public wyrmlingApiUrl: string = defaults.wyrmlingApiUrl;
  public wyrmlingApiPort: number = defaults.wyrmlingApiPort;
  public apiToken: string = defaults.apiToken;
  public channelId: channelId = defaults.channelId;

  constructor(channel?: channelId, token?: string) {
    this.channelId = channel || defaults.channelId;
    this.apiToken = token || defaults.apiToken;
  }
}

export default CoreSettings;
