/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class Config {

  address: string;
  username: string | (() => string);
  password: string | (() => string);
  resource: string;
  service: string;
  rooms: string[];
  nick: string;
  port: number;
  endpoint: string;
  serviceAddress: string;
  websocketUrl: string;

  constructor(username: string|(()=>string), password: string|(()=>string), nick: string = "",
    address: string = "chat.camelotunchained.com",
    port: number = 8222, endpoint: string = "/api/chat",
    resource: string = undefined, service: string = "conference") {
    this.address = address;
    this.username = username;
    this.password = password;
    this.resource = resource;
    this.service = service;
    this.nick = nick;
    this.port = port;
    this.endpoint = endpoint;
    this.resource = resource;
    this.service = service;
  }

  init() {
    if (!this.serviceAddress) {
      this.serviceAddress = '@' + this.service + '.' + this.address;
      this.websocketUrl = 'ws://' + this.address + ':' + this.port + this.endpoint;
    }
  }

  getPassword() : string {
    if (typeof this.password === 'function') {
      this.password = (<()=>string>this.password)();
    }
    return <string>this.password;
  }
}

export default Config;
