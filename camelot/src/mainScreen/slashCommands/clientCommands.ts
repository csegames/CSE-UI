/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { game } from '@csegames/library/dist/_baseGame';
import { camelot } from '@csegames/library/dist/camelotunchained';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { AppDispatch, RootState } from '../redux/store';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';

export function registerClientSlashCommands(registry: SlashCommandRegistry<RootState, AppDispatch>): ListenerHandle[] {
  return [
    registry.add(
      'droplight',
      'drop a light at your location, options: (colors are 0-255) droplight <intensity> <radius> <red> <green> <blue>',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        if (argv.length > 0) {
          const intensity = argv.length >= 0 ? parseInt(argv[0]) : 1;
          const radius = argv.length > 1 ? parseInt(argv[1]) : 20;
          const red = argv.length > 2 ? parseInt(argv[2]) : 100;
          const green = argv.length > 3 ? parseInt(argv[3]) : 100;
          const blue = argv.length > 4 ? parseInt(argv[4]) : 100;
          game.dropLight.drop(intensity, radius, red, green, blue);
          return;
        }
      }
    ),

    registry.add(
      'removelight',
      'removes the closest dropped light to the player',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        game.dropLight.removeLast();
      }
    ),

    registry.add(
      'resetlights',
      'removes all dropped lights from the world',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        game.dropLight.clearAll();
      }
    ),

    registry.add('exit', 'quit the game', () => clientAPI.quit()),

    registry.add(
      'replacesubstance',
      'replace blocks with type args[0] with blocks with type of args[1]',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        if (argv.length >= 2) {
          game.building.replaceMaterialsAsync(parseInt(argv[0]), parseInt(argv[1]), false);
        }
        return;
      }
    ),

    registry.add(
      'replaceshape',
      'replace blocks with shape args[0] with blocks with shape of args[1]',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        if (argv.length >= 2) {
          game.building.replaceShapesAsync(parseInt(argv[0]), parseInt(argv[1]), false);
        }
        return;
      }
    ),

    registry.add(
      'replaceselectedsubstance',
      'replace blocks with type args[0] with blocks with type of args[1] within selected range',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        if (argv.length >= 2) {
          game.building.replaceMaterialsAsync(parseInt(argv[0]), parseInt(argv[1]), true);
        }
        return;
      }
    ),

    registry.add(
      'replaceselectedshape',
      'replace blocks with shape args[0] to blocks with shape of args[1] within selected range',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        if (argv.length >= 2) {
          game.building.replaceShapesAsync(parseInt(argv[0]), parseInt(argv[1]), true);
        }
        return;
      }
    ),

    registry.add(
      'blocktypes',
      'prints out substance and shape of selected blocks',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        // TODO COHERENT BlockTypes is missing, potentially use materials property
        // client.BlockTypes();
      }
    ),

    registry.add(
      'rotatex',
      'rotate selected blocks 90 degrees around the x axis',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        game.triggerKeyAction(state.keyActions.CubeRotateBlockX);
      }
    ),

    registry.add(
      'rotatey',
      'rotate selected blocks 90 degrees around the y axis',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        game.triggerKeyAction(state.keyActions.CubeRotateBlockY);
      }
    ),

    registry.add(
      'rotatez',
      'rotate selected blocks 90 degrees around the z axis',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        game.triggerKeyAction(state.keyActions.CubeRotateBlockZ);
      }
    ),

    registry.add(
      'loopability',
      'Loops specified Ability at Interval',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        if (argv.length >= 2) {
          camelot.game._cse_dev_beginTriggerKeyActionLoop(parseInt(argv[0]), parseInt(argv[1]));
        }
      }
    ),

    registry.add(
      'endloop',
      'Loops specified Ability at Interval',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        camelot.game._cse_dev_endTriggerKeyActionLoop();
      }
    )
  ];
}
