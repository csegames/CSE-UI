require('shelljs/global');
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');

var yargs = require('yargs')
  .usage('Usage: $0 (-b | --build) | (-i | --install) | (-p outputDirectory | -- publish outputDirectory)')
  .alias('b', 'build')
  .alias('i', 'install')
  .alias('p', 'publish')
  .alias('prod', 'production')
  .argv;

var publish = yargs.publish || 'publish';

function getDirectories(root) {
  return fs.readdirSync(root).filter(function(file) {
    return fs.statSync(path.join(root, file)).isDirectory()
      && !file.startsWith('.')
      && file !== 'node_modules';
  });
}

function installModule(directory) {
  console.log(chalk.green(`running npm install in ${directory}`));
  cd(directory);
  exec(yargs.production ? 'npm install --production' : 'npm install');
  cd('..');
}

function buildModule(directory) {
  console.log(chalk.green(`building module at ${directory}`));
  cd(directory);
  exec('npm run build');
  cd('..');
  exec(`(robocopy ${directory}\\dist ${publish}\\${directory} /s) ^& IF %ERRORLEVEL% LEQ 1 exit 0`);
}

var directories = getDirectories('.');

if (yargs.install) directories.map(installModule);

if (yargs.build) directories.map(buildModule);
