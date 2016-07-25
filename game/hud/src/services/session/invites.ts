/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import cu, {client, GroupInvite, groupType} from 'camelot-unchained';

const localStorageKey = 'cse_hud_invites-state';

const FETCH_INVITES = 'hud/warband/FETCH_INVITES';
const FETCH_INVITES_SUCCESS = 'hud/warband/FETCH_INVITES_SUCCESS';
const FETCH_INVITES_FAILED = 'hud/warband/FETCH_INVITES_FAILED';
const REQUEST_INVITES = 'hud/warband/REQUEST_INVITES';

export interface InvitesAction {
  type: string;
  time?: Date;
  error?: string;
  invites?: GroupInvite[];
}

export interface AsyncAction { (dispatch: (action:any) => any): any }

// Actions
function requestInvites(): InvitesAction {
  return {
    type: REQUEST_INVITES
  }
}

function fetchInvitesSuccess(invites: GroupInvite[]): InvitesAction {
  return {
    type: FETCH_INVITES_SUCCESS,
    invites: invites,
    time: new Date()
  }
}

function fetchInvitesFailed(error?:string): InvitesAction {
  return {
    type: FETCH_INVITES_FAILED,
    error: error
  }
}

export function fetchInvites() : AsyncAction {
  return (dispatch: (action: any) => any) => {
    dispatch(requestInvites());
    cu.api.getInvitesForCharacter(client.shardID, client.characterID)
      .then((data: any) => console.log(data))
      .catch((errors: any) => console.log(errors));
  }
}


export interface InvitesState {
  isFetching?: boolean;
  lastSuccess?: Date;
  invites?: GroupInvite[];
  error?: string;
}

const initialState = {
  isFetching: false,
}

export default function reducer(state: InvitesState = initialState, action: InvitesAction = {type: null}): InvitesState {
  switch(action.type) {
    case REQUEST_INVITES: 
      return Object.assign(state, {
        isFetching: true
      });
    default: return state;
  }
}
