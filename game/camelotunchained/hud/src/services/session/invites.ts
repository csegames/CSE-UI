/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  merge,
  BaseAction,
  AsyncAction,
  removeWhere,
  createReducer,
  ActionDefinitions,
  addOrUpdate,
} from '../../lib/reduxUtils';

const INITIALIZE_SIGNALR = 'hud/invites/INITIALIZE_SIGNALR';
const INITIALIZE_SIGNALR_SUCCESS = 'hud/invites/INITIALIZE_SIGNALR_SUCCESS';
const INITIALIZE_SIGNALR_FAILED = 'hud/invites/INITIALIZE_SIGNALR_FAILED';

const FETCH_INVITES_SUCCESS = 'hud/invites/FETCH_INVITES_SUCCESS';
const FETCH_INVITES_FAILED = 'hud/invites/FETCH_INVITES_FAILED';
const REQUEST_INVITES = 'hud/invites/REQUEST_INVITES';
const INVITE_RECEIVED = 'hud/invites/INVITE_RECEIVED';

const ACCEPT_INVITE = 'hud/invites/ACCEPT_INVITE';
const DECLINE_INVITE = 'hud/invites/DECLINE_INVITE';

/**
 * Helper methods
 */

// function registerInviteEvents(dispatch: (action: InvitesAction) => any) {
//   // game.on(signalr.GROUP_EVENTS_INVITE_RECEIVED, (invite: IGroupInvite) => dispatch(inviteReceived(invite)));
// }

export interface InvitesAction extends BaseAction {
  error?: string;
  invites?: IGroupInvite[];
  invite?: IGroupInvite;
}

/**
 * INTERNAL ACTIONS
 */

function initSignalR(): InvitesAction {
  return {
    type: INITIALIZE_SIGNALR,
    when: new Date(),
  };
}

// function initSignalRSuccess(): InvitesAction {
//   return {
//     type: INITIALIZE_SIGNALR_SUCCESS,
//     when: new Date(),
//   };
// }

function initSignalRFailed(): InvitesAction {
  return {
    type: INITIALIZE_SIGNALR_FAILED,
    when: new Date(),
  };
}


function requestInvites(): InvitesAction {
  return {
    type: REQUEST_INVITES,
    when: new Date(),
  };
}

function fetchInvitesSuccess(invites: IGroupInvite[]): InvitesAction {
  return {
    type: FETCH_INVITES_SUCCESS,
    invites,
    when: new Date(),
  };
}

function fetchInvitesFailed(error?: string): InvitesAction {
  return {
    type: FETCH_INVITES_FAILED,
    when: new Date(),
    error,
  };
}

// function inviteReceived(invite: IGroupInvite): InvitesAction {
//   return {
//     type: INVITE_RECEIVED,
//     when: new Date(),
//     invite,
//   };
// }

/**
 * EXTERNAL ACTIONS
 */

export function initializeInvites(): AsyncAction<InvitesAction> {
  return (dispatch: (action: InvitesAction | AsyncAction<InvitesAction>) => any) => {
    dispatch(fetchInvites());
    dispatch(initSignalR());

    try {
      // signalr.groupsHub.start(() => {
      //   dispatch(initSignalRSuccess());
      //   registerInviteEvents(dispatch);
      // });
    } catch (e) {
      console.log(e);
      dispatch(initSignalRFailed());
    }
  };
}

export function acceptInvite(invite: IGroupInvite): InvitesAction {
  joinWithInvite(invite);
  return {
    type: ACCEPT_INVITE,
    when: new Date(),
    invite,
  };
}

export function declineInvite(invite: IGroupInvite): InvitesAction {
  return {
    type: DECLINE_INVITE,
    when: new Date(),
    invite,
  };
}

export function fetchInvites(): AsyncAction<InvitesAction> {
  return (dispatch: (action: any) => any) => {
    dispatch(requestInvites());

    getInvitesForCharacter()
      .then((data: any) => dispatch(fetchInvitesSuccess(JSON.parse(data))))
      .catch((response: any) => dispatch(fetchInvitesFailed(response.problem)));
  };
}

async function joinWithInvite(invite: IGroupInvite) {
  // try {
  //   await webAPI.WarbandsAPI.JoinWithInviteV1(
  //     webAPI.defaultConfig,
  //     client.loginToken,
  //     client.shardID,
  //     invite.groupID,
  //     client.characterID,
  //     invite.inviteCode,
  //   );
  // } catch (err) {
  //   webAPI.handleWebAPIError(err);
  // }
}

async function getInvitesForCharacter() {
  // try {
  //   await webAPI.GroupsAPI.GetInvitesForCharacterV1(
  //     webAPI.defaultConfig,
  //     client.loginToken,
  //     client.shardID,
  //     client.characterID,
  //   );
  // } catch (err) {
  //   webAPI.handleWebAPIError(err);
  // }
}

export interface InvitesState {
  isInitializing: boolean;
  signalRInitialized: boolean;
  isFetching: boolean;
  lastSuccess?: Date;
  invites?: IGroupInvite[];
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

function inviteEquals(a: IGroupInvite, b: IGroupInvite): boolean {
  return a.Code === b.Code;
}

const actionDefs: ActionDefinitions<InvitesState> = {};

actionDefs[INITIALIZE_SIGNALR] = (s, a) => merge(s, { isInitalizing: false });

actionDefs[INITIALIZE_SIGNALR_SUCCESS] = (s, a) => merge(s, { isInitalizing: false, signalRInitialized: true });

actionDefs[INITIALIZE_SIGNALR_FAILED] = (s, a) => merge(s, { isInitalizing: false, signalRInitialized: true });

actionDefs[REQUEST_INVITES] = (state: InvitesState, action: InvitesAction) => merge(state, { isFetching: true });

actionDefs[ACCEPT_INVITE] = (state: InvitesState, action: InvitesAction) => {
  return merge(state, {
    invites: removeWhere(state.invites, i => i.Code === action.invite.Code).result,
  });
};

actionDefs[DECLINE_INVITE] = (state: InvitesState, action: InvitesAction) => {
  return merge(state, {
    invites: removeWhere(state.invites, i => i.Code === action.invite.Code).result,
  });
};

actionDefs[INVITE_RECEIVED] = (state: InvitesState, action: InvitesAction) =>
  merge(state, { invites: addOrUpdate(state.invites, action.invite, inviteEquals) });

export default createReducer<InvitesState>(initialState(), actionDefs);
