/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, createDefaultOnUpdated, createDefaultOnReady } from './_Updatable';
import engineInit from './_Init';

export interface OptionsModel {
  /**
   * Gets all Keybinds from the client
   */
  getKeybinds: () => Keybind[];

  /**
   * Request that the client listen for a key combination to bind a key value to.
   * @param {String} id Identifier of the Keybinding to be bound
   * @param {Number} index Index of binds to set / replace with the new binding
   * @returns {Binding} The newly bound key information
   */
  bindKey: (id: string, index: number) => Binding;

  /**
   * Request that the client clear a particular key bind
   * @param {String} id Identifier of the Keybinding to be cleared
   * @param {Number} index Index of bind to clear
   */
  clearKeybind: (id: string, index: number) => void;

  /**
   * Get all options from the client
   */
  getOptions: () => GameOption[];

  /**
   * Sets a single Option value on the client
   * @param {GameOption} option The option to set
   * @return {Boolean} Whether or not the option was saved correctly
   */
  setOption: (option: GameOption) => boolean;

  /**
   * Batch set of all passed in options
   * @param {GameOption[]} options The options to set
   * @return {Boolean} Whether or not the options all saved correctly
   */
  setOptions: (options: GameOption[]) => boolean;

  /**
   * Test an option without saving it, this allows preview of changes without saving them immediately
   * When called, this method should change the setting on the client without saving it to file or the server
   * @param {GameOption} option The option to test
   * @return {Boolean} Whether or not the option was valid to test
   */
  testOption: (option: GameOption) => boolean;

  /**
   * Cancels all option tests and revert to the currently saved options
   */
  cancelTests: () => void;

  /**
   * Restores options to their default values based on category
   * @param {OptionCategory} The category of options to reset
   */
  resetOptions: (category: OptionCategory) => void;
}

export interface OptionsExt extends Updatable {

}

export type Options = OptionsModel & Updatable;

export const Options_Update = 'options.update';

function noOp(...args: any[]): any {}

function initDefault(): Options {
  return {
    getKeybinds: noOp,
    bindKey: noOp,
    clearKeybind: noOp,

    getOptions: noOp,
    setOption: noOp,
    setOptions: noOp,
    testOption: noOp,
    cancelTests: noOp,
    resetOptions: noOp,

    // Updatable
    isReady: false,
    name: Options_Update,
    onUpdated: createDefaultOnUpdated(Options_Update),
    onReady: createDefaultOnReady(Options_Update),
  };
}

export default function() {

  engineInit(
    Options_Update,
    () => __devGame.options = initDefault(),
    () => game.options,
    (model: OptionsModel) => __devGame.options = model as Options);

}

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
interface SelectOption extends BaseOption<string | number> {
  selectValues: [string | number];
}

type GameOption = BooleanOption | NumberOption | RangeOption | SelectOption;

enum OptionKind {
  Boolean,
  Number,
  Range,
  Select,
}

enum OptionCategory {
  None,
  Any,
  KeyBind, // deprecated
  Rendering,
  UI,
  InternalKeyBind, // deprecated
  Input,
  ProxyClient, // Not used by UI
  Audio,
  PhysicsServer, // Not used by UI
}


/**
 * Keybind defines a single action that can be bound to a key by the client.
 */
interface Keybind {
  /**
   * Unique Identifier for this keybind
   */
  id: number;

  /**
   * Descriptor displayed in the UI to identify this keybind
   */
  description: string;

  /**
   * Used for sorting displayed Keybinds into basic categories.
   */
  category: KeybindCategory;

  /**
   * Up to 3 unique bound key values are available to any Keybind
   */
  binds: [Binding, Binding, Binding];
}

/**
 * Binding defines an individual bound key setting
 */
interface Binding {
  /**
   * Display name for the bound key value
   */
  name: string;

  /**
   * Windows key value for the bound key
   */
  value: number;
}

type KeybindCategory = 'skills' | 'interface' | 'game' | 'miscellaneous';
