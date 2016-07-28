/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

require('isomorphic-fetch');
var fetchHelpers_1 = require('../../lib/fetchHelpers');
var FETCH_ATTRIBUTE_OFFSETS = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS';
var FETCH_ATTRIBUTE_OFFSETS_SUCCESS = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS_SUCCESS';
var FETCH_ATTRIBUTE_OFFSETS_FAILED = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS_FAILED';
function requestAttributeOffsets() {
    return {
        type: FETCH_ATTRIBUTE_OFFSETS
    };
}
exports.requestAttributeOffsets = requestAttributeOffsets;
function fetchAttributeOffsetsSuccess(offsets) {
    return {
        type: FETCH_ATTRIBUTE_OFFSETS_SUCCESS,
        offsets: offsets,
        receivedAt: Date.now()
    };
}
exports.fetchAttributeOffsetsSuccess = fetchAttributeOffsetsSuccess;
function fetchAttributeOffsetsFailed(error) {
    return {
        type: FETCH_ATTRIBUTE_OFFSETS_FAILED,
        error: error.message
    };
}
exports.fetchAttributeOffsetsFailed = fetchAttributeOffsetsFailed;
function fetchAttributeOffsets() {
    var apiUrl = arguments.length <= 0 || arguments[0] === undefined ? 'https://api.camelotunchained.com/' : arguments[0];
    var shard = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var apiVersion = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    return function (dispatch) {
        dispatch(requestAttributeOffsets());
        return fetchHelpers_1.fetchJSON(apiUrl + 'gamedata/attributeoffsets/' + shard + '?api-version=' + apiVersion).then(function (offsets) {
            return dispatch(fetchAttributeOffsetsSuccess(offsets));
        }).catch(function (error) {
            return dispatch(fetchAttributeOffsetsFailed(error));
        });
    };
}
exports.fetchAttributeOffsets = fetchAttributeOffsets;
var initialState = {
    isFetching: false,
    lastUpdated: null,
    offsets: [],
    error: null
};
function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    switch (action.type) {
        case FETCH_ATTRIBUTE_OFFSETS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case FETCH_ATTRIBUTE_OFFSETS_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                lastUpdated: action.receivedAt,
                offsets: action.offsets
            });
        case FETCH_ATTRIBUTE_OFFSETS_FAILED:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error
            });
        default:
            return state;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reducer;