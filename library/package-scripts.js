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
      thirdParty: 'copyup src/third-party/**/* lib/',
      misc: 'copyup src/**/*.html src/**/*.css src/**/*.scss lib/',
      tmp: 'copyup tmp/**/* lib/',
      definitions: 'copyup tmp/**/*.d.ts lib/'
    },
    copies: 'nps copy.definitions && nps copy.thirdParty && nps copy.misc',
    build: 'nps clean -s && nps lint && tsc && nps sass && nps copies && nps babel && nps browserify && rimraf tmp',
    docs: 'typedoc --out docs/ --excludeExternals --module commonjs --exclude node_modules --ignoreCompilerErrors --experimentalDecorators --target ES6 --jsx react ./src/'
  }
};
