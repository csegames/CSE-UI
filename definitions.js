require('shelljs/global');
var chalk = require('chalk');
var rimraf = require('rimraf');

var yargs = require('yargs')
  .usage('Usage: $0 (-r | --repo)')
  .alias('r', 'repo')
  .argv;

var repo = yargs.repo || 'origin';

console.log(chalk.green(`copying definitions...`));
exec(`(robocopy library\\definitions definitions /s) ^& IF %ERRORLEVEL% LEQ 1 exit 0`);
console.log(chalk.green(`switching to definitions branch...`));
exec(`git checkout definitions`);
exec(`git add definitions\*`);
exec(`git commit -m "definitions built"`);
console.log(chalk.green(`pushing definitions to ${repo}/definitions...`));
exec(`git push ${repo} definitions`);
console.log(chalk.green(`checking out master...`));
exec(`git checkout master`);
console.log(chalk.green(`deleting definitions...`));
exec(`rimraf definitions`);
console.log(chalk.green(`definitions complete`));
