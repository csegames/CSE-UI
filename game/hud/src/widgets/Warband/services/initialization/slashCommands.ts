/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import yargs from 'yargs-parser';
import {
  client,
  events,
  registerSlashCommand,
  hasClientAPI,
  webAPI,
} from 'camelot-unchained';

export const parseArgs = (args: string): any => yargs(args);
export const systemMessage = (message: string): void => events.fire('system_message', message);

export default () => {
  if (!hasClientAPI()) return;

  /**
   * Create a new Warband
   * 
   * usage:
   * 
   *   1. Create a temporary warband, this type of warband will go away after all members leave.
   *      This is the standard "Party".
   *    /createWarband
   * 
   *   2. Create a permanent warband, this type of warband will live on until it is abandonded by all its members.
   *    /createWarband Friendship Warriors
   */
  registerSlashCommand(
    'createWarband', 'Create a Warband. Optionally, accepts a name if you wish to make this a permanent Warband.',
    (name: string = '') => {
      if (name === '' || name.length === 0) {
        webAPI.WarbandsAPI.createV1(client.shardID, client.characterID)
          .then((response: any) => {
            if (!response.ok) {
              // console.error(response);
              systemMessage('Failed to create Warband.');
              // systemMessage(response.data);
              return;
            }

            systemMessage('Warband successfully created!');
          });
      } else {
        webAPI.WarbandsAPI.createWithNameV1(client.shardID, client.characterID, name)
          .then((response: any) => {
            if (!response.ok) {
              // something went wrong
              // console.error(response);
              systemMessage(`Failed to create Warband.`);
              // systemMessage(response.data);
              return;
            }

            // success
            systemMessage(`Warband ${name} successfully created!`);
          });
      }
    });

  /**
   * Invite a player to your warband you are invite
   * 
   * usage:  /invite mehuge
   */

  let friendlyTargetName: string = '';
  client.OnFriendlyTargetNameChanged((name: string) => {
    friendlyTargetName = name;
  });

  registerSlashCommand(
    'invite',
    'Invite a player to your warband. Will use either your current friendly target, or a character name if you provide one.',
    (name: string = '') => {
      if (name.length > 0) {
        webAPI.WarbandsAPI.inviteByNameV1(client.shardID, client.characterID, name)
          .then((response: any) => {
            if (!response.ok) {
              // something went wrong
              console.error(response);

              return;
            }

            // success

          });
      } else if (friendlyTargetName && friendlyTargetName !== '') {
        webAPI.WarbandsAPI.inviteByNameV1(client.shardID, client.characterID, friendlyTargetName)
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
    const argv = yargs(args);
    if (argv._.length === 1) {
      // name only

      webAPI.WarbandsAPI.joinByNameV1(client.shardID, argv._[0], client.characterID)
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

      webAPI.WarbandsAPI.joinByNameWithInviteV1(client.shardID, argv._[0], client.characterID, argv._[1])
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

  function quitWarband() {
    webAPI.WarbandsAPI.quitV1(client.shardID, client.characterID)
      .then((response: any) => {
        if (!response.ok) {
          // something went wrong
          console.error(response);
          return;
        }
      });
  }
  registerSlashCommand('quitWarband', 'Quit your active Warband.', quitWarband);
  registerSlashCommand('leaveWarband', 'Quit your active Warband.', quitWarband);
  registerSlashCommand('leave', 'Quit your active Warband.', quitWarband);
  registerSlashCommand('quit', 'Quit your active Warband.', quitWarband);

  /**
   * Abandon a Warband
   */
  registerSlashCommand(
    'abandonWarband',
    'Abandon a Warband. Optionally, accepts a name if you are abandoning a Warband that is not your currently active ' +
    'Warband.',
    (name: string = '') => {
      if (name === '') {
        webAPI.WarbandsAPI.abandonV1(client.shardID, client.characterID)
          .then((response: any) => {
            if (!response.ok) {
              // something went wrong
              console.error(response);
              return;
            }
          });
      } else {
        webAPI.WarbandsAPI.abandonByNameV1(client.shardID, client.characterID, name)
          .then((response: any) => {
            if (!response.ok) {
              // something went wrong
              console.error(response);
              return;
            }
          });
      }
    });

  /**
   * Permissions, Rank, and Role management.
   */

  registerSlashCommand(
    'makeleader', 'Make your friendly target the leader of your warband or if you provide a name, that character named.',
    (name: string = '') => {
      if (name.length > 0) {
        webAPI.WarbandsAPI.setLeaderByNameV1(client.shardID, client.characterID, name);
      } else if (friendlyTargetName && friendlyTargetName !== '') {
        webAPI.WarbandsAPI.setLeaderByNameV1(client.shardID, client.characterID, friendlyTargetName);
      } else {
        systemMessage('No friendly target to make leader. Provide a name or select a friendly target and try again.');
      }
    });

  registerSlashCommand(
    'promote',
    'Give invite permission to your friendly target or if you provide a name, that character named.',
    (name: string = '') => {
      if (name.length > 0) {
        webAPI.WarbandsAPI.setRankByNameV1(client.shardID, client.characterID, name, 'Invite');
      } else if (friendlyTargetName && friendlyTargetName !== '') {
        webAPI.WarbandsAPI.setRankByNameV1(client.shardID, client.characterID, friendlyTargetName, 'Invite');
      } else {
        systemMessage('No friendly target to make leader. Provide a name or select a friendly target and try again.');
      }
    });

  function kick(targetName: string) {
    webAPI.WarbandsAPI.kickByNameV1(client.shardID, client.characterID, targetName)
      .then((response: any) => {
        if (!response.ok) {
          // something went wrong
          console.error(response);
          systemMessage('Failed to kick member.');
          return;
        }
      });
  }

  registerSlashCommand('kick', 'Give a Warband member the boot.', (name: string = '') => {
    if (name.length > 0) {
      kick(name);
    } else if (friendlyTargetName && friendlyTargetName !== '') {
      kick(friendlyTargetName);
    } else {
      systemMessage('No friendly target to kick. Provide a name or select a friendly target and try again.');
    }
  });

};
