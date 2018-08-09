module.exports = {
  scripts: {
    lint: {
      script: 'tslint -t stylish src/**/*.ts{,x}',
      description: 'Run TS-Lint"',
      fix: {
        script: 'tslint --fix src/**/*.ts{,x}',
        description: 'Fix TS-Lint errors'
      }
    },
    tsc: 'tsc',
    dev: 'start npm-watch',
    clean: 'rimraf tmp && rimraf lib',
    babel: 'babel tmp -d lib',
    browserify: 'browserify -g [ envify --NODE_ENV production ] lib/index.js > lib/camelot-unchained.js',
    sass: 'node-sass src/ -o lib/ --importer src/third-party/sass-importer/sass-npm-importer.js',
    copy: {
      thirdParty: 'copyup "src/third-party/**/*" "lib/"',
      misc: 'copyup "src/**/*.html" "src/**/*.css" "src/**/*.scss" "lib/"',
      tmp: 'copyup "tmp/**/*" "lib/"',
      definitions: 'copyup "tmp/**/*.d.ts" lib/',
    },
    updateApi: {
      buildDefinitions: '"../../../CamelotUnchained/MMO/CUWebAPIServer/tsfixup/tsfixup.exe" -d "../../../CamelotUnchained/MMO/CUWebAPIServer/CUWebApi.Dll/TypeScriptTemplates/models" -d "../../../CamelotUnchained/MMO/CUWebAPIServer/CUWebApi.Dll/TypeScriptTemplates/extras" -d "../../../CamelotUnchained/MMO/CUWebAPIServer/CUWebApi.Dll/TypeScriptTemplates/enums" -o "src/webAPI/definitions.ts"',
      cleanControllers: 'rimraf src/webAPI/controllers',
      copyControllers: 'copyfiles -f ../../../CamelotUnchained/MMO/CUWebAPIServer/CUWebApi.Dll/TypeScriptTemplates/controllers/*.ts src/webAPI/controllers/',
      default: 'nps updateApi.buildDefinitions && nps updateApi.cleanControllers && nps updateApi.copyControllers',
    },
    copies: 'nps copy.definitions && nps copy.thirdParty && nps copy.misc',
    build: 'nps clean -s && tsc && nps sass && nps copies && nps babel && nps browserify && rimraf tmp',
    //docs: 'typedoc --out docs/ --excludeExternals --module commonjs --exclude node_modules --ignoreCompilerErrors --experimentalDecorators --target ES6 --jsx react ./src/',
    test: {
      default: {
        script: 'nps test.jest'
      },
      watch: {
        script: 'nps test.jest.watch'
      },
      jest: {
        default: {
          script: 'jest',
          hiddenFromHelp: true,
        },
        watch: {
          script: 'jest --watch',
          hiddenFromHelp: true,
        },
      }
    },
    definitions: {
      default: 'download https://hatcheryapi.camelotunchained.com/codegen/definitions.ts > ./src/webAPI/definitions.ts',
      local: 'download http://localhost:1337/codegen/definitions.ts > ./src/webAPI/definitions.ts',
      localserver: 'download http://localhost:8000/codegen/definitions.ts > ./src/webAPI/definitions.ts',
    },
    gql: {
      schema: 'apollo-codegen introspect-schema https://hatcheryapi.camelotunchained.com/graphql --output src/graphql/schema.json',
      typings: 'gql-gen --schema src/graphql/schema.json --template graphql-codegen-typescript-no-pascal-template --config ./gql-gen.json --out ./src/graphql/schema.ts',
      default: 'nps gql.schema && nps gql.typings',
      local: 'nps gql.localschema && nps gql.typings',
      localschema: 'apollo-codegen introspect-schema http://localhost:1337/graphql --output src/graphql/schema.json',
      localserverschema: 'apollo-codegen introspect-schema http://localhost:8000/graphql --output src/graphql/schema.json',
      localserver: 'nps gql.localserverschema && nps gql.typings',
    },
  }
};
