module.exports = {
  scripts: {
    lint: {
      script: 'tslint "src/**/*.ts{,x}"',
      description: 'Run TS-Lint"',
      fix: {
        script: 'tslint --fix "src/**/*.ts{,x}"',
        description: 'Fix TS-Lint errors'
      }
    },
    copy: {
      misc: 'copyup src/assets/**/* src/third-party/**/* src/sounds/**/* src/images/**/* src/font/**/* src/**/*.html src/videos/**/* dist/ui src/dev.config.js dist/ui',
      patcher: 'copyup dist/ui/**/* PatchClient/cpui'
    },
    babel: 'babel tmp -d tmpp',
    browserify: {
      default: 'mkdirp dist/ui/js && browserify tmpp/index.js -o dist/ui/js/%npm_package_config_name%.js --fast --noparse=FILE -u @csegames/camelot-unchained -u es6-promise -u eventemitter3 -u isomorphic-fetch -u moment -u node-xmpp-client -u normalizr -u react -u react-dom  -u react-redux -u react-tap-event-plugin -u redux -u redux-thunk -u reflux',
      lib: 'mkdirp dist/ui/js && browserify -r @csegames/camelot-unchained -r es6-promise -r eventemitter3 -r isomorphic-fetch -r moment -r node-xmpp-client -r normalizr -r react -r react-dom  -r react-redux -r react-tap-event-plugin -r redux -r redux-thunk -r reflux > dist/ui/js/lib.js'
    },
    build: {
      sass: 'node-sass src -o dist/ui/css --importer node_modules/sass-importer-node/sass-importer-node.js',
      noLint: 'rimraf tmp && rimraf tmpp && rimraf dist/ui && nps browserify.lib && nps build.sass && nps copy.misc -s && tsc && nps babel && nps browserify && rimraf tmp && rimraf tmpp',
      default: 'rimraf tmp && rimraf tmpp && rimraf dist/ui && nps browserify.lib && nps lint && nps build.sass && nps copy.misc -s && tsc && nps babel && nps browserify && rimraf tmp && rimraf tmpp'
    },
    publish: 'nps build',
    serve: 'http-server -p 9000 dist/ui/',
    debug: 'nps build.noLint && nps copy.patcher && nps patcher',
    patcher: 'cd Patchclient && start CamelotUnchained.exe canPatchSelf=0 outputUI=0',
    gql: {
      mkdir: 'mkdirp gql',
      schema: 'apollo-codegen introspect-schema https://hatcheryapi.camelotunchained.com/graphql --output gql/schema.json',
      codegen: 'apollo-codegen generate src/**/*.graphql --schema gql/schema.json --target typescript --output src/gqlInterfaces.ts',
      collectAndConcat: 'graphql-document-collector "src/**/*.graphql" > gql/gqlDocument.json && concat-cli -f src/gqlPrepend.txt -f gql/gqlDocument.json -o src/gqlDocuments.ts',
      default: 'nps gql.mkdir && nps gql.schema && nps gql.codegen && nps gql.collectAndConcat'
    },
    gqlLocal: {
      schema: 'apollo-codegen introspect-schema https://hatcheryapi.camelotunchained.com/graphql --output gql/schema.json',
      codegen: 'apollo-codegen generate src/**/*.graphql --schema gql/schema.json --target typescript --output src/gqlInterfaces.ts',
      collectAndConcat: 'graphql-document-collector "src/**/*.graphql" > gql/gqlDocument.json && concat-cli -f src/gqlPrepend.txt -f gql/gqlDocument.json -o src/gqlDocuments.ts',
      default: 'nps gql.schema && nps gql.codegen && nps gql.collectAndConcat'
    },
  }
};
