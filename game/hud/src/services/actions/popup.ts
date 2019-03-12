/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// BASIC MANAGEMENT

export const ACTIVATE_POPUP = 'active-popup';
export const HIDE_POPUP = 'hide-popup';

export interface PopupStyle {
  Popup: string;
  popup: string;
  popupFixed: string;
}

export interface ShowPopupPayload {
  content: JSX.Element | JSX.Element[] | string;
  event: {
    clientX: number;
    clientY: number;
  };
  shouldAnimate?: boolean;
  styles?: Partial<PopupStyle>;
}

export function showPopup(payload: ShowPopupPayload) {
  game.trigger(ACTIVATE_POPUP, payload);
}

export function hidePopup() {
  game.trigger(HIDE_POPUP);
}

export function onShowPopup(callback: (payload: ShowPopupPayload) => void) {
  return game.on(ACTIVATE_POPUP, callback);
}

export function onHidePopup(callback: () => void) {
  return game.on(HIDE_POPUP, callback);
}
