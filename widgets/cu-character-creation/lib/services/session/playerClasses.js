/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

require('isomorphic-fetch');
var fetchHelpers_1 = require('../../lib/fetchHelpers');
var FETCH_PLAYER_CLASS = 'cu-character-creation/player-class/FETCH_PLAYER_CLASS';
var FETCH_PLAYER_CLASS_SUCCESS = 'cu-character-creation/player-class/FETCH_PLAYER_CLASS_SUCCESS';
var FETCH_PLAYER_CLASS_FAILED = 'cu-character-creation/player-class/FETCH_PLAYER_CLASS_FAILED';
var SELECT_CLASS = 'cu-character-creation/player-class/SELECT_CLASS';
function requestPlayerClasses() {
    return {
        type: FETCH_PLAYER_CLASS
    };
}
exports.requestPlayerClasses = requestPlayerClasses;
function fetchPlayerClassesSuccess(playerClasses) {
    return {
        type: FETCH_PLAYER_CLASS_SUCCESS,
        playerClasses: playerClasses,
        receivedAt: Date.now()
    };
}
exports.fetchPlayerClassesSuccess = fetchPlayerClassesSuccess;
function fetchPlayerClassesFailed(error) {
    return {
        type: FETCH_PLAYER_CLASS_FAILED,
        error: error.message
    };
}
exports.fetchPlayerClassesFailed = fetchPlayerClassesFailed;
function selectPlayerClass(selected) {
    return {
        type: SELECT_CLASS,
        selected: selected
    };
}
exports.selectPlayerClass = selectPlayerClass;
function fetchPlayerClasses() {
    var apiUrl = arguments.length <= 0 || arguments[0] === undefined ? 'https://api.camelotunchained.com/' : arguments[0];
    var shard = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var apiVersion = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    return function (dispatch) {
        dispatch(requestPlayerClasses());
        return fetchHelpers_1.fetchJSON(apiUrl + 'gamedata/archetypes?api-version=' + apiVersion).then(function (playerClasses) {
            return dispatch(fetchPlayerClassesSuccess(playerClasses));
        }).catch(function (error) {
            return dispatch(fetchPlayerClassesFailed(error));
        });
    };
}
exports.fetchPlayerClasses = fetchPlayerClasses;
var initialState = {
    isFetching: false,
    lastUpdated: null,
    playerClasses: [],
    selected: null,
    error: null
};
function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
        case FETCH_PLAYER_CLASS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case FETCH_PLAYER_CLASS_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                lastUpdated: action.receivedAt,
                playerClasses: action.playerClasses
            });
        case FETCH_PLAYER_CLASS_FAILED:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case SELECT_CLASS:
            return Object.assign({}, state, {
                selected: action.selected
            });
        default:
            return state;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reducer;