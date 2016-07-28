/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

require('isomorphic-fetch');
var fetchHelpers_1 = require('../../lib/fetchHelpers');
var FETCH_FACTIONS = 'cu-character-creation/factions/FETCH_FACTIONS';
var FETCH_FACTIONS_SUCCESS = 'cu-character-creation/factions/FETCH_FACTIONS_SUCCESS';
var FETCH_FACTIONS_FAILED = 'cu-character-creation/factions/FETCH_FACTIONS_FAILED';
var SELECT_FACTION = 'cu-character-creation/factions/SELECT_FACTION';
function requestFactions() {
    return {
        type: FETCH_FACTIONS
    };
}
exports.requestFactions = requestFactions;
function fetchFactionsSuccess(factions) {
    return {
        type: FETCH_FACTIONS_SUCCESS,
        factions: factions,
        receivedAt: Date.now()
    };
}
exports.fetchFactionsSuccess = fetchFactionsSuccess;
function fetchFactionsFailed(error) {
    return {
        type: FETCH_FACTIONS_FAILED,
        error: error.message
    };
}
exports.fetchFactionsFailed = fetchFactionsFailed;
function selectFaction(selected) {
    return {
        type: SELECT_FACTION,
        selected: selected
    };
}
exports.selectFaction = selectFaction;
function fetchFactions() {
    var apiUrl = arguments.length <= 0 || arguments[0] === undefined ? 'https://api.camelotunchained.com/' : arguments[0];
    var shard = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var apiVersion = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    return function (dispatch) {
        dispatch(requestFactions());
        return fetchHelpers_1.fetchJSON(apiUrl + 'gamedata/factions?api-version=' + apiVersion).then(function (factions) {
            return dispatch(fetchFactionsSuccess(factions));
        }).catch(function (error) {
            return dispatch(fetchFactionsFailed(error));
        });
    };
}
exports.fetchFactions = fetchFactions;
var initialState = {
    isFetching: false,
    lastUpdated: null,
    factions: [],
    selected: null,
    error: null
};
function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
        case FETCH_FACTIONS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case FETCH_FACTIONS_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                lastUpdated: action.receivedAt,
                factions: action.factions
            });
        case FETCH_FACTIONS_FAILED:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case SELECT_FACTION:
            return Object.assign({}, state, {
                selected: action.selected
            });
        default:
            return state;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reducer;