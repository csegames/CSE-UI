/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  interface Screenshot {
    /**
     * Base64 encoded image data
     */
    image: string;

    /**
     * Path to the screenshot location saved on your pc.
     */
    path: string;
  }
}
