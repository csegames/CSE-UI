/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-09-08 15:44:21
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-09-08 15:48:59
 */

// Simple LocalStorage Management
export class Store {

  private prefix: string;

  constructor(prefix: string = '') {
    this.prefix = prefix;
  }

  public setPrefix = (prefix: string) => {
    this.prefix = prefix;
  }

  public set = (key: string, value: any) => {
    localStorage.setItem(this.prefixed(key), JSON.stringify(value));
  }

  public get = <T>(key: string) => {
    const data = localStorage.getItem(this.prefixed(key));
    return data && JSON.parse(data) as T || undefined;
  }

  public clear = () => {
    if (this.prefix) {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.prefix))
        .forEach(k => localStorage.removeItem(this.prefixed(k)));
    } else {
      localStorage.clear();
    }
  }

  private prefixed = (key: string) => {
    return this.prefix + key;
  }
}

export default Store;
