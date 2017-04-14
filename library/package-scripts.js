module.exports = {
  scripts: {
    lint: {
      script: 'tslint src/**/*.ts{,x}',
      description: 'Run TS-Lint"',
      fix: {
        script: 'tslint --fix src/**/*.ts{,x}',
        description: 'Fix TS-Lint errors'
      }
    },
    dev: 'start npm-watch',
    clean: 'rimraf tmp && rimraf lib',
    babel: 'babel tmp -d lib',
    browserify: 'browserify lib/index.js > lib/camelot-unchained.js',
    sass: 'node-sass src/ -o lib/ --importer src/third-party/sass-importer/sass-npm-importer.js',
    copy: {
      thirdParty: '(robocopy src\third-party lib\third-party /s) ^& IF %ERRORLEVEL% LEQ 1 exit 0',
      misc: '(robocopy src\ lib\ /s /xf *.js /xf *.ts /xf *.tsx) ^& IF %ERRORLEVEL% LEQ 1 exit 0',
      tmp: '(robocopy tmp\ lib\ /s) ^& IF %ERRORLEVEL% LEQ 1 exit 0',
      definitions: '(robocopy tmp\ lib\ *.d.ts /s /mov) ^& IF %ERRORLEVEL% LEQ 1 exit 0'
    },
    copies: 'nps copy.definitions && nps copy.third-party && nps copy.misc',
    build: 'nps clean -s && nps lint && tsc && nps sass && nps copies && nps babel && nps browserify && rimraf tmp',
    docs: 'typedoc --out docs/ --excludeExternals --module commonjs --exclude node_modules --ignoreCompilerErrors --experimentalDecorators --target ES6 --jsx react ./src/'
  }
};
