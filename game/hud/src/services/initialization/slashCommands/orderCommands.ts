/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export default (): any => null;

// import yargs from 'yargs-parser';
// import {
//   client,
//   registerSlashCommand,
//   webAPI,
//   utils,
// } from '@csegames/camelot-unchained';
// import { systemMessage } from './utils';

// export default () => {

//   interface Command {
//     description: string;
//     handler: (params?: string) => void;
//   }

//   let friendlyTargetName: string = '';
//   client.OnFriendlyTargetNameChanged((name: string) => {
//     friendlyTargetName = name;
//   });

//   function argsWithHelp(params: string) {
//     return yargs(params, {
//       alias: { help: 'h' },
//       boolean: ['help'],
//     });
//   }

//   function shouldShowHelp(argv: any, requireArgs: boolean) {
//     return (requireArgs && argv._.length === 0) || argv._[0] === 'help' || argv.h || argv.help;
//   }

//   const orderCommands: utils.Dictionary<Command> = {
//     help: {
//       description: 'Displays help information',
//       handler: () => {
//         // list commands
//         for (const key in orderCommands) {
//           systemMessage(`${key} : ${orderCommands[key].description}`);
//         }
//       },
//     },

//     create: {
//       description: 'Create an order.',
//       handler: (name: string) => {
//         if (name.length === 0 || name === 'help' || name === '-h' || name === '--help') {
//           // display help
//           systemMessage(`${orderCommands['create'].description}`);
//           systemMessage(`Usage: /order create <name>`);
//           return;
//         }

//         systemMessage(`Attempting to create Order ${name}...`);
//         createOrder(name);
//       },
//     },

//     invite: {
//       description: 'Invite another player to your Order',
//       handler: (name: string) => {
//         if (name === 'help' || name === '-h' || name === '--help') {
//           // display help
//           systemMessage(`${orderCommands['invite'].description}`);
//           systemMessage(`Usage: /order invite [name]`);
//           systemMessage(`name is optional. If a name is not provided, this command will invite your friendly target.`);
//           return;
//         }

//         const toInvite = name.length === 0 ? friendlyTargetName : name;
//         systemMessage(`Attempting to invite ${toInvite}...`);
//         invitePlayer(toInvite);
//       },
//     },

//     abandon: {
//       description: 'Abandon your Order.',
//       handler: () => {
//         systemMessage('Attempting to abandon your Order...');
//         abandonOrder();
//       },
//     },

//     quit: {
//       description: 'Abandon your Order.',
//       handler: () => {
//         orderCommands['abandon'].handler();
//       },
//     },

//     disband: {
//       description: 'Disband your Order.',
//       handler: () => {
//         systemMessage('Attemping to disband your Order...');
//         disbandOrder();
//       },
//     },

//     showpermissions: {
//       description: 'List what permissions are available to be assigned to Order ranks.',
//       handler: (params: string) => {
//         systemMessage('Fetching permissions info...');
//         // no args...
//         webAPI.GameDataAPI.GetOrderPermissionsV1(webAPI.defaultConfig).then((res) => {
//           const data = JSON.parse(res.data);
//           if (!res.ok) {
//             console.error(res);
//             systemMessage('Failed to retrieve Order permissions from the Web API');
//             if (data !== null) {
//               systemMessage(`ERROR : ${data.Message}`);
//             }
//             return;
//           }

//           const permissions = <webAPI.PermissionInfo[]> data;
//           for (let i = 0; i < permissions.length; ++i) {
//             const p = permissions[i];
//             systemMessage(`${p.name} : ${p.description}`);
//           }
//         });
//       },
//     },


//     createrank: {
//       description: 'Create a new custom rank for your Order.',
//       handler: (params: string) => {
//         const argv = argsWithHelp(params);
//         const rankName = argv._[0];
//         const rankLevel = Number.parseInt(argv._[1], 10);
//         const permissions = argv._.slice(2);

//         if (shouldShowHelp(argv, true)) {
//           systemMessage(`${orderCommands['createrank'].description}`);
//           systemMessage('Usage: /order createRank <name> <level> [permissions]');
//           systemMessage('permissions are optional. List permissions seperated by a space; ie. Invite Kick');
//           systemMessage('To view available permission names type /order showPermissions');
//           return;
//         }

//         systemMessage(`Attempting to create rank ${rankName}...`);
//         createRank(rankName, rankLevel, permissions);
//       },
//     },

//     removerank: {
//       description: 'Remove a custom rank from your Order.',
//       handler: (params: string) => {
//         const argv = argsWithHelp(params);
//         const rankName = argv._[0];

//         if (shouldShowHelp(argv, true)) {
//           systemMessage(`${orderCommands['removerank'].description}`);
//           systemMessage('Usage: /order removeRank <name>');
//           return;
//         }

//         systemMessage(`Attemping to remove rank ${rankName}...`);
//         removeRank(rankName);
//       },
//     },

//     renamerank: {
//       description: 'Rename a custom rank in your Order.',
//       handler: (params: string) => {
//         const argv = argsWithHelp(params);
//         const currentName = argv._[0];
//         const newName = argv._[1];

//         if (shouldShowHelp(argv, true)) {
//           systemMessage(`${orderCommands['renamerank'].description}`);
//           systemMessage('Usage: /order renamerank <current name> <new name>');
//           return;
//         }

//         systemMessage(`Attempting to rename rank ${argv._[0]} to ${argv._[1]}...`);
//         renameRank(currentName, newName);
//       },
//     },

//     // 'showranks': {
//     //   description: 'Show all ranks in your Order.',
//     //   handler: function () {
//     //     systemMessage('Fetching ranks from the Web API...');
//     //
//     //     webAPI.OrdersAPI.showRanksV1(client.shardID, client.characterID)
//     //       .then((response: any) => {
//     //         if (!response.ok) {
//     //           console.error(response);
//     //           systemMessage('Failed to fetch ranks. :(');
//     //           if (response.data !== null) systemMessage(`ERROR : ${response.data.Message}`);
//     //           return;
//     //         }

//     //         const ranks = <webAPI.RankInfo[]>response.data;

//     //         for (let i = 0; i < ranks.length; ++i) {
//     //           const r = ranks[i];
//     //           systemMessage(`${r.name} ${r.level} ${r.permissions.length > 0 ? r.permissions.join(', ') :
//     //           'No Permissions'}`);
//     //         }

//     //       });
//     //   }
//     // },

//     addrankpermissions: {
//       description: 'Add permissions to a rank in your Order.',
//       handler: (params: string) => {
//         const argv = argsWithHelp(params);
//         const name = argv._[0];
//         const permissions = argv._.slice(1);
//         if (shouldShowHelp(argv, true)) {
//           systemMessage(`${orderCommands['addrankpermissions'].description}`);
//           systemMessage('Usage: /order addrankpermissions <rank name> <permissions>');
//           systemMessage('List permissions seperated by a space; ie. Invite Kick');
//           systemMessage('To view available permission names type /order showPermissions');
//           return;
//         }

//         systemMessage(`Attempting to add permissions to rank ${argv._[0]}...`);
//         addRankPermissions(name, permissions);
//       },
//     },

//     removerankpermissions: {
//       description: 'Remove permissions to a rank in your Order.',
//       handler: (params: string) => {
//         const argv = argsWithHelp(params);
//         const name = argv._[0];
//         const permissions = argv._.slice(1);
//         if (shouldShowHelp(argv, true)) {
//           systemMessage(`${orderCommands['removerankpermissions'].description}`);
//           systemMessage('Usage: /order removerankpermissions <rank name> <permissions>');
//           systemMessage('List permissions seperated by a space; ie. Invite Kick');
//           systemMessage('To view current rank permissions names type /order showRanks');
//           return;
//         }

//         systemMessage(`Attempting to remove permissions from rank ${argv._[0]}...`);
//         removeRankPermissions(name, permissions);
//       },
//     },

//     changeranklevel: {
//       description: 'Change level of a rank in your Order.',
//       handler: (params: string) => {
//         const argv = argsWithHelp(params);
//         const name = argv._[0];
//         const level = argv._[1];

//         if (shouldShowHelp(argv, true)) {
//           systemMessage(`${orderCommands['changeranklevel'].description}`);
//           systemMessage('Usage: /order changeranklevel <rank name> <level>');
//           return;
//         }

//         systemMessage(`Attemping to change level of rank ${name} to ${level}...`);
//         changeRankLevel(name, level);
//       },
//     },

//     rank: {
//       description: 'View your rank!',
//       handler: () => {
//         systemMessage('Fetching your rank...');
//         webAPI.OrdersAPI.GetMyRankV1(
//           webAPI.defaultConfig,
//           client.loginToken,
//           client.shardID,
//           client.characterID,
//         ).then((res) => {
//           const data = JSON.parse(res.data);
//           if (!res.ok) {
//             console.error(res);
//             systemMessage('Failed to get your rank :(');
//             if (data !== null) {
//               systemMessage(`ERROR : ${data.Message}`);
//             }
//             return;
//           }

//           const rank = <webAPI.RankInfo> data;
//           systemMessage(`${rank.name} ${rank.level} ${rank.permissions.join(', ')}`);
//         });
//       },
//     },

//   };

//   registerSlashCommand('order', 'Order commands, use /order help to view available commands.', (params: string) => {
//     if (typeof params === 'undefined' || params.length === 0 || params === '') {
//       orderCommands['help'].handler('');
//       return;
//     }
//     const splitParams = params.trim().split(/ (.+)?/);
//     let command = orderCommands[splitParams[0].toLowerCase()];
//     if (typeof command === 'undefined' || params.length === 0) command = orderCommands['help'];
//     command.handler(splitParams.length > 1 ? splitParams[1] : '');
//   });
// };

// async function createOrder(name: string) {
//   try {
//     const res = await webAPI.OrdersAPI.CreateV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//       name,
//     );

//     if (!res.ok) {
//       const data = JSON.parse(res.data);
//       systemMessage(`Failed to create Order`);
//       if (data !== null) {
//         systemMessage(`ERROR : ${res.data}`);
//       }
//       return;
//     }
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function invitePlayer(toInvite: string) {
//   try {
//     const res = await webAPI.OrdersAPI.InviteByNameV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//       toInvite,
//     );
//     if (!res.ok) {
//       const data = JSON.parse(res.data);
//       console.error(res);
//       systemMessage(`Failed to invite ${toInvite} to your Order.`);
//       if (data !== null) {
//         systemMessage(`ERROR : ${data}`);
//       }
//       return;
//     }
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function abandonOrder() {
//   try {
//     const res = await webAPI.OrdersAPI.AbandonV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//     );
//     if (!res.ok) {
//       const data = JSON.parse(res.data);
//       console.error(res);
//       systemMessage('Failed to abandon Order.');
//       if (data !== null) {
//         systemMessage(`ERROR : ${data}`);
//       }
//     }
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function disbandOrder() {
//   try {
//     const res = await webAPI.OrdersAPI.DisbandV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//     );
//     if (!res.ok) {
//       const data = JSON.parse(res.data);
//       console.error(res);
//       systemMessage(`Failed to disband Order.`);
//       if (data !== null) {
//         systemMessage(`ERROR : ${data.Message}`);
//       }
//     }
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function createRank(rankName: string, rankLevel: number, permissions: any[]) {
//   try {
//     const res = await webAPI.OrdersAPI.CreateRankV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//       rankName,
//       rankLevel,
//       permissions,
//     );
//     const data: any = JSON.parse(res.data);
//     if (!res.ok) {
//       console.error(res);
//       systemMessage(`Failed to create rank.`);
//       if (data !== null) {
//         systemMessage(`ERROR : ${data.Message}`);
//       }
//       return;
//     }

//     systemMessage(`Order rank ${rankName} created!`);
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function removeRank(rankName: string) {
//   try {
//     const res = await webAPI.OrdersAPI.RemoveRankV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//       rankName,
//     );
//     if (!res.ok) {
//       const data = JSON.parse(res.data);
//       console.error(res);
//       systemMessage(`Failed to remove rank ${rankName}`);
//       if (data !== null) {
//         systemMessage(`ERROR : ${data.Message}`);
//       }
//       return;
//     }

//     systemMessage(`Order rank ${rankName} was removed.`);
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function renameRank(currentName: string, newName: string) {
//   try {
//     const res = await webAPI.OrdersAPI.RenameRankV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//       currentName,
//       newName,
//     );
//     if (!res.ok) {
//       const data = JSON.parse(res.data);
//       console.error(res);
//       systemMessage('Failed to rename rank');
//       if (data !== null) {
//         systemMessage(`ERROR : ${data.Message}`);
//       }
//       return;
//     }

//     systemMessage(`Successfully renamed rank ${currentName} to ${newName}!`);
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function addRankPermissions(name: string, permissions: string[]) {
//   try {
//     const res = await webAPI.OrdersAPI.AddRankPermissionsV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//       name,
//       permissions,
//     );
//     if (!res.ok) {
//       const data = JSON.parse(res.data);
//       console.error(res);
//       systemMessage('Failed to add permissions ranks. :(');
//       if (data !== null) {
//         systemMessage(`ERROR : ${data.Message}`);
//       }
//       return;
//     }

//     systemMessage(`Successfully added ${permissions.join(', ')} permissions to rank ${name}`);
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function removeRankPermissions(name: string, permissions: string[]) {
//   try {
//     const res = await webAPI.OrdersAPI.RemoveRankPermissionsV1(
//       webAPI.defaultConfig,
//       client.loginToken,
//       client.shardID,
//       client.characterID,
//       name,
//       permissions,
//     );
//     if (!res.ok) {
//       const data = JSON.parse(res.data);
//       console.error(res);
//       systemMessage('Failed to remove permissions ranks. :(');
//       if (data !== null) {
//         systemMessage(`ERROR : ${data.Message}`);
//       }
//       return;
//     }

//     systemMessage(`Successfully removed ${permissions.join(', ')} permission from rank ${name}`);
//   } catch (err) {
//     webAPI.handleWebAPIError(err);
//   }
// }

// async function changeRankLevel(name: string, level: number) {
//   const res = await webAPI.OrdersAPI.ChangeRankLevelV1(
//     webAPI.defaultConfig,
//     client.loginToken,
//     client.shardID,
//     client.characterID,
//     name,
//     level,
//   );
//   if (!res.ok) {
//     const data = JSON.parse(res.data);
//     console.error(res);
//     systemMessage(`Failed to change rank level :(`);
//     if (data !== null) {
//       systemMessage(`ERROR : ${data.Message}`);
//     }
//     return;
//   }

//   systemMessage(`Successfully changed level of rank ${name} to ${level}`);
// }
