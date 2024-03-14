/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare var process: any; // injected by Webpack into individual projects

export function getEnv(key: string, defaultValue: any): any {
  // TODO : if we don't have an attached engine, check query string
  const value = process ? process[key] : undefined;
  return value === undefined ? defaultValue : value;
}

export function getBooleanEnv(key: string, defaultValue: boolean): boolean {
  let env = getEnv(key, defaultValue);
  if (typeof env === 'string') {
    const value = parseInt(env, 10);
    if (!isNaN(value)) {
      return value !== 0;
    }
    const lowercaseEnv = env.toLowerCase();
    return lowercaseEnv === 'true' || lowercaseEnv === 'yes' || lowercaseEnv === 'y';
  } else if (typeof env === 'number') {
    if (env === 0) {
      env = false;
    } else {
      env = true;
    }
  } else if (typeof env !== 'boolean') {
    env = defaultValue;
  }
  return env;
}
