/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ArrayMap } from './ObjectMap';

/**
 * GameOption defines an individual game config setting
 */
export interface BaseOption<T> {
  /**
   * Name of the option, used for both display & identification
   */
  name: string;

  displayName: string;

  /**
   * Used for sorting displayed options into basic categories
   */
  category: OptionCategory;

  /**
   * Identifies the data type and any extra properties that may exist as part of the option value
   */
  kind: OptionKind;

  value: T;
  defaultValue: T;
}

export type BooleanOption = BaseOption<boolean>;

/**
 * Range option defines a value that has a min and max, typically displayed using a slider
 */
export interface RangeOption extends BaseOption<number> {
  minValue: number;
  maxValue: number;
  increment: number;
}

/**
 * Select option defines a set of values that the user can select from, typically displayed using a list select
 */
export interface SelectOption extends BaseOption<SelectValue> {
  selectValues: ArrayMap<SelectValue>;
}

export interface SelectValue {
  value: number;
  description: string;
}

export type IntRangeOption = RangeOption;
export type FloatRangeOption = RangeOption;
export type DoubleRangeOption = RangeOption;

export type GameOption = BooleanOption | IntRangeOption | FloatRangeOption | DoubleRangeOption | SelectOption;

export enum OptionKind {
  Boolean = 0,
  IntRangeOption = 1,
  FloatRangeOption = 2,
  DoubleRangeOption = 2,
  Select = 3
}

export enum OptionCategory {
  None = 0,
  Any = 1,
  KeyBind = 2, // deprecated
  Rendering = 3,
  UI = 4,
  InternalKeyBind = 5, // deprecated
  Input = 6,
  ProxyClient = 7, // Not used by UI
  Audio = 8,
  PhysicsServer = 9 // Not used by UI
}
