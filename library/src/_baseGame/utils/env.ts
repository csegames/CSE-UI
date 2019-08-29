/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function getEnv(key: string, defaultValue: any) {
  if (typeof process === 'object' && typeof process.env === 'object' && typeof process.env[key] !== undefined) {
    return process.env[key];
  }
  return defaultValue;
}

export function getBooleanEnv(key: string, defaultValue: boolean) {
  let env = getEnv(key, defaultValue);
  if (typeof env === 'string') {
    const lowercaseEnv = env.toLowerCase();
    if (lowercaseEnv === '1' || lowercaseEnv === 'true' || lowercaseEnv === 'yes' || lowercaseEnv === 'y') {
      env = true;
    } else {
      env = false;
    }
  } else if (typeof env === 'number') {
    if (env === 1) {
      env = true;
    } else {
      env = false;
    }
  } else if (typeof env !== 'boolean') {
    env = defaultValue;
  }
  return env;
}
