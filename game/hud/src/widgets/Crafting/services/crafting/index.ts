/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-05 21:48:53
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-05 22:18:48
 */

import { client, hasClientAPI } from 'camelot-unchained';

function slash(command: string) {
  if (hasClientAPI()) {
    client.SendSlashCommand(command);
  } else {
    console.log('would have sent ' + command + ' to server');
  }
}

export function setJob() {
  slash('/cr vox setjob');
}

export function startJob() {
  slash('/cr vox startjob');
}

export function clearJob() {
  slash('/cr vox clearjob');
}

export function collectJob() {
  slash('/cr vox collect');
}

export function setRecipe(id: string) {
  slash('/cr vox setrecipe ' + id);
}

export function setQuality(quality: number) {
  slash('/cr vox setquality ' + quality);
}

export function setName(name: string) {
  slash('/cr vox setname ' + name);
}

export function setTemplate(id: string) {
  slash('/cr vox settemplate ' + id);
}
