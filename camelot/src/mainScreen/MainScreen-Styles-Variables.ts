/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function getCSSVariable(key: CSSKey): string {
  return getComputedStyle(document.querySelector(':root')).getPropertyValue(key);
}

// These are constants for accessing CSS variables without having to use a raw string.
export enum CSSKey {
  ModalFadeDuration = '--modal-fade-duration',
  ToasterFadeDuration = '--toaster-fade-duration'
}
