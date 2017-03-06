/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

let yargs = require('yargs-parser');
import { client, registerSlashCommand, hasClientAPI, SlashCommand, getSlashCommands, webAPI, utils } from 'camelot-unchained';
import { parseArgs, systemMessage } from './utils';

export default () => {

  interface Command {
    description: string;
    handler: (params?: string) => void;
  }

  let friendlyTargetName: string = '';
  client.OnFriendlyTargetNameChanged((name: string) => {
    friendlyTargetName = name;
  });

  function argsWithHelp(params: string) {
    return yargs(params, {
      alias: { help: 'h' },
      boolean: ['help'],
    });
  }

  function shouldShowHelp(argv: any, requireArgs: boolean) {
    return (requireArgs && argv._.length === 0) || argv._[0] === 'help' || argv.h || argv.help;
  }

  const orderCommands: utils.Dictionary<Command> = {
    'help': {
      description: 'Displays help information',
      handler: function () {
        // list commands
        for (const key in orderCommands) {
          systemMessage(`${key} : ${orderCommands[key].description}`)
        }
      }
    },

    'create': {
      description: 'Create an order.',
      handler: function (name: string) {
        if (name.length === 0 || name === 'help' || name === '-h' || name === '--help') {
          // display help
          systemMessage(`${orderCommands['create'].description}`);
          systemMessage(`Usage: /order create <name>`);
          return;
        }

        systemMessage(`Attempting to create Order ${name}...`);
        webAPI.OrdersAPI.createV1(client.shardID, client.characterID, name)
          .then((response: any) => {
            if (!response.ok) {
              systemMessage(`Failed to create Order.`);
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            systemMessage(`Order ${name} successfully created!`);
          });
      }
    },

    'invite': {
      description: 'Invite another player to your Order',
      handler: function (name: string) {
        if (name === 'help' || name === '-h' || name === '--help') {
          // display help
          systemMessage(`${orderCommands['invite'].description}`);
          systemMessage(`Usage: /order invite [name]`);
          systemMessage(`name is optional. If a name is not provided, this command will invite your friendly target.`);
          return;
        }

        const toInvite = name.length === 0 ? friendlyTargetName : name;
        systemMessage(`Attempting to invite ${toInvite}...`);
        webAPI.OrdersAPI.inviteByNameV1(client.shardID, client.characterID, toInvite)
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage(`Failed to invite ${toInvite} to your Order.`);
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            systemMessage(`An Order invite has been sent to ${toInvite}.`);
          });
      }
    },

    'abandon': {
      description: 'Abandon your Order.',
      handler: function () {
        systemMessage('Attempting to abandon your Order...');

        webAPI.OrdersAPI.abandonV1(client.shardID, client.characterID)
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage('Failed to abandon Order.');
              if (response.data !== null) systemMessage(`ERROR : ${response.data}`);
              return;
            }
            systemMessage('You are no longer a member of an Order.');
          });
      }
    },

    'quit': {
      description: 'Abandon your Order.',
      handler: function () {
        orderCommands['abandon'].handler();
      }
    },

    'disband': {
      description: 'Disband your Order.',
      handler: function() {
        systemMessage('Attemping to disband your Order...');

        webAPI.OrdersAPI.disbandV1(client.shardID, client.characterID)
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage('Failed to disband Order.');
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }
            systemMessage('Your Order has been disbanded.');
          });
      }
    },

    'showpermissions': {
      description: 'List what permissions are available to be assigned to Order ranks.',
      handler: function (params: string) {
        systemMessage('Fetching permissions info...');
        // no args...
        webAPI.GameDataAPI.getOrderPermissionsV1()
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage('Failed to retrieve Order permissions from the Web API.');
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            const permissions = <webAPI.PermissionInfo[]>response.data;
            for (let i = 0; i < permissions.length; ++i) {
              const p = permissions[i];
              systemMessage(`${p.name} : ${p.description}`);
            }
          });
      }
    },


    'createrank': {
      description: 'Create a new custom rank for your Order.',
      handler: function (params: string) {
        const argv = argsWithHelp(params);

        if (shouldShowHelp(argv, true)) {
          systemMessage(`${orderCommands['createrank'].description}`);
          systemMessage('Usage: /order createRank <name> <level> [permissions]');
          systemMessage('permissions are optional. List permissions seperated by a space; ie. Invite Kick');
          systemMessage('To view available permission names type /order showPermissions');
          return;
        }

        systemMessage(`Attempting to create rank ${argv._[0]}...`);
        const permissions = argv._.slice(2);
        webAPI.OrdersAPI.createRankV1(client.shardID, client.characterID, argv._[0], Number.parseInt(argv._[1]), permissions)
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage(`Failed to create rank.`);
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            systemMessage(`Order rank ${argv._[0]} created!`);
          });
      }
    },

    'removerank': {
      description: 'Remove a custom rank from your Order.',
      handler: function (params: string) {
        const argv = argsWithHelp(params);

        if (shouldShowHelp(argv, true)) {
          systemMessage(`${orderCommands['removerank'].description}`);
          systemMessage('Usage: /order removeRank <name>');
          return;
        }

        systemMessage(`Attemping to remove rank ${argv._[0]}...`);
        webAPI.OrdersAPI.removeRankV1(client.shardID, client.characterID, argv._[0])
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage(`Failed to remove rank ${argv._[0]}`);
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            systemMessage(`Order rank ${argv._[0]} was removed.`);
          });
      }
    },

    'renamerank': {
      description: 'Rename a custom rank in your Order.',
      handler: function (params: string) {
        const argv = argsWithHelp(params);

        if (shouldShowHelp(argv, true)) {
          systemMessage(`${orderCommands['renamerank'].description}`);
          systemMessage('Usage: /order renamerank <current name> <new name>');
          return;
        }

        systemMessage(`Attempting to rename rank ${argv._[0]} to ${argv._[1]}...`);
        webAPI.OrdersAPI.renameRankV1(client.shardID, client.characterID, argv._[0], argv._[1])
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage('Failed to rename rank');
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            systemMessage(`Successfully renamed rank ${argv._[0]} to ${argv._[1]}!`);
          });
      }
    },

    // 'showranks': {
    //   description: 'Show all ranks in your Order.',
    //   handler: function () {
    //     systemMessage('Fetching ranks from the Web API...');
    //
    //     webAPI.OrdersAPI.showRanksV1(client.shardID, client.characterID)
    //       .then((response: any) => {
    //         if (!response.ok) {
    //           console.error(response);
    //           systemMessage('Failed to fetch ranks. :(');
    //           if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
    //           return;
    //         }

    //         const ranks = <webAPI.RankInfo[]>response.data;

    //         for (let i = 0; i < ranks.length; ++i) {
    //           const r = ranks[i];
    //           systemMessage(`${r.name} ${r.level} ${r.permissions.length > 0 ? r.permissions.join(', ') : 'No Permissions'}`);
    //         }

    //       });
    //   }
    // },

    'addrankpermissions': {
      description: 'Add permissions to a rank in your Order.',
      handler: function (params: string) {
        var argv = argsWithHelp(params);

        if (shouldShowHelp(argv, true)) {
          systemMessage(`${orderCommands['addrankpermissions'].description}`);
          systemMessage('Usage: /order addrankpermissions <rank name> <permissions>');
          systemMessage('List permissions seperated by a space; ie. Invite Kick');
          systemMessage('To view available permission names type /order showPermissions');
          return;
        }

        systemMessage(`Attempting to add permissions to rank ${argv._[0]}...`);
        const permissions = argv._.slice(1);
        webAPI.OrdersAPI.addRankPermissionsV1(client.shardID, client.characterID, argv._[0], permissions)
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage('Failed to add permissions ranks. :(');
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            systemMessage(`Successfully added ${permissions.join(', ')} permisions to rank ${argv._[0]}`);
          });
      }
    },

    'removerankpermissions': {
      description: 'Remove permissions to a rank in your Order.',
      handler: function (params: string) {
        var argv = argsWithHelp(params);

        if (shouldShowHelp(argv, true)) {
          systemMessage(`${orderCommands['removerankpermissions'].description}`);
          systemMessage('Usage: /order removerankpermissions <rank name> <permissions>');
          systemMessage('List permissions seperated by a space; ie. Invite Kick');
          systemMessage('To view current rank permissions names type /order showRanks');
          return;
        }

        systemMessage(`Attempting to remove permissions from rank ${argv._[0]}...`);
        const permissions = argv._.slice(1);
        webAPI.OrdersAPI.removeRankPermissionsV1(client.shardID, client.characterID, argv._[0], permissions)
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage('Failed to remove permissions ranks. :(');
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            systemMessage(`Successfully removed ${permissions.join(', ')} permisions from rank ${argv._[0]}`);
          });
      }
    },

    'changeranklevel': {
      description: 'Change level of a rank in your Order.',
      handler: function (params: string) {
        var argv = argsWithHelp(params);

        if (shouldShowHelp(argv, true)) {
          systemMessage(`${orderCommands['changeranklevel'].description}`);
          systemMessage('Usage: /order changeranklevel <rank name> <level>');
          return;
        }

        systemMessage(`Attemping to change level of rank ${argv._[0]} to ${argv._[1]}...`);
        webAPI.OrdersAPI.changeRankLevelV1(client.shardID, client.characterID, argv._[0], argv._[1])
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage('Failed to change rank level. :(');
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            systemMessage(`Successfully changed level of rank ${argv._[0]} to ${argv._[1]}`);
          });
      }
    },

    'rank': {
      description: 'View your rank!',
      handler: function () {
        systemMessage('Fetching your rank...');
        webAPI.OrdersAPI.getMyRankV1(client.shardID, client.characterID)
          .then((response: any) => {
            if (!response.ok) {
              console.error(response);
              systemMessage('Failed to get your rank. :(');
              if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
              return;
            }

            var rank = <webAPI.RankInfo>response.data;
            systemMessage(`${rank.name} ${rank.level} ${rank.permissions.join(', ')}`);
          });
      }
    }

  };

  registerSlashCommand('order', 'Order commands, use /order help to view available commands.', (params: string) => {
    if (typeof params === 'undefined' || params.length === 0 || params === '') {
      orderCommands['help'].handler('');
      return;
    }
    const splitParams = params.trim().split(/ (.+)?/)
    let command = orderCommands[splitParams[0].toLowerCase()];
    if (typeof command === 'undefined' || params.length === 0) command = orderCommands['help'];
    command.handler(splitParams.length > 1 ? splitParams[1] : '');
  });
}

