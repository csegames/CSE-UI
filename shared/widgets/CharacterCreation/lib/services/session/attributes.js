/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

require('isomorphic-fetch');
var fetchHelpers_1 = require('../../lib/fetchHelpers');
var totalPoints = 30;
(function (attributeType) {
    attributeType[attributeType["NONE"] = 0] = "NONE";
    attributeType[attributeType["PRIMARY"] = 1] = "PRIMARY";
    attributeType[attributeType["SECONDARY"] = 2] = "SECONDARY";
    attributeType[attributeType["DERIVED"] = 3] = "DERIVED"; // calculated from primary or secondary attributes, player can not directly change
})(exports.attributeType || (exports.attributeType = {}));
var attributeType = exports.attributeType;
var FETCH_ATTRIBUTES = 'cu-character-creation/attributes/FETCH_ATTRIBUTES';
var FETCH_ATTRIBUTES_SUCCESS = 'cu-character-creation/attributes/FETCH_ATTRIBUTES_SUCCESS';
var FETCH_ATTRIBUTES_FAILED = 'cu-character-creation/attributes/FETCH_ATTRIBUTES_FAILED';
var ALLOCATE_ATTRIBUTE_POINT = 'cu-character-creation/attributes/ALLOCATE_ATTRIBUTE_POINT';
var UPDATE_WITH_OFFSETS = 'cu-character-creation/attributes/UPDATE_WITH_OFFSETS';
var FETCH_OFFSETS = 'cu-character-creation/attributes/FETCH_OFFSETS';
var FETCH_OFFSETS_SUCCESS = 'cu-character-creation/attributes/FETCH_OFFSETS_SUCCESS';
var RESET = 'cu-character-creation/attributes/RESET';
function resetAttributes() {
    return {
        type: RESET,
        state: initialState
    };
}
exports.resetAttributes = resetAttributes;
function allocateAttributePoint(name, value) {
    return {
        type: ALLOCATE_ATTRIBUTE_POINT,
        name: name,
        value: value
    };
}
exports.allocateAttributePoint = allocateAttributePoint;
function requestAttributes() {
    return {
        type: FETCH_ATTRIBUTES
    };
}
exports.requestAttributes = requestAttributes;
function fetchAttributesSuccess(attributes) {
    return {
        type: FETCH_ATTRIBUTES_SUCCESS,
        attributes: attributes,
        receivedAt: Date.now()
    };
}
exports.fetchAttributesSuccess = fetchAttributesSuccess;
function fetchAttributesFailed(error) {
    return {
        type: FETCH_ATTRIBUTES_FAILED,
        error: error.message
    };
}
exports.fetchAttributesFailed = fetchAttributesFailed;
function fetchAttributes() {
    var apiUrl = arguments.length <= 0 || arguments[0] === undefined ? 'https://api.camelotunchained.com/' : arguments[0];
    var shard = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var apiVersion = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    return function (dispatch) {
        dispatch(requestAttributes());
        return fetchHelpers_1.fetchJSON(apiUrl + 'gamedata/attributes/' + shard + '?api-version=' + apiVersion).then(function (attributes) {
            return attributes.map(function (a) {
                a.allocatedPoints = 0;
                a.minValue = a.baseValue;
                return a;
            });
        }).then(function (attributes) {
            return dispatch(fetchAttributesSuccess(attributes));
        }).catch(function (error) {
            return dispatch(fetchAttributesFailed(error));
        });
    };
}
exports.fetchAttributes = fetchAttributes;
var initialState = {
    isFetching: false,
    lastUpdated: null,
    attributes: [],
    error: null,
    allocations: [],
    pointsAllocated: 0,
    maxPoints: totalPoints
};
function reducer() {
    var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
    var action = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ret = function () {
        switch (action.type) {
            case FETCH_ATTRIBUTES:
                return {
                    v: Object.assign({}, state, {
                        isFetching: true
                    })
                };
            case FETCH_ATTRIBUTES_SUCCESS:
                return {
                    v: Object.assign({}, state, {
                        isFetching: false,
                        lastUpdated: action.receivedAt,
                        attributes: action.attributes
                    })
                };
            case FETCH_ATTRIBUTES_FAILED:
                return {
                    v: Object.assign({}, state, {
                        isFetching: false,
                        error: action.error
                    })
                };
            case ALLOCATE_ATTRIBUTE_POINT:
                var allocated = 0;
                return {
                    v: Object.assign({}, state, {
                        attributes: state.attributes.map(function (a) {
                            if (a.name == action.name && a.allocatedPoints + a.baseValue + action.value >= a.minValue && state.pointsAllocated + action.value + allocated <= totalPoints) {
                                a.allocatedPoints += action.value;
                                allocated += action.value;
                            }
                            return a;
                        }),
                        pointsAllocated: state.pointsAllocated + allocated
                    })
                };
            case RESET:
                return {
                    v: action.state
                };
            default:
                return {
                    v: state
                };
        }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reducer;