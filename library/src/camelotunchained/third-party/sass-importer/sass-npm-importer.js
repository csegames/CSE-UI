/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';
var path = require('path');
var aliases = {};
// Look for .scss|sass files inside the node_modules folder
module.exports = function (url, file, done) {
  if (aliases[url]) {
    return done({file: aliases[url]});
  }
  try {
    var newPath = path.relative('.', require.resolve(url));
    aliases[url] = newPath;
    console.log(newPath);
    // bourbon gives a js file.
    if (newPath.endsWith('.js')) {
      var module = require(url);
      newPath = module.includePaths[0] + '/' + url;
      aliases[url] = newPath;
    }
    return done({file: newPath});
  } catch (e) {
    aliases[url] = url;
    return done({file: url});
  }
}
