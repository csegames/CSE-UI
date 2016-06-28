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
    cu.api.createWarband(client.shardID, client.characterID, name)
      .then((response: any) => {
        if (!response.ok) {
          // something went wrong
          console.log(response);

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
  registerSlashCommand('invite', 'Invite a player to your warband. Will use either your current friendly target, or a character name if you provide one.',
   (name: string = '') => {
     if (name.length > 0) {
       cu.api.inviteCharacterToWarbandByName(client.shardID, client.characterID, name)
        .then((response: any) => {
          if (!response.ok) {
            // something went wrong
            console.log(response);
            
            return;
          }

          // success

        });
     }
  });

  /**
   * Invite a player to your warband
   */
  registerSlashCommand('invite', 'Invite a player to your warband. Will use either your current friendly target, or a character name if you provide one.',
   (name: string = '') => {
     if (name.length > 0) {
       cu.api.inviteCharacterToWarbandByName(client.shardID, client.characterID, name)
        .then((response: any) => {
          if (!response.ok) {
            // something went wrong
            console.log(response);
            
            return;
          }

          // success

        });
     }
   });
};
