/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {

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
}
