/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

require('isomorphic-fetch');
var fetchHelpers_1 = require('../../lib/fetchHelpers');
var FETCH_RACES = 'cu-character-creation/races/FETCH_RACES';
var FETCH_RACES_SUCCESS = 'cu-character-creation/races/FETCH_RACES_SUCCESS';
var FETCH_RACES_FAILED = 'cu-character-creation/races/FETCH_RACES_FAILED';
var SELECT_RACE = 'cu-character-creation/races/SELECT_RACE';
function requestRaces() {
    return {
        type: FETCH_RACES
    };
}
exports.requestRaces = requestRaces;
function fetchRacesSuccess(races) {
    return {
        type: FETCH_RACES_SUCCESS,
        races: races,
        receivedAt: Date.now()
    };
}
exports.fetchRacesSuccess = fetchRacesSuccess;
function fetchRacesFailed(error) {
    return {
        type: FETCH_RACES_FAILED,
        error: error.message
    };
}
exports.fetchRacesFailed = fetchRacesFailed;
function selectRace(selected) {
    return {
        type: SELECT_RACE,
        selected: selected
    };
}
exports.selectRace = selectRace;
function fetchRaces() {
    var apiUrl = arguments.length <= 0 || arguments[0] === undefined ? 'https://api.camelotunchained.com/' : arguments[0];
    var shard = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var apiVersion = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    return function (dispatch) {
        dispatch(requestRaces());
        return fetchHelpers_1.fetchJSON(apiUrl + 'gamedata/races?api-version=' + apiVersion).then(function (races) {
            return dispatch(fetchRacesSuccess(races));
        }).catch(function (error) {
            return dispatch(fetchRacesFailed(error));
        });
    };
}
exports.fetchRaces = fetchRaces;
var initialState = {
    isFetching: false,
    lastUpdated: null,
    races: [],
    selected: null,
    error: null
};
function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
        case FETCH_RACES:
            return Object.assign({}, state, {
                isFetching: true
            });
        case FETCH_RACES_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                lastUpdated: action.receivedAt,
                races: action.races
            });
        case FETCH_RACES_FAILED:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case SELECT_RACE:
            return Object.assign({}, state, {
                selected: action.selected
            });
        default:
            return state;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reducer;