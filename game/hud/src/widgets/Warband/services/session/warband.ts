/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {client, GroupInvite, groupType, signalr, WarbandMember, events} from 'camelot-unchained';


const INITIALIZE_SIGNALR = 'hud/warband/INITIALIZE_SIGNALR';
const INITIALIZE_SIGNALR_SUCCESS = 'hud/warband/INITIALIZE_SIGNALR_SUCCESS';
const INITIALIZE_SIGNALR_FAILED = 'hud/warband/INITIALIZE_SIGNALR_FAILED';

/**
 * namespace in events we'll handle here from signalr
 */
const WARBAND_JOINED = `hud/warband/${signalr.WARBAND_EVENTS_JOINED}`;
const WARBAND_UPDATE = `hud/warband/${signalr.WARBAND_EVENTS_UPDATE}`;
const WARBAND_QUIT = `hud/warband/${signalr.WARBAND_EVENTS_QUIT}`;
const WARBAND_ABANDONED = `hud/warband/${signalr.WARBAND_EVENTS_ABANDONED}`;
const WARBAND_MEMBERJOINED = `hud/warband/${signalr.WARBAND_EVENTS_MEMBERJOINED}`;
const WARBAND_MEMBERUPDATE = `hud/warband/${signalr.WARBAND_EVENTS_MEMBERUPDATE}`;
const WARBAND_MEMBERREMOVED = `hud/warband/${signalr.WARBAND_EVENTS_MEMBERREMOVED}`;

export interface WarbandAction {
  type: string;
  error?: string;
  name?: string;
  id?: string;
  member?: WarbandMember;
}

/**
 * Helper methods
 */

function registerWarbandEvents(dispatch: (action: WarbandAction) => any) {
  events.on(signalr.WARBAND_EVENTS_JOINED, (info: {id: string, name: string}) => dispatch(warbandJoined(info.id, info.name)));
  events.on(signalr.WARBAND_EVENTS_UPDATE, (info: {id: string, name: string}) => dispatch(warbandJoined(info.id, info.name)));
  events.on(signalr.WARBAND_EVENTS_QUIT, () => dispatch(warbandQuit()));
  events.on(signalr.WARBAND_EVENTS_ABANDONED, () => dispatch(warbandAbandoned()));
  events.on(signalr.WARBAND_EVENTS_MEMBERJOINED, (member: WarbandMember) => dispatch(memberJoined(member)));
  events.on(signalr.WARBAND_EVENTS_MEMBERUPDATE, (member: WarbandMember) => dispatch(memberUpdate(member)));
  events.on(signalr.WARBAND_EVENTS_MEMBERREMOVED, (member: WarbandMember) => dispatch(memberRemoved(member)));
}

const systemMessage = (message: string) => events.fire('system', message);

/**
 * INTERNAL DISPATCH METHODS
 */

function initSignalR(): WarbandAction {
  return {
    type: INITIALIZE_SIGNALR
  }
}

function initSignalRSuccess(): WarbandAction {
  return {
    type: INITIALIZE_SIGNALR_SUCCESS
  }
}

function initSignalRFailed(): WarbandAction {
  return {
    type: INITIALIZE_SIGNALR_FAILED
  }
}

function warbandJoined(warbandID: string, warbandName: string = ''): WarbandAction {
  systemMessage(`You have joined ${warbandName.length > 0 ? `the ${warbandName}` : 'a' } warband.`);
  return {
    type: WARBAND_JOINED,
    id: warbandID,
    name: warbandName
  }
}

function warbandUpdate(warbandID: string, warbandName: string = ''): WarbandAction {
  systemMessage(`Your warband has been made ${warbandName.length > 0 ? `permanent and is now named ${warbandName}.` : 'temporary.'}`);
  return {
    type: WARBAND_UPDATE,
    id: warbandID,
    name: warbandName
  }
}

function warbandQuit(): WarbandAction {
  systemMessage('You have quit your warband.');
  return {
    type: WARBAND_QUIT
  }
}

function warbandAbandoned(): WarbandAction {
  systemMessage('You have abandonded your warband.');
  return {
    type: WARBAND_ABANDONED
  }
}

function memberJoined(member: WarbandMember): WarbandAction {
  systemMessage(`${member.name} has joined your warband.`);
  return {
    type: WARBAND_MEMBERJOINED,
    member: member
  }
}

function memberUpdate(member: WarbandMember): WarbandAction {
  return {
    type: WARBAND_MEMBERUPDATE,
    member: member
  }
}

function memberRemoved(member: WarbandMember): WarbandAction {
  systemMessage(`${member.name} as left your warband.`);
  return {
    type: WARBAND_MEMBERREMOVED,
    member: member
  }
}


/**
 * EXTERNAL DISPATCH METHODS
 */

export function initializeSignalR() {
  return (dispatch: (action: WarbandAction) => any) => {
    dispatch(initSignalR());

    initializeSignalR();

    signalr.initializeSignalRHubs({
      name: signalr.WARBANDS_HUB,
      callback: (succeeded: boolean) => {
        if (succeeded) {
          dispatch(initSignalRSuccess());
          registerWarbandEvents(dispatch);
        } else {
          dispatch(initSignalRFailed());
        }
      }
    });
  }
}

export interface WarbandState {
  isInitializing: boolean;
  signalRInitialized: boolean;
  locked?: boolean;
  activeMembers?: WarbandMember[];
  permanentMembers?: WarbandMember[];
  name?: string;
  warbandID?: string;
}

const initialState = {
  isInitializing: false,
  signalRInitialized: false,
  locked: true,
}

/**
 * State Helpers
 */

function clone<T>(obj: T): T {
  return Object.assign({}, obj);
}

function addOrUpdateMember(state: WarbandState, member: WarbandMember): WarbandState {
  // check if member exists
  let index = -1;
  for (let i = 0; i < state.activeMembers.length; ++i) {
    const member = state.activeMembers[i];
    if (member.characterID == member.characterID) {
      index = i;
    }
  }
  
  if (index >= 0) {
    // update existing
    state.activeMembers[index] = member;
  } else {
    state.activeMembers.push(member);
  }

  return state;
}

function removeMember(state: WarbandState, member: WarbandMember): WarbandState {
  // check if member exists
  let index = -1;
  for (let i = 0; i < state.activeMembers.length; ++i) {
    const member = state.activeMembers[i];
    if (member.characterID == member.characterID) {
      index = i;
    }
  }
  
  if (index >= 0) {
    // update existing
    state.activeMembers.slice(index, 1);
  }

  return state;
}

export default function reducer(state: WarbandState = initialState,
                                action: WarbandAction = {type: null}): WarbandState {
  switch(action.type) {
    default: return state;
    
    case INITIALIZE_SIGNALR:
      return Object.assign({}, state, {
        isInitalizing: false,
      });
    
    case INITIALIZE_SIGNALR_SUCCESS:
      return Object.assign({}, state, {
        isInitalizing: false,
        signalRInitialized: true,
      });
    
    case INITIALIZE_SIGNALR_FAILED:
    return Object.assign({}, state, {
        isInitalizing: false,
        signalRInitialized: false,
      });
    
    case WARBAND_JOINED:
    {
      return Object.assign({}, state, {
        name: action.name,
        warbandID: action.id
      });
    }

    case WARBAND_UPDATE: 
    {
      return Object.assign({}, state, {
       name: action.name,
       warbandID: action.id,
      });
    }

    case WARBAND_QUIT:
    {
      return Object.assign({}, state, {
        name: '',
        warbandID: null
      });
    }

    case WARBAND_ABANDONED:
    {
      return Object.assign({}, state, {
        name: '',
        warbandID: null
      });
    }

    case WARBAND_MEMBERJOINED:
      return Object.assign({}, state, addOrUpdateMember(clone(state), action.member));

    case WARBAND_MEMBERUPDATE:
      return Object.assign({}, state, addOrUpdateMember(clone(state), action.member));
    
    case WARBAND_MEMBERREMOVED:
      return Object.assign({}, state, removeMember(clone(state), action.member));
  }
}
