/* tslint:disable */
/* GENERATED FILE -- DO NOT EDIT */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { request as xhrRequest, RequestResult } from '../util/request';

export interface RequestConfig {
  url: string;
  headers?: { [key: string]: string };
}

export const CharactersAPI = {
  GetCharactersV1Async: function(config: RequestConfig, loginToken: string,) {
    return xhrRequest('post', config.url + 'v1/characters/getAll', {}, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetCharactersOnShardV1Async: function(config: RequestConfig, loginToken: string, shardID: number) {
    return xhrRequest('post', config.url + 'v1/characters/getAllOnShard', {
      shardID: shardID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetCharacterV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/characters/get', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  DeleteCharacterV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/characters/delete', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  CreateCharacterV1Async: function(config: RequestConfig, loginToken: string, shardID: number, character: Character) {
    return xhrRequest('post', config.url + 'v1/characters/create', {
      shardID: shardID,
    }, character, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const ContentAPI = {
  MessageOfTheDayV1Async: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/messageoftheday', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  PatcherHeroContentV1Async: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/patcherherocontent', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  PatcherAlertsV1Async: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/patcheralerts', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const CraftingAPI = {
  SetVoxJob: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, job: VoxJobType) {
    return xhrRequest('post', config.url + 'v1/crafting/setvoxjob', {
      shardID: shardID,
      characterID: characterID,
      job: job,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  ClearVoxJob: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/crafting/clearvoxjob', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetRecipeID: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, recipeID: string) {
    return xhrRequest('post', config.url + 'v1/crafting/setvoxrecipeid', {
      shardID: shardID,
      characterID: characterID,
      recipeID: recipeID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetQuality: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, quality: number) {
    return xhrRequest('post', config.url + 'v1/crafting/setvoxquality', {
      shardID: shardID,
      characterID: characterID,
      quality: quality,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetCustomItemName: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, itemName: string) {
    return xhrRequest('post', config.url + 'v1/crafting/setvoxcustomitemname', {
      shardID: shardID,
      characterID: characterID,
      itemName: itemName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AddIngredient: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, itemInstanceID: string, unitCount: number, slot: SubItemSlot) {
    return xhrRequest('post', config.url + 'v1/crafting/addvoxingredient', {
      shardID: shardID,
      characterID: characterID,
      itemInstanceID: itemInstanceID,
      unitCount: unitCount,
      slot: slot,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RemoveVoxIngredient: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, itemInstanceID: string, unitCount: number) {
    return xhrRequest('post', config.url + 'v1/crafting/removevoxingredient', {
      shardID: shardID,
      characterID: characterID,
      itemInstanceID: itemInstanceID,
      unitCount: unitCount,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  StartVoxJob: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/crafting/startvoxjob', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  CollectFinishedVoxJob: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/crafting/collectfinishedvoxjob', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  CancelVoxJob: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/crafting/cancelvoxjob', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetVoxItemCount: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, count: number) {
    return xhrRequest('post', config.url + 'v1/crafting/setvoxitemcount', {
      shardID: shardID,
      characterID: characterID,
      count: count,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const GameDataAPI = {
  GetFactionInfoV1: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/gamedata/factionInfo', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetFactionsV1: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/gamedata/factions', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetAttributeInfoV1Async: function(config: RequestConfig, shard: number) {
    return xhrRequest('get', config.url + 'v1/gamedata/attributeInfo', {
      shard: shard,
    }, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetArchetypesV1: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/gamedata/archetypes', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetRacesV1: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/gamedata/races', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetAttributeOffsetsV1Async: function(config: RequestConfig, shard: number) {
    return xhrRequest('get', config.url + 'v1/gamedata/attributeOffsets', {
      shard: shard,
    }, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetOrderPermissionsV1: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/gamedata/orderPermissions', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const GraphQLAPI = {
  PostAsync: function(config: RequestConfig,) {
    return xhrRequest('post', config.url + 'graphql', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const GroupsAPI = {
  GetInvitesForCharacterV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/groups/getInvitesForCharacter', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  CreateRankV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, name: string, level: number, permissions: string[]) {
    return xhrRequest('post', config.url + 'v1/groups/createRank', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      name: name,
      level: level,
      permissions: permissions,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RemoveRankV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, name: string) {
    return xhrRequest('post', config.url + 'v1/groups/removeRank', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      name: name,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RenameRankV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, name: string, newName: string) {
    return xhrRequest('post', config.url + 'v1/groups/renameRank', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      name: name,
      newName: newName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AddRankPermissionsV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, name: string, permissions: string[]) {
    return xhrRequest('post', config.url + 'v1/groups/addRankPermissions', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      name: name,
      permissions: permissions,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RemoveRankPermissionsV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, name: string, permissions: string[]) {
    return xhrRequest('post', config.url + 'v1/groups/removeRankPermissions', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      name: name,
      permissions: permissions,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetRankPermissionsV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, name: string, permissions: string[]) {
    return xhrRequest('post', config.url + 'v1/groups/setRankPermissions', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      name: name,
      permissions: permissions,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetRankLevelV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, name: string, level: number) {
    return xhrRequest('post', config.url + 'v1/groups/setRankLevel', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      name: name,
      level: level,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AssignRankV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, targetID: string, rankName: string) {
    return xhrRequest('post', config.url + 'v1/groups/assignRank', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      targetID: targetID,
      rankName: rankName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  KickV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, targetID: string) {
    return xhrRequest('post', config.url + 'v1/groups/kick', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      targetID: targetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  InviteV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, targetID: string) {
    return xhrRequest('post', config.url + 'v1/groups/invite', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      targetID: targetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  InviteByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, targetName: string) {
    return xhrRequest('post', config.url + 'v1/groups/inviteByName', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      targetName: targetName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AcceptInviteV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, groupID: string, inviteCode: string) {
    return xhrRequest('post', config.url + 'v1/groups/acceptInvite', {
      shardID: shardID,
      characterID: characterID,
      groupID: groupID,
      inviteCode: inviteCode,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const ItemAPI = {
  MoveItems: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, request: MoveItemRequest) {
    return xhrRequest('post', config.url + 'v1/items/moveitems', {
      shardID: shardID,
      characterID: characterID,
      request: request,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  BatchMoveItems: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, requests: MoveItemRequest[]) {
    return xhrRequest('post', config.url + 'v1/items/batchmoveitems', {
      shardID: shardID,
      characterID: characterID,
    }, requests, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const OrdersAPI = {
  CreateV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, name: string) {
    return xhrRequest('post', config.url + 'v1/orders/create', {
      shardID: shardID,
      characterID: characterID,
      name: name,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  CreateRankV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, name: string, level: number, permissions: string[]) {
    return xhrRequest('post', config.url + 'v1/orders/createRank', {
      shardID: shardID,
      characterID: characterID,
      name: name,
      level: level,
      permissions: permissions,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RemoveRankV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, name: string) {
    return xhrRequest('post', config.url + 'v1/orders/removeRank', {
      shardID: shardID,
      characterID: characterID,
      name: name,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  InviteV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string) {
    return xhrRequest('post', config.url + 'v1/orders/inviteByID', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  InviteByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string) {
    return xhrRequest('post', config.url + 'v1/orders/inviteByName', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AcceptInviteAsync: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, orderID: string, inviteCode: string) {
    return xhrRequest('post', config.url + 'v1/orders/acceptInvite', {
      shardID: shardID,
      characterID: characterID,
      orderID: orderID,
      inviteCode: inviteCode,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  KickV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string) {
    return xhrRequest('post', config.url + 'v1/orders/kick', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AbandonV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/orders/abandon', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  DisbandV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/orders/disband', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RenameRankV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, name: string, newName: string) {
    return xhrRequest('post', config.url + 'v1/orders/renameRank', {
      shardID: shardID,
      characterID: characterID,
      name: name,
      newName: newName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AddRankPermissionsV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, name: string, permissions: string[]) {
    return xhrRequest('post', config.url + 'v1/orders/addRankPermissions', {
      shardID: shardID,
      characterID: characterID,
      name: name,
      permissions: permissions,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RemoveRankPermissionsV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, name: string, permissions: string[]) {
    return xhrRequest('post', config.url + 'v1/orders/removeRankPermissions', {
      shardID: shardID,
      characterID: characterID,
      name: name,
      permissions: permissions,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  ChangeRankLevelV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, name: string, level: number) {
    return xhrRequest('post', config.url + 'v1/orders/changeRankLevel', {
      shardID: shardID,
      characterID: characterID,
      name: name,
      level: level,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetMyRankV1: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/orders/getMyRank', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const PresenceAPI = {
  GetStartingServer: function(config: RequestConfig, shardID: number, characterID: string) {
    return xhrRequest('get', config.url + 'v1/presence/startingServer/{shardID}/{characterID}', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetServers: function(config: RequestConfig, shardID: number) {
    return xhrRequest('get', config.url + 'v1/presence/servers/{shardID}', {
      shardID: shardID,
    }, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetPlayers: function(config: RequestConfig, shardID: number) {
    return xhrRequest('get', config.url + 'v1/presence/players/{shardID}', {
      shardID: shardID,
    }, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const PlotsAPI = {
  ReleasePlotV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, entityID: string) {
    return xhrRequest('post', config.url + 'v1/plot/releasePlot', {
      shardID: shardID,
      characterID: characterID,
      entityID: entityID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  ModifyPermissionsV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, entityID: string, newPermissions: number) {
    return xhrRequest('post', config.url + 'v1/plot/modifyPermissions', {
      shardID: shardID,
      characterID: characterID,
      entityID: entityID,
      newPermissions: newPermissions,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RemoveQueuedBlueprintV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, entityID: string, indexToRemove: number) {
    return xhrRequest('post', config.url + 'v1/plot/removeQueuedBlueprint', {
      shardID: shardID,
      characterID: characterID,
      entityID: entityID,
      indexToRemove: indexToRemove,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  ReorderQueueV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, entityID: string, indexToMove: number, destinationIndex: number) {
    return xhrRequest('post', config.url + 'v1/plot/reorderQueue', {
      shardID: shardID,
      characterID: characterID,
      entityID: entityID,
      indexToMove: indexToMove,
      destinationIndex: destinationIndex,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetQueueStatusV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/plot/getQueueStatus', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const SecureTradeAPI = {
  Invite: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, tradeTargetID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/invite', {
      shardID: shardID,
      characterID: characterID,
      tradeTargetID: tradeTargetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RevokeInvite: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, inviteTargetID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/revokeinvite', {
      shardID: shardID,
      characterID: characterID,
      inviteTargetID: inviteTargetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AcceptInvite: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, inviterID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/acceptinvite', {
      shardID: shardID,
      characterID: characterID,
      inviterID: inviterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RejectInvite: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, inviterID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/rejectinvite', {
      shardID: shardID,
      characterID: characterID,
      inviterID: inviterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AbortSecureTradeAsync: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/abort', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  Lock: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/lock', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  Unlock: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/unlock', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AddItems: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, items: SecureTradeItem[]) {
    return xhrRequest('post', config.url + 'v1/secureTrade/additems', {
      shardID: shardID,
      characterID: characterID,
    }, items, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  RemoveItem: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, items: SecureTradeItem[]) {
    return xhrRequest('post', config.url + 'v1/secureTrade/removeItems', {
      shardID: shardID,
      characterID: characterID,
    }, items, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  Confirm: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/confirm', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  CancelTradeConfirmation: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/secureTrade/cancelconfirmation', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const ServersAPI = {
  GetServersV1: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/servers/getAll', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const TraitsAPI = {
  GetTraitsV1: function(config: RequestConfig, shardID: number) {
    return xhrRequest('get', config.url + 'v1/traits', {
      shardID: shardID,
    }, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const TypeGenAPI = {
  GetDefinitions: function(config: RequestConfig,) {
    return xhrRequest('get', config.url + 'v1/codegen/definitions.ts', {}, null, {
      headers: Object.assign({}, {
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export const WarbandsAPI = {
  CreateV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/create', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  CreateWithNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, name: string) {
    return xhrRequest('post', config.url + 'v1/warbands/createWithName', {
      shardID: shardID,
      characterID: characterID,
      name: name,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  InviteV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/invite', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  InviteByIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/inviteWithID', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  InviteByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string) {
    return xhrRequest('post', config.url + 'v1/warbands/inviteByName', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  InviteByNameWithIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/inviteByNameWithID', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  JoinWithInviteV1Async: function(config: RequestConfig, loginToken: string, shardID: number, warbandID: string, characterID: string, inviteCode: string) {
    return xhrRequest('post', config.url + 'v1/warbands/joinWithInvite', {
      shardID: shardID,
      warbandID: warbandID,
      characterID: characterID,
      inviteCode: inviteCode,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  JoinV1Async: function(config: RequestConfig, loginToken: string, shardID: number, warbandID: string, characterID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/join', {
      shardID: shardID,
      warbandID: warbandID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  JoinByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, warbandName: string, characterID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/joinByName', {
      shardID: shardID,
      warbandName: warbandName,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  JoinByNameWithInviteV1Async: function(config: RequestConfig, loginToken: string, shardID: number, warbandName: string, characterID: string, inviteCode: string) {
    return xhrRequest('post', config.url + 'v1/warbands/joinByNameWithInvite', {
      shardID: shardID,
      warbandName: warbandName,
      characterID: characterID,
      inviteCode: inviteCode,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  QuitV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/quit', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AbandonByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, warbandName: string) {
    return xhrRequest('post', config.url + 'v1/warbands/abandonByName', {
      shardID: shardID,
      characterID: characterID,
      warbandName: warbandName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AbandonV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/abandon', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  AbandonByIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/abandonByID', {
      shardID: shardID,
      characterID: characterID,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetRankV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string, rank: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setRank', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
      rank: rank,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetRankWithIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string, rank: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setRankWithID', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
      rank: rank,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetRankByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string, rank: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setRankByName', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
      rank: rank,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetRankByNameWithIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string, rank: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setRankByNameWithID', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
      rank: rank,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetLeaderV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setLeader', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetLeaderWithIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setLeaderWithID', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetLeaderByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setLeaderByName', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetLeaderByNameWithIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setLeaderByNameWithID', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetDisplayOrderV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string, wantDisplayOrder: number) {
    return xhrRequest('post', config.url + 'v1/warbands/setDisplayOrder', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
      wantDisplayOrder: wantDisplayOrder,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  SetDisplayOrderWithIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string, wantDisplayOrder: number, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/setDisplayOrderWithID', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
      wantDisplayOrder: wantDisplayOrder,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  KickV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/kick', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  KicWithIDkV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetID: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/kickWithID', {
      shardID: shardID,
      characterID: characterID,
      targetID: targetID,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  KickByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string) {
    return xhrRequest('post', config.url + 'v1/warbands/kickByName', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  KickByNameWithIDV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string, targetName: string, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/warbands/kickByNameWithID', {
      shardID: shardID,
      characterID: characterID,
      targetName: targetName,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetInfoV1Async: function(config: RequestConfig, loginToken: string, shardID: number, warbandID: string) {
    return xhrRequest('post', config.url + 'v1/groups/getWarbandInfoByID', {
      shardID: shardID,
      warbandID: warbandID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetInfoByNameV1Async: function(config: RequestConfig, loginToken: string, shardID: number, warbandName: string) {
    return xhrRequest('post', config.url + 'v1/groups/getWarbandInfoByName', {
      shardID: shardID,
      warbandName: warbandName,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetActiveInfoV1Async: function(config: RequestConfig, loginToken: string, shardID: number, characterID: string) {
    return xhrRequest('post', config.url + 'v1/groups/getMyActiveWarbandInfo', {
      shardID: shardID,
      characterID: characterID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
  GetAllWarbandsOnShardV1Async: function(config: RequestConfig, loginToken: string, shardID: number) {
    return xhrRequest('post', config.url + 'v1/groups/getAllWarbands', {
      shardID: shardID,
    }, null, {
      headers: Object.assign({}, {
        'loginToken': loginToken,
        'Accept': 'application/json',
      }, config.headers || {})
    });
  },
}

export enum AccessType {
  Public = 0,
  Beta3 = 1,
  Beta2 = 2,
  Beta1 = 3,
  Alpha = 4,
  InternalTest = 5,
  Employees = 6,
  Invalid = -1,
}

export enum ShapeType {
  Box = 0,
  Capsule = 1,
  Sphere = 2,
  Cone = 3,
}

export enum ServiceType {
  None = 0,
  Game = 1,
  Chat = 2,
  All = 4294967295,
}

export enum CollisionFlags {
  None = 0,
  Side = 1,
  Top = 2,
  Bottom = 4,
}

export enum PlayerMovementState {
  None = 0,
  Falling = 1,
  Hovering = 2,
  Sliding = 4,
  Swimming = 8,
  Walking = 16,
  Dead = 32,
  Ghost = 64,
  Attached = 128,
}

export enum EntityMoveKind {
  Player = 0,
  Controlled = 1,
}

export enum PlotType {
  Small = 0,
  Medium = 1,
  Large = 2,
  Custom = 3,
}

export enum BuildingDiffType {
  RangeSet = 0,
  ChangeTree = 1,
  FullStructure = 2,
  NoChange = 3,
  COUNT = 4,
}

export enum BuildPermissions {
  None = 0,
  Self = 0,
  Group = 1,
  Friends = 2,
  Guild = 4,
  Realm = 8,
  All = 16,
  COUNT = 32,
}

export enum PlotSource {
  Command = 0,
  Cog = 1,
  COUNT = 2,
}

export enum AnimSetID {
  Travel = 0,
}

export enum FootType {
  Bare = 0,
  Leather = 1,
  Chain = 2,
  Metal = 3,
  Plate = 4,
}

export enum PlayerStat {
  Strength = 0,
  Dexterity = 1,
  Agility = 2,
  Vitality = 3,
  Endurance = 4,
  Attunement = 5,
  Will = 6,
  Faith = 7,
  Resonance = 8,
  Eyesight = 9,
  Hearing = 10,
  Presence = 11,
  Clarity = 12,
  Affinity = 13,
  Mass = 14,
  MaxMoveSpeed = 15,
  MoveAcceleration = 16,
  MaxTurnSpeed = 17,
  Vision = 18,
  Detection = 19,
  Encumbrance = 20,
  EncumbranceReduction = 21,
  CarryCapacity = 22,
  MaxPanic = 23,
  PanicDecay = 24,
  MaxHP = 25,
  HealthRegeneration = 26,
  MaxStamina = 27,
  StaminaRegeneration = 28,
  AbilityPreparationSpeed = 29,
  AbilityRecoverySpeed = 30,
  CooldownSpeed = 31,
  Age = 32,
  Concealment = 33,
  VeilSubtlety = 34,
  VeilResist = 35,
  HealingReceivedBonus = 36,
  EnhancementDuration = 37,
  HeatTolerance = 38,
  ColdTolerance = 39,
  MaxBlood = 40,
  BloodRegeneration = 41,
  EffectPowerBonus = 42,
  None = 43,
  COUNT = 43,
}

export enum PlayerStatType {
  None = 0,
  Primary = 1,
  Secondary = 2,
  Derived = 3,
  Hidden = 4,
}

export enum AlloyStat {
  Hardness = 1,
  ImpactToughness = 2,
  FractureChance = 3,
  Malleability = 4,
  MassPCF = 5,
  Density = 6,
  MeltingPoint = 7,
  ThermConductivity = 8,
  SlashingResistance = 9,
  PiercingResistance = 10,
  CrushingResistance = 11,
  AcidResistance = 12,
  PoisonResistance = 13,
  DiseaseResistance = 14,
  EarthResistance = 15,
  WaterResistance = 16,
  FireResistance = 17,
  AirResistance = 18,
  LightningResistance = 19,
  FrostResistance = 20,
  LifeResistance = 21,
  MindResistance = 22,
  SpiritResistance = 23,
  RadiantResistance = 24,
  DeathResistance = 25,
  ShadowResistance = 26,
  ChaosResistance = 27,
  VoidResistance = 28,
  ArcaneResistance = 29,
  MagicalResistance = 30,
  HardnessFactor = 31,
  StrengthFactor = 32,
  FractureFactor = 33,
  MassFactor = 34,
  DamageResistance = 35,
  UnitHealth = 36,
}

export enum ArmorStat {
  ArmorClass = 1,
}

export enum BuildingBlockStat {
  CompressiveStrength = 1,
  ShearStrength = 2,
  TensileStrength = 3,
  Density = 4,
  HealthUnits = 5,
  BuildTimeUnits = 6,
  UnitMass = 7,
}

export enum ContainerStat {
  MaxItemCount = 1,
  MaxItemMass = 2,
}

export enum DurabilityStat {
  MaxRepairPoints = 1,
  MaxHealth = 2,
  FractureThreshold = 3,
  FractureChance = 4,
  CurrentRepairPoints = 5,
  CurrentHealth = 6,
  HealthLossPerUse = 7,
}

export enum ItemStat {
  Quality = 1,
  SelfMass = 2,
  TotalMass = 3,
  Encumbrance = 4,
  AgilityRequirement = 5,
  DexterityRequirement = 6,
  StrengthRequirement = 7,
  UnitCount = 8,
}

export enum SiegeEngineStat {
  Health = 1,
  YawSpeedDegPerSec = 2,
  PitchSpeedDegPerSec = 3,
}

export enum SubstanceStat {
  Hardness = 1,
  ImpactToughness = 2,
  FractureChance = 3,
  Malleability = 4,
  MassPCF = 5,
  Density = 6,
  MeltingPoint = 7,
  ThermConductivity = 8,
  SlashingResistance = 9,
  PiercingResistance = 10,
  CrushingResistance = 11,
  AcidResistance = 12,
  PoisonResistance = 13,
  DiseaseResistance = 14,
  EarthResistance = 15,
  WaterResistance = 16,
  FireResistance = 17,
  AirResistance = 18,
  LightningResistance = 19,
  FrostResistance = 20,
  LifeResistance = 21,
  MindResistance = 22,
  SpiritResistance = 23,
  RadiantResistance = 24,
  DeathResistance = 25,
  ShadowResistance = 26,
  ChaosResistance = 27,
  VoidResistance = 28,
  ArcaneResistance = 29,
  MagicalResistance = 30,
  HardnessFactor = 31,
  StrengthFactor = 32,
  FractureFactor = 33,
  MassFactor = 34,
  UnitHealth = 35,
}

export enum WeaponStat {
  PiercingDamage = 1,
  PiercingBleed = 2,
  PiercingArmorPenetration = 3,
  SlashingDamage = 4,
  SlashingBleed = 5,
  SlashingArmorPenetration = 6,
  CrushingDamage = 7,
  FallbackCrushingDamage = 8,
  Disruption = 9,
  DeflectionAmount = 10,
  PhysicalProjectileSpeed = 11,
  KnockbackAmount = 12,
  Stability = 13,
  FalloffMinDistance = 14,
  FalloffMaxDistance = 15,
  FalloffReduction = 16,
  DeflectionRecovery = 17,
  StaminaCost = 18,
  PhysicalPreparationTime = 19,
  PhysicalRecoveryTime = 20,
  Range = 21,
}

export enum SubItemSlot {
  Invalid = 0,
  PrimarySubstance = 1,
  SecondarySubstance1 = 2,
  SecondarySubstance2 = 3,
  SecondarySubstance3 = 4,
  Alloy = 5,
  WeaponBlade = 6,
  WeaponHandle = 7,
  NonRecipe = 8,
}

export enum Archetype {
  FireMage = 0,
  EarthMage = 1,
  WaterMage = 2,
  Fighter = 3,
  Healer = 4,
  Archer = 5,
  MeleeCombatTest = 6,
  ArcherTest = 7,
  BlackKnight = 8,
  Fianna = 9,
  Mjolnir = 10,
  Physician = 11,
  Empath = 12,
  Stonehealer = 13,
  Blackguard = 14,
  ForestStalker = 15,
  WintersShadow = 16,
  Any = 17,
}

export enum Faction {
  Factionless = 0,
  TDD = 1,
  Viking = 2,
  Arthurian = 3,
  COUNT = 4,
}

export enum Gender {
  None = 0,
  Male = 1,
  Female = 2,
}

export enum EquipmentModelSlots {
  Tabard = 0,
  Hair = 1,
  HeadBack = 2,
  FaceUpper = 3,
  FaceLower = 4,
  Beard = 5,
  Neck = 6,
  Chest = 7,
  Torso = 8,
  LeftPauldron = 9,
  RightPauldron = 10,
  LeftUpperArm1 = 11,
  LeftUpperArm2 = 12,
  LeftLowerArm1 = 13,
  LeftLowerArm2 = 14,
  LeftHand = 15,
  RightUpperArm1 = 16,
  RightUpperArm2 = 17,
  RightLowerArm1 = 18,
  RightLowerArm2 = 19,
  RightHand = 20,
  Belt = 21,
  Pelvis = 22,
  UpperLeg1 = 23,
  UpperLeg2 = 24,
  LowerLeg1 = 25,
  LowerLeg2 = 26,
  Foot = 27,
  Knee = 28,
  UpperCloak1 = 29,
  UpperCloak2 = 30,
  LowerCloak1 = 31,
  LowerCloak2 = 32,
  RightElbow = 33,
  LeftElbow = 34,
  Taset = 35,
  Helmet = 36,
  Cape = 37,
  Horns = 38,
  Collar = 39,
}

export enum Race {
  Tuatha = 0,
  Hamadryad = 1,
  Luchorpan = 2,
  Firbog = 3,
  Valkyrie = 4,
  Helbound = 5,
  FrostGiant = 6,
  Dvergr = 7,
  Strm = 8,
  CaitSith = 9,
  Golem = 10,
  Gargoyle = 11,
  StormRider = 12,
  StormRiderT = 13,
  StormRiderV = 14,
  HumanMaleV = 15,
  HumanMaleA = 16,
  HumanMaleT = 17,
  Pict = 18,
  Any = 19,
}

export enum SheetReferenceType {
  Unspecified = 0,
  GoogleSheet = 1,
}

export enum CASAbilityParams {
  Invalid = 0,
  Duration = 1,
  StartTime = 2,
  VFXComponent = 3,
  CASID = 4,
  TargetType = 5,
  TargetBone = 6,
  AudioAKID = 7,
  TrackingMode = 8,
  TrackingStrength = 9,
  ModelID = 10,
  CancelledByMovement = 11,
  StopsMovement = 12,
  CancellationTime = 13,
  PreparationTime = 14,
  RecoveryTime = 15,
  HasProjectile = 16,
  MaxTriggerHoldTime = 17,
  AlwaysAimed = 18,
  AimingOptional = 19,
  NeverAimed = 20,
  AnimActionIndex = 21,
  HitNote = 22,
  GeometryType = 23,
  GeometryBoxX = 24,
  GeometryBoxY = 25,
  GeometryBoxZ = 26,
  GeometryRadius = 27,
  GeometryHeight = 28,
  GeometryDepth = 29,
  TargetGroup = 30,
  TargetRequired = 31,
  TargetingVolumeType = 32,
  TargetingRadius = 33,
  TargetingConeAngle = 34,
}

export enum CASEffectsTrigger {
  None = 0,
  Time = 1,
  HitWall = 2,
  HitPlayer = 3,
  Begin = 4,
  TriggerTime = 5,
  TriggerHeld = 6,
  Canceled = 7,
  Ended = 8,
}

export enum CASEffectsType {
  None = 0,
  Particle = 1,
  Sound = 2,
  Animation = 3,
  Ability = 4,
  Geometry = 5,
  Model = 6,
  Targeting = 7,
}

export enum CASEntityType {
  Standard = 0,
  Projectile = 1,
}

export enum CASParamDataType {
  Invalid = 0,
  Int32 = 1,
  Int64 = 2,
  Float = 3,
  Bool = 4,
}

export enum ClientAbilitySpecID {
  None = 0,
  Undefined = 18446744073709551615,
}

export enum TestItemFlags {
  None = 0,
  StormRider = 1,
  HumanMale = 2,
  Archery = 4,
  FutureRelease = 8,
}

export enum PermissionRegionType {
  None = 0,
  Self = 2,
  Friends = 4,
  MutualFriends = 8,
  TempWarband = 16,
  PermanentWarband = 32,
  Order = 64,
  Alliance = 128,
  Campaign = 256,
  Realm = 512,
  AllRealm = 1022,
  Public = 1024,
  All = -1,
}

export enum ModifySecureTradeResultCode {
  Success = 0,
  NoTrade = 1,
  IncorrectState = 2,
  ItemNotFound = 3,
  InventoryNotFound = 4,
  DuplicateItemInRequest = 5,
  NoPendingInvite = 6,
  MissingFaction = 7,
  FactionMismatch = 8,
  TradeSourceNotAlive = 9,
  TradeTargetNotAlive = 10,
  NoEntityPosition = 11,
  TooFarAway = 12,
  EntityMismatch = 13,
  CanceledEntityMissing = 14,
  DBError = 15,
  NotLoggedIn = 16,
  EntityToTradeWithNotFound = 17,
  CannotTradeWithSelf = 18,
  MoveItemError = 19,
  EntityCannotTrade = 20,
  InvalidRequest = -1,
}

export enum MoveItemRequestLocationType {
  Invalid = 0,
  Container = 1,
  Equipment = 2,
  Ground = 3,
  Inventory = 4,
  Vox = 5,
  Trash = 6,
}

export enum MoveItemResultCode {
  Success = 0,
  None = 1,
  Timeout = 2,
  PlayerNotFound = 3,
  EntityNotFound = 4,
  ItemNotFound = 5,
  ItemNotValid = 6,
  MixedError = 7,
  TooManyItems = 8,
  InventoryNotFound = 9,
  EquipmentNotFound = 10,
  DefinitionNotFound = 11,
  SecureTradeNotFound = 12,
  InvalidParameter = 13,
  SpatialNotFound = 14,
  ItemFeatureTurnedOff = 15,
  BrokenItem = 16,
  ItemRequirementNotMet = 17,
  EntityNotValid = 18,
  MultiItemMoveNotSupported = 19,
  ItemsDoNotStack = 20,
  TooFarAway = 21,
  PermissionDenied = 22,
  ItemInversion = 23,
  InvalidVoxSlot = 24,
  ItemCannotBeTraded = 25,
}

export enum HarvestResourceNodeResultCode {
  InvalidRequest = 0,
  Success = 1,
  NoItemsHarvested = 2,
  WrongFaction = 3,
  RequirementNotMet = 4,
  TooSoonSinceLastHarvest = 5,
  FailedToCreateItem = 6,
  MixedError = 7,
}

export enum ModifyVoxJobResultCode {
  Success = 0,
  JobAlreadyExists = 1,
  InvalidJob = 2,
  NoCurrentJob = 3,
  ItemsInVox = 4,
  IncorrectJobState = 5,
  DBError = 6,
  NotSupported = 7,
  InvalidRecipe = 8,
  TooManyIngredients = 9,
  NotEnoughIngredients = 10,
  IncorrectIngredient = 11,
  InvalidIngredient = 12,
  InvalidQuality = 13,
  InventoryFull = 14,
  NoRepairPoints = 15,
  InvalidUnitCount = 16,
  ParameterError = 17,
  VoxNotFound = 18,
  RecipeAlreadyDiscovered = 19,
  RecipeNotSet = 20,
  ItemSlotNotSupported = 21,
  IngredientsExist = 22,
  VoxBroken = 23,
  IngredientBroken = 24,
  PlayerNotFound = 25,
  InvalidRequest = -1,
}

export enum GroupType {
  Warband = 0,
  Order = 1,
  Alliance = 2,
  Campaign = 3,
}

export enum MemberActionType {
  Created = 0,
  Disbanded = 1,
  CharacterJoined = 2,
  GroupJoined = 3,
  CharacterQuit = 4,
  GroupQuit = 5,
  CharacterKicked = 6,
  GroupKicked = 7,
  CharacterInvited = 8,
  GroupInvited = 9,
  CharacterAcceptedInvite = 10,
  ChangedRole = 11,
  AssignRank = 12,
  UpdatedRolePermissions = 13,
  UpdatedRankPermissions = 14,
  ChangedName = 15,
  CharacterPermissionsChanged = 16,
  GroupPermissionsChanged = 17,
  CreateRank = 18,
  RemoveRank = 19,
  RenameRank = 20,
  AddRankPermissions = 21,
  RemoveRankPermissions = 22,
  SetRankPermissions = 23,
  ChangeRankLevel = 24,
  TransferedOwnership = 25,
  Abandonded = 26,
  DepositedItemInStash = 26,
  InvitedOrder = 26,
  SharedCount = 26,
  WithdrewItemFromStash = 27,
  OrderAcceptedInvite = 27,
  WarbandCount = 27,
  DepositedCurrencyInStash = 28,
  AllianceCount = 28,
  ChangeDisplayOrder = 28,
  InvitedAlliance = 28,
  AllianceSharedCount = 28,
  WithdrewCurrencyFromStash = 29,
  AllianceAcceptedInvite = 29,
  SetLeader = 29,
  InvitedWarband = 30,
  OrderCount = 30,
  WarbandAcceptedInvite = 31,
  CampaignCount = 32,
}

export enum InviteStatus {
  Active = 0,
  Accepted = 1,
  Declined = 2,
  Rescinded = 3,
  Expired = 4,
}

export enum PatchPermissions {
  Public = 0,
  AllBackers = 1,
  InternalTest = 2,
  Development = 4,
  Alpha = 8,
  Beta1 = 16,
  Beta2 = 32,
  Beta3 = 64,
}

export enum EntitySourceKind {
  Command = 0,
  Placeable = 1,
  Terrain = 2,
}

export enum SecureTradeTransferState {
  Invalid = 0,
  Initialized = 1,
  TransferStarted = 2,
  TransferCompleted = 3,
}

export enum VoxJobState {
  None = 0,
  Configuring = 1,
  Running = 2,
  Finished = 3,
}

export enum ItemDataVersion {
  Invalid = 0,
}

export enum ItemStatModificationType {
  Invalid = 0,
  Add = 1,
  Multiply = 2,
}

export enum WireCompressionType {
  None = 0,
  LZMA = 1,
}

export enum ResourceCompressionType {
  None = 0,
}

export enum EXETypes {
  None = 0,
  X86 = 1,
  X64 = 2,
}

export enum DBVarType {
  Int8 = 0,
  Int16 = 1,
  Int32 = 2,
  Int64 = 3,
  UInt8 = 4,
  UInt16 = 5,
  UInt32 = 6,
  UInt64 = 7,
  Float = 8,
  Double = 9,
  Char = 10,
  String = 11,
  Bool = 12,
}

export enum ClipSegmentTag {
  None = 0,
  Prepare = 1,
  Hit = 2,
  PreHit = 3,
  PostHit = 4,
  Recover = 5,
  BlendIn = 6,
  BlendOut = 7,
  Aim = 8,
  Loop = 9,
}

export enum ClipTag {
  Idle = 0,
  Fidget = 1,
  Walk = 2,
  Run = 3,
  Jump = 4,
  Knockback = 5,
  Fall = 6,
  Land = 7,
  Flinch = 8,
  Death = 9,
  InPlace = 10,
  Forward = 11,
  ForwardLeft = 12,
  Left = 13,
  BackwardLeft = 14,
  Backward = 15,
  BackwardRight = 16,
  Right = 17,
  ForwardRight = 18,
  Attack = 19,
  Block = 20,
  Parry = 21,
  Low = 22,
  Mid = 23,
  High = 24,
  Slash = 25,
  Pierce = 26,
  Crush = 27,
  Melee = 28,
  Bow = 29,
  Throw = 30,
  Shout = 31,
  Cast = 32,
  Projectile = 33,
  Summon = 34,
  Instant = 35,
  Load = 36,
  Aim = 37,
}

export enum AnimSetTag {
  Default = 0,
  R_Empty = 1,
  L_Empty = 2,
  R_Axe = 3,
  R_Torch = 3,
  R_Sword = 3,
  R_Weapon = 3,
  R_Hammer = 3,
  R_Mace = 3,
  L_Axe = 4,
  L_Weapon = 4,
  L_Hammer = 4,
  L_Mace = 4,
  L_Sword = 4,
  R_Focus = 5,
  L_Focus = 6,
  R_Dagger = 7,
  L_Dagger = 8,
  R_Spear = 9,
  L_Shield = 10,
  RL_Spear = 11,
  RL_Polearm = 12,
  RL_Longsword = 13,
  RL_Greatsword = 14,
  RL_Staff = 15,
  RL_Archery = 16,
  RL_Hammer = 17,
  RL_Greataxe = 18,
  Combat = 19,
  Travel = 20,
  Offensive = 21,
  Defensive = 22,
  Tuatha = 23,
  Viking = 24,
  Arthurian = 25,
  Male = 26,
  Female = 27,
  Human = 28,
  Luchorpan = 29,
  Pict = 30,
  Valkyrie = 31,
  L_Torch = 32,
  Scorpion = 33,
}

export enum AbilityActionStat {
  None = 0,
  AimTime = 1,
  AreaSpreadRate = 2,
  ArmorClassIncrease = 3,
  ArmorClassReduction = 4,
  ArmorPenetrationIncrease = 5,
  ArmorPenetrationReduction = 6,
  BarrierPower = 7,
  BleedPiercing = 8,
  BleedSlashing = 9,
  BlockPercentModifier = 10,
  BloodCost = 11,
  BloodCostIncrease = 12,
  BloodCostReduction = 13,
  BloodIncrease = 14,
  BloodIncreaseOverTime = 15,
  BloodReduction = 16,
  BloodReductionOverTime = 17,
  BloodRegenerationDecrease = 18,
  BloodRegenerationIncrease = 19,
  CamouflageTransition = 20,
  ChannelTime = 21,
  ChargeExpend = 22,
  ChargeIncrease = 23,
  ConcealmentIncrease = 24,
  ConeAoeDuration = 25,
  ConeAoeRange = 26,
  ConeAoeSize = 27,
  CooldownIncrease = 28,
  CooldownReduction = 29,
  CooldownTime = 30,
  CureWound = 31,
  Damage = 32,
  DamageCrushing = 33,
  DamagePiercing = 34,
  DamageSlashing = 35,
  DeflectionPower = 36,
  DeflectionRateModifier = 37,
  DisruptionDamage = 38,
  DisruptionHealth = 39,
  DotAmount = 40,
  DotDuration = 41,
  Duration = 42,
  FallbackDamage = 43,
  ForceFieldDuration = 44,
  ForceFieldMagnitude = 45,
  ForceFieldSize = 46,
  Healing = 47,
  HealingEffectPower = 48,
  HealingPowerIncrease = 49,
  HealingPowerReduction = 50,
  HealthCost = 51,
  HealthReduction = 52,
  HealthReductionOverTime = 53,
  HealthRegenerationIncrease = 54,
  HealthRegenerationReduction = 55,
  HealthTransfer = 56,
  HotAmount = 57,
  HotDuration = 58,
  IgnoreHealingReduction = 59,
  IgnoreResistance = 60,
  ImmobilizeDuration = 61,
  IncomingDamageIncrease = 62,
  IncomingDamageReduction = 63,
  Instant = 64,
  InvulnerabilityTime = 65,
  KnockbackAmount = 66,
  KnockbackAngle = 67,
  Lifedrain = 68,
  MaxHealthAmount = 69,
  MaxHealthDuration = 70,
  MeleeArc = 71,
  MeleeRange = 72,
  MovementCancels = 73,
  MovementSpeedReduction = 74,
  ObjectDamage = 75,
  ObjectDuration = 76,
  ObjectHealth = 77,
  ObjectSize = 78,
  ObjectSpeed = 79,
  ObjectTracking = 80,
  OutgoingDamageIncrease = 81,
  OutgoingDamageReduction = 82,
  PanicIncrease = 83,
  PanicReduction = 84,
  Penetration = 85,
  PenetrationIncrease = 86,
  PenetrationPiercing = 87,
  PenetrationReduction = 88,
  PenetrationSlashing = 89,
  PeriodicIntervalsPerSecond = 90,
  PowerFalloffMaxDistance = 91,
  PowerFalloffMinDistance = 92,
  PowerFalloffReduction = 93,
  PreparationIncrease = 94,
  PreparationReduction = 95,
  PreparationTime = 96,
  ProjectileArc = 97,
  ProjectileDuration = 98,
  ProjectileSize = 99,
  ProjectileSpeed = 100,
  ProjectileSpeedIncrease = 101,
  ProjectileSpeedReduction = 102,
  Projectiletracking = 103,
  Range = 104,
  RecoveryIncrease = 105,
  RecoveryReduction = 106,
  RecoveryTime = 107,
  RedirectDuration = 108,
  RedirectEffect = 109,
  RemoveAllyEffectPower = 110,
  RemoveEnemyEffect = 111,
  ResetDeflection = 112,
  ResistanceIncrease = 113,
  ResistanceReduction = 114,
  SelfDamage = 115,
  SelfImmobilizeDuration = 116,
  SelfSnareAmount = 117,
  SelfSnareDuration = 118,
  SnareAmount = 119,
  SnareDuration = 120,
  SpeedAmount = 121,
  SpeedDuration = 122,
  SphereAoeDuration = 123,
  SphereAoeSize = 124,
  StabilityIncrease = 125,
  StabilityReduction = 126,
  StaminaCost = 127,
  StaminaCostIncrease = 128,
  StaminaCostReduction = 129,
  StaminaDrain = 130,
  StaminaDrainOverTime = 131,
  StaminaDrainOverTimeDuration = 132,
  StaminaIncreaseOverTime = 133,
  StaminaReductionOverTime = 134,
  StaminaRegenerationIncrease = 135,
  StaminaRegenerationReduction = 136,
  StaminaRestore = 137,
  StaminaRestoreOverTime = 138,
  StaminaRestoreOverTimeDuration = 139,
  StanceTransition = 140,
  StopsMovement = 141,
  SuppressBleedingTime = 142,
  SuppressBloodRegenerationTime = 143,
  SuppressDeflectionTime = 144,
  SuppressHealthRegenerationTime = 145,
  SuppressMovementReductionTime = 146,
  SuppressStaminaRegenerationTime = 147,
  SuppressWoundTime = 148,
  TargetLimit = 149,
  TouchContact = 150,
  VeilStealthTransition = 151,
  WallDuration = 152,
  WallHealth = 153,
  OverallPower = 154,
}

export enum AbilityActionStatValueType {
  Cost = 0,
  Power = 1,
}

export enum AbilityActionType {
  None = 0,
  Damage = 1,
  Disruption = 2,
  DOT = 3,
  Healing = 4,
  HOT = 5,
  StaminaDrain = 6,
  StaminaDrainOverTime = 7,
  StaminaRestore = 8,
  StaminaRestoreOverTime = 9,
  CureWounds = 10,
  Lifedrain = 11,
  Snare = 12,
  Immobilize = 13,
  Knockback = 14,
  Speed = 15,
  MaxHealth = 16,
  Wall = 17,
  Field = 18,
  Projectile = 19,
  SphereAoE = 20,
  ConeAoE = 21,
  Stance = 22,
  Blocking = 23,
}

export enum AbilityID {
  None = 0,
  Undefined = 18446744073709551615,
}

export enum AbilityLifetimeEvent {
  Begin = 0,
  Hit = 1,
}

export enum AbilityTag {
  SYSTEM = 0,
  NonAggressive = 1,
  NonInteractable = 2,
  NoMagic = 3,
  Slashing = 4,
  Piercing = 5,
  Crushing = 6,
  Weapon = 7,
  Style = 8,
  Speed = 9,
  Potential = 10,
  Voice = 11,
  Shout = 12,
  Inflection = 13,
  Air = 14,
  Earth = 15,
  Fire = 16,
  Water = 17,
  Blast = 18,
  Lava = 19,
  Mud = 20,
  Sand = 21,
  Steam = 22,
  Spray = 23,
  Acid = 24,
  Poison = 25,
  Disease = 26,
  Lightning = 27,
  PrimalLightning = 28,
  GroundedLightning = 29,
  CelestialLightning = 30,
  ChainLightning = 31,
  Frost = 32,
  Life = 33,
  Mind = 34,
  Spirit = 35,
  Radiant = 36,
  Death = 37,
  Shadow = 38,
  Chaos = 39,
  Void = 40,
  Arcane = 41,
  Healing = 42,
  Restoration = 43,
  Lifedrain = 44,
  Swiftness = 45,
  Displacement = 46,
  Magic = 47,
  Rune = 48,
  Shape = 49,
  Range = 50,
  Size = 51,
  Infusion = 52,
  Focus = 53,
  Elixir = 54,
  Potion = 55,
  Bottle = 56,
  Stone = 57,
  Self = 58,
  Direct = 59,
  Touch = 60,
  Dart = 61,
  Ball = 62,
  Cloud = 63,
  Fountain = 64,
  Wall = 65,
  Field = 66,
  Wave = 67,
  Pool = 68,
  Cone = 69,
  Blocking = 70,
  CounterAttack = 71,
  Targeting = 72,
  Trauma = 73,
  Wound = 74,
  Attack = 75,
  Melee = 76,
  Ranged = 77,
  Bow = 78,
  Shield = 79,
  Channel = 80,
  Stance = 81,
  Unblockable = 82,
  Positive = 83,
  Negative = 84,
  Bleeding = 85,
  CombatStance = 86,
  TravelStance = 87,
  TestTagA = 88,
  TestTagB = 89,
  TestTagC = 90,
  TestTagD = 91,
  TestTagE = 92,
  HealingReduction = 93,
  RegrowthElixir = 94,
  SharedResilience = 95,
  ViolentFeedback = 96,
  SelfAnointment = 97,
  Delivery = 98,
  SelfRune = 99,
  SelfShape = 100,
  RuneNoParts = 101,
  SelfRuneNoParts = 102,
  COUNT = 103,
}

export enum AimingMode {
  AutoTarget = 0,
  AimedDirection = 1,
}

export enum SubpartId {
  _FREE_MASK = 0,
  None = 0,
  _BODY_PART_COUNT = 6,
  Any = 7,
  _BUILDING_VAL = 72057594037927936,
  _BODY_VAL = 144115188075855872,
  Torso = 144115188075855873,
  _BODY_BEGIN = 144115188075855873,
  Head = 144115188075855874,
  LeftArm = 144115188075855875,
  RightArm = 144115188075855876,
  LeftLeg = 144115188075855877,
  RightLeg = 144115188075855878,
  _BODY_END = 144115188075855879,
  _SINGULAR_VAL = 288230376151711744,
  _TYPE_MASK = 1080863910568919040,
}

export enum DamageType {
  None = 0,
  Slashing = 1,
  Piercing = 2,
  Crushing = 4,
  Physical = 7,
  Acid = 8,
  Poison = 16,
  Disease = 32,
  Earth = 64,
  Water = 128,
  Fire = 256,
  Air = 512,
  Lightning = 1024,
  Frost = 2048,
  Elemental = 4032,
  Life = 8192,
  Mind = 16384,
  Spirit = 32768,
  Radiant = 65536,
  Light = 122880,
  Death = 131072,
  Shadow = 262144,
  Chaos = 524288,
  Void = 1048576,
  Dark = 1966080,
  Arcane = 2097152,
  Other = 2097208,
  SYSTEM = -2147483648,
  All = -1,
}

export enum ProjectileTrackingMode {
  None = 0,
  LargeAngle = 1,
  Full = 2,
  Horizontal = 3,
  Attractor = 4,
  Gravity = 5,
}

export enum ResourceType {
  Blood = 0,
  Stamina = 1,
  None = -1,
}

export enum StatModificationOperatorType {
  AddPercent = 0,
  AddValue = 1,
  ReplaceValue = 2,
}

export enum TagConstraintType {
  AllOf = 0,
  AnyOf = 1,
  NoneOf = 2,
}

export enum TargetType {
  None = 0,
  Enemy = 1,
  Friend = 2,
  Any = 3,
  Self = 4,
  FriendOrSelf = 5,
}

export enum TriggerBehaviorMode {
  None = 0,
  AttachToTarget = 1,
  MoveTowardsTarget = 2,
  COUNT = 3,
}

export enum TriggerFilter {
  Any = 0,
  Friend = 1,
  Enemy = 2,
}

export enum TriggerType {
  None = 0,
  AbilityUse = 1,
  AbilityHit = 2,
  Damage = 3,
  Healing = 4,
  Wound = 5,
  Death = 6,
  Collision = 7,
}

export enum AbilityComponentID {
  None = 0,
}

export enum AbilityComponentSubType {
  None = 0,
  Rune = 1,
  Shape = 2,
  Range = 4,
  Size = 8,
  Infusion = 16,
  Focus = 32,
  Transposition = 64,
  MagicalType = 127,
  Weapon = 128,
  Style = 256,
  Speed = 512,
  Potential = 1024,
  Stance = 2048,
  PhysicalType = 3968,
  RangedWeapon = 4096,
  Load = 8192,
  Prepare = 16384,
  Draw = 32768,
  Aim = 65536,
  RangedType = 126976,
  Voice = 131072,
  Instrument = 262144,
  Shout = 524288,
  Song = 1048576,
  Inflection = 2097152,
  Technique = 4194304,
  SoundType = 8257536,
  Stone = 8388608,
  Delivery = 16777216,
  StoneType = 25165824,
  RuneSelf = 33554432,
  ShapeSelf = 67108864,
  MagicSelf = 100663420,
  RuneNoParts = 134217728,
  MagicNoParts = 134217854,
  RuneSelfNoParts = 268435456,
  MagicSelfNoParts = 335544444,
  Target = 536870912,
  SiegeWeapon = 4294967296,
  SiegeLoad = 8589934592,
  SiegePrepare = 17179869184,
  SiegeDraw = 34359738368,
  SiegeAim = 68719476736,
  SiegeTypes = 133143986176,
}

export enum AbilityComponentType {
  Primary = 0,
  Secondary = 1,
  OptionalModifier = 2,
  SpecialModal = 3,
  IndependantModal = 4,
}

export enum StoneTypes {
  Life = 0,
  Curing = 1,
  Shielding = 2,
  Rejuvenation = 3,
  Inversion = 4,
  Deflection = 5,
}

export enum VoxJobType {
  Invalid = 0,
  Block = 1,
  Grind = 2,
  Make = 3,
  Purify = 4,
  Refine = 5,
  Repair = 6,
  Salvage = 7,
  Shape = 8,
}

export enum VoxState {
  NotFound = 0,
  NotOwnedByPlayer = 1,
  Found = 2,
}

export enum SecureTradeState {
  None = 0,
  Invited = 1,
  ModifyingItems = 2,
  Locked = 3,
  Confirmed = 4,
  Transferring = 5,
}

export enum EventResultHandlerPriorities {
  Lowest = 0,
  Default = 1,
  Highest = 2,
}

export enum EventComponentPriorities {
  Lowest = 0,
  ConsumeItem = 1,
  Default = 2,
  PlayerSpawnDone = 3,
  FinalizeHealthAndResourceChanges = 4,
  Highest = 5,
}

export enum AlloyDefStat {
  Hardness = 1,
  ImpactToughness = 2,
  FractureChance = 3,
  Malleability = 4,
  MassPCF = 5,
  Density = 6,
  MeltingPoint = 7,
  ThermConductivity = 8,
  Elasticity = 9,
  SlashingResistance = 10,
  PiercingResistance = 11,
  CrushingResistance = 12,
  AcidResistance = 13,
  PoisonResistance = 14,
  DiseaseResistance = 15,
  EarthResistance = 16,
  WaterResistance = 17,
  FireResistance = 18,
  AirResistance = 19,
  LightningResistance = 20,
  FrostResistance = 21,
  LifeResistance = 22,
  MindResistance = 23,
  SpiritResistance = 24,
  RadiantResistance = 25,
  DeathResistance = 26,
  ShadowResistance = 27,
  ChaosResistance = 28,
  VoidResistance = 29,
  ArcaneResistance = 30,
  MagicalResistance = 31,
  HardnessFactor = 32,
  StrengthFactor = 33,
  FractureFactor = 34,
  MassFactor = 35,
  UnitHealth = 36,
}

export enum ArmorDefStat {
  ArmorClass = 1,
}

export enum SiegeEngineDefStat {
  Health = 1,
  YawSpeedDegPerSec = 2,
  PitchSpeedDegPerSec = 3,
}

export enum StatAggregation {
  Add = 0,
  WeightedAverage = 1,
  UnitCountAverage = 2,
  ItemAverage = 3,
}

export enum ContainerDefStat {
  MaxItemCount = 1,
  MaxItemMass = 2,
}

export enum DurabilityDefStat {
  MaxRepairPoints = 1,
  MaxHealth = 2,
  FractureThreshold = 3,
  FractureChance = 4,
  HealthLossPerUse = 5,
}

export enum ItemDefStat {
  Mass = 1,
  Encumbrance = 2,
}

export enum SubstanceDefStat {
  ArthurianBonus = 1,
  VikingBonus = 2,
  TDDBonus = 3,
  Hardness = 4,
  ImpactToughness = 5,
  FractureChance = 6,
  Malleability = 7,
  MassPCF = 8,
  Density = 9,
  MeltingPoint = 10,
  ThermConductivity = 11,
  Elasticity = 12,
  SlashingResistance = 13,
  PiercingResistance = 14,
  CrushingResistance = 15,
  AcidResistance = 16,
  PoisonResistance = 17,
  DiseaseResistance = 18,
  EarthResistance = 19,
  WaterResistance = 20,
  FireResistance = 21,
  AirResistance = 22,
  LightningResistance = 23,
  FrostResistance = 24,
  LifeResistance = 25,
  MindResistance = 26,
  SpiritResistance = 27,
  RadiantResistance = 28,
  DeathResistance = 29,
  ShadowResistance = 30,
  ChaosResistance = 31,
  VoidResistance = 32,
  ArcaneResistance = 33,
  MagicalResistance = 34,
  HardnessFactor = 35,
  StrengthFactor = 36,
  FractureFactor = 37,
  MassFactor = 38,
  MinQuality = 39,
  MaxQuality = 40,
  UnitMass = 41,
  UnitHealth = 42,
}

export enum WeaponDefStat {
  PiercingDamage = 1,
  PiercingBleed = 2,
  PiercingArmorPenetration = 3,
  SlashingDamage = 4,
  SlashingBleed = 5,
  SlashingArmorPenetration = 6,
  CrushingDamage = 7,
  FallbackCrushingDamage = 8,
  Disruption = 9,
  DeflectionAmount = 10,
  PhysicalProjectileSpeed = 11,
  KnockbackAmount = 12,
  Stability = 13,
  FalloffMinDistance = 14,
  FalloffMaxDistance = 15,
  FalloffReduction = 16,
  DeflectionRecovery = 17,
  StaminaCost = 18,
  PhysicalPreparationTime = 19,
  PhysicalRecoveryTime = 20,
  Range = 21,
}

export enum SkillCooldownID {
  None = 0,
}

export enum DBResult {
  Success = 0,
  PlayerNotFound = 1,
  SpatialNotFound = 2,
  EntityNotFound = 3,
  ItemNotFound = 4,
  ItemNotValid = 5,
  DatabaseError = 6,
  DatabaseWhiff = 7,
  UpdaterError = 8,
  MixedError = 9,
  TooManyItems = 10,
  InventoryNotFound = 11,
  EquipmentNotFound = 12,
  ItemFeatureTurnedOff = 13,
  InvalidGearSlot = 14,
}

export enum UpdaterResult {
  Success = 0,
  None = 1,
  Timeout = 2,
  PlayerNotFound = 3,
  EntityNotFound = 4,
  ItemNotFound = 5,
  ItemNotValid = 6,
  MixedError = 7,
  TooManyItems = 8,
  InventoryNotFound = 9,
  EquipmentNotFound = 10,
  DefinitionNotFound = 11,
  InvalidParameter = 12,
  SpatialNotFound = 13,
  ItemFeatureTurnedOff = 14,
  BrokenItem = 15,
  ItemRequirementNotMet = 16,
  EntityNotValid = 17,
  NotSupported = 18,
  ItemsDoNotStack = 19,
}

export enum TransactionState {
  Created = 0,
  Database = 1,
  Updater = 2,
  Canacelled = 3,
  Complete = 4,
}

export enum SkillTracks {
  None = 0,
  PrimaryWeapon = 1,
  SecondaryWeapon = 2,
  BothWeapons = 3,
  Voice = 4,
  Mind = 8,
  All = 268435455,
  ErrorFlag = 268435456,
  EitherWeaponPreferPrimary = 536870912,
  EitherWeaponPreferSecondary = 1073741824,
  ChoiceFlags = 1610612736,
}

export enum SkillAdvanceMode {
  AutoAdvance = 0,
  Repeating = 1,
  HoldIfAiming = 2,
}

export enum AudioID {
  NONE = 0,
}

export enum ArmorStatCalculationType {
  None = 0,
  Average = 1,
  Add = 2,
}

export enum AmmoType {
  None = 0,
  Arrow = 1,
  BasicArrow = 1,
  Elixir = 2,
  BasicElixir = 2,
  Bolt = 4,
  Black = 8,
  BlackArrow = 9,
  Flight = 16,
  FlightArrow = 17,
  Blunt = 32,
  BluntArrow = 33,
  Broadhead = 64,
  BroadheadArrow = 65,
  Barbed = 128,
  BarbedArrow = 129,
  Leafblade = 256,
  LeafbladeArrow = 257,
  Serrated = 512,
  SerratedArrow = 513,
  Notched = 1024,
  NotchedArrow = 1025,
  Crescent = 2048,
  CrescentArrow = 2049,
  Light = 4096,
  LightArrow = 4097,
  DartPoint = 8192,
  DartPointArrow = 8193,
  Forked = 16384,
  ForkedArrow = 16385,
  Heavy = 32768,
  War = 65536,
  HeavyWarArrow = 98305,
  Siege = 131072,
  BasicSiegeBolt = 131076,
  BluntSiegeBolt = 131108,
  LightSiegeBolt = 135172,
  HeavySiegeBolt = 163844,
}

export enum WeaponType {
  NONE = 0,
  Arrow = 1,
  Dagger = 2,
  Sword = 4,
  Hammer = 8,
  Axe = 16,
  Mace = 32,
  GreatSword = 64,
  GreatHammer = 128,
  GreatAxe = 256,
  GreatMace = 512,
  Spear = 1024,
  Staff = 2048,
  Polearm = 4096,
  Shield = 8192,
  Bow = 16384,
  Throwing = 32768,
  Focus = 65536,
  LongSword = 131072,
  All = 262143,
}

export enum NetworkWeaponType {
  Default = 0,
  Shield = 1,
  Bow = 2,
}

export enum NetworkWeaponSlot {
  PrimaryHand = 0,
  SecondaryHand = 1,
  TwoHands = 2,
}

export enum CharacterLoadoutID {
  None = 0,
}

export enum GearLayerType {
  Unknown = 0,
  Weapon = 1,
  Armor = 2,
}

export enum ItemType {
  Basic = 0,
  Vox = 1,
  Ammo = 2,
  Armor = 3,
  Weapon = 4,
  Block = 5,
  Alloy = 6,
  Substance = 7,
  SiegeEngine = 8,
}

export enum LoadoutType {
  Unknown = 0,
  Equip = 1,
  Inventory = 2,
}

export enum ResourceNodeDefNetworkID {
  None = 0,
}

export enum AEStackingResult {
  Ignore = 0,
  Add = 1,
}

export enum ClientSkillDefID {
  None = 0,
}

export enum ClientSkillTarget {
  None = 0,
  Self = 1,
  Friendly = 2,
  Enemy = 4,
  Aimed = 8,
  Projectile = 16,
}

export enum ClientSkillHit {
  None = 0,
  Either = 1,
  Hit = 2,
  Miss = 3,
}

export enum ClientSkillAdvanceMode {
  Auto = 0,
  Repeat = 1,
  Manual = 2,
  Optional = 3,
}

export enum ClientEffectKind {
  Animation = 0,
  Particle = 1,
  Sound = 2,
  Projectile = 3,
}

export enum ClientProjectileDefID {
  None = 0,
}

export enum ClientTargetEffectsID {
  None = 0,
}

export enum EventDirection {
  Out = 0,
  In = 1,
  Meaningless = 2,
}

export enum TraitCategory {
  General = 0,
  Faction = 1,
  Race = 2,
  Class = 3,
}

export enum PlotAreaContested {
  Outer = 0,
  Inner = 1,
}

export enum ClientCommandType {
  Cancel = 0,
  Ability = 1,
  ChangeAiming = 2,
  TriggerAbility = 3,
  Target = 4,
  Jump = 5,
  Respawn = 6,
  Stuck = 7,
  Interact = 8,
  NUMBER_OF_COMMANDS = 9,
}

export enum ClientCommandIndex {
  None = 0,
}

export enum TargetSlot {
  Enemy = 0,
  Friend = 1,
  COUNT = 2,
}

export enum ServerCommandType {
  AbilityStarted = 0,
  AbilityCancelled = 1,
  AbilityQueued = 2,
  ReportCombatResult = 3,
  SyncPosition = 4,
  TargetsChanged = 5,
  PlayLocalSound = 6,
  NUMBER_OF_COMMANDS = 7,
}

export enum ServerCommandIndex {
  None = 0,
}

export enum CancelledReason {
  NoMessage = 0,
  OutOfRange = 1,
  InvalidTarget = 2,
  NoLineOfSight = 3,
  OnCooldown = 4,
  NoTarget = 5,
  Interrupted = 6,
  NoResource = 7,
  NotInStance = 8,
  WrongWeapon = 9,
  COUNT = 10,
}

export enum ReportedCombatResult {
  None = 0,
  Blocked = 1,
  COUNT = 2,
}

export enum EntityComponentType {
  Unknown = 0,
  Inventory = 1,
  ActiveEffects = 2,
  Equipment = 3,
  Stats = 4,
  Resources = 5,
  Damageable = 6,
  SkillsKnown = 7,
  SkillQueue = 8,
  Targeting = 9,
  Subskill = 10,
  Collision = 11,
  Faction = 12,
  EntityInfo = 13,
  CharacterInfo = 14,
  Subparts = 15,
  PhysicsEntity = 16,
  PlayerPhysics = 17,
  Respawned = 18,
  UserConnection = 19,
  SystemTrigger = 20,
  CollisionTracker = 21,
  OwnerHistory = 22,
  TargetDummy = 23,
  SlashCommands = 24,
  Administrator = 25,
  Warband = 26,
  State = 27,
  Traits = 28,
  Mode = 29,
  Source = 30,
  ResourceNode = 31,
  ResourceNodeSpawner = 32,
  AnimSet = 33,
  SpawnPoint = 34,
  CraftingHistory = 35,
  Interaction = 36,
  Controllable = 37,
  Controller = 38,
  Subscription = 39,
  ItemWrapper = 40,
  Door = 41,
  Portal = 42,
  CollisionHistory = 43,
  BuildingPlot = 44,
  Projectile = 45,
  SecureTrade = 46,
  Null = -1,
}

export enum HealthComponentType {
  Null = 0,
  Partitioned = 1,
  Bag = 2,
}

export enum PhysicsState {
  Invalid = 0,
  StillTravelling = 1,
  ServerStopped = 2,
  ClientStopped = 3,
  _NETWORKED_COUNT = 3,
  ClientNeverStarted = 4,
  InterpolatingToEnd = 5,
  _COUNT = 6,
}

export enum ProjectileState {
  Invalid = 0,
  StillTravelling = 1,
  FizzledInFlight = 2,
  FizzledOnHit = 3,
  ExplodedOnHit = 4,
  COUNT = 5,
}

export enum TargetTrack {
  Self = 0,
  Friend = 1,
  Enemy = 2,
}

export enum ItemComponentType {
  Alloy = 0,
  Ammo = 1,
  Armor = 2,
  BuildingBlock = 3,
  Container = 4,
  Durability = 5,
  Equippable = 6,
  ItemStat = 7,
  Renderable = 8,
  SiegeEngine = 9,
  Substance = 10,
  Vox = 11,
  Weapon = 12,
}

export enum KnockbackType {
  PointOfOrigin = 0,
  Directional = 1,
}

export enum LayerEnum {
  InitiatorBase = 0,
  InitiatorModifier = 1,
  InitiatorEffects = 2,
  InitiatorBounds = 3,
  SubjectDeflectionRAM = 4,
  SubjectPreArmorRAM = 5,
  SubjectArmorRAM = 6,
  SubjectPostArmorRAM = 7,
  SbjectEffects = 8,
  SubjectApplication = 10,
  SubjectBounds = 11,
  StatBounds = 11,
  Admin = 12,
  AdminBounds = 19,
  SystemBounds = 2147483647,
}

export enum SlotDir {
  Invalid = 0,
  Out = 1,
  In = 2,
}

export enum PhysicsStat {
  None = 0,
  Mass = 14,
  MaxMoveSpeed = 15,
  MoveAcceleration = 16,
  MaxTurnSpeed = 17,
}

export enum ProcessingStatus {
  Invalid = 0,
  Continue = 1,
  Finished = 2,
}

export enum ServerStatus {
  Offline = 0,
  Starting = 1,
  Online = 2,
}

export enum Platforms {
  Undefined = 0,
  Windows = 1,
  Mac = 2,
  iPhone = 3,
  iPad = 4,
  Android = 5,
  Web = 6,
}

export enum Subset {
  None = 0,
  Paid = 1,
  Free = 2,
}

export enum LanguageCode {
  Unassigned = 0,
  en_US = 1,
  en_GB = 2,
  en_AU = 3,
  de_DE = 4,
}

export enum PrereleaseAccess {
  none = 0,
  beta3 = 1,
  beta2 = 2,
  beta1 = 3,
  alpha = 4,
  internalTesting = 5,
}

export enum ForumAccess {
  founderReadOnly = 0,
  founder = 1,
  internalTest = 2,
  builder = 3,
}

export enum RedeemError {
  Success = 0,
  AlreadyRedeemed = 1,
  DatabaseError = 2,
  DuplicateTransactionID = 3,
  Invalidated = 4,
  BadState = 5,
  NotRevealed = 6,
}

export enum TransactionType {
  Paypal = 1,
  Kickstarter = 2,
  Child = 3,
  Stripe = 4,
}

export enum BackerLevel {
  none = 0,
  builder = 10,
  founder = 20,
}

export enum Permissions {
  CSEEmployee = 0,
  AccountEditor = 1,
  AccountViewer = 2,
  OzEditor = 3,
  InternalTester = 4,
  TrustedTester = 5,
  ModSquad = 6,
  OldSchoolGaming = 7,
  BuildersBrigade = 8,
}

export enum StrongAuth {
  None = 0,
  Email = 1,
  Facebook = 2,
}

export enum FieldCodes {
  UnspecifiedAuthorizationDenied = 1000,
  APIKeyAuthorizationFailed = 1001,
  LoginTokenAuthorizationFailed = 1002,
  RealmRestricted = 1003,
  UnspecifiedNotAllowed = 2000,
  RateLimitExceeded = 2001,
  InternalAction = 2002,
  UnspecifiedRequestError = 3000,
  UnspecifiedExecutionError = 4000,
  UnhandledExecutionException = 4001,
  DoesNotExist = 4002,
  UserStateConflict = 4003,
  InsufficientResource = 4004,
  VoxJobError = 4005,
  MoveItemError = 4006,
  SecureTradeError = 4007,
  UnspecifiedServiceUnavailable = 5000,
  DatabaseUnavailable = 5001,
  GroupServiceUnavailable = 5002,
  GameServiceUnavailable = 5003,
  PresenceServiceUnavailable = 5004,
  InvalidModel = 30001,
}

export enum AccessType {
}

export enum PhysicsVar {
  Gravity = 0,
  AirDensity = 1,
  DefaultPlayerSpeed = 2,
  DefaultPlayerAcceleration = 3,
  DefaultPlayerRotationSpeed = 4,
  PlayerSlidingConstant = 5,
  PlayerMaxUphillSlope = 6,
  PlayerMinUphillSlope = 7,
  PlayerMaxDownhillSlope = 8,
  PlayerMinDownhillSlope = 9,
  PlayerMaxUphillSpeed = 10,
  PlayerMinUphillSpeed = 11,
  PlayerMaxDownhillSpeed = 12,
  PlayerMinDownhillSpeed = 13,
  PlayerJumpVelocity = 14,
  PlayerForwardSpeedMultiplier = 15,
  PlayerSidewaysSpeedMultiplier = 16,
  PlayerBackwardsSpeedMultiplier = 17,
  PlayerMinSlopeForSliding = 18,
  PlayerSlopeForForcedSliding = 19,
  PlayerOnGroundGravityFactor = 20,
  PlayerUncontrolledAccelerationFactor = 21,
  PlayerControlledVelocityFactorSq = 22,
  PlayerServerAccelCheat = 23,
  PlayerServerSpeedCheat = 24,
  PlayerMinSlideSpeed = 25,
  _COUNT = 26,
}

export enum PhysicsEventKind {
  SyncLocal = 0,
  Collision = 1,
  StartStop = 2,
  Movement = 4,
  _COUNT = 7,
  Shock = 8,
  TerrainUpdate = 16,
  BuildingCellsDone = 32,
}

export enum CollisionType {
  ContactFound = 0,
  ContactLost = 1,
  _COUNT = 2,
}

export enum PhysicsEntityType {
  Kinematic = 0,
  Dynamic = 1,
  Trigger = 2,
  ForceField = 3,
  SystemStatic = 4,
  SystemTrigger = 5,
  Building = 6,
  SiegeEngine = 7,
  COUNT = 8,
}

export interface QueueStatusResponse {
  errorMessage: string;
  queueStatusMessage: QueueStatusMessage;
}

export interface QueueStatusMessage {
  status: string;
  numContributors: number;
  maxContributors: number;
  blueprints: QueuedBlueprintMessage[];
}

export interface QueuedBlueprintMessage {
  name: string;
  percentComplete: number;
  estTimeRemaining: number;
  subName: string;
  amtNeeded: number;
}

export interface MoveItemRequest {
  MoveItemID: string;
  StackHash: string;
  UnitCount: number;
  To: MoveItemRequestLocation;
  From: MoveItemRequestLocation;
}

export interface MoveItemRequestLocation {
  CharacterID: string;
  EntityID: string;
  Position: number;
  ContainerID: string;
  GearSlotIDs: string[];
  VoxSlot: SubItemSlot;
  Location: MoveItemRequestLocationType;
}

export interface MoveItemResult {
  Code: MoveItemResultCode;
  MovedItemIDs: string[];
  Message: string;
}

export interface SecureTradeItem {
  ItemID: string;
  UnitCount: number;
}

export interface ArchetypeInfo {
  description: string;
  faction: Faction;
  id: Archetype;
  name: string;
}

export interface SimpleCharacter {
  archetype: Archetype;
  faction: Faction;
  gender: Gender;
  id: string;
  lastLogin: string;
  name: string;
  race: Race;
  shardID: number;
}

export interface Character {
  archetype: Archetype;
  attributes: string[];
  traitIDs: string[];
  faction: Faction;
  gender: Gender;
  id: string;
  lastLogin: string;
  name: string;
  race: Race;
  shardID: number;
}

export interface ControlGameState {
  arthurianScore: number;
  controlPoints: ControlPoint[];
  gameState: number;
  timeLeft: number;
  tuathaDeDanannScore: number;
  vikingScore: number;
}

export interface ControlPoint {
  faction: string;
  id: string;
  size: string;
  x: number;
  y: number;
}

export interface FactionInfo {
  description: string;
  id: number;
  name: string;
  shortName: string;
}

export interface MessageOfTheDay {
  id: string;
  message: string;
  duration: number;
}

export interface PatcherAlert {
  id: string;
  message: string;
  utcDateEnd: string;
  utcDateStart: string;
}

export interface PatcherHeroContent {
  content: string;
  id: string;
  priority: number;
  utcDateEnd: string;
  utcDateStart: string;
}

export interface PlayerAttributeOffset {
  race: Race;
  gender: Gender;
  attributeOffsets: string[];
}

export interface PlayerPresence {
  characterID: string;
  connectedZoneIDs: number[];
  activeZoneID: number;
  desiredZoneID: number;
}

export interface PlayerStatAttribute {
  baseValue: number;
  derivedFrom: string;
  description: string;
  maxOrMultipler: number;
  name: string;
  type: PlayerStatType;
  units: string;
}

export interface RaceInfo {
  name: string;
  description: string;
  faction: Faction;
  id: Race;
}

export interface ServerModel {
  accessLevel: AccessType;
  channelID: number;
  channelPatchPermissions: number;
  host: string;
  name: string;
  playerMaximum: number;
  shardID: number;
  status: ServerStatus;
  apiHost: string;
}

export interface ServerPresence {
  address: string;
  zoneID: number;
  shardID: number;
  zoneBoundsMax: { x: number, y: number };
  zoneBoundsMin: { x: number, y: number };
}

export interface ServerState {
  controlGameState: ControlGameState;
  playerCounts: PlayerCounts;
  spawnPoints: SpawnPoint[];
}

export interface SpawnPoint {
  faction: Faction;
  x: number;
  y: number;
}

export interface PlayerCounts {
  arthurian: number;
  maxPlayers: number;
  tuatha: number;
  viking: number;
}

export interface StartingServer {
  Address: string;
  ZoneID: number;
}

export interface Trait {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  prerequisites: string[];
}

export interface OptionalAndRequiredTraits {
  required: string[];
  optional: string[];
}

export interface ExclusiveTraits {
  ids: string[];
  minRequired: number;
  maxAllowed: number;
}

export interface TraitList {
  traits: Trait[];
  factions: string[];
  races: string[];
  archetypes: string[];
  ranks: string[][];
  exclusivity: ExclusiveTraits[];
}

export interface GroupInvite {
  created: string;
  groupType: GroupType;
  inviteCode: string;
  groupID: string;
  groupName: string;
  invitedByName: string;
}

export interface Order {
  created: string;
  createdBy: string;
  faction: Faction;
  formerMembers: OrderMember[];
  id: string;
  members: OrderMember[];
  name: string;
  ranks: RankInfo[];
  shardID: number;
}

export interface OrderMember {
  name: string;
  id: string;
  joined: string;
  parted: string;
  rank: string;
  additionalPermissions: string[];
}

export interface PermissionInfo {
  description: string;
  name: string;
}

export interface RankInfo {
  level: number;
  name: string;
  permissions: string[];
}

export interface Warband {
  banner: string;
  created: string;
  id: string;
  members: WarbandMember[];
  name: string;
  shardID: number;
}

export interface WarbandMember {
  additionalPermissions: string[];
  archetype: Archetype;
  avatar: string;
  blood: CurrentMaxValue;
  characterID: string;
  gender: Gender;
  health: CurrentMaxValue[];
  joined: string;
  name: string;
  panic: CurrentMaxValue;
  parted: string;
  race: Race;
  rank: string;
  stamina: CurrentMaxValue;
  temperature: Temperature;
  wounds: number[];
}

export interface BadRequestFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedRequestError {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface InvalidModel {
  ModelErrors: ModelError[];
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface ModelError {
  Message: string;
  ParamName: string;
  TypeName: string;
}

export interface ExecutionErrorFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedExecutionError {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface UnhandledExecutionException {
  Exception: string;
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface DoesNotExist {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface UserStateConflict {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface InsufficientResource {
  Resources: ResourceRequirement[];
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface ResourceRequirement {
  Name: string;
  Required: Object;
  Available: Object;
}

export interface NotAllowedFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedNotAllowed {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface RateLimitExceeded {
  Retry: number;
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface InternalAction {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface ServiceUnavailableFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedServiceUnavailable {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface DatabaseUnavailable {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface GroupServiceUnavailable {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface GameServiceUnavailable {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface PresenceServiceUnavailable {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface UnauthorizedFieldCode {
  Code: FieldCodes;
  Message: string;
}

export interface UnspecifiedAuthorizationDenied {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface APIKeyAuthorizationFailed {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface LoginTokenAuthorizationFailed {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface RealmRestricted {
  Code: FieldCodes;
  Message: string;
  DefaultMessage: string;
}

export interface CurrentMaxValue {
  current: number;
  maximum: number;
}

export interface Temperature {
  current: number;
  freezingThreshold: number;
  burndingThreshold: number;
}
