/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

require('isomorphic-fetch');
var ResponseError_1 = require('./ResponseError');
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new ResponseError_1.default(response, response.statusText);
        throw error;
    }
}
exports.checkStatus = checkStatus;
function parseJSON(response) {
    return response.json();
}
exports.parseJSON = parseJSON;
function fetchJSON(url, options) {
    return fetch(url, options).then(checkStatus).then(parseJSON);
}
exports.fetchJSON = fetchJSON;