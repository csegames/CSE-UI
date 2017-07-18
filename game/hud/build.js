require('shelljs/global');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var yargs = require('yargs')
  .alias('l', 'lib')
  .alias('d', 'dev')
  .alias('b', 'build')
  .alias('h', 'hatchery')
  .alias('p', 'production')
  .argv;

function runYarn(directory) {
  console.log(chalk.green(`running install in ${directory}`));
  cd(directory);
  exec(yargs.production ? 'yarn install --production' : 'yarn install');
}

function runNPMScript(directory, script) {
  console.log(chalk.green(`running npm start ${script} in ${directory}`));
  cd(directory);
  exec(`npm start ${script}`);
}

var libDir = `${__dirname}/../../library`;

if (yargs.lib) {

  runYarn(libDir);
  runNPMScript(libDir, 'build');

}

if (yargs.dev) {

  runYarn(__dirname);
  runNPMScript(__dirname, 'dev');

} else if (yargs.build) {

  runYarn(__dirname);
  runNPMScript(__dirname, 'build');

} else if (yargs.hatchery) {

  runYarn(__dirname);
  runNPMScript(__dirname, 'build.hatchery');

}
