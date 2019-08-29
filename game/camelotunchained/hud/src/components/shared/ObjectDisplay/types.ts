/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type States = 'online' | 'offline' | 'initializing';
export type DataTypes = 'string' | 'status';

export type DataMapper = {
  [key: string]: DataTypes | { title?: string, type?: DataTypes };
};
