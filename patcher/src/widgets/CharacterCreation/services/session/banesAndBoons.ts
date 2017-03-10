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
import traitsExampleResponse from '../../components/BanesAndBoonsContainer/traitsExampleResponse';

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

export const fetchTraits = (payload: { playerClass: string, race: string, faction: string }) => {
  return (dispatch: (action: any) => any) => {
    /*return webAPI.TraitsAPI.getTraitsV1(client.shardID)
      .then((result: any) => {
        if (result.ok) {
          dispatch(onInitializeTraits({
            playerClass: payload.playerClass,
            race: payload.race,
            faction: payload.faction,
            banesAndBoons: result
          }));
        } else {
          console.log('Failed to retrieve Banes and Boons');
        }
      })*/
      dispatch(onInitializeTraits({
        playerClass: payload.playerClass,
        race: payload.race,
        faction: payload.faction,
        banesAndBoons: traitsExampleResponse
      }))
  }
};

const emptyBaneOrBoon = {
  id: '',
  name: '',
  description: '',
  points: 0,
  icon: '',
  required: false,
  category: '',
  selected: false,
  rank: -1,
  ranks: [''],
  exclusivityGroup: -1,
  minRequired: -1,
  maxAllowed: -1
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
    const addedBanesClone = state.addedBanes;
    const traitsClone = state.traits;
    addedBanesClone[action.bane.id] = action.bane.id;
    traitsClone[action.bane.id] = { ...action.bane, selected: true };
    return {
      ...state,
      traits: traitsClone,
      addedBanes: addedBanesClone,
      totalPoints: state.totalPoints + action.bane.points
    }
  }
});

export const onSelectBoon = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_SELECT_BOON',
  action: (action: { boon: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    const addedBoonsClone = state.addedBoons;
    const traitsClone = state.traits;
    addedBoonsClone[action.boon.id] = action.boon.id;
    traitsClone[action.boon.id] = { ...action.boon, selected: true };
    return {
      ...state,
      traits: traitsClone,
      addedBoons: addedBoonsClone,
      totalPoints: state.totalPoints + action.boon.points
    }
  }
});

export const onCancelBaneClick = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_CANCEL_BANE',
  action: (action: { bane: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    const addedBanesClone = state.addedBanes;
    const traitsClone = state.traits;
    traitsClone[action.bane.id] = { ...action.bane, selected: false };
    delete addedBanesClone[action.bane.id];
    return {
      traits: traitsClone,
      addedBanes: addedBanesClone,
      totalPoints: state.totalPoints - action.bane.points
    }
  }
});

export const onCancelBoonClick = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_CANCEL_BOON',
  action: (action: { boon: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    const addedBoonsClone = state.addedBoons;
    const traitsClone = state.traits;
    traitsClone[action.boon.id] = { ...action.boon, selected: false }
    delete addedBoonsClone[action.boon.id];
    return Object.assign({}, state, {
      addedBoons: addedBoonsClone,
      totalPoints: state.totalPoints - action.boon.points
    });
  }
});

export const onUpdateRankBoons = module.createAction({
  type: 'cu-character-creeation/banes-and-boons/ON_UPDATE_RANK_BOONS',
  action: (action: { boon: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let totalPointRankBoons = state.totalPoints;
    const gBoons = state.generalBoons;
    const cBoons = state.playerClassBoons;
    const rBoons = state.raceBoons;
    const fBoons = state.factionBoons;
    const addedBoonsClone = state.addedBoons;
    const traitsClone = state.traits;
    console.log(action.boon);
    const nextRankBoon = action.boon.ranks[action.boon.rank + 1] ? action.boon.ranks[action.boon.rank + 1] :
      action.boon.ranks[action.boon.rank];
    const previousRankBoon = action.boon.ranks[action.boon.rank - 1] ? action.boon.ranks[action.boon.rank - 1] :
      action.boon.ranks[action.boon.rank];
    if (action.event === 'select') {
      if (addedBoonsClone[previousRankBoon] && state.traits[previousRankBoon].rank !== action.boon.ranks.length - 1)
        totalPointRankBoons = totalPointRankBoons + (action.boon.points - state.traits[previousRankBoon].points);
      if (action.boon.rank !== 0) {
        addedBoonsClone[previousRankBoon] = action.boon.id;
        addedBoonsClone[action.boon.id] = addedBoonsClone[previousRankBoon]
        delete addedBoonsClone[previousRankBoon];
      }
      switch (action.boon.category) {
        case 'General':
          gBoons[action.boon.id] = nextRankBoon;
          if (action.boon.ranks.length - 1 !== action.boon.rank) {
            gBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = gBoons[action.boon.id];
            delete gBoons[action.boon.id];
          }
          break;
        case 'Class':
          cBoons[action.boon.id] = nextRankBoon;
          if (action.boon.ranks.length - 1 !== action.boon.rank) {
            cBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = cBoons[action.boon.id];
            delete cBoons[action.boon.id];
          }
          break;
        case 'Race':
          rBoons[action.boon.id] = nextRankBoon;
          if (action.boon.ranks.length - 1 !== action.boon.rank) {
            cBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = cBoons[action.boon.id];
            delete cBoons[action.boon.id];
          }
          break;
        case 'Faction':
          fBoons[action.boon.id] = nextRankBoon;
          if (action.boon.ranks.length - 1 !== action.boon.rank) {
            fBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = fBoons[action.boon.id];
            delete fBoons[action.boon.id];
          }
          break;
      }
    }
    if (action.event === 'cancel') {
      if (action.boon.rank !== 0) {
        addedBoonsClone[action.boon.id] = state.traits[previousRankBoon].id;
        addedBoonsClone[previousRankBoon] = addedBoonsClone[action.boon.id];
        delete addedBoonsClone[action.boon.id];
      }
      if (action.boon.rank !== 0)
        totalPointRankBoons = totalPointRankBoons - (action.boon.points - state.traits[previousRankBoon].points);
      switch (action.boon.category) {
        case 'General':
          gBoons[action.boon.ranks[action.boon.rank + 1]] = action.boon.id;
          gBoons[action.boon.id] = gBoons[action.boon.ranks[action.boon.rank + 1]];
          delete gBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Class':
          cBoons[action.boon.ranks[action.boon.rank + 1]] = action.boon.id;
          cBoons[action.boon.id] = cBoons[action.boon.ranks[action.boon.rank + 1]];
          delete cBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Race':
          rBoons[action.boon.ranks[action.boon.rank + 1]] = action.boon.id;
          rBoons[action.boon.id] = rBoons[action.boon.ranks[action.boon.rank + 1]];
          delete rBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Faction':
          fBoons[action.boon.ranks[action.boon.rank + 1]] = action.boon.id;
          fBoons[action.boon.id] = fBoons[action.boon.ranks[action.boon.rank + 1]];
          delete fBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
      }
    }
    return Object.assign({}, state, {
      addedBoons: addedBoonsClone,
      generalBoons: gBoons,
      classBoons: cBoons,
      raceBoons: rBoons,
      factionBoons: fBoons,
      totalPoints: totalPointRankBoons
    });
  }
});

export const onUpdateRankBanes = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_RANK_BANES',
  action: (action: { bane: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let totalPointRankBanes = state.totalPoints;
    const gBanes = state.generalBanes;
    const cBanes = state.playerClassBanes;
    const rBanes = state.raceBanes;
    const fBanes = state.factionBanes;
    const addedBanesClone = state.addedBanes;
    const traitsClone = state.traits;
    const nextRankBane = action.bane.ranks[action.bane.rank + 1] ? action.bane.ranks[action.bane.rank + 1] :
      action.bane.id;
    const previousRankBane = action.bane.ranks[action.bane.rank - 1] ? action.bane.ranks[action.bane.rank - 1] :
      action.bane.id;
    if (action.event === 'select') {
      if (addedBanesClone[previousRankBane] && state.traits[previousRankBane].rank !== action.bane.ranks.length - 1)
        totalPointRankBanes = totalPointRankBanes + (action.bane.points - state.traits[previousRankBane].points);
      if (action.bane.rank !== 0) {
        addedBanesClone[previousRankBane] = action.bane.id;
        addedBanesClone[action.bane.id] = addedBanesClone[previousRankBane]
        delete addedBanesClone[previousRankBane];
      }
      switch (action.bane.category) {
        case 'General':
          gBanes[action.bane.id] = nextRankBane;
          if (action.bane.ranks.length - 1 !== action.bane.rank) {
            gBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = gBanes[action.bane.id];
            delete gBanes[action.bane.id];
          }
          break;
        case 'Class':
          cBanes[action.bane.id] = nextRankBane;
          if (action.bane.ranks.length - 1 !== action.bane.rank) {
            cBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = cBanes[action.bane.id];
            delete cBanes[action.bane.id];
          }
          break;
        case 'Race':
          rBanes[action.bane.id] = nextRankBane;
          if (action.bane.ranks.length - 1 !== action.bane.rank) {
            cBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = cBanes[action.bane.id];
            delete cBanes[action.bane.id];
          }
          break;
        case 'Faction':
          fBanes[action.bane.id] = nextRankBane;
          if (action.bane.ranks.length - 1 !== action.bane.rank) {
            fBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = fBanes[action.bane.id];
            delete fBanes[action.bane.id];
          }
          break;
      }
    }
    if (action.event === 'cancel') {
      if (action.bane.rank !== 0) {
        addedBanesClone[action.bane.id] = state.traits[previousRankBane].id;
        addedBanesClone[previousRankBane] = addedBanesClone[action.bane.id];
        delete addedBanesClone[action.bane.id];
      }
      if (action.bane.rank !== 0)
        totalPointRankBanes = totalPointRankBanes - (action.bane.points - state.traits[previousRankBane].points);
      switch (action.bane.category) {
        case 'General':
          gBanes[action.bane.ranks[action.bane.rank + 1]] = action.bane.id;
          gBanes[action.bane.id] = gBanes[action.bane.ranks[action.bane.rank + 1]];
          delete gBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Class':
          cBanes[action.bane.ranks[action.bane.rank + 1]] = action.bane.id;
          cBanes[action.bane.id] = cBanes[action.bane.ranks[action.bane.rank + 1]];
          delete cBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Race':
          rBanes[action.bane.ranks[action.bane.rank + 1]] = action.bane.id;
          rBanes[action.bane.id] = rBanes[action.bane.ranks[action.bane.rank + 1]];
          delete rBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Faction':
          fBanes[action.bane.ranks[action.bane.rank + 1]] = action.bane.id;
          fBanes[action.bane.id] = fBanes[action.bane.ranks[action.bane.rank + 1]];
          delete fBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
      }
    }
    return Object.assign({}, state, {
      addedBanes: addedBanesClone,
      generalBanes: gBanes,
      classBanes: cBanes,
      raceBanes: rBanes,
      factionBanes: fBanes,
      totalPoints: totalPointRankBanes
    });
  }
});

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
    const allExclusiveTraits: { [id: string]: string } = {};
     exclusives.forEach((exclusiveArray: ExclusiveInfo, index: number) =>
      exclusiveArray.ids.forEach((exclusive: string) => {
      traits[exclusive] = Object.assign({},
        traits[exclusive],
        {
        exclusivityGroup: exclusiveArray.ids,
        minRequired: exclusiveArray.minRequired,
        maxAllowed: exclusiveArray.maxAllowed,
      })
      allExclusiveTraits[exclusive] = exclusive;
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
    ].map((id) => Object.assign({}, traits[id], { required: true }));

    const requiredBanes = [
      ...playerClassTraits && playerClassTraits.required ?
        playerClassTraits.required.filter((id: string) => traits[id].points <= -1) : [],
      ...factionTraits && factionTraits.required ?
        factionTraits.required.filter((id: string) => traits[id].points <= -1) : [],
      ...raceTraits && raceTraits.required ?
        raceTraits.required.filter((id: string) => traits[id].points <= -1) : []
    ].map((id) => Object.assign({}, traits[id], { required: true }));

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

    const addedBoons: { [id: string]: BanesAndBoonsInfo } = {};
    requiredBoons.forEach((trait: BanesAndBoonsInfo) => addedBoons[trait.id] = trait.id);

    const addedBanes: { [id: string]: BanesAndBoonsInfo } = {};
    requiredBanes.forEach((trait: BanesAndBoonsInfo) => addedBanes[trait.id] = trait.id);

    console.log(traits);
    console.log(generalBoons);
    console.log(generalBanes);
    console.log(playerClassBoons);
    console.log(playerClassBanes);
    console.log(raceBoons);
    console.log(raceBanes);
    console.log(factionBoons);
    console.log(factionBanes);
    console.log(allPrerequisites);
    console.log(combinedRanks);
    console.log(allExclusiveTraits)

    return Object.assign({}, state, {
      initial: false,
      addedBoons: addedBoons,
      addedBanes: addedBanes,
      traits: traits,
      generalBoons: generalBoons,
      generalBanes: generalBanes,
      playerClassBoons: playerClassBoons,
      playerClassBanes: playerClassBanes,
      raceBoons: raceBoons,
      raceBanes: raceBanes,
      factionBoons: factionBoons,
      factionBanes: factionBanes,
      totalPoints: totalPoints,
      allPrerequisites: allPrerequisites,
      allExclusives: allExclusiveTraits
    });
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
