/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const Generator = require('yeoman-generator');
const fs = require('fs');

function errorAndExit(message, logger) {
  logger.error(message);
  process.exit(1);
}

module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: 'string',
        name: 'name',
        message: 'Module Name'
      }
    ]);

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
  }
  writing() {
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
  }
}
