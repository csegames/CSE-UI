/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { addImageToCache, removeImageFromCache } from '../redux/hudSlice';
import { store } from '../redux/store';

export function requestAddImagesToCache(requestor: string, urls: string[]): void {
  for (const url of urls) {
    store.dispatch(addImageToCache([url, [requestor]]));
  }
}

export function requestRemoveImagesFromCache(requestor: string, urls: string[]): void {
  for (const url of urls) {
    store.dispatch(removeImageFromCache([url, [requestor]]));
  }
}
