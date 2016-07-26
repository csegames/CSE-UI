/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

require('isomorphic-fetch');
var fetchHelpers_1 = require('../../lib/fetchHelpers');
var defaultBanes = {
    "5429de13da9beb2c3c3dd450": 3,
    "5429de13da9beb2c3c3dd451": 1,
    "5429de13da9beb2c3c3dd452": 1
};
var defaultBoons = { "5429de0eda9beb2c3c3dd32b": 1 };
var CREATE_CHARACTER = 'cu-character-creation/character/CREATE_CHARACTER';
var CREATE_CHARACTER_SUCCESS = 'cu-character-creation/character/CREATE_CHARACTER_SUCCESS';
var CREATE_CHARACTER_FAILED = 'cu-character-creation/character/CREATE_CHARACTER_FAILED';
var RESET = 'cu-character-creation/character/RESET';
function resetCharacter() {
    return {
        type: RESET,
        state: initialState
    };
}
exports.resetCharacter = resetCharacter;
function createCharacter(model, apiKey) {
    var apiUrl = arguments.length <= 2 || arguments[2] === undefined ? 'https://api.camelotunchained.com/' : arguments[2];
    var shard = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];
    var apiVersion = arguments.length <= 4 || arguments[4] === undefined ? 1 : arguments[4];

    model.banes = defaultBanes;
    model.boons = defaultBoons;
    return function (dispatch) {
        dispatch(createCharacterStarted());
        return fetch(apiUrl + 'characters/' + shard, {
            method: 'post',
            body: JSON.stringify(model),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-version': apiVersion,
                'loginToken': apiKey
            }
        }).then(fetchHelpers_1.checkStatus).then(function () {
            return dispatch(createCharacterSuccess(model));
        }).catch(function (error) {
            return error.response.json().then(function (error) {
                return dispatch(createCharacterFailed(error));
            });
        });
    };
}
exports.createCharacter = createCharacter;
function createCharacterStarted() {
    return {
        type: CREATE_CHARACTER
    };
}
exports.createCharacterStarted = createCharacterStarted;
function createCharacterSuccess(model) {
    return {
        type: CREATE_CHARACTER_SUCCESS,
        model: model
    };
}
exports.createCharacterSuccess = createCharacterSuccess;
function createCharacterFailed(error) {
    return {
        type: CREATE_CHARACTER_FAILED,
        error: JSON.parse(error.Message)
    };
}
exports.createCharacterFailed = createCharacterFailed;
var initialState = {
    isFetching: false,
    success: false,
    error: null,
    created: null
};
function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
        case CREATE_CHARACTER:
            return Object.assign({}, state, {
                isFetching: true
            });
        case CREATE_CHARACTER_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                success: true,
                created: action.model
            });
        case CREATE_CHARACTER_FAILED:
            var errors = action.error.Errors;
            errors.forEach(function (e) {
                return Materialize.toast(e, 5000);
            });
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        case RESET:
            {
                return action.state;
            }
        default:
            return state;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reducer;