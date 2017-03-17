/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-03 16:19:58
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-03 17:25:22
 */

import { fetchJSON } from '../../../../lib/fetchHelpers';
import ResponseError from '../../../../lib/ResponseError';
import { Module } from 'redux-typed-modules';
import { webAPI, client, Faction, Race } from 'camelot-unchained';

export interface BanesAndBoonsInfo {
  id: any;
  name: string;
  description: string;
  points: number;
  icon: string;
  required: boolean;
  category: string;
  selected: boolean;
  prerequisites: Array<string>;
  rank: number;
  ranks: Array<string>;
  exclusivityGroup: Array<string>;
  minRequired: number;
  maxAllowed: number;
  finished: boolean;
}

export interface TraitMap {
  [id: string]: BanesAndBoonsInfo
}

export interface TraitIdMap {
  [id: string]: string
}

export interface BanesAndBoonsState {
  initial: boolean;
  totalPoints: number;
  traits: TraitMap;
  addedBanes: TraitIdMap;
  addedBoons: TraitIdMap;
  generalBoons: TraitIdMap;
  playerClassBoons: TraitIdMap;
  raceBoons: TraitIdMap;
  factionBoons: TraitIdMap;
  generalBanes: TraitIdMap;
  playerClassBanes: TraitIdMap;
  raceBanes: TraitIdMap;
  factionBanes: TraitIdMap;
  allPrerequisites: TraitIdMap;
  allExclusives: TraitIdMap;
}

declare var toastr: any;

export const fetchTraits = (payload: { playerClass: string, race: string, faction: string }) => {
  return (dispatch: (action: any) => any) => {
    return webAPI.TraitsAPI.getTraitsV1(client.shardID)
      .then((result: any) => {
        if (result.ok) {
          dispatch(onInitializeTraits({
            playerClass: payload.playerClass,
            race: payload.race,
            faction: payload.faction,
            banesAndBoons: result.data
          }));
        } else {
          toastr.error(
            'We are having technical difficulties. You will not be able to create a character until they have been fixed.',
            'Oh No!!',
            {timeOut: 5000}
          );
        }
    })
  }
};

export function getInitialState() {
  const initialState: BanesAndBoonsState = {
    initial: true,
    totalPoints: 0,
    traits: {},
    addedBanes: {},
    addedBoons: {},
    generalBoons: {},
    playerClassBoons: {},
    raceBoons: {},
    factionBoons: {},
    generalBanes: {},
    playerClassBanes: {},
    raceBanes: {},
    factionBanes: {},
    allPrerequisites: {},
    allExclusives: {}
  }
  return initialState;
}

export const module = new Module({
  initialState: getInitialState()
});

export const onSelectBane = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_SELECT_BANE',
  action: (action: { bane: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    const addedBanes = state.addedBanes;
    const traits = state.traits;
    addedBanes[action.bane.id] = action.bane.id;
    traits[action.bane.id] = { ...action.bane, selected: true };
    return {
      traits,
      addedBanes,
      totalPoints: state.totalPoints + action.bane.points
    }
  }
});

export const onSelectBoon = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_SELECT_BOON',
  action: (action: { boon: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    const addedBoons = state.addedBoons;
    const traits = state.traits;
    addedBoons[action.boon.id] = action.boon.id;
    traits[action.boon.id] = { ...action.boon, selected: true };
    return {
      traits,
      addedBoons,
      totalPoints: state.totalPoints + action.boon.points
    }
  }
});

export const onCancelBaneClick = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_CANCEL_BANE',
  action: (action: { bane: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    const addedBanes = state.addedBanes;
    const traits = state.traits;
    traits[action.bane.id] = { ...action.bane, selected: false };
    delete addedBanes[action.bane.id];
    return {
      traits,
      addedBanes,
      totalPoints: state.totalPoints - action.bane.points
    }
  }
});

export const onCancelBoonClick = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_CANCEL_BOON',
  action: (action: { boon: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    const addedBoons = state.addedBoons;
    const traits = state.traits;
    traits[action.boon.id] = { ...action.boon, selected: false }
    delete addedBoons[action.boon.id];
    return {
      traits,
      addedBoons,
      totalPoints: state.totalPoints - action.boon.points
    };
  }
});

export const onSelectRankBoon = module.createAction({
  type: 'cu-character-creeation/banes-and-boons/ON_SELECT_RANK_BOONS',
  action: (action: { boon: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    let totalPoints = state.totalPoints;
    const generalBoons = state.generalBoons;
    const classBoons = state.playerClassBoons;
    const raceBoons = state.raceBoons;
    const factionBoons = state.factionBoons;
    const addedBoons = state.addedBoons;
    const traits = state.traits;
    const nextRankBoon = action.boon.ranks[action.boon.rank + 1] ? action.boon.ranks[action.boon.rank + 1] :
      action.boon.ranks[action.boon.rank];
    const previousRankBoon = action.boon.ranks[action.boon.rank - 1] ? action.boon.ranks[action.boon.rank - 1] :
      action.boon.ranks[action.boon.rank];
    if (addedBoons[previousRankBoon] && state.traits[previousRankBoon].rank !== action.boon.ranks.length - 1)
      totalPoints = totalPoints + (action.boon.points - state.traits[previousRankBoon].points);
    if (action.boon.rank !== 0) {
      addedBoons[previousRankBoon] = action.boon.id;
      addedBoons[action.boon.id] = addedBoons[previousRankBoon]
      delete addedBoons[previousRankBoon];
    }
    switch (action.boon.category) {
      case 'General':
        generalBoons[action.boon.id] = nextRankBoon;
        if (action.boon.ranks.length - 1 !== action.boon.rank) {
          generalBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = generalBoons[action.boon.id];
          delete generalBoons[action.boon.id];
        }
        break;
      case 'Class':
        classBoons[action.boon.id] = nextRankBoon;
        if (action.boon.ranks.length - 1 !== action.boon.rank) {
          classBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = classBoons[action.boon.id];
          delete classBoons[action.boon.id];
        }
        break;
      case 'Race':
        raceBoons[action.boon.id] = nextRankBoon;
        if (action.boon.ranks.length - 1 !== action.boon.rank) {
          classBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = classBoons[action.boon.id];
          delete classBoons[action.boon.id];
        }
        break;
      case 'Faction':
        factionBoons[action.boon.id] = nextRankBoon;
        if (action.boon.ranks.length - 1 !== action.boon.rank) {
          factionBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = factionBoons[action.boon.id];
          delete factionBoons[action.boon.id];
        }
        break;
    }
    console.log(generalBoons);
    return {
      addedBoons,
      generalBoons,
      classBoons,
      raceBoons,
      factionBoons,
      totalPoints
    };
  }
});

export const onCancelRankBoon = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_CANCEL_RANK_BOON',
  action: (action: { boon: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    let totalPoints = state.totalPoints;
    const generalBoons = state.generalBoons;
    const classBoons = state.playerClassBoons;
    const raceBoons = state.raceBoons;
    const factionBoons = state.factionBoons;
    const addedBoons = state.addedBoons;
    const previousRankBoon = action.boon.ranks[action.boon.rank - 1] ? action.boon.ranks[action.boon.rank - 1] :
      action.boon.ranks[action.boon.rank];
    if (action.boon.rank !== 0) {
        addedBoons[action.boon.id] = state.traits[previousRankBoon].id;
        addedBoons[previousRankBoon] = addedBoons[action.boon.id];
        delete addedBoons[action.boon.id];
      }
      if (action.boon.rank !== 0)
        totalPoints = totalPoints - (action.boon.points - state.traits[previousRankBoon].points);
      switch (action.boon.category) {
        case 'General':
          generalBoons[action.boon.ranks[action.boon.rank + 1]] = action.boon.id;
          generalBoons[action.boon.id] = generalBoons[action.boon.ranks[action.boon.rank + 1]];
          delete generalBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Class':
          classBoons[action.boon.ranks[action.boon.rank + 1]] = action.boon.id;
          classBoons[action.boon.id] = classBoons[action.boon.ranks[action.boon.rank + 1]];
          delete classBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Race':
          raceBoons[action.boon.ranks[action.boon.rank + 1]] = action.boon.id;
          raceBoons[action.boon.id] = raceBoons[action.boon.ranks[action.boon.rank + 1]];
          delete raceBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Faction':
          factionBoons[action.boon.ranks[action.boon.rank + 1]] = action.boon.id;
          factionBoons[action.boon.id] = factionBoons[action.boon.ranks[action.boon.rank + 1]];
          delete factionBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
      }
    return {
      addedBoons,
      generalBoons,
      classBoons,
      raceBoons,
      factionBoons,
      totalPoints
    }
  }
});

export const onSelectRankBane = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_RANK_BANES',
  action: (action: { bane: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    let totalPoints = state.totalPoints;
    const generalBanes = state.generalBanes;
    const classBanes = state.playerClassBanes;
    const raceBanes = state.raceBanes;
    const factionBanes = state.factionBanes;
    const addedBanes = state.addedBanes;
    const traits = state.traits;
    const nextRankBane = action.bane.ranks[action.bane.rank + 1] ? action.bane.ranks[action.bane.rank + 1] :
      action.bane.id;
    const previousRankBane = action.bane.ranks[action.bane.rank - 1] ? action.bane.ranks[action.bane.rank - 1] :
      action.bane.id;
    if (addedBanes[previousRankBane] && state.traits[previousRankBane].rank !== action.bane.ranks.length - 1)
      totalPoints = totalPoints + (action.bane.points - state.traits[previousRankBane].points);
    if (action.bane.rank !== 0) {
      addedBanes[previousRankBane] = action.bane.id;
      addedBanes[action.bane.id] = addedBanes[previousRankBane]
      delete addedBanes[previousRankBane];
    }
    switch (action.bane.category) {
      case 'General':
        generalBanes[action.bane.id] = nextRankBane;
        if (action.bane.ranks.length - 1 !== action.bane.rank) {
          generalBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = generalBanes[action.bane.id];
          delete generalBanes[action.bane.id];
        }
        break;
      case 'Class':
        classBanes[action.bane.id] = nextRankBane;
        if (action.bane.ranks.length - 1 !== action.bane.rank) {
          classBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = classBanes[action.bane.id];
          delete classBanes[action.bane.id];
        }
        break;
      case 'Race':
        raceBanes[action.bane.id] = nextRankBane;
        if (action.bane.ranks.length - 1 !== action.bane.rank) {
          classBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = classBanes[action.bane.id];
          delete classBanes[action.bane.id];
        }
        break;
      case 'Faction':
        factionBanes[action.bane.id] = nextRankBane;
        if (action.bane.ranks.length - 1 !== action.bane.rank) {
          factionBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = factionBanes[action.bane.id];
          delete factionBanes[action.bane.id];
        }
        break;
    }
    return {
      addedBanes,
      generalBanes,
      classBanes,
      raceBanes,
      factionBanes,
      totalPoints
    };
  }
});

export const onCancelRankBane = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_CANCEL_RANK_BANE',
  action: (action: { bane: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    let totalPoints = state.totalPoints;
    const generalBanes = state.generalBanes;
    const classBanes = state.playerClassBanes;
    const raceBanes = state.raceBanes;
    const factionBanes = state.factionBanes;
    const addedBanes = state.addedBanes;
    const traits = state.traits;
    const previousRankBane = action.bane.ranks[action.bane.rank - 1] ? action.bane.ranks[action.bane.rank - 1] :
      action.bane.id;
    if (action.bane.rank !== 0) {
        addedBanes[action.bane.id] = state.traits[previousRankBane].id;
        addedBanes[previousRankBane] = addedBanes[action.bane.id];
        delete addedBanes[action.bane.id];
      }
      if (action.bane.rank !== 0)
        totalPoints = totalPoints - (action.bane.points - state.traits[previousRankBane].points);
      switch (action.bane.category) {
        case 'General':
          generalBanes[action.bane.ranks[action.bane.rank + 1]] = action.bane.id;
          generalBanes[action.bane.id] = generalBanes[action.bane.ranks[action.bane.rank + 1]];
          delete generalBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Class':
          classBanes[action.bane.ranks[action.bane.rank + 1]] = action.bane.id;
          classBanes[action.bane.id] = classBanes[action.bane.ranks[action.bane.rank + 1]];
          delete classBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Race':
          raceBanes[action.bane.ranks[action.bane.rank + 1]] = action.bane.id;
          raceBanes[action.bane.id] = raceBanes[action.bane.ranks[action.bane.rank + 1]];
          delete raceBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Faction':
          factionBanes[action.bane.ranks[action.bane.rank + 1]] = action.bane.id;
          factionBanes[action.bane.id] = factionBanes[action.bane.ranks[action.bane.rank + 1]];
          delete factionBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
      }
    return {
      addedBanes,
      generalBanes,
      classBanes,
      raceBanes,
      factionBanes,
      totalPoints
    }
  }
})

export const onInitializeTraits = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_INITIALIZE_TRAITS',
  action: (action: { playerClass: string, faction: string, race: string, banesAndBoons: any }) => action,
  reducer: (state, action) => {
    const { playerClass, faction, race, banesAndBoons } = action;
    const playerClasses = banesAndBoons.classes;
    const factions = banesAndBoons.factions;
    const races = banesAndBoons.races;
    const ranks = banesAndBoons.ranks;
    const exclusives = banesAndBoons.exclusivity;
    const allTraits = banesAndBoons.traits;
    const traits: { [id: string]: BanesAndBoonsInfo } = {};
    banesAndBoons.traits.forEach((i: BanesAndBoonsInfo) => traits[i.id] = i)

    // Rank traits
    const allRanks = ranks.map((rankArray: Array<string>) =>
      rankArray.map((rankId: string, i: number) =>
        Object.assign({},
          traits[rankId],
          {
            rank: i,
            ranks: rankArray
          }
        )
      ));
      ranks.forEach((rankArray: Array<string>) =>
        rankArray.forEach((rankId: string, i: number) =>
          traits[rankId] = { ...traits[rankId], rank: i, ranks: rankArray, selected: i > 0 }
        )
      )
    const firstRanksArr = allRanks.map((rankArray: Array<BanesAndBoonsInfo>) =>
      rankArray.find((rank: BanesAndBoonsInfo) => rank.rank === 0));
    const firstRanks: { [id: string]: BanesAndBoonsInfo } = {};
    firstRanksArr.forEach((trait: BanesAndBoonsInfo) => firstRanks[trait.id] = trait);
    const combinedRanksArr = allRanks.reduce((rank1: Array<BanesAndBoonsInfo>, rank2: Array<BanesAndBoonsInfo>) => rank1.concat(rank2));
    const combinedRanks: { [id: string]: BanesAndBoonsInfo } = {};
    combinedRanksArr.forEach((trait: BanesAndBoonsInfo) => combinedRanks[trait.id] = trait.id);

    // Exclusive traits
    interface ExclusiveInfo {
      ids: Array<string>,
      minRequired: number,
      maxAllowed: number
    }
    const allExclusives: { [id: string]: string } = {};
     exclusives.forEach((exclusiveArray: ExclusiveInfo, index: number) =>
      exclusiveArray.ids.forEach((exclusive: string) => {
      traits[exclusive] = Object.assign({},
        traits[exclusive],
        {
        exclusivityGroup: exclusiveArray.ids,
        minRequired: exclusiveArray.minRequired,
        maxAllowed: exclusiveArray.maxAllowed,
      })
      allExclusives[exclusive] = exclusive;
     }))

    // Getting all the non-general traits
    const allClassTraits = Object.keys(playerClasses).map((playerClass) => {
      return {
        optional: playerClasses[playerClass] && playerClasses[playerClass].optional ?
          playerClasses[playerClass].optional : [],
        required: playerClasses[playerClass] && playerClasses[playerClass].required ?
          playerClasses[playerClass].required : []
      };
    });
    const allRaceTraits = Object.keys(races).map((race) => {      
      return {
        optional: races[race] && races[race].optional ? races[race].optional : [],
        required: races[race] && races[race].required ? races[race].required : []
      };
    });
    const allFactionTraits = Object.keys(factions).map((faction) => {
      return {
        optional: factions[faction] && factions[faction].optional ? factions[faction].optional : [],
        required: factions[faction] && factions[faction].required ? factions[faction].required : []
      };
    });

    const playerClassTraits = allClassTraits[Object.keys(playerClasses).indexOf(playerClass)];
    const factionTraits = allFactionTraits[Object.keys(factions).indexOf(faction)];
    const raceTraits = allRaceTraits[Object.keys(races).indexOf(race)];

    // Required traits
    const requiredBoons = [
      ...playerClassTraits && playerClassTraits.required ?
        playerClassTraits.required.filter((id: string) => traits[id].points >= 1) : [],
      ...factionTraits && factionTraits.required ?
        factionTraits.required.filter((id: string) => traits[id].points >= 1) : [],
      ...raceTraits && raceTraits.required ?
        raceTraits.required.filter((id: string) => traits[id].points >= 1) : []
    ].map((id) => {
      traits[id] = {...traits[id], required: true};
      return Object.assign({}, traits[id], { required: true })
    });

    const requiredBanes = [
      ...playerClassTraits && playerClassTraits.required ?
        playerClassTraits.required.filter((id: string) => traits[id].points <= -1) : [],
      ...factionTraits && factionTraits.required ?
        factionTraits.required.filter((id: string) => traits[id].points <= -1) : [],
      ...raceTraits && raceTraits.required ?
        raceTraits.required.filter((id: string) => traits[id].points <= -1) : []
    ].map((id) => {
      traits[id] = {...traits[id], required: true}
      return Object.assign({}, traits[id], { required: true })
    });

    // Player class traits
    const playerClassBoons: { [boonId: string]: string } = {}
    playerClassTraits && playerClassTraits.optional && [
      ...playerClassTraits.optional.filter((id: string) => {
        traits[id] = combinedRanks[id] ? { ...traits[id], category: 'Class' } : traits[id];
        return traits[id].points >= 1 && !combinedRanks[id];
      }) || [],
      playerClassTraits.optional.find((id: string) => firstRanks[id] && traits[id].points >= 1)
     ].filter((id: string) => id).forEach((key: string) => {
       playerClassBoons[key] = key;
       traits[key] = { ...traits[key], category: 'Class' };
     })

    const playerClassBanes: { [baneId: string]: string } = {};
    playerClassTraits && playerClassTraits.optional && [
      ...playerClassTraits.optional.filter((id: string) => {
        traits[id] = combinedRanks[id] ? { ...traits[id], category: 'Class' } : traits[id];
        return traits[id].points <= -1 && !combinedRanks[id];
      }) || [],
      playerClassTraits.optional.find((id: string) => firstRanks[id] && traits[id].points <= -1)
     ].filter((id: string) => id).forEach((key: string) => {
       playerClassBanes[key] = key;
       traits[key] = { ...traits[key], category: 'Class' };
     });

    // Faction traits
    const factionBoons: { [boonId: string]: string } = {};
    factionTraits && factionTraits.optional && [
      ...factionTraits.optional.filter((id: string) => {
        traits[id] = combinedRanks[id] ? { ...traits[id], category: 'Faction' } : traits[id];
        return traits[id].points >= 1 && !combinedRanks[id];
      }) || [],
      factionTraits.optional.find((id: string) => firstRanks[id] && traits[id].points >= 1)
    ].filter((id: string) => id).forEach((key: string) => {
      factionBoons[key] = key;
      traits[key] = { ...traits[key], category: 'Faction' };
    });

    const factionBanes: { [baneId: string]: string } = {};
    factionTraits && factionTraits.optional && [
      ...factionTraits.optional.filter((id: string) => {
        traits[id] = combinedRanks[id] ? { ...traits[id], category: 'Faction' } : traits[id];
        return traits[id].points <= -1 && !combinedRanks[id];
      }) || [],
      factionTraits.optional.find((id: string) => firstRanks[id] && traits[id].points <= -1)
    ].filter((id: string) => id).forEach((key: string) => {
      factionBanes[key] = key;
      traits[key] = { ...traits[key], category: 'Faction' };
    });


    // Race traits
    const raceBoons: { [boonId: string]: string } = {};
    raceTraits && raceTraits.optional && [
      ...raceTraits.optional.filter((id: string) => {
        traits[id] = combinedRanks[id] ? { ...traits[id], category: 'Race' } : traits[id];
        return traits[id].points >= 1 && !combinedRanks[id];
      }) || [],
      raceTraits.optional.find((id: string) => firstRanks[id] && traits[id].points >= 1)
    ].filter((id: string) => id).forEach((key: string) => {
      raceBoons[key] = key;
      traits[key] = { ...traits[key], category: 'Race' };
    });

    const raceBanes: { [baneId: string]: string } = {}
    raceTraits && raceTraits.optional && [
      ...raceTraits.optional.filter((id: string) => {
        traits[id] = combinedRanks[id] ? { ...traits[id], category: 'Race' } : traits[id];
        return traits[id].points <= -1 && !combinedRanks[id];
      }) || [],
      raceTraits.optional.find((id: string) => firstRanks[id] && traits[id].points <= -1)
    ].filter((id: string) => id).forEach((key: string) => {
      raceBanes[key] = key;
      traits[key] = { ...traits[key], category: 'Race' };
    });

    // General
    const undesirableTraits: { [id: string]: string } = {};
    [
      ...allClassTraits.map((playerClass) => [...playerClass.optional, ...playerClass.required]).reduce((a, b) => a.concat(b)),
      ...allRaceTraits.map((race) => [...race.optional, ...race.required]).reduce((a, b) => a.concat(b)),
      ...allFactionTraits.map((faction) => [...faction.optional, ...faction.required]).reduce((a, b) => a.concat(b))
    ].forEach((key: string) => undesirableTraits[key] = key);
    // Finding the Banes & Boons from the undesirableTraits
    const generalBoons: { [boonId: string]: string } = {};
    [
      ...allTraits.filter((boon: BanesAndBoonsInfo) => {
        traits[boon.id] = combinedRanks[boon.id] && !undesirableTraits[boon.id] ? { ...traits[boon.id], category: 'General' }
        : traits[boon.id];
        return !combinedRanks[boon.id] && !undesirableTraits[boon.id] && traits[boon.id].points >= 1;
      }),
      ...firstRanksArr.filter((rank: BanesAndBoonsInfo) => !undesirableTraits[rank.id] && rank.points >= 1)
    ].forEach((trait: BanesAndBoonsInfo) => generalBoons[trait.id] = trait.id)
    const generalBanes: { [baneId: string]: string } = {};
    [
      ...allTraits.filter((bane: BanesAndBoonsInfo) => {
        traits[bane.id] = combinedRanks[bane.id] && !undesirableTraits[bane.id] ? { ...traits[bane.id], category: 'General' }
        : traits[bane.id];
        return !combinedRanks[bane.id] && !undesirableTraits[bane.id] && traits[bane.id].points <= -1
      }),
      ...firstRanksArr.filter((rank: BanesAndBoonsInfo) => !undesirableTraits[rank.id] && rank.points <= -1)
    ].forEach((trait: BanesAndBoonsInfo) => generalBanes[trait.id] = trait.id)

    // Total points
    const totalPoints = (requiredBoons.length > 0 && requiredBoons.map((boon) => boon.points).reduce((a, b) => a + b)) +
      (requiredBanes.length > 0 && requiredBanes.map((bane) => bane.points).reduce((a, b) => a + b));

    // Prerequisite traits
    const allTraitsWithPrerequisites = allTraits.filter((trait: BanesAndBoonsInfo) => trait.prerequisites);
    const allPrerequisites: { [id: string]: string } = {};
     allTraitsWithPrerequisites.filter((t: BanesAndBoonsInfo) => t.prerequisites.filter((preReq) => traits[preReq]).length !== 0)
     .forEach((boon: BanesAndBoonsInfo) => boon.prerequisites.forEach((preReq) => allPrerequisites[preReq] = preReq))

    const addedBoons: { [id: string]: string } = {};
    requiredBoons.forEach((trait: BanesAndBoonsInfo) => addedBoons[trait.id] = trait.id);

    const addedBanes: { [id: string]: string } = {};
    requiredBanes.forEach((trait: BanesAndBoonsInfo) => addedBanes[trait.id] = trait.id);

    return {
      initial: false,
      addedBoons,
      addedBanes,
      traits,
      generalBoons,
      generalBanes,
      playerClassBoons,
      playerClassBanes,
      raceBoons,
      raceBanes,
      factionBoons,
      factionBanes,
      totalPoints,
      allPrerequisites,
      allExclusives
    };
  }
});

export const resetBanesAndBoons = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_RESET_BANES_AND_BOONS',
  action: () => null,
  reducer: () => {
    return module.initialState;
  }
});

export default module.createReducer();
