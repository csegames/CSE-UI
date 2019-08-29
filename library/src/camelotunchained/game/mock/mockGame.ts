/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference> ../coherent.d.ts

export function mockGame() {
  console.log('MOCK.game', 'initialize');
  _devGame.sendSlashCommand = (command: string) => {
    console.log('MOCK.game', 'sendSlashCommand', command);
    game.trigger('_mock_.slashCommand', command);
    return {
      success: true,
    };
  };
  _devGame.triggerKeyAction = (id: number) => {
    console.log('MOCK.game', 'triggerKeyAction', id);
    game.trigger('_mock_.keyAction', id);
    return {
      success: true,
    };
  };
}
