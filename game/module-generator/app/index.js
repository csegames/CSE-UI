/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

var generators = require('yeoman-generator');
var fs = require('fs');

function errorAndExit(message, logger) {
  logger.error(message);
  process.exit(1);
}

module.exports = generators.Base.extend({
  prompting: function () {
    var done = this.async();
    this.prompt([
      {
        type: 'string',
        name: 'name',
        message: 'Module Name'
      }
    ], function (answers) {
      this.name = answers.name.trim();
      if (this.name == '') {
        errorAndExit('Module Name is Required', this.log);
      }
      this.nameSlug = this.name.toLowerCase().replace(new RegExp(' ', 'g'), '-');
      if (fs.existsSync(this.destinationPath(this.nameSlug))) {
        errorAndExit('Directory "' + this.nameSlug + '" Already Exists', this.log);
      } else {
        this.destinationRoot(this.destinationRoot() + '/' + this.nameSlug);
      }
      done();
    }.bind(this));
  },
  writing: function () {
    this.fs.copyTpl(
      [this.templatePath('**/*'), this.templatePath('.*')],
      this.destinationPath(''),
      {
        name: this.name,
        nameSlug: this.nameSlug,
      }
    );
    this.fs.move(
      this.destinationPath('src/cu-boilerplate-module.ui'),
      this.destinationPath('src/' + this.nameSlug + '.ui')
    );
    this.fs.move(
      this.destinationPath('src/sass/main.scss'),
      this.destinationPath('src/sass/' + this.nameSlug + '.scss')
    );
  }
});
