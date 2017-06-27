/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-27 17:41:30
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-27 17:41:30
 */

/* USAGE:
 *
 * create a copy of this file and name it dev.config.js, then add
 * your information. .config.js files are ignored by git.
 * 
 * window.cuOverrides will override any data on the cuAPI / client
 * object from camelot-unchained library.
 * 
 * Use this file to save your api tokens (login token) character
 * details and whatnot.
 * 
 */

(function () {
  window.cuOverrides = {
    loginToken: 'developer',
    characterID: 'ABCDEFG',
    apiHost: 'https://api.camelotunchained.com',
    apiVersion: 1,
    shardID: 1,
    debug: true
  };
})();
