/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum AudioSettingType {
  RANGE,
  BOOL,
}

export class AudioSetting {
  public type: AudioSettingType;
  public default: any;
  public value: any; // bool or int based on AudioSettingType
  public min: any; // undefined on bool
  public max: any; // undefined on bool
}
