/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { AppDispatch, RootState } from '../redux/store';
import { callCreateInvitationForName, callLeave } from '../helpers/rest/warbandsRestCalls';
import { consolePrint } from './utils';

export function registerPartySlashCommands(registry: SlashCommandRegistry<RootState, AppDispatch>): ListenerHandle[] {
  return [
    registry.add(
      'invite',
      'Invite an ally to your party',
      (state: RootState, dispatch: AppDispatch, argv: string[]) => {
        if (argv.length < 1) {
          consolePrint('use: /invite <name>'); // TODO : string table
          return;
        }
        dispatch(callCreateInvitationForName(argv[0]));
      }
    ),

    /* TODO : search party for matching name and convert to ID
    registry.add('kick', 'Kick a member of your party', (state: RootState, dispatch: AppDispatch, argv: string[]) => {
      if (argv.length < 1) {
        consolePrint('use: /kick <name>'); // TODO : string table
        return;
      }

      dispatch(callKickForName(argv[0]));
    }),
    */

    registry.add('leave', 'Leave your party', (state: RootState, dispatch: AppDispatch, argv: string[]) => {
      dispatch(callLeave());
    })
  ];
}
