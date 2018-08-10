module.exports = {
  scripts: {
    custom: {
      script: 'node ./build.js',
      description: 'Custom build script to make my life easier - JB',
    },
    lint: {
      default: {
        script: 'tslint -t stylish src/**/*.ts{,x}',
        description: 'Run TS-Lint"',
        hiddenFromHelp: true,
      },
      fix: {
        script: 'tslint --fix src/**/*.ts{,x}',
        description: 'Fix TS-Lint errors',
        hiddenFromHelp: true,
      }
    },
    gql: {
      mkdir: 'if not exist "gql" mkdir gql',
      schema: 'apollo-codegen introspect-schema https://hatcheryapi.camelotunchained.com/graphql --output gql/schema.json',
      codegen: 'apollo-codegen generate src/**/*.graphql --schema gql/schema.json --target typescript --output src/gqlInterfaces.ts',
      collectAndConcat: 'graphql-document-collector "src/**/*.graphql" > gql/gqlDocument.json && concat-cli -f src/gqlPrepend.txt -f gql/gqlDocument.json -o src/gqlDocuments.ts',
      default: '(nps gql.mkdir && nps gql.schema && nps gql.codegen && nps gql.collectAndConcat) || echo continuing...'
    },
    gqlLocal: {
      schema: 'apollo-codegen introspect-schema http://localhost:1337/graphql --output gql/schema.json',
      codegen: 'apollo-codegen generate src/**/*.graphql --schema gql/schema.json --target typescript --output src/gqlInterfaces.ts',
      collectAndConcat: 'graphql-document-collector "src/**/*.graphql" > gql/gqlDocument.json && concat-cli -f src/gqlPrepend.txt -f gql/gqlDocument.json -o src/gqlDocuments.ts',
      default: 'nps gqlLocal.schema && nps gqlLocal.codegen && nps gqlLocal.collectAndConcat'
    },
    gqlLocalServer: {
      schema: 'apollo-codegen introspect-schema http://localhost:8000/graphql --output gql/schema.json',
      codegen: 'apollo-codegen generate src/**/*.graphql --schema gql/schema.json --target typescript --output src/gqlInterfaces.ts',
      collectAndConcat: 'graphql-document-collector "src/**/*.graphql" > gql/gqlDocument.json && concat-cli -f src/gqlPrepend.txt -f gql/gqlDocument.json -o src/gqlDocuments.ts',
      default: 'nps gqlLocalServer.schema && nps gqlLocalServer.codegen && nps gqlLocalServer.collectAndConcat'
    },
    dev: {
      default: {
        script: 'nps clean,build.browserify.lib,build.dev,dev.livereload,dev.watch,dev.serve',
        description: 'Development mode will start an http server with live reload that will watch and build whenever a file change is detected.'
      },
      webpack: {
        default: {
          script: 'nps clean && nps gql.codegen && nps gql.collectAndConcat && nps build.sass,copy.dev,copy.dist && nps dev.webpack.watch',
          description: 'Development mode will start an http server with live reload that will watch and build whenever a file change is detected.',
        },
        watch: {
          script: 'nps -p dev.webpack.serveWebpack,dev.webpack.watchGraphql,dev.webpack.watchSass,dev.webpack.watchMisc',
        },
        serveWebpack: {
          script: 'webpack-serve --content ./dist --open',
        },
        watchWebpack: {
          script: 'webpack --mode development --watch',
        },
        watchGraphql: {
          script: 'watch -p "src/**/*.graphql -c "nps gql.codegen && nps gql.collectAndConcat"',
        },
        watchSass: {
          script: 'watch -p "src/**/*.scss" -c "nps build.sass"',
        },
        watchMisc: {
          script: 'watch -p "src/**/*.html" -p "src/third-party/**/*" -p "src/font/**/*" -p "src/images/**/*" -p "src/**/*.ui" -p "src/**/*.ico" -p "src/**/*.config.js" -c "nps copy.dev,copy.dist"',
        },
        hatchery: {
          script: 'nps clean && nps gql.codegen && nps gql.collectAndConcat && nps build.sass && nps copy && nps copy.dist && nps clean.hatchery && nps copy.hatchery && nps dev.webpack.watchHatchery',
        },
        watchHatchery: {
          script: 'cross-env CUUI_DEV_OUTPUT_PATH="%localappdata%/CSE/CamelotUnchained/4/INTERFACE/hud" nps -p dev.webpack.watchWebpack,dev.webpack.watchGraphql,dev.webpack.watchSass,dev.webpack.watchMisc',
        },
      },
      production: {
        script: 'nps clean,build.browserify.lib,build.devProduction,dev.livereload,dev.watch,dev.serve',
        description: 'Development Production mode will start an http server with live reload that will watch and build whenever a file change is detected using a production environment variable.'
      },
      start: {
      },
      serve: {
        script: 'start http-server ./dist/ -p 9003 -o --cors -c-1',
        hiddenFromHelp: true,
      },
      livereload: {
        script: 'start livereload ./dist/',
        hiddenFromHelp: true,
      },
      watch: {
        default: {
          script: 'start nps -p dev.watch.ts,dev.watch.graphql,dev.watch.sass,dev.watch.misc',
          description: 'Runs watch scripts in parallel to build whenever a file change is detected.',
          hiddenFromHelp: true,
        },
        ts: {
          script: 'watch -p "src/**/*.ts" -p "src/**/*.tsx" -c "nps build.dev"',
          hiddenFromHelp: true,
        },
        graphql: {
          script: 'watch -p "src/**/*.graphql -c "nps build.dev"',
          hiddenFromHelp: true,
        },
        sass: {
          script: 'watch -p "src/**/*.scss" -c "nps build.sass"',
          hiddenFromHelp: true,
        },
        misc: {
          script: 'watch -p "src/**/*.html" -p "src/third-party/**/*" -p "src/font/**/*" -p "src/images/**/*" -p "src/**/*.ui" -p "src/**/*.ico" -p "src/**/*.config.js" -c "nps copy.dev,copy.dist"',
          hiddenFromHelp: true,
        },
      },
    },
    clean: {
      default: {
        script: 'nps clean.temps && rimraf build && rimraf dist',
        hiddenFromHelp: true,
      },
      fledgling: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/30/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      hatchery: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/4/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      wyrmling: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/10/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      wyrmlingPrep: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/11/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      fledgling: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/30/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      nuada: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/1300/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      nuadaPrep: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/1400/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      cube: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/27/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      wolfhere: {
        script: 'rimraf \"%localappdata%/CSE/CamelotUnchained/1100/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      temps: {
        script: 'rimraf tmp && rimraf tmpp',
        hiddenFromHelp: true,
      },
    },
    copy: {
      dist: {
        script: 'copyup build/**/* dist',
        hiddenFromHelp: true,
      },
      default: {
        script: 'copyup src/third-party/**/* src/images/**/* src/font/**/* src/hud.html src/**/*.ico src/**/*.ui build',
        hiddenFromHelp: true,
      },
      dev: {
        script: 'nps copy && copyup src/**/*.config.js src/index.html dist',
        hiddenFromHelp: true,
      },
      fledgling: {
        script: 'copyup build/**/* \"%localappdata%/CSE/CamelotUnchained/30/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      hatchery: {
        script: 'copyup build/**/* \"%localappdata%/CSE/CamelotUnchained/4/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      wyrmling: {
        script: 'copyup build/**/* \"%localappdata%/CSE/CamelotUnchained/10/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      wyrmlingPrep: {
        script: 'copyup build/**/* \"%localappdata%/CSE/CamelotUnchained/11/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      nuada: {
        script: 'copyup build/**/* \"%localappdata%/CSE/CamelotUnchained/1300/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      nuadaPrep: {
        script: 'copyup build/**/* \"%localappdata%/CSE/CamelotUnchained/1400/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      wolfhere: {
        script: 'copyup build/**/* \"%localappdata%/CSE/CamelotUnchained/1100/INTERFACE/hud\"',
        hiddenFromHelp: true,
      },
      cube: {
        script: 'copyup build/**/* \"%localappdata%/CSE/CamelotUnchained/27/INTERFACE/hu\"d',
        hiddenFromHelp: true
      },
    },
    test: {
      default: {
        script: 'nps report.test && nps test.jest'
      },
      update: {
        script: 'nps report.test && nps test.jest.update'
      },
      watch: {
        script: 'nps report.test && nps test.jest.watch'
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
        update: {
          script: 'jest --updateSnapshot'
        }
      }
    },
    build: {
      sass: {
        script: 'node-sass src/index.scss -o build/css --importer node_modules/sass-importer-node/sass-importer-node.js --quiet && nps report.sass && nps copy.dist',
        hiddenFromHelp: true,
      },
      browserify: {
        default: {
          script: 'mkdirp build/js && browserify -g [ envify --NODE_ENV development ] tmpp/index.js -r react -r react-dom -r jquery -r es6-promise -r react-draggable -r react-redux -r react-select -r redux -r redux-thunk -r ol -o build/js/hud.js --fast --noparse=FILE',
          hiddenFromHelp: true,
        },
        lib: {
          script: '',//mkdirp build/js && browserify -r react -r react-dom -r jquery -r es6-promise -r react-draggable -r react-redux -r react-select -r redux -r redux-thunk -r ol > build/js/lib.js',
          hiddenFromHelp: true,
        },
        production: {
          script: 'mkdirp build/js && browserify -g [ envify --NODE_ENV production ] tmpp/index.js -r react -r react-dom -r jquery -r es6-promise -r react-draggable -r react-redux -r react-select -r redux -r redux-thunk -r ol -o build/js/hud.js --fast --noparse=FILE',
          hiddenFromHelp: true,
        },
      },
      babel: {
        script: 'babel tmp -d tmpp -q',
        hiddenFromHelp: true,
      },
      default: {
        script: 'nps report.start && tsc && nps lint && nps report.lint && nps report.tsc,copy,report.copy,build.babel,report.babel,build.browserify.lib,build.browserify.production,report.browserify,build.sass,copy.dist,clean.temps,report.success',
        description: 'Build the module.',
      },
      dev: {
        script: 'nps report.start && tsc && nps report.tsc,copy,report.copy,build.babel,report.babel,build.browserify,report.browserify,build.sass,clean.temps,report.success,copy.dev',
        description: 'build for dev watcher, skips the browserify lib & sass',
        hiddenFromHelp: true,
      },
      webpack: {
        default: {
          script: 'nps report.start && nps copy,report.copy,build.webpack.production,build.sass,copy.dist,clean.temps,report.success',
        },
        development: {
          script: 'webpack --mode development',
          hiddenFromHelp: true,
        },
        production: {
          script: 'webpack --mode production',
          hiddenFromHelp: true,
        },
      },
      devWebpack: {
        script: 'nps report.start && nps copy,report.copy,build.webpack.development,build.sass,clean.temps,report.success,copy.dev',
        description: 'build for dev watcher',
        hiddenFromHelp: true,
      },
      hatchery: {
        script: 'nps build,clean.hatchery,copy.hatchery',
        webpack: 'nps build.webpack.development,clean.hatchery,copy.hatchery',
        description: 'Builds the module and copies to the Hatchery (4) UI override directory.',
      },
      wyrmling: {
        script: 'nps build,clean.wyrmling,copy.wyrmling',
        description: 'Builds the module and copies to the Wyrmling (10) UI override directory',
      },
      wyrmlingPrep: {
        script: 'nps build,clean.wyrmlingPrep,copy.wyrmlingPrep',
        description: 'Builds the module and copies to the WyrmlingPrep (11) UI override directory',
      },
      nuada: {
        script: 'nps build,clean.nuada,copy.nuada',
        description: 'Builds the module and copies to the Nuada (1300) UI override directory',
      },
      nuadaPrep: {
        script: 'nps build,clean.nuadaPrep,copy.nuadaPrep',
        description: 'Builds the module and copies to the NuadaPrep (1400) UI override directory',
      },
      wolfhere: {
        script: 'nps build,clean.wolfhere,copy.wolfhere',
        description: 'Builds the module and copies to the Wolfhere (1100) UI override directory',
      },
      cube: {
        script: 'nps build,clean.cube,copy.cube',
        description: 'Builds the module and copies to the CUBE (27) UI override directory',
      },
      ignoreLint: {
        script: 'nps report.start && nps report.gql && nps gql && tsc && nps report.tsc,copy,report.copy,build.babel,report.babel,build.browserify.lib,build.browserify,report.browserify,build.sass,copy.dist,clean.temps,report.success',
        localServer: 'nps report.start && nps report.gql && nps gqlLocalServer && tsc && nps report.tsc,copy,report.copy,build.babel,report.babel,build.browserify.lib,build.browserify,report.browserify,build.sass,copy.dist,clean.temps,report.success',
        description: 'Build module without running lint',
      },
      ignoreLintProduction: {
        script: 'nps report.start && nps report.gql && nps gql && tsc && nps report.tsc,copy,report.copy,build.babel,report.babel,build.browserify.lib,build.browserify.production,report.browserify,build.sass,copy.dist,clean.temps,report.success',
        localServer: 'nps report.start && nps report.gql && nps gqlLocalServer && tsc && nps report.tsc,copy,report.copy,build.babel,report.babel,build.browserify.lib,build.browserify,report.browserify,build.sass,copy.dist,clean.temps,report.success',
        description: 'Build module without running lint',
      },
      ignoreLintHatchery: {
        script: 'nps build.ignoreLint,clean.hatchery,copy.hatchery',
        production: 'nps build.ignoreLintProduction,clean.hatchery,copy.hatchery',
        description: 'Builds the module and copies to the Hatchery (4) UI override directory.',
      },
      ignoreLintWyrmling: {
        script: 'nps build.ignoreLint,clean.wyrmling,copy.wyrmling',
        description: 'Builds the module and copies to the Wyrmling (10) UI override directory',
      },
      ignoreLintWyrmlingPrep: {
        script: 'nps build.ignoreLint,clean.wyrmlingPrep,copy.wyrmlingPrep',
        description: 'Builds the module and copies to the WyrmlingPrep (11) UI override directory',
      },
      ignoreLintFledgling: {
        script: 'nps build.ignoreLint,clean.fledgling,copy.fledgling',
        description: 'Builds the module and copies to the Fledling (30) UI override directory.',
      },
      ignoreLintWolfhere: {
        script: 'nps build.ignoreLint,clean.wolfhere,copy.wolfhere',
        description: 'Builds the module and copies to the Wolfhere (1100) UI override directory',
      },
      ignoreLintNuadaPrep: {
        script: 'nps build.ignoreLint,clean.nuadaPrep,copy.nuadaPrep',
        description: 'Builds the module and copies to the NuadaPrep (1400) UI override directory',
      },
      ignoreLintLocalServer: {
        script: 'nps build.ignoreLint.localServer,clean.hatchery,copy.hatchery',
        description: 'Builds the module and copies to the Hatchery (4) UI override directory',
      },
    },
    report: {
      start: {
        script: 'echo "Build started..."',
        hiddenFromHelp: true,
      },
      lint: {
        script: 'echo "TSLint complete"',
        hiddenFromHelp: true,
      },
      tsc: {
        script: 'echo "TypeScript transpile complete..."',
        hiddenFromHelp: true,
      },
      babel: {
        script: 'echo "Babel transpile complete..."',
        hiddenFromHelp: true,
      },
      copy: {
        script: 'echo "Copy complete..."',
        hiddenFromHelp: true,
      },
      browserify: {
        script: 'echo "Browserify bundle complete..."',
        hiddenFromHelp: true,
      },
      sass: {
        script: 'echo "SCSS compile complete..."',
        hiddenFromHelp: true,
      },
      success: {
        script: 'echo "Build completed successfully!"',
        hiddenFromHelp: true,
      },
      test: {
        script: 'echo "Testing started..."',
        hiddenFromHelp: true,
      },
      gql: {
        script: 'echo "Generating GraphQL Documents and Typings...',
        hiddenFromHelp: true,
      }
    },
    deploy: {
      script: 'nps clean,build.webpack && rimraf ../../../CamelotUnchained/MMO/Client/Assets/interface/hud && copyup build/**/* ../../../CamelotUnchained/MMO/Client/Assets/interface/hud',
      description: 'Deploys a fresh build to the client assets directory, CamelotUnchained & CamelotUnchained-UI repositories should be side by side in the same root directory.'
    },
  }
};
