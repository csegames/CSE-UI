module.exports = {
  scripts: {
    tsc: 'tsc',
    dev: 'start npm-watch',
    clean: 'rimraf tmp && rimraf lib',
    babel: 'babel tmp -d lib',
    browserify: {
      camelotunchained: 'browserify -g [ envify --NODE_ENV production ] lib/camelotunchained/index.js > lib/camelotunchained/camelot-unchained.js',
      hordetest: 'browserify -g [ envify --NODE_ENV production ] lib/hordetest/index.js > lib/hordetest/hordetest.js',
    },
    sass: {
      camelotunchained: 'node-sass src/camelotunchained/ -o lib/camelotunchained/ --importer src/camelotunchained/third-party/sass-importer/sass-npm-importer.js',
    },
    copy: {
      definitions: 'copyup "tmp/**/*.d.ts" lib/',
      camelotunchained: {
        thirdParty: 'copyup "src/camelotunchained/third-party/**/*" "lib/"',
        misc: 'copyup "src/camelotunchained/**/*.html" "src/camelotunchained/**/*.css" "src/camelotunchained/**/*.scss" "lib/"',
        tmp: 'copyup "tmp/camelotunchained/**/*" "lib/"',
      },
      hordetest: {
        thirdParty: 'copyup "src/hordetest/third-party/**/*" "lib/"',
        misc: 'copyup "src/hordetest/**/*.html" "src/hordetest/**/*.css" "src/hordetest/**/*.scss" "lib/"',
        tmp: 'copyup "tmp/**/*" "lib/"',
      },
      proto: 'copyup "src/**/chat_pb.js" tmp/ && copyup "src/**/*.proto" tmp/',
    },
    updateApi: {
      camelotunchained: {
        buildDefinitions: '"../../../CamelotUnchained/MMO/CUWebAPIServer/tsfixup/tsfixup.exe" -d "../../../CamelotUnchained/MMO/CUWebAPIServer/CUWebApi.Dll/TypeScriptTemplates/models" -d "../../../CamelotUnchained/MMO/CUWebAPIServer/CUWebApi.Dll/TypeScriptTemplates/extras" -d "../../../CamelotUnchained/MMO/CUWebAPIServer/CUWebApi.Dll/TypeScriptTemplates/enums" -o "src/webAPI/definitions.ts"',
        cleanControllers: 'rimraf src/camelotunchained/webAPI/controllers',
        copyControllers: 'copyfiles -f ../../../CamelotUnchained/MMO/CUWebAPIServer/CUWebApi.Dll/TypeScriptTemplates/controllers/*.ts src/webAPI/controllers/',
        default: 'nps updateApi.buildDefinitions && nps updateApi.cleanControllers && nps updateApi.copyControllers',
      },
    },
    copies: {
      camelotunchained: 'nps copy.definitions && nps copy.camelotunchained.thirdParty && nps copy.camelotunchained.misc && nps copy.proto',
      hordetest: 'nps copy.definitions && nps copy.hordetest.thirdParty && nps copy.hordetest.misc && nps copy.proto',
    },
    build: {
      default: 'nps clean -s && (nps build.camelotunchained & nps build.hordetest) && rimraf tmp',
      camelotunchained: 'tsc --p cu-tsconfig.json && nps sass.camelotunchained && nps copies.camelotunchained && nps babel && nps browserify.camelotunchained',
      hordetest: 'tsc --p hordetest-tsconfig.json && nps copies.hordetest && nps babel && nps browserify.hordetest',
    },
    rebuild: 'tsc && nps sass.camelotunchained && nps copies && nps babel && nps browserify && rimraf tmp',
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
      camelotunchained: {
        default: `download https://hatcheryapi.camelotunchained.com/v1/codegen/definitions.ts > ./src/camelotunchained/webAPI/definitions.ts`,
        local: 'download http://localhost:1337/v1/codegen/definitions.ts > ./src/camelotunchained/webAPI/definitions.ts',
        localserver: 'download http://localhost:8000/v1/codegen/definitions.ts > ./src/camelotunchained/webAPI/definitions.ts',
      },
      hordetest: {
        default: 'download https://omeletteapi.camelotunchained.com/v1/codegen/definitions.ts > ./src/hordetest/webAPI/definitions.ts',
        local: 'download http://localhost:1337/v1/codegen/definitions.ts > ./src/hordetest/webAPI/definitions.ts',
        localserver: 'download http://localhost:8000/v1/codegen/definitions.ts > ./src/hordetest/webAPI/definitions.ts',
      },
    },
    gql: {
      camelotunchained: {
        schema: 'apollo-codegen introspect-schema https://hatcheryapi.camelotunchained.com/graphql --output src/camelotunchained/graphql/schema.json',
        typings: 'gql-gen --schema src/camelotunchained/graphql/schema.json --template graphql-codegen-typescript-no-pascal-template --config ./gql-gen.json --out ./src/camelotunchained/graphql/schema.ts',
        default: 'nps gql.camelotunchained.schema && nps gql.camelotunchained.typings',
        local: 'nps gql.camelotunchained.localschema && nps gql.camelotunchained.typings',
        localschema: 'apollo-codegen introspect-schema http://localhost:1337/graphql --output src/camelotunchained/graphql/schema.json',
        localserverschema: 'apollo-codegen introspect-schema http://localhost:8000/graphql --output src/camelotunchained/graphql/schema.json',
        localserver: 'nps gql.camelotunchained.localserverschema && nps gql.camelotunchained.typings',
      },
      hordetest: {
        schema: 'apollo-codegen introspect-schema https://omeletteapi.camelotunchained.com/graphql --output src/hordetest/graphql/schema.json',
        typings: 'gql-gen --schema src/hordetest/graphql/schema.json --template graphql-codegen-typescript-no-pascal-template --config ./gql-gen.json --out ./src/hordetest/graphql/schema.ts',
        default: 'nps gql.hordetest.schema && nps gql.hordetest.typings',
        local: 'nps gql.hordetest.localschema && nps gql.hordetest.typings',
        localschema: 'apollo-codegen introspect-schema http://localhost:1337/graphql --output src/hordetest/graphql/schema.json',
        localserverschema: 'apollo-codegen introspect-schema http://localhost:8000/graphql --output src/hordetest/graphql/schema.json',
        localserver: 'nps gql.hordetest.localserverschema && nps gql.hordetest.typings',
      }
    },
  }
};
