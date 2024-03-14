/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Keybind defines a single action that can be bound to a key by the client.
 */
export interface Keybind {
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
   * Used for sorting displayed Keybinds into manually defined sections.
   */
  section: KeybindSection;

  /**
   * Used for sorting displayed Keybinds within sections into a manually defined sequence.
   */
  order: number;

  /**
   * Up to 3 unique bound key values are available to any Keybind
   */
  binds: [Binding, Binding, Binding];
}

/**
 * Binding defines an individual bound key setting
 */
export interface Binding {
  /**
   * Display name for the bound key value
   */
  name: string;

  /**
   * Windows key value for the bound key
   */
  value: number;

  /**
   * Name of font icon to display for key. This can be empty, default to name property if empty.
   */
  iconClass?: string;
}

export type KeybindCategory = 'actionslots' | 'interface' | 'game' | 'miscellaneous';

export enum KeybindSection {
  None,
  BasicControls,
  Social,
  Camera,
  Advanced
}
