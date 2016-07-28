/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

var redux_1 = require('redux');
var races_1 = require('./races');
var races = races_1.default;
var playerClasses_1 = require('./playerClasses');
var playerClasses = playerClasses_1.default;
var factions_1 = require('./factions');
var factions = factions_1.default;
var attributes_1 = require('./attributes');
var attributes = attributes_1.default;
var attributeOffsets_1 = require('./attributeOffsets');
var attributeOffsets = attributeOffsets_1.default;
var genders_1 = require('./genders');
var gender = genders_1.default;
var character_1 = require('./character');
var character = character_1.default;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = redux_1.combineReducers({
    races: races,
    playerClasses: playerClasses,
    factions: factions,
    attributes: attributes,
    gender: gender,
    attributeOffsets: attributeOffsets,
    character: character
});