/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  /**
   * GameOption defines an individual game config setting
   */
  interface BaseOption<T> {

    /**
     * Name of the option, used for both display & identification
     */
    name: string;

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

  type BooleanOption = BaseOption<boolean>;
  type NumberOption = BaseOption<number>;

  /**
   * Range option defines a value that has a min and max, typically displayed using a slider
   */
  interface RangeOption extends NumberOption {
    minValue: number;
    maxValue: number;
  }

  /**
   * Select option defines a set of values that the user can select from, typically displayed using a list select
   */
  interface SelectOption extends BaseOption<SelectValue> {
    selectValues: SelectValue[];
  }

  interface SelectValue {
    value: number;
    description: string | number;
  }

  type GameOption = BooleanOption | NumberOption | RangeOption | SelectOption;

  enum OptionKind {
    Boolean = 0,
    Number = 1,
    Range = 2,
    Select = 3,
  }

  enum OptionCategory {
    None = 0,
    Any = 1,
    KeyBind = 2, // deprecated
    Rendering = 3,
    UI = 4,
    InternalKeyBind = 5, // deprecated
    Input = 6,
    ProxyClient = 7, // Not used by UI
    Audio = 8,
    PhysicsServer = 9, // Not used by UI
  }

  interface Window {
    OptionKind: typeof OptionKind;
    OptionCategory: typeof OptionCategory;
  }
}

enum OptionKind {
  Boolean = 0,
  Number = 1,
  Range = 2,
  Select = 3,
}
window.OptionKind = OptionKind;

enum OptionCategory {
  None = 0,
  Any = 1,
  KeyBind = 2, // deprecated
  Rendering = 3,
  UI = 4,
  InternalKeyBind = 5, // deprecated
  Input = 6,
  ProxyClient = 7, // Not used by UI
  Audio = 8,
  PhysicsServer = 9, // Not used by UI
}
window.OptionCategory = OptionCategory;
