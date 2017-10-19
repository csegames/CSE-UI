/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
