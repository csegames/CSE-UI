export interface BanesAndBoonsInfo {
  name: string,
  description: string,
  points: number,
  icon: string,
  required: boolean
}

export interface AddedBaneOrBoonInfo {
  empty: boolean,
  name: string,
  description: string,
  points: number,
  icon: string,
  required: boolean
}

export interface BanesAndBoonsState {
  addedBanes: Array<AddedBaneOrBoonInfo>,
  addedBoons: Array<AddedBaneOrBoonInfo>
}

const ON_SELECT_BANE = 'ON_SELECT_BANE';
const ON_SELECT_BOON = 'ON_SELECT_BOON';

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

const emptyBaneOrBoon = {
  empty: true,
  name: '',
  description: '',
  points: 0,
  icon: '',
  required: false
};

const initialState: BanesAndBoonsState = {
  addedBanes: Array(10).fill(emptyBaneOrBoon),
  addedBoons: Array(10).fill(emptyBaneOrBoon)
};

export default function reducer(state: BanesAndBoonsState = initialState, action: any = {}) {
   switch(action.type) {
     case ON_SELECT_BANE:
       let updatedBanes = false;
       let addedBanes = state.addedBanes.map((bane) => {
         console.log(state.addedBanes);
         if (bane.empty && !updatedBanes) {
           updatedBanes = true;
           return action.bane;
         } else {
           return bane;
         }
       });
       return Object.assign({}, state, {
         addedBanes: addedBanes
       });
     case ON_SELECT_BOON:
       let updatedBoons = false;
       let addedBoons = state.addedBoons.map((boon) => {
         console.log(state.addedBoons);
         if (boon.empty && !updatedBoons) {
           updatedBoons = true;
           return action.boon;
         } else {
           return boon;
         }
       });
       return Object.assign({}, state, {
         addedBoons: addedBoons
       });
     default: return state;
   }
}
