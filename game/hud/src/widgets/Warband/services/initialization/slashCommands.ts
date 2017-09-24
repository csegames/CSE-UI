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
  webAPI,
} from 'camelot-unchained';

export const parseArgs = (args: string): any => yargs(args);
export const systemMessage = (message: string): void => events.fire('system_message', message);

async function createWarbandWithoutName() {
  const res = await webAPI.WarbandsAPI.CreateV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
  );
  if (!res.ok) {
    // console.error(response);
    systemMessage('Failed to create Warband.');
    // systemMessage(response.data);
    return;
  }

  systemMessage('Warband successfully created!');
}

async function createWarbandWithName(name: string) {
  const res = await webAPI.WarbandsAPI.CreateWithNameV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    name,
  );
  if (!res.ok) {
    // something went wrong
    // console.error(response);
    systemMessage(`Failed to create Warband.`);
    // systemMessage(response.data);
    return;
  }

  // success
  systemMessage(`Warband ${name} successfully created!`);
}

async function inviteByName(name: string) {
  const res = await webAPI.WarbandsAPI.InviteByNameV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    name,
  );
  if (!res.ok) {
    // something went wrong
    console.error(res);

    return;
  }
}

async function joinByName(name: string) {
  const res = await webAPI.WarbandsAPI.JoinByNameV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    name,
    client.characterID,
  );
  if (!res.ok) {
    // something went wrong
    console.error(res);
    return;
  }
}

async function joinByNameWithInvite(warbandName: string, inviteCode: string) {
  const res = await webAPI.WarbandsAPI.JoinByNameWithInviteV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    warbandName,
    client.characterID,
    inviteCode,
  );
  if (!res.ok) {
    // something went wrong
    console.error(res);
    return;
  }
}

async function quitWarband() {
  const res = await webAPI.WarbandsAPI.QuitV1(webAPI.defaultConfig, client.loginToken, client.shardID, client.characterID);
  if (!res.ok) {
    // something went wrong
    console.error(res);
    return;
  }
}

async function abandonWarbandWithoutName() {
  const res = await webAPI.WarbandsAPI.AbandonV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
  );
  if (!res.ok) {
    // something went wrong
    console.error(res);
    return;
  }
}

async function abandonWarbandWithName(name: string) {
  const res = await webAPI.WarbandsAPI.AbandonByNameV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    name,
  );
  if (!res.ok) {
    // something went wrong
    console.error(res);
    return;
  }
}

function setLeaderByName(name: string) {
  webAPI.WarbandsAPI.SetLeaderByNameV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    name,
  );
}

function setRankByName(name: string) {
  webAPI.WarbandsAPI.SetRankByNameV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    name,
    'Invite',
  );
}

async function kickByName(name: string) {
  const res = await webAPI.WarbandsAPI.KickByNameV1(
    webAPI.defaultConfig,
    client.loginToken,
    client.shardID,
    client.characterID,
    name,
  );
  if (!res.ok) {
    // something went wrong
    console.error(res);
    systemMessage('Failed to kick member.');
    return;
  }
}

export default () => {

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
      if (name === '') {
        createWarbandWithoutName();
      } else {
        createWarbandWithName(name);
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
        inviteByName(name);
      } else if (friendlyTargetName && friendlyTargetName !== '') {
        inviteByName(friendlyTargetName);
      } else {
        systemMessage('No friendly target to invite. Provide a name or select a friendly target and try again.');
      }
    });


  registerSlashCommand('joinWarband', 'Join an existing Warband.', (args: string) => {
    const argv = yargs(args);
    if (argv._.length === 1) {
      // name only
      joinByName(argv._[0]);
    } else if (argv._.length === 2) {
      // name and invite code
      joinByNameWithInvite(argv._[0], argv._[1]);
    } else {
      systemMessage('Please provide a Warband name, or a Warband name and invite code in order to join a Warband.');
    }
  });

  /**
   * Quit your currently active Warband
   */
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
        abandonWarbandWithoutName();
      } else {
        abandonWarbandWithName(name);
      }
    });

  /**
   * Permissions, Rank, and Role management.
   */

  registerSlashCommand(
    'makeleader', 'Make your friendly target the leader of your warband or if you provide a name, that character named.',
    (name: string = '') => {
      if (name.length > 0) {
        setLeaderByName(name);
      } else if (friendlyTargetName && friendlyTargetName !== '') {
        setLeaderByName(friendlyTargetName);
      } else {
        systemMessage('No friendly target to make leader. Provide a name or select a friendly target and try again.');
      }
    });

  registerSlashCommand(
    'promote',
    'Give invite permission to your friendly target or if you provide a name, that character named.',
    (name: string = '') => {
      if (name.length > 0) {
        setRankByName(name);
      } else if (friendlyTargetName && friendlyTargetName !== '') {
        setRankByName(friendlyTargetName);
      } else {
        systemMessage('No friendly target to make leader. Provide a name or select a friendly target and try again.');
      }
    });

  registerSlashCommand('kick', 'Give a Warband member the boot.', (name: string = '') => {
    if (name.length > 0) {
      kickByName(name);
    } else if (friendlyTargetName && friendlyTargetName !== '') {
      kickByName(friendlyTargetName);
    } else {
      systemMessage('No friendly target to kick. Provide a name or select a friendly target and try again.');
    }
  });

};
