/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
declare class Config {
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
    constructor(username: string | (() => string), password: string | (() => string), nick?: string, address?: string, port?: number, endpoint?: string, resource?: string, service?: string);
    init(): void;
    getPassword(): string;
}
export default Config;
