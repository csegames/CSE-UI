import { fetchJSON } from '../../../../lib/fetchHelpers';
import ResponseError from '../../../../lib/ResponseError';
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
  rank: any;
  ranks: Array<string>;
  exclusivityGroup: number;
  minRequired: number;
  maxAllowed: number;
}

export interface BanesAndBoonsState {
  initial: boolean;
  totalPoints: number;
  addedBanes: Array<BanesAndBoonsInfo>;
  addedBoons: Array<BanesAndBoonsInfo>;
  generalBoons: Array<BanesAndBoonsInfo>;
  playerClassBoons: Array<BanesAndBoonsInfo>;
  raceBoons: Array<BanesAndBoonsInfo>;
  factionBoons: Array<BanesAndBoonsInfo>;
  generalBanes: Array<BanesAndBoonsInfo>;
  playerClassBanes: Array<BanesAndBoonsInfo>;
  raceBanes: Array<BanesAndBoonsInfo>;
  factionBanes: Array<BanesAndBoonsInfo>;
  allPrerequisites: Array<BanesAndBoonsInfo>;
  allRanks: Array<BanesAndBoonsInfo>;
  allExclusives: Array<BanesAndBoonsInfo>;
}

const ON_SELECT_BANE = 'cu-character-creation/banes-and-boons/ON_SELECT_BANE';
const ON_SELECT_BOON = 'cu-character-creation/banes-and-boons/ON_SELECT_BOON';
const ON_CANCEL_BANE = 'cu-character-creation/banes-and-boons/ON_CANCEL_BANE';
const ON_CANCEL_BOON = 'cu-character-creation/banes-and-boons/ON_CANCEL_BOON';
const ON_UPDATE_GENERAL_BOONS ='cu-character-creation/banes-and-boons/ON_UPDATE_GENERAL_BOONS';
const ON_UPDATE_PLAYER_CLASS_BOONS = 'cu-character-creation/banes-and-boons/ON_UPDATE_PLAYER_CLASS_BOONS';
const ON_UPDATE_RACE_BOONS ='cu-character-creation/banes-and-boons/ON_UPDATE_RACE_BOONS';
const ON_UPDATE_FACTION_BOONS ='cu-character-creation/banes-and-boons/ON_UPDATE_FACTION_BOONS';
const ON_UPDATE_GENERAL_BANES ='cu-character-creation/banes-and-boons/ON_UPDATE_GENERAL_BANES';
const ON_UPDATE_PLAYER_CLASS_BANES ='cu-character-creation/banes-and-boons/ON_UPDATE_PLAYER_CLASS_BANES';
const ON_UPDATE_RACE_BANES ='cu-character-creation/banes-and-boons/ON_UPDATE_RACE_BANES';
const ON_UPDATE_FACTION_BANES ='cu-character-creation/banes-and-boons/ON_UPDATE_FACTION_BANES';
const ON_UPDATE_RANK_BOONS = 'cu-character-creeation/banes-and-boons/ON_UPDATE_RANK_BOONS';
const ON_UPDATE_RANK_BANES = 'cu-character-creation/banes-and-boons/ON_UPDATE_RANK_BANES';
const ON_INITIALIZE_TRAITS = 'cu-character-creation/banes-and-boons/ON_INITIALIZE_TRAITS';
const ON_RESET_BANES_AND_BOONS = 'cu-character-creation/banes-and-boons/ON_RESET_BANES_AND_BOONS';

export const onSelectBane = (bane: BanesAndBoonsInfo) => {
  return {
    type: ON_SELECT_BANE,
    bane: bane
  }
};

export const onSelectBoon = (boon: BanesAndBoonsInfo) => {
  return {
    type: ON_SELECT_BOON,
    boon: boon
  }
};

export const onCancelBaneClick = (bane: BanesAndBoonsInfo) => {
  return {
    type: ON_CANCEL_BANE,
    bane: bane
  }
};

export const onCancelBoonClick = (boon: BanesAndBoonsInfo) => {
  return {
    type: ON_CANCEL_BOON,
    boon: boon
  }
};

export const onUpdateGeneralBoons = (event: 'select' | 'cancel', boon: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_GENERAL_BOONS,
    event: event,
    boon: boon
  }
};

export const onUpdatePlayerClassBoons = (event: 'select' | 'cancel', boon: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_PLAYER_CLASS_BOONS,
    event: event,
    boon: boon
  }
};

export const onUpdateRaceBoons = (event: 'select' | 'cancel', boon: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_RACE_BOONS,
    event: event,
    boon: boon
  }
};

export const onUpdateFactionBoons = (event: 'select' | 'cancel', boon: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_FACTION_BOONS,
    event: event,
    boon: boon
  }
};

export const onUpdateGeneralBanes = (event: 'select' | 'cancel', bane: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_GENERAL_BANES,
    event: event,
    bane: bane
  }
};

export const onUpdatePlayerClassBanes = (event: 'select' | 'cancel', bane: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_PLAYER_CLASS_BANES,
    event: event,
    bane: bane
  }
};

export const onUpdateRaceBanes = (event: 'select' | 'cancel', bane: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_RACE_BANES,
    event: event,
    bane: bane
  }
};

export const onUpdateFactionBanes = (event: 'select' | 'cancel', bane: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_FACTION_BANES,
    event: event,
    bane: bane
  }
};

export const onInitializeTraits = (payload: { playerClass: string, faction: string, race: string, banesAndBoons: Array<BanesAndBoonsInfo> }) => {
  return {
    type: ON_INITIALIZE_TRAITS,
    playerClass: payload.playerClass,
    faction: payload.faction,
    race: payload.race,
    banesAndBoons: payload.banesAndBoons
  }
};

export const onUpdateRankBoons = (event: 'select' | 'cancel', boon: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_RANK_BOONS,
    event: event,
    boon: boon
  }
};

export const onUpdateRankBanes = (event: 'select' | 'cancel', bane: BanesAndBoonsInfo) => {
  return {
    type: ON_UPDATE_RANK_BANES,
    event: event,
    bane: bane
  }
};

export const resetBanesAndBoons = () => {
  return {
    type: ON_RESET_BANES_AND_BOONS
  }
};

export const fetchTraits = (payload: { playerClass: string, race: string, faction: string }, apiUrl: string = 'https://api.camelotunchained.com/') => {
  return (dispatch: (action: any) => any) => {
    return fetchJSON(`${apiUrl}v1/traits?shardID=1`)
      .then((traits: Array<BanesAndBoonsInfo>) => dispatch(onInitializeTraits({
        playerClass: payload.playerClass,
        race: payload.race,
        faction: payload.faction,
        banesAndBoons: traits
      })))
      .catch((err: ResponseError) => dispatch(onInitializeTraits({
        playerClass: payload.playerClass,
        race: payload.race,
        faction: payload.faction,
        banesAndBoons: traitsExampleResponse
      }))); // TODO: Handle not finding anything
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

const initialState: BanesAndBoonsState = {
  initial: true,
  totalPoints: 0,
  addedBanes: Array(5).fill(emptyBaneOrBoon),
  addedBoons: Array(5).fill(emptyBaneOrBoon),
  generalBoons: [],
  playerClassBoons: [],
  raceBoons: [],
  factionBoons: [],
  generalBanes: [],
  playerClassBanes: [],
  raceBanes: [],
  factionBanes: [],
  allPrerequisites: [],
  allRanks: [],
  allExclusives: []
};

export default function reducer(state: BanesAndBoonsState = initialState, action: any = {}) {
   switch(action.type) {
     case ON_SELECT_BANE:
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

     case ON_SELECT_BOON:
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

     case ON_CANCEL_BANE:
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

     case ON_CANCEL_BOON:
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

     case ON_UPDATE_GENERAL_BOONS:
       let generalBoonsClone = state.generalBoons;
       const indexOfGeneralBoon = generalBoonsClone.findIndex((boon) => boon.id === action.boon.id);
       if (action.event === 'select') {
         generalBoonsClone[indexOfGeneralBoon] = Object.assign({}, action.boon, { selected: true });
         return Object.assign({}, state, { generalBoons: generalBoonsClone });
       }
       generalBoonsClone[indexOfGeneralBoon] = Object.assign({}, action.boon, { selected: false });
       return Object.assign({}, state, { generalBoons: generalBoonsClone });

     case ON_UPDATE_PLAYER_CLASS_BOONS:
       let playerClassBoonsClone = state.playerClassBoons;
       const indexOfPlayerClassBoon = playerClassBoonsClone.findIndex((boon) => boon.id === action.boon.id);
       if (action.event === 'select') {
         playerClassBoonsClone[indexOfPlayerClassBoon] = Object.assign({}, action.boon, { selected: true });
         return Object.assign({}, state, { playerClassBoons: playerClassBoonsClone });
       }
       playerClassBoonsClone[indexOfPlayerClassBoon] = Object.assign({}, action.boon, { selected: false });
       return Object.assign({}, state, { playerClassBoons: playerClassBoonsClone });

     case ON_UPDATE_RACE_BOONS:
       let raceBoonsClone = state.raceBoons;
       const indexOfRaceBoon = raceBoonsClone.findIndex((boon) => boon.id === action.boon.id);
       if (action.event === 'select') {
         raceBoonsClone[indexOfRaceBoon] = Object.assign({}, action.boon, { selected: true });
         return Object.assign({}, state, { raceBoons: raceBoonsClone });
       }
       raceBoonsClone[indexOfRaceBoon] = Object.assign({}, action.boon, { selected: false });
       return Object.assign({}, state, { raceBoons: raceBoonsClone });

     case ON_UPDATE_FACTION_BOONS:
       let factionBoonsClone = state.factionBoons;
       const indexOfFactionBoon = factionBoonsClone.findIndex((boon) => boon.id === action.boon.id);
       if (action.event === 'select') {
         factionBoonsClone[indexOfFactionBoon] = Object.assign({}, action.boon, { selected: true });
         return Object.assign({}, state, { factionBoons: factionBoonsClone });
       }
       factionBoonsClone[indexOfFactionBoon] = Object.assign({}, action.boon, { selected: false });
       return Object.assign({}, state, { factionBoons: factionBoonsClone });

     case ON_UPDATE_GENERAL_BANES:
       let generalBanesClone = state.generalBanes;
       const indexOfGeneralBane = generalBanesClone.findIndex((bane) => bane.id === action.bane.id);
       if (action.event === 'select') {
         generalBanesClone[indexOfGeneralBane] = Object.assign({}, action.bane, { selected: true });
         return Object.assign({}, state, { generalBanes: generalBanesClone });
       }
       generalBanesClone[indexOfGeneralBane] = Object.assign({}, action.bane, { selected: false });
       return Object.assign({}, state, { generalBanes: generalBanesClone });

     case ON_UPDATE_PLAYER_CLASS_BANES:
       let playerClassBanesClone = state.playerClassBanes;
       const indexOfPlayerClassBane = playerClassBanesClone.findIndex((bane) => bane.id === action.bane.id);
       if (action.event === 'select') {
         playerClassBanesClone[indexOfPlayerClassBane] = Object.assign({}, action.bane, { selected: true });
         return Object.assign({}, state, { playerClassBanes: playerClassBanesClone });
       }
       playerClassBanesClone[indexOfPlayerClassBane] = Object.assign({}, action.bane, { selected: false });
       return Object.assign({}, state, { playerClassBanes: playerClassBanesClone });

     case ON_UPDATE_RACE_BANES:
       let raceBanesClone = state.raceBanes;
       const indexOfRaceBane = raceBanesClone.findIndex((bane) => bane.id === action.bane.id);
       if (action.event === 'select') {
         raceBanesClone[indexOfRaceBane] = Object.assign({}, action.bane, { selected: true });
         return Object.assign({}, state, { raceBanes: raceBanesClone });
       }
       raceBanesClone[indexOfRaceBane] = Object.assign({}, action.bane, { selected: false });
       return Object.assign({}, state, { raceBanes: raceBanesClone });

     case ON_UPDATE_FACTION_BANES:
       let factionBanesClone = state.factionBanes;
       const indexOfFactionBane = factionBanesClone.findIndex((bane) => bane.id === action.bane.id);
       if (action.event === 'select') {
         factionBanesClone[indexOfFactionBane] = Object.assign({}, action.bane, { selected: true });
         return Object.assign({}, state, { factionBanes: factionBanesClone });
       }
       factionBanesClone[indexOfFactionBane] = Object.assign({}, action.bane, { selected: false });
       return Object.assign({}, state, { factionBanes: factionBanesClone });

     case ON_UPDATE_RANK_BOONS:
       let gBoons = state.generalBoons;
       let cBoons = state.playerClassBoons;
       let rBoons = state.raceBoons;
       let fBoons = state.factionBoons;
       let addedBoonsClone = state.addedBoons;
       let totalPointRankBoons = state.totalPoints;
       const nextRankBoon = action.boon.ranks[action.boon.rank + 1] ? Object.assign({},
         state.allRanks.find((boon: BanesAndBoonsInfo) => boon.id === action.boon.ranks[action.boon.rank + 1]),
         {
           rank: action.boon.rank + 1,
           ranks: action.boon.ranks,
           category: action.boon.category,
           selected: true
         }) : Object.assign({}, action.boon, { selected: true, finished: true });
       const previousRankBoon = action.boon.ranks[action.boon.rank - 1] ? Object.assign({},
          state.allRanks.find((boon: BanesAndBoonsInfo) => boon.id === action.boon.ranks[action.boon.rank - 1]),
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
             gBoons[gBoons.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.id)] = nextRankBoon;
           case 'Class':
             cBoons[cBoons.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.id)] = nextRankBoon;
           case 'Race':
             rBoons[rBoons.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.id)] = nextRankBoon;
           case 'Faction':
             fBoons[fBoons.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.id)] = nextRankBoon;
         }
       }
       if (action.event === 'cancel') {
         if (addedBoonCancelIndex !== -1) addedBoonsClone[addedBoonCancelIndex] = previousRankBoon;
         if (!action.boon.finished)
           totalPointRankBoons = totalPointRankBoons - (action.boon.points - previousRankBoon.points);
         switch (action.boon.category) {
           case 'General':
             gBoons[gBoons.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.ranks[action.boon.rank + 1])] = action.boon;
           case 'Class':
             cBoons[cBoons.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.ranks[action.boon.rank + 1])] = action.boon;
           case 'Race':
             rBoons[rBoons.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.ranks[action.boon.rank + 1])] = action.boon;
           case 'Faction':
             fBoons[fBoons.findIndex((boon: BanesAndBoonsInfo) => boon.id === action.boon.ranks[action.boon.rank + 1])] = action.boon;
         }
       } else if (action.event === 'cancel') {
         addedBoonsClone = addedBoonsClone.filter((boon: BanesAndBoonsInfo) => boon.id !== action.boon.id);
       }
       return Object.assign({}, state, {
         addedBoons: addedBoonsClone,
         generalBoons: gBoons,
         classBoons: cBoons,
         raceBoons: rBoons,
         factionBoons: fBoons,
         totalPoints: totalPointRankBoons
       });

     case ON_UPDATE_RANK_BANES:
       let gBanes = state.generalBanes;
       let cBanes = state.playerClassBanes;
       let rBanes = state.raceBanes;
       let fBanes = state.factionBanes;
       let addedBanesClone = state.addedBanes;
       let totalPointRankBanes = state.totalPoints;
       const nextRankBane = action.bane.ranks[action.bane.rank + 1] ? Object.assign({},
           state.allRanks.find((bane: BanesAndBoonsInfo) => bane.id === action.bane.ranks[action.bane.rank + 1]),
           {
             rank: action.bane.rank + 1,
             ranks: action.bane.ranks,
             category: action.bane.category,
             selected: true
           }) : Object.assign({}, action.bane, { selected: true, finished: true });
       const previousRankBane = action.bane.ranks[action.bane.rank - 1] ? Object.assign({},
           state.allRanks.find((bane: BanesAndBoonsInfo) => bane.id === action.bane.ranks[action.bane.rank - 1]),
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
             gBanes[gBanes.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.id)] = nextRankBane;
           case 'Class':
             cBanes[cBanes.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.id)] = nextRankBane;
           case 'Race':
             rBanes[rBanes.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.id)] = nextRankBane;
           case 'Faction':
             fBanes[fBanes.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.id)] = nextRankBane;
         }
       }
       if (action.event === 'cancel') {
         if (addedBaneCancelIndex !== -1) addedBanesClone[addedBaneCancelIndex] = previousRankBane;
         if (!action.bane.finished)
           totalPointRankBanes = totalPointRankBanes - (action.bane.points - previousRankBane.points);
         switch (action.bane.category) {
           case 'General':
             gBanes[gBanes.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.ranks[action.bane.rank + 1])] = action.bane;
           case 'Class':
             cBanes[cBanes.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.ranks[action.bane.rank + 1])] = action.bane;
           case 'Race':
             rBanes[rBanes.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.ranks[action.bane.rank + 1])] = action.bane;
           case 'Faction':
             fBanes[fBanes.findIndex((bane: BanesAndBoonsInfo) => bane.id === action.bane.ranks[action.bane.rank + 1])] = action.bane;
         }
       } else if (action.event === 'cancel') {
         addedBanesClone = addedBanesClone.filter((bane: BanesAndBoonsInfo) => bane.id !== action.bane.id);
       }
       return Object.assign({}, state, {
         addedBanes: addedBanesClone,
         generalBanes: gBanes,
         classBanes: cBanes,
         raceBanes: rBanes,
         factionBanes: fBanes,
         totalPoints: totalPointRankBanes
       });

     case ON_INITIALIZE_TRAITS:
       const { playerClass, faction, race, banesAndBoons } = action;
       /* !!To test ranks, exclusivity, and prerequisites: Uncomment the line below and comment the banesAndBoons variable above!! */
       // let banesAndBoons = traitsExampleResponse;
       const playerClasses = banesAndBoons.classes;
       const factions = banesAndBoons.factions;
       const races = banesAndBoons.races;
       const ranks = banesAndBoons.ranks;
       const exclusives = banesAndBoons.exclusivity;
       const allTraits = banesAndBoons.traits;

       // Rank traits
       const allRanks = ranks.map((rankArray: Array<string>) =>
         rankArray.map((rankId: string, i: number) =>
           Object.assign({},
             allTraits.find((trait: BanesAndBoonsInfo) => trait.id === rankId),
             {
               rank: i,
               ranks: rankArray
             }
           )
         ));
       const firstRanks = allRanks.map((rankArray: Array<BanesAndBoonsInfo>) =>
         rankArray.find((rank: BanesAndBoonsInfo) => rank.rank === 0));
       const combinedRanks = allRanks.reduce((rank1: Array<BanesAndBoonsInfo>, rank2: Array<BanesAndBoonsInfo>) => rank1.concat(rank2));

       // Exclusive traits
       interface ExclusiveInfo {
         ids: Array<string>,
         minRequired: number,
         maxAllowed: number
       }
       const allExclusiveTraits = exclusives.map((exclusiveArray: ExclusiveInfo, index: number) =>
         exclusiveArray.ids.map((exclusive: string) =>
         Object.assign({}, allTraits.find((trait: BanesAndBoonsInfo) => trait.id === exclusive),
         {
           exclusivityGroup: index,
           minRequired: exclusiveArray.minRequired,
           maxAllowed: exclusiveArray.maxAllowed,
         }))).reduce((a: Array<ExclusiveInfo>, b: Array<ExclusiveInfo>) => a.concat(b));

       // Getting all the non-general traits
       const allClassTraits = Object.keys(playerClasses).map((playerClass) => {
         const optional = playerClasses[playerClass] && playerClasses[playerClass].optional ?
           allTraits.filter((trait: BanesAndBoonsInfo) => playerClasses[playerClass].optional
             .filter((optTrait: string) => trait.id === optTrait).length !== 0) : [];
         const required = playerClasses[playerClass] && playerClasses[playerClass].required ?
           allTraits.filter((trait: BanesAndBoonsInfo) => playerClasses[playerClass].required
             .filter((reqTrait: string) => trait.id === reqTrait).length !== 0) : [];
         return Object.assign({}, { optional: optional, required: required });
       });

       const allRaceTraits = Object.keys(races).map((race) => {
         const optional = races[race] && races[race].optional ?
           allTraits.filter((trait: BanesAndBoonsInfo) => races[race].optional
             .filter((optTrait: string) => trait.id === optTrait).length !== 0) : [];
         const required = races[race] && races[race].required ?
           allTraits.filter((trait: BanesAndBoonsInfo) => races[race].required
             .filter((reqTrait: string) => trait.id === reqTrait).length !== 0) : [];
         return Object.assign({}, { optional: optional, required: required });
       });

       const allFactionTraits = Object.keys(factions).map((faction) => {
         const optional = factions[faction] && factions[faction].optional ?
           allTraits.filter((trait: BanesAndBoonsInfo) => factions[faction].optional
             .filter((optTrait: string) => trait.id === optTrait).length !== 0) : [];
         const required = factions[faction] && factions[faction].required ?
           allTraits.filter((trait: BanesAndBoonsInfo) => factions[faction].required
             .filter((reqTrait: string) => trait.id === reqTrait).length !== 0) : [];
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
       const playerClassBoons = playerClassTraits && playerClassTraits.optional ? [...playerClassTraits.optional
         .filter((trait: BanesAndBoonsInfo) => trait.points >= 1 &&
         !combinedRanks.find((rank: BanesAndBoonsInfo) => trait.id === rank.id)),
           ...firstRanks.filter((rank: BanesAndBoonsInfo) =>
             playerClassTraits.optional.find((trait: BanesAndBoonsInfo) => trait.id === rank.id && trait.points >= 1))
         ].map((boon: BanesAndBoonsInfo) => Object.assign({}, boon, { category: 'Class', selected: false })) : [];

       const playerClassBanes = playerClassTraits && playerClassTraits.optional ? [...playerClassTraits.optional
         .filter((trait: BanesAndBoonsInfo) => trait.points <= -1 &&
         !combinedRanks.find((rank: BanesAndBoonsInfo) => trait.id === rank.id)),
           ...firstRanks.filter((rank: BanesAndBoonsInfo) =>
             playerClassTraits.optional.find((trait: BanesAndBoonsInfo) => trait.id === rank.id && trait.points <= -1))
         ].map((bane: BanesAndBoonsInfo) => Object.assign({}, bane, { category: 'Class', selected: false })) : [];

       // Race traits
       const raceBoons = raceTraits && raceTraits.optional && [...raceTraits.optional
         .filter((trait: BanesAndBoonsInfo) => trait.points >= 1 &&
         !combinedRanks.find((rank: BanesAndBoonsInfo) => trait.id === rank.id)),
           ...firstRanks.filter((rank: BanesAndBoonsInfo) =>
           raceTraits.optional.find((trait: BanesAndBoonsInfo) => trait.id === rank.id && trait.points <= -1))
         ].map((boon: BanesAndBoonsInfo) => Object.assign({}, boon, { category: 'Race', selected: false }));

       const raceBanes = raceTraits && raceTraits.optional && [...raceTraits.optional
         .filter((trait: BanesAndBoonsInfo) => trait.points <= -1 &&
         !combinedRanks.find((rank: BanesAndBoonsInfo) => trait.id === rank.id)),
           ...firstRanks.filter((rank: BanesAndBoonsInfo) =>
           raceTraits.optional.find((trait: BanesAndBoonsInfo) => trait.id === rank.id && trait.points <= -1))
         ].map((bane: BanesAndBoonsInfo) => Object.assign({}, bane, { category: 'Race', selected: false }));

       // Faction traits
       const factionBoons = factionTraits && factionTraits.optional && [...factionTraits.optional
         .filter((trait: BanesAndBoonsInfo) => trait.points >= 1 &&
         !combinedRanks.find((rank: BanesAndBoonsInfo) => trait.id === rank.id)),
         ...firstRanks.filter((rank: BanesAndBoonsInfo) =>
           factionTraits.optional.find((trait: BanesAndBoonsInfo) => trait.id === rank.id && trait.points >= 1))
         ].map((boon: BanesAndBoonsInfo) => Object.assign({}, boon, { category: 'Faction', selected: false }));

       const factionBanes = factionTraits && factionTraits.optional && [...factionTraits.optional
         .filter((trait: BanesAndBoonsInfo) => trait.points <= -1 &&
         !combinedRanks.find((rank: BanesAndBoonsInfo) => trait.id === rank.id)),
           ...firstRanks.filter((rank: BanesAndBoonsInfo) =>
           factionTraits.optional.find((trait: BanesAndBoonsInfo) => trait.id === rank.id && trait.points <= -1))
         ].map((bane: BanesAndBoonsInfo) => Object.assign({}, bane, { category: 'Faction', selected: false }));

       // General
       const undesirableTraits = [
         ...allClassTraits.map((playerClass) => [...playerClass.optional, ...playerClass.required]).reduce((a, b) => a.concat(b)),
         ...allRaceTraits.map((race) => [...race.optional, ...race.required]).reduce((a, b) => a.concat(b)),
         ...allFactionTraits.map((faction) => [...faction.optional, ...faction.required]).reduce((a, b) => a.concat(b))
       ];

       // Finding the Banes & Boons from the undesirableTraits
       const generalBoons = [
         ...allTraits.filter((trait: BanesAndBoonsInfo) => {
           return !combinedRanks.find((rank: BanesAndBoonsInfo) => rank.id === trait.id) &&
             !undesirableTraits.find((usedBoon) => usedBoon.id === trait.id) &&
             trait.points >= 1;
         }),
         ...firstRanks.filter((rank: BanesAndBoonsInfo) =>
         !undesirableTraits.find((usedBoon) => usedBoon.id === rank.id) && rank.points >= 1)
       ].map((boon: BanesAndBoonsInfo) => Object.assign({}, boon, { category: 'General', selected: false }));

       const generalBanes = [
         ...allTraits.filter((trait: BanesAndBoonsInfo) => {
           return !combinedRanks.find((rank: BanesAndBoonsInfo) => rank.id === trait.id) &&
             !undesirableTraits.find((usedBane) => usedBane.id === trait.id) &&
             trait.points <= -1;
         }),
         ...firstRanks.filter((rank: BanesAndBoonsInfo) =>
         !undesirableTraits.find((usedBane) => usedBane.id === rank.id) && rank.points <= -1)
       ].map((bane: BanesAndBoonsInfo) => Object.assign({}, bane, { category: 'General', selected: false }));

       // Total points
       const totalPoints = (requiredBoons.length > 0 && requiredBoons.map((boon) => boon.points).reduce((a, b) => a + b)) +
         (requiredBanes.length > 0 && requiredBanes.map((bane) => bane.points).reduce((a, b) => a + b));

       // Prerequisite traits
       const allTraitsWithPrerequisites = allTraits.filter((trait: BanesAndBoonsInfo) => trait.prerequisites);
       const allPrerequisites = allTraits.filter((trait: BanesAndBoonsInfo) =>
       allTraitsWithPrerequisites.filter((t: BanesAndBoonsInfo) =>
         t.prerequisites.find((preReq) => preReq === trait.id)).length !== 0);

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
     case ON_RESET_BANES_AND_BOONS:
       return initialState;
     default: return state;
   }
}
