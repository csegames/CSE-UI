/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
let yargs = require('yargs-parser');
import cu, {client, events, registerSlashCommand, hasClientAPI, SlashCommand, getSlashCommands} from 'camelot-unchained';

export const parseArgs = (args: string): any => yargs(args);
export const systemMessage = (message: string): void => events.fire('system_message', message);

export default () => {
  if (!hasClientAPI()) return;

  /**
   * Create a new Warband
   * 
   * usage:
   * 
   *   1. Create a temporary warband, this type of warband will go away after all members leave. This is the standard "Party".
   *    /createWarband
   * 
   *   2. Create a permanent warband, this type of warband will live on until it is abandonded by all its members.
   *    /createWarband Friendship Warriors
   */
  registerSlashCommand('createWarband', 'Create a Warband. Optionally, accepts a name if you wish to make this a permanent Warband.', (name: string = '') => {
    cu.api.createWarband(client.shardID, client.characterID, false, name)
      .then((response: any) => {
        if (!response.ok) {
          // something went wrong
          console.error(response);

          return;
        }
        
        // success

      });
  });

  /**
   * Invite a player to your warband you are invite
   * 
   * usage:  /invite mehuge
   */

  let friendlyTargetName: string = '';
  events.on(events.clientEventTopics.handlesFriendlyTarget, (ft: any) => {
    if (ft) friendlyTargetName = ft.name;
  });

  registerSlashCommand('invite', 'Invite a player to your warband. Will use either your current friendly target, or a character name if you provide one.',
   (name: string = '') => {
     if (name.length > 0) {
       cu.api.inviteCharacterToWarbandByName(client.shardID, client.characterID, name)
        .then((response: any) => {
          if (!response.ok) {
            // something went wrong
            console.error(response);
            
            return;
          }

          // success

        });
     } else if (friendlyTargetName && friendlyTargetName !== '') {
       cu.api.inviteCharacterToWarbandByName(client.shardID, client.characterID, friendlyTargetName)
        .then((response: any) => {
          if (!response.ok) {
            // something went wrong
            console.error(response);
            return;
          }
          // success
        });
     } else {
       systemMessage('No friendly target to invite. Provide a name or select a friendly target and try again.');
     }
  });


  registerSlashCommand('joinWarband', 'Join an existing Warband.', (args: string) => {
    let argv = yargs(args);
    if (argv._.length === 1) {
      // name only

      cu.api.joinWarbandByName(client.shardID, argv._[0], client.characterID)
        .then((response: any) => {
          if (!response.ok) {
            // something went wrong
            console.error(response);
            return;
          }
          // success
        });

    } else if (argv._.length === 2) {
      // name and invite code

      cu.api.joinWarbandByName(client.shardID, argv._[0], client.characterID, argv._[1])
        .then((response: any) => {
          if (!response.ok) {
            // something went wrong
            console.error(response);
            return;
          }
          // success
        });

    } else {
      systemMessage('Please provide a Warband name, or a Warband name and invite code in order to join a Warband.');
    }
  });

  /**
   * Quit your currently active Warband
   */
  registerSlashCommand('quitWarband', 'Quit your active Warband.', () => {
    cu.api.quitWarband(client.shardID, client.characterID)
     .then((response: any) => {
       if (!response.ok) {
         // something went wrong
         console.error(response);
         return;
       }
     });
  });

  /**
   * Abandon a Warband
   */
  registerSlashCommand('abandonWarband', 'Abandon a Warband. Optionally, accepts a name if you are abandoning a Warband that is not your currently active Warband.', (name: string = '') => {
    cu.api.abandonWarbandByName(client.shardID, client.characterID, name)
      .then((response: any) => {
       if (!response.ok) {
         // something went wrong
         console.error(response);
         return;
       }
     });
  });


};
