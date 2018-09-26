/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


/**
 * Begin chat is fired by the game client to tell the UI that the user wishes to begin sending a chat message.
 *
 * Expected behavior: The chat input element will gain focus and accept text input.
 *
 * @param {String} message Optional: A message to auto-populate into the chat input.
 */
export const EE_BeginChat = 'beginChat';

/**
 * The client wishes to display a message in the system log.
 *
 * Expected behavior: the provided message id displayed in the system log.
 *
 * @param {String} message The text to display in the system log
 */
export const EE_SystemMessage = 'systemMessage';

