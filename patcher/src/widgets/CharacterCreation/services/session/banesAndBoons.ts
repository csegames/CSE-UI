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
  exclusivityGroup: Array<BanesAndBoonsInfo>;
  minRequired: number;
  maxAllowed: number;
  finished: boolean;
}

export interface TraitMap {
  [id: string]: BanesAndBoonsInfo
}

export interface BanesAndBoonsState {
  initial: boolean;
  totalPoints: number;
  addedBanes: BanesAndBoonsInfo[];
  addedBoons: BanesAndBoonsInfo[];
  generalBoons: TraitMap;
  playerClassBoons: TraitMap;
  raceBoons: TraitMap;
  factionBoons: TraitMap;
  generalBanes: TraitMap;
  playerClassBanes: TraitMap;
  raceBanes: TraitMap;
  factionBanes: TraitMap;
  allPrerequisites: TraitMap;
  allRanks: TraitMap;
  allExclusives: TraitMap;
}

export const fetchTraits = (payload: { playerClass: string, race: string, faction: string }) => {
  return (dispatch: (action: any) => any) => {
    return webAPI.TraitsAPI.getTraitsV1(client.shardID)
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
      })
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

const defaultTraitMap: TraitMap = {};

export function getInitialState() {
  return {
    initial: true,
    totalPoints: 0,
    addedBanes: [],
    addedBoons: [],
    generalBoons: defaultTraitMap,
    playerClassBoons: defaultTraitMap,
    raceBoons: defaultTraitMap,
    factionBoons: defaultTraitMap,
    generalBanes: defaultTraitMap,
    playerClassBanes: defaultTraitMap,
    raceBanes: defaultTraitMap,
    factionBanes: defaultTraitMap,
    allPrerequisites: defaultTraitMap,
    allRanks: defaultTraitMap,
    allExclusives: defaultTraitMap
  }
}

export const module = new Module({
  initialState: getInitialState()
});

export const onSelectBane = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_SELECT_BANE',
  action: (action: { bane: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    let updatedBanes = false;
    // Updating empty banes
    const addedBanes = state.addedBanes.map((bane) => {
      if (bane.id === '' && !updatedBanes) {
        updatedBanes = true;
        return Object.assign({}, action.bane, { selected: true });
      } else {
        return bane;
      }
    });
    // Adding on to the list of banes if there are no more empty banes to replace
    if (state.addedBanes.filter((bane) => bane.id === '').length === 0) {
      return Object.assign({}, state, {
        addedBanes: [...addedBanes, Object.assign({}, action.bane, { selected: true })],
        totalPoints: state.totalPoints + action.bane.points
      })
    }
    return Object.assign({}, state, {
      addedBanes: addedBanes,
      totalPoints: state.totalPoints + action.bane.points
    });
  }
});
export const onSelectBoon = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_SELECT_BOON',
  action: (action: { boon: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    let updatedBoons = false;
    // Updating empty boons
    const addedBoons = state.addedBoons.map((boon) => {
      if (boon.id === '' && !updatedBoons) {
        updatedBoons = true;
        return Object.assign({}, action.boon, { selected: true });
      } else {
        return boon;
      }
    });
    // Adding on to the list of boons if there are no more empty boons to replace
    if (state.addedBoons.filter((boon) => boon.id === '').length === 0) {
      return Object.assign({}, state, {
        addedBoons: [...addedBoons, Object.assign({}, action.boon, { selected: true })],
        totalPoints: state.totalPoints + action.boon.points
      })
    }
    return Object.assign({}, state, {
      addedBoons: addedBoons,
      totalPoints: state.totalPoints + action.boon.points
    });
  }
});

export const onCancelBaneClick = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_CANCEL_BANE',
  action: (action: { bane: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    if (state.addedBanes.length === 5) {
      const lessThanFiveBanes = state.addedBanes.map((bane) => {
        if (bane.id === action.bane.id) return emptyBaneOrBoon;
        return bane;
      });
      return Object.assign({}, state, {
        addedBanes: lessThanFiveBanes,
        totalPoints: state.totalPoints - action.bane.points
      });
    }
    const banes = state.addedBanes.filter((bane) => {
      return bane.id !== action.bane.id;
    });
    return Object.assign({}, state, {
      addedBanes: banes,
      totalPoints: state.totalPoints - action.bane.points
    });
  }
});

export const onCancelBoonClick = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_CANCEL_BOON',
  action: (action: { boon: BanesAndBoonsInfo }) => action,
  reducer: (state, action) => {
    if (state.addedBoons.length === 5) {
      const lessThanFiveBoons = state.addedBoons.map((boon) => {
        if (boon.id === action.boon.id) return emptyBaneOrBoon;
        return boon;
      });
      return Object.assign({}, state, {
        addedBoons: lessThanFiveBoons,
        totalPoints: state.totalPoints - action.boon.points
      });
    }
    const boons = state.addedBoons.filter((boon) => {
      return boon.id !== action.boon.id;
    });
    return Object.assign({}, state, {
      addedBoons: boons,
      totalPoints: state.totalPoints - action.boon.points
    });
  }
});

export const onUpdateGeneralBoons = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_GENERAL_BOONS',
  action: (action: { boon: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let generalBoonsClone = state.generalBoons;
    if (action.event === 'select') {
      generalBoonsClone[action.boon.id] = Object.assign({}, action.boon, { selected: true });
      return Object.assign({}, state, { generalBoons: generalBoonsClone });
    }
    generalBoonsClone[action.boon.id] = Object.assign({}, action.boon, { selected: false });
    return Object.assign({}, state, { generalBoons: generalBoonsClone });
  }
});

export const onUpdateGeneralBanes = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_GENERAL_BANES',
  action: (action: { bane: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let generalBanesClone = state.generalBanes;
    if (action.event === 'select') {
      generalBanesClone[action.bane.id] = Object.assign({}, action.bane, { selected: true });
      return Object.assign({}, state, { generalBanes: generalBanesClone });
    }
    generalBanesClone[action.bane.id] = Object.assign({}, action.bane, { selected: false });
    return Object.assign({}, state, { generalBanes: generalBanesClone });
  }
});

export const onUpdatePlayerClassBoons = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_PLAYER_CLASS_BOONS',
  action: (action: { boon: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let playerClassBoonsClone = state.playerClassBoons;
    if (action.event === 'select') {
      playerClassBoonsClone[action.boon.id] = Object.assign({}, action.boon, { selected: true });
      return Object.assign({}, state, { playerClassBoons: playerClassBoonsClone });
    }
    playerClassBoonsClone[action.boon.id] = Object.assign({}, action.boon, { selected: false });
    return Object.assign({}, state, { playerClassBoons: playerClassBoonsClone });
  }
});

export const onUpdatePlayerClassBanes = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_PLAYER_CLASS_BANES',
  action: (action: { bane: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let playerClassBanesClone = state.playerClassBanes;
    if (action.event === 'select') {
      playerClassBanesClone[action.bane.id] = Object.assign({}, action.bane, { selected: true });
      return Object.assign({}, state, { playerClassBanes: playerClassBanesClone });
    }
    playerClassBanesClone[action.bane.id] = Object.assign({}, action.bane, { selected: false });
    return Object.assign({}, state, { playerClassBanes: playerClassBanesClone });
  }
});

export const onUpdateFactionBoons = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_FACTION_BOONS',
  action: (action: { boon: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let factionBoonsClone = state.factionBoons;
    if (action.event === 'select') {
      factionBoonsClone[action.boon.id] = Object.assign({}, action.boon, { selected: true });
      return Object.assign({}, state, { factionBoons: factionBoonsClone });
    }
    factionBoonsClone[action.boon.id] = Object.assign({}, action.boon, { selected: false });
    return Object.assign({}, state, { factionBoons: factionBoonsClone });
  }
});

export const onUpdateFactionBanes = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_FACTION_BANES',
  action: (action: { bane: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let factionBanesClone = state.factionBanes;
    if (action.event === 'select') {
      factionBanesClone[action.bane.id] = Object.assign({}, action.bane, { selected: true });
      return Object.assign({}, state, { factionBanes: factionBanesClone });
    }
    factionBanesClone[action.bane.id] = Object.assign({}, action.bane, { selected: false });
    return Object.assign({}, state, { factionBanes: factionBanesClone });
  }
});

export const onUpdateRaceBoons = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_RACE_BOONS',
  action: (action: { boon: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let raceBoonsClone = state.raceBoons;
    if (action.event === 'select') {
      raceBoonsClone[action.boon.id] = Object.assign({}, action.boon, { selected: true });
      return Object.assign({}, state, { raceBoons: raceBoonsClone });
    }
    raceBoonsClone[action.boon.id] = Object.assign({}, action.boon, { selected: false });
    return Object.assign({}, state, { raceBoons: raceBoonsClone });
  }
});

export const onUpdateRaceBanes = module.createAction({
  type: 'cu-character-creation/banes-and-boons/ON_UPDATE_RACE_BANES',
  action: (action: { bane: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let raceBanesClone = state.raceBanes;
    if (action.event === 'select') {
      raceBanesClone[action.bane.id] = Object.assign({}, action.bane, { selected: true });
      return Object.assign({}, state, { raceBanes: raceBanesClone });
    }
    raceBanesClone[action.bane.id] = Object.assign({}, action.bane, { selected: false });
    return Object.assign({}, state, { raceBanes: raceBanesClone });
  }
});

export const onUpdateRankBoons = module.createAction({
  type: 'cu-character-creeation/banes-and-boons/ON_UPDATE_RANK_BOONS',
  action: (action: { boon: BanesAndBoonsInfo, event: 'select' | 'cancel' }) => action,
  reducer: (state, action) => {
    let gBoons = state.generalBoons;
    let cBoons = state.playerClassBoons;
    let rBoons = state.raceBoons;
    let fBoons = state.factionBoons;
    let addedBoonsClone = state.addedBoons;
    let totalPointRankBoons = state.totalPoints;
    const nextRankBoon = action.boon.ranks[action.boon.rank + 1] ? Object.assign({},
      state.allRanks[action.boon.ranks[action.boon.rank + 1]],
      {
        rank: action.boon.rank + 1,
        ranks: action.boon.ranks,
        category: action.boon.category,
        selected: true
      }) : Object.assign({}, action.boon, { selected: true, finished: true });
    const previousRankBoon = action.boon.ranks[action.boon.rank - 1] ? Object.assign({},
      state.allRanks[action.boon.ranks[action.boon.rank - 1]],
      {
        rank: action.boon.rank - 1,
        ranks: action.boon.ranks,
        category: action.boon.category,
        selected: action.boon.rank !== 1
      }) : Object.assign({}, action.boon, { selected: false, finished: true });
    const addedBoonSelectIndex = addedBoonsClone.findIndex((boon: BanesAndBoonsInfo) => boon.id === previousRankBoon.id);
    const addedBoonCancelIndex = addedBoonsClone.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.id);
    if (action.event === 'select') {
      if (addedBoonSelectIndex !== -1) addedBoonsClone[addedBoonSelectIndex] = action.boon;
      if (!action.boon.finished)
        totalPointRankBoons = totalPointRankBoons + (action.boon.points - previousRankBoon.points);
      switch (action.boon.category) {
        case 'General':
          gBoons[action.boon.id] = nextRankBoon;
          gBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = gBoons[action.boon.id];
          delete gBoons[action.boon.id];
          break;
        case 'Class':
          cBoons[action.boon.id] = nextRankBoon;
          cBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = cBoons[action.boon.id];
          delete cBoons[action.boon.id];
          break;
        case 'Race':
          rBoons[action.boon.id] = nextRankBoon;
          cBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = cBoons[action.boon.id];
          delete cBoons[action.boon.id];
          break;
        case 'Faction':
          fBoons[action.boon.id] = nextRankBoon;
          fBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.rank]] = fBoons[action.boon.id];
          delete fBoons[action.boon.id];
          break;
      }
    }
    if (action.event === 'cancel') {
      if (addedBoonCancelIndex !== -1) addedBoonsClone[addedBoonCancelIndex] = previousRankBoon;
      if (!action.boon.finished)
        totalPointRankBoons = totalPointRankBoons - (action.boon.points - previousRankBoon.points);
      switch (action.boon.category) {
        case 'General':
          gBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.id]] = action.boon;
          gBoons[action.boon.id] = gBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.id]];
          delete gBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Class':
          cBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.id]] = action.boon;
          cBoons[action.boon.id] = cBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.id]];
          delete cBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Race':
          rBoons[action.boon.ranks[action.boon.rank + 1] || action.boon.id] = action.boon;
          rBoons[action.boon.id] = rBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.id]];
          delete rBoons[action.boon.ranks[action.boon.rank + 1]];
          break;
        case 'Faction':
          fBoons[action.boon.ranks[action.boon.rank + 1] || action.boon.id] = action.boon;
          fBoons[action.boon.id] = fBoons[action.boon.ranks[action.boon.rank + 1 || action.boon.id]];
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
    let gBanes = state.generalBanes;
    let cBanes = state.playerClassBanes;
    let rBanes = state.raceBanes;
    let fBanes = state.factionBanes;
    let addedBanesClone = state.addedBanes;
    let totalPointRankBanes = state.totalPoints;
    const nextRankBane = action.bane.ranks[action.bane.rank + 1] ? Object.assign({},
        state.allRanks[action.bane.ranks[action.bane.rank + 1]],
        {
          rank: action.bane.rank + 1,
          ranks: action.bane.ranks,
          category: action.bane.category,
          selected: true
        }) : Object.assign({}, action.bane, { selected: true, finished: true });
    const previousRankBane = action.bane.ranks[action.bane.rank - 1] ? Object.assign({},
        state.allRanks[action.bane.ranks[action.bane.rank - 1]],
        {
          rank: action.bane.rank - 1,
          ranks: action.bane.ranks,
          category: action.bane.category,
          selected: action.bane.rank !== 1
        }) : Object.assign({}, action.bane, { selected: false, finished: true });
    const addedBaneSelectIndex = addedBanesClone.findIndex((bane: BanesAndBoonsInfo) => bane.id === previousRankBane.id);
    const addedBaneCancelIndex = addedBanesClone.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.id);
    if (action.event === 'select') {
      if (addedBaneSelectIndex !== -1) addedBanesClone[addedBaneSelectIndex] = action.bane;
      if (!action.bane.finished)
        totalPointRankBanes = totalPointRankBanes + (action.bane.points - previousRankBane.points);
      switch (action.bane.category) {
        case 'General':
          gBanes[action.bane.id] = nextRankBane;
          gBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = gBanes[action.bane.id];
          delete gBanes[action.bane.id];
          break;
        case 'Class':
          cBanes[action.bane.id] = nextRankBane;
          cBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = cBanes[action.bane.id];
          delete cBanes[action.bane.id];
          break;
        case 'Race':
          rBanes[action.bane.id] = nextRankBane;
          cBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = cBanes[action.bane.id];
          delete cBanes[action.bane.id];
          break;
        case 'Faction':
          fBanes[action.bane.id] = nextRankBane;
          fBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.rank]] = fBanes[action.bane.id];
          delete fBanes[action.bane.id];
          break;
      }
    }
    if (action.event === 'cancel') {
      if (addedBaneCancelIndex !== -1) addedBanesClone[addedBaneCancelIndex] = previousRankBane;
      if (!action.bane.finished)
        totalPointRankBanes = totalPointRankBanes - (action.bane.points - previousRankBane.points);
      switch (action.bane.category) {
        case 'General':
          gBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.id]] = action.bane;
          gBanes[action.bane.id] = gBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.id]];
          delete gBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Class':
          cBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.id]] = action.bane;
          cBanes[action.bane.id] = cBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.id]];
          delete cBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Race':
          rBanes[action.bane.ranks[action.bane.rank + 1] || action.bane.id] = action.bane;
          rBanes[action.bane.id] = rBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.id]];
          delete rBanes[action.bane.ranks[action.bane.rank + 1]];
          break;
        case 'Faction':
          fBanes[action.bane.ranks[action.bane.rank + 1] || action.bane.id] = action.bane;
          fBanes[action.bane.id] = fBanes[action.bane.ranks[action.bane.rank + 1 || action.bane.id]];
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
    const firstRanksArr = allRanks.map((rankArray: Array<BanesAndBoonsInfo>) =>
      rankArray.find((rank: BanesAndBoonsInfo) => rank.rank === 0));
    const firstRanks: { [id: string]: BanesAndBoonsInfo } = {};
    firstRanksArr.forEach((trait: BanesAndBoonsInfo) => firstRanks[trait.id] = trait);
    const combinedRanksArr = allRanks.reduce((rank1: Array<BanesAndBoonsInfo>, rank2: Array<BanesAndBoonsInfo>) => rank1.concat(rank2));
    const combinedRanks: { [id: string]: BanesAndBoonsInfo } = {};
    combinedRanksArr.forEach((trait: BanesAndBoonsInfo) => combinedRanks[trait.id] = trait);

    // Exclusive traits
    interface ExclusiveInfo {
      ids: Array<string>,
      minRequired: number,
      maxAllowed: number
    }
    const allExclusiveTraits: { [id: string]: BanesAndBoonsInfo } = {};
     exclusives.map((exclusiveArray: ExclusiveInfo, index: number) =>
      exclusiveArray.ids.map((exclusive: string) =>
      Object.assign({}, allTraits.find((trait: BanesAndBoonsInfo) => trait.id === exclusive),
      {
        exclusivityGroup: exclusiveArray.ids.map((exclusive: string) => traits[exclusive]),
        minRequired: exclusiveArray.minRequired,
        maxAllowed: exclusiveArray.maxAllowed,
      }))).reduce((a: Array<ExclusiveInfo>, b: Array<ExclusiveInfo>) => a.concat(b))
      .forEach((exclusive: BanesAndBoonsInfo) => allExclusiveTraits[exclusive.id] = exclusive);

    // Getting all the non-general traits
    const allClassTraits = Object.keys(playerClasses).map((playerClass) => {
      const optional = playerClasses[playerClass] && playerClasses[playerClass].optional ?
        playerClasses[playerClass].optional.map((pcId: string) => traits[pcId]) : [];
      const required = playerClasses[playerClass] && playerClasses[playerClass].required ?
        playerClasses[playerClass].required.map((pcId: string) => traits[pcId]) : [];
      return Object.assign({}, { optional: optional, required: required });
    });
    const allRaceTraits = Object.keys(races).map((race) => {
      const optional = races[race] && races[race].optional ?
        races[race].optional.map((rId: string) => traits[rId]) : [];
      const required = races[race] && races[race].required ?
        races[race].required.map((rId: string) => traits[rId]): [];
      return Object.assign({}, { optional: optional, required: required });
    });
    const allFactionTraits = Object.keys(factions).map((faction) => {
      const optional = factions[faction] && factions[faction].optional ?
       factions[faction].optional.map((fId: string) => traits[fId]) : [];
      const required = factions[faction] && factions[faction].required ?
       factions[faction].required.map((fId: string) => traits[fId]) : [];
      return Object.assign({}, { optional: optional, required: required });
    });
    const playerClassTraits = allClassTraits[Object.keys(playerClasses).indexOf(playerClass)];
    const factionTraits = allFactionTraits[Object.keys(factions).indexOf(faction)];
    const raceTraits = allRaceTraits[Object.keys(races).indexOf(race)];

    // Required traits
    const requiredBoons = [
      ...playerClassTraits && playerClassTraits.required ?
        playerClassTraits.required.filter((trait: BanesAndBoonsInfo) => trait.points >= 1) : [],
      ...factionTraits && factionTraits.required ?
        factionTraits.required.filter((trait: BanesAndBoonsInfo) => trait.points >= 1) : [],
      ...raceTraits && raceTraits.required ?
        raceTraits.required.filter((trait: BanesAndBoonsInfo) => trait.points >= 1) : []
    ].map((boon) => Object.assign({}, boon, { required: true }));
    const requiredBanes = [
      ...playerClassTraits && playerClassTraits.required ?
        playerClassTraits.required.filter((trait: BanesAndBoonsInfo) => trait.points <= -1) : [],
      ...factionTraits && factionTraits.required ?
        factionTraits.required.filter((trait: BanesAndBoonsInfo) => trait.points <= -1) : [],
      ...raceTraits && raceTraits.required ?
        raceTraits.required.filter((trait: BanesAndBoonsInfo) => trait.points <= -1) : []
    ].map((bane) => Object.assign({}, bane, { required: true }));

    // Player class traits
    const playerClassBoons: { [boonId: string]: BanesAndBoonsInfo } = {}
    playerClassTraits && playerClassTraits.optional &&
     [...playerClassTraits.optional.filter((trait: BanesAndBoonsInfo) =>  trait.points >= 1 && !combinedRanks[trait.id]) || [],
      ...playerClassTraits.optional.find((trait: BanesAndBoonsInfo) => firstRanks[trait.id] && trait.points >= 1) || []
     ].map((boon: BanesAndBoonsInfo) => playerClassBoons[boon.id] = Object.assign({}, boon, { category: 'Class', selected: false }));
    const playerClassBanes: { [baneId: string]: BanesAndBoonsInfo } = {};
    playerClassTraits && playerClassTraits.optional &&
     [...playerClassTraits.optional.filter((trait: BanesAndBoonsInfo) => trait.points <= -1 && !combinedRanks[trait.id]) || [],
      ...playerClassTraits.optional.find((trait: BanesAndBoonsInfo) => firstRanks[trait.id] && trait.points <= -1) || []
     ].map((bane: BanesAndBoonsInfo) => playerClassBanes[bane.id] = Object.assign({}, bane, { category: 'Class', selected: false }));

      // Faction traits
    const factionBoons: { [boonId: string]: BanesAndBoonsInfo } = {};
    factionTraits && factionTraits.optional && 
    [...factionTraits.optional.filter((trait: BanesAndBoonsInfo) => trait.points >= 1 && !combinedRanks[trait.id]) || [],
     ...factionTraits.optional.find((trait: BanesAndBoonsInfo) => firstRanks[trait.id] && trait.points >= 1) || []
    ].map((boon: BanesAndBoonsInfo) => factionBoons[boon.id] = Object.assign({}, boon, { category: 'Faction', selected: false }))
    const factionBanes: { [baneId: string]: BanesAndBoonsInfo } = {};
    factionTraits && factionTraits.optional &&
    [...factionTraits.optional.filter((trait: BanesAndBoonsInfo) => trait.points <= -1 && !combinedRanks[trait.id]) || [],
      ...factionTraits.optional.find((trait: BanesAndBoonsInfo) => firstRanks[trait.id] && trait.points <= -1) || []
    ].map((bane: BanesAndBoonsInfo) => factionBanes[bane.id] = Object.assign({}, bane, { category: 'Faction', selected: false }))

    // Race traits
    const raceBoons: { [boonId: string]: BanesAndBoonsInfo } = {};
    raceTraits && raceTraits.optional &&
     [...raceTraits.optional.filter((trait: BanesAndBoonsInfo) => trait.points >= 1 && !combinedRanks[trait.id]) || [],
      ...raceTraits.optional.find((trait: BanesAndBoonsInfo) => firstRanks[trait.id] && trait.points >= 1) || []
     ].map((boon: BanesAndBoonsInfo) => raceBoons[boon.id] = Object.assign({}, boon, { category: 'Race', selected: false }))
    const raceBanes: { [baneId: string]: BanesAndBoonsInfo } = {}
    raceTraits && raceTraits.optional &&
     [...raceTraits.optional.filter((trait: BanesAndBoonsInfo) => trait.points <= -1 && !combinedRanks[trait.id]) || [],
      ...raceTraits.optional.find((trait: BanesAndBoonsInfo) => firstRanks[trait.id] && trait.points <= -1) || []
     ].map((bane: BanesAndBoonsInfo) => raceBanes[bane.id] = Object.assign({}, bane, { category: 'Race', selected: false }))

    // General
    const undesirableTraits: { [id: string]: BanesAndBoonsInfo } = {};
    [
      ...allClassTraits.map((playerClass) => [...playerClass.optional, ...playerClass.required]).reduce((a, b) => a.concat(b)),
      ...allRaceTraits.map((race) => [...race.optional, ...race.required]).reduce((a, b) => a.concat(b)),
      ...allFactionTraits.map((faction) => [...faction.optional, ...faction.required]).reduce((a, b) => a.concat(b))
    ].forEach((trait: BanesAndBoonsInfo) => undesirableTraits[trait.id] = trait);
    // Finding the Banes & Boons from the undesirableTraits
    const generalBoons: { [boonId: string]: BanesAndBoonsInfo } = {};
    [
      ...allTraits.filter((trait: BanesAndBoonsInfo) => !combinedRanks[trait.id] && !undesirableTraits[trait.id] && trait.points >= 1) || [],
      ...firstRanksArr.filter((rank: BanesAndBoonsInfo) => !undesirableTraits[rank.id] && rank.points >= 1) || []
    ].map((boon: BanesAndBoonsInfo) => generalBoons[boon.id] = Object.assign({}, boon, { category: 'General', selected: false }))
    const generalBanes: { [baneId: string]: BanesAndBoonsInfo } = {};
    [
      ...allTraits.filter((trait: BanesAndBoonsInfo) => !combinedRanks[trait.id] && !undesirableTraits[trait.id] && trait.points <= -1) || [],
      ...firstRanksArr.filter((rank: BanesAndBoonsInfo) => !undesirableTraits[rank.id] && rank.points <= -1) || []
    ].map((bane: BanesAndBoonsInfo) => generalBanes[bane.id] = Object.assign({}, bane, { category: 'General', selected: false }))

    // Total points
    const totalPoints = (requiredBoons.length > 0 && requiredBoons.map((boon) => boon.points).reduce((a, b) => a + b)) +
      (requiredBanes.length > 0 && requiredBanes.map((bane) => bane.points).reduce((a, b) => a + b));

    // Prerequisite traits
    const allTraitsWithPrerequisites = allTraits.filter((trait: BanesAndBoonsInfo) => trait.prerequisites);
    const allPrerequisites: { [id: string]: BanesAndBoonsInfo } = {};
     allTraitsWithPrerequisites.filter((t: BanesAndBoonsInfo) => t.prerequisites.filter((preReq) => traits[preReq]).length !== 0)
     .forEach((boon: BanesAndBoonsInfo) => boon.prerequisites.forEach((preReq) => allPrerequisites[preReq] = traits[preReq]))

    return Object.assign({}, state, {
      initial: false,
      addedBoons: [...requiredBoons, ...Array(5 - requiredBoons.length).fill(emptyBaneOrBoon)],
      addedBanes: [...requiredBanes, ...Array(5 - requiredBanes.length).fill(emptyBaneOrBoon)],
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
      allRanks: combinedRanks,
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
