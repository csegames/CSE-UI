/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { registerSlashCommand } from '@csegames/camelot-unchained';
import { parseArgs, systemMessage } from './utils';

export default () => {

  /**
   * Drop a temporary light at the characters feet
   */
  registerSlashCommand(
    'droplight',
    'drop a light at your location, options: (colors are 0-255) droplight <intensity> <radius> <red> <green> <blue>',
    (params: string = '') => {
      if (params.length === 0) return;

      const argv = parseArgs(params);
      if (argv._.length > 0) {
        const intensity = argv._.length >= 0 ? argv._[0] : 1;
        const radius = argv._.length > 1 ? argv._[1] : 20;
        const red = argv._.length > 2 ? argv._[2] : 100;
        const green = argv._.length > 3 ? argv._[3] : 100;
        const blue = argv._.length > 4 ? argv._[4] : 100;
        game.plot.dropLight(intensity, radius, red, green, blue);
        return;
      }

      const intensity = argv.intensity ? argv.intensity : 1;
      const radius = argv.radius > 1 ? argv.radius : 20;
      const red = argv.red > 2 ? argv.red : 100;
      const green = argv.green > 3 ? argv.green : 100;
      const blue = argv.blue > 4 ? argv.blue : 100;
      game.plot.dropLight(intensity, radius, red, green, blue);
    });

  /**
   * Remove the closest dropped light to the player
   */
  registerSlashCommand('removelight', 'removes the closest dropped light to the player', (params: string = '') => {
    game.plot.removeLight();
  });

  /**
   * Remove all lights placed with the drop light command
   */
  registerSlashCommand('resetlights', 'removes all dropped lights from the world', (params: string = '') => {
    game.plot.resetLights();
  });

  /**
   * Count all the placed blocks in the world
   */
  registerSlashCommand('countblocks', 'count all placed blocks in the world.', () => {
    setTimeout(() => systemMessage(`There are ${game.plot.countBlocks()} blocks in this world.`), 1000);
  });

  /**
   * Quit the game
   */
  registerSlashCommand('exit', 'quit the game', () => game.quit());

  registerSlashCommand(
    'replacesubstance',
    'replace blocks with type args[0] with blocks with type of args[1]', (params: string = '') => {
      if (params.length === 0) return;
      const argv = parseArgs(params);
      if (argv._.length >= 2) {
        game.plot.replaceMaterials(argv._[0], argv._[1]);
      }
      return;
    });
  registerSlashCommand(
    'replaceshape',
    'replace blocks with shape args[0] with blocks with shape of args[1]', (params: string = '') => {
      if (params.length === 0) return;
      const argv = parseArgs(params);
      if (argv._.length >= 2) {
        game.plot.replaceShapes(argv._[0], argv._[1]);
      }
      return;
    });
  registerSlashCommand(
    'replaceselectedsubstance',
    'replace blocks with type args[0] with blocks with type of args[1] within selected range', (params: string = '') => {
      if (params.length === 0) return;
      const argv = parseArgs(params);
      if (argv._.length >= 2) {
        game.plot.replaceMaterialsInSelection(argv._[0], argv._[1]);
      }
      return;
    });
  registerSlashCommand(
    'replaceselectedshape',
    'replace blocks with shape args[0] to blocks with shape of args[1] within selected range', (params: string = '') => {
      if (params.length === 0) return;
      const argv = parseArgs(params);
      if (argv._.length >= 2) {
        game.plot.replaceShapesInSelection(argv._[0], argv._[1]);
      }
      return;
    });
  registerSlashCommand('blocktypes', 'prints out substance and shape of selected blocks', () => {
    // TODO COHERENT BlockTypes is missing, potentially use materials property
    // client.BlockTypes();
    // setTimeout(() => systemMessage(`${client.blockTypes}`), 1000);
  });
  registerSlashCommand('rotatex', 'rotate selected blocks 90 degrees around the x axis', () => {
    game.triggerKeyAction(game.keyActions.CubeRotateBlockX);
  });
  registerSlashCommand('rotatey', 'rotate selected blocks 90 degrees around the y axis', () => {
    game.triggerKeyAction(game.keyActions.CubeRotateBlockY);
  });
  registerSlashCommand('rotatez', 'rotate selected blocks 90 degrees around the z axis', () => {
    game.triggerKeyAction(game.keyActions.CubeRotateBlockZ);
  });
  registerSlashCommand('loopability', 'Loops specified Ability at Interval', (params: string = '') => {
    if (params.length === 0) return;
    const argv = parseArgs(params);
    if (argv._.length >= 2) {
      game._cse_dev_beginTriggerKeyActionLoop(argv._[0], argv._[1]);
    }
  });
  registerSlashCommand('endloop', 'Loops specified Ability at Interval', (params: string = '') => {
    game._cse_dev_endTriggerKeyActionLoop();
  });
};
