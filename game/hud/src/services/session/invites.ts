/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {webAPI, client, GroupInvite, groupType, hasClientAPI, signalr, events} from 'camelot-unchained';
import {Dictionary, clone, merge, BaseAction, AsyncAction, defaultAction, removeWhere, createReducer, ActionDefinitions, addOrUpdate, remove} from '../../lib/reduxUtils';

const localStorageKey = 'cse_hud_invites-state';

const INITIALIZE_SIGNALR = 'hud/invites/INITIALIZE_SIGNALR';
const INITIALIZE_SIGNALR_SUCCESS = 'hud/invites/INITIALIZE_SIGNALR_SUCCESS';
const INITIALIZE_SIGNALR_FAILED = 'hud/invites/INITIALIZE_SIGNALR_FAILED';

const FETCH_INVITES = 'hud/invites/FETCH_INVITES';
const FETCH_INVITES_SUCCESS = 'hud/invites/FETCH_INVITES_SUCCESS';
const FETCH_INVITES_FAILED = 'hud/invites/FETCH_INVITES_FAILED';
const REQUEST_INVITES = 'hud/invites/REQUEST_INVITES';
const INVITE_RECEIVED = 'hud/invites/INVITE_RECEIVED';

const ACCEPT_INVITE = 'hud/invites/ACCEPT_INVITE';
const DECLINE_INVITE = 'hud/invites/DECLINE_INVITE';

/**
 * Helper methods
 */

function registerInviteEvents(dispatch: (action: InvitesAction) => any) {
  events.on(signalr.GROUP_EVENTS_INVITE_RECEIVED, (invite: GroupInvite) => dispatch(inviteReceived(invite)))
}

export interface InvitesAction extends BaseAction {
  error?: string;
  invites?: GroupInvite[];
  invite?: GroupInvite;
}

/**
 * INTERNAL ACTIONS
 */

function initSignalR(): InvitesAction {
  return {
    type: INITIALIZE_SIGNALR,
    when: new Date(),
  }
}

function initSignalRSuccess(): InvitesAction {
  return {
    type: INITIALIZE_SIGNALR_SUCCESS,
    when: new Date(),
  }
}

function initSignalRFailed(): InvitesAction {
  return {
    type: INITIALIZE_SIGNALR_FAILED,
    when: new Date(),
  }
}


function requestInvites(): InvitesAction {
  return {
    type: REQUEST_INVITES,
    when: new Date(),
  }
}

function fetchInvitesSuccess(invites: GroupInvite[]): InvitesAction {
  return {
    type: FETCH_INVITES_SUCCESS,
    invites: invites,
    when: new Date(),
  }
}

function fetchInvitesFailed(error?:string): InvitesAction {
  return {
    type: FETCH_INVITES_FAILED,
    when: new Date(),
    error: error
  }
}

function inviteReceived(invite: GroupInvite): InvitesAction {
  return {
    type: INVITE_RECEIVED,
    when: new Date(),
    invite: invite,
  };
}

/**
 * EXTERNAL ACTIONS
 */

export function initializeInvites() : AsyncAction<InvitesAction> {
  return (dispatch: (action: InvitesAction | AsyncAction<InvitesAction>) => any) => {
    dispatch(fetchInvites());
    dispatch(initSignalR());

    try {
      signalr.groupsHub.start(() => {
        dispatch(initSignalRSuccess());
        registerInviteEvents(dispatch);
      });
    } catch(e) {
      console.log(e);
      dispatch(initSignalRFailed());
    }
  }
}

export function acceptInvite(invite: GroupInvite) : InvitesAction {
  webAPI.WarbandsAPI.joinWithInviteV1(client.shardID, invite.groupID, client.characterID, invite.inviteCode);
  return {
    type: ACCEPT_INVITE,
    when: new Date(),
    invite: invite
  }
}

export function declineInvite(invite: GroupInvite) : InvitesAction {
  return {
    type: DECLINE_INVITE,
    when: new Date(),
    invite: invite
  }
}

export function fetchInvites() : AsyncAction<InvitesAction> {
  return (dispatch: (action: any) => any) => {
    dispatch(requestInvites());
    webAPI.GroupsAPI.getInvitesForCharacterV1(client.shardID, client.characterID)
      .then((data: any) => dispatch(fetchInvitesSuccess(data)))
      .catch((response: any) => dispatch(fetchInvitesFailed(response.problem)));
  }
}



export interface InvitesState {
  isInitializing: boolean;
  signalRInitialized: boolean;
  isFetching: boolean;
  lastSuccess?: Date;
  invites?: GroupInvite[];
  error?: string;
}

function initialState(): InvitesState {
  return {
    isInitializing: false,
    signalRInitialized: false,
    isFetching: false,
    invites: [],
  };
}

function inviteEquals(a: GroupInvite, b: GroupInvite): boolean {
  return a.inviteCode === b.inviteCode;
}

const actionDefs: ActionDefinitions<InvitesState> = {};

actionDefs[INITIALIZE_SIGNALR] = (s, a) => merge(s, {isInitalizing: false});

actionDefs[INITIALIZE_SIGNALR_SUCCESS] = (s, a) => merge(s, {isInitalizing: false, signalRInitialized: true});

actionDefs[INITIALIZE_SIGNALR_FAILED] = (s, a) => merge(s, {isInitalizing: false, signalRInitialized: true});

actionDefs[REQUEST_INVITES] = (state: InvitesState, action: InvitesAction) => merge(state, {isFetching: true});

actionDefs[ACCEPT_INVITE] = (state: InvitesState, action: InvitesAction) => {
  return merge(state, {
    invites: removeWhere(state.invites, i => i.inviteCode === action.invite.inviteCode).result
  });
}

actionDefs[DECLINE_INVITE] = (state: InvitesState, action: InvitesAction) => {
  return merge(state, {
    invites: removeWhere(state.invites, i => i.inviteCode === action.invite.inviteCode).result
  });
};

actionDefs[INVITE_RECEIVED] = (state: InvitesState, action: InvitesAction) => merge(state, {invites: addOrUpdate(state.invites, action.invite, inviteEquals)});

export default createReducer<InvitesState>(initialState(), actionDefs);
