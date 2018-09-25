const path = require('path');
// helper function to generate scripts for each target
function generateForTargets(callback) {
  const targets = [
    { name: 'patcher', folder: path.resolve(__dirname, 'PatchClient/cpui/ui'), },
  ];
  return generateFor(targets, callback);
}

// helper function to generate scripts
function generateFor(list, callback) {
  let scripts = {};
  list.forEach((item) => {
    Object.assign(scripts, callback(item));
  });
  return scripts;
}

module.exports = {
  scripts: {

    debug: 'nps build.patcher.dev && nps patcher',
    debugProduction: 'nps build.patcher && nps patcher',
    patcher: 'cd Patchclient && start CamelotUnchained.exe canPatchSelf=0 outputUI=0',

    build: {
      default: {
        script: 'nps report.start && nps clean && nps gql.codegen && nps build.webpack.production && nps report.success',
        description: 'Builds the UI in production mode',
      },
      dev: {
        script: 'nps report.start && nps clean && nps gql.codegen && nps build.webpack.development && nps report.success',
        description: 'Builds the UI in development mode',
      },
      browser: {
        default: {
          script: 'cross-env CUUI_BUILD_IS_BROWSER="1" nps build'
        },
        dev: {
          script: 'cross-env CUUI_BUILD_IS_BROWSER="1" nps build.dev'
        }
      },
      webpack: {
        default: {
          hiddenFromHelp: true,
          script: 'nps build',
        },
        development: {
          hiddenFromHelp: true,
          script: 'webpack --mode development',
        },
        production: {
          hiddenFromHelp: true,
          script: 'webpack --mode production',
        },
      },
      ...generateForTargets((target) => {
        return {
          [target.name]: {
            default: {
              script: `nps clean.${target.name} && cross-env CUUI_BUILD_OUTPUT_PATH="${target.folder}" nps build`,
              description: `Builds the UI in production mode and copies to the ${target.name} (${target.id}) UI override directory.`,
            },
            dev: {
              script: `nps clean.${target.name} && cross-env CUUI_BUILD_OUTPUT_PATH="${target.folder}" nps build.dev`,
              description: `Builds the UI in development mode and copies to the ${target.name} (${target.id}) UI override directory.`,
            }
          },
        };
      }),
    },

    // Dev
    dev: {
      default: {
        script: 'nps clean && nps gql.codegen && cross-env CUUI_BUILD_IS_BROWSER="1" nps dev.watch',
        description: 'Development mode will start an http server with live reload that will watch and build whenever a file change is detected.',
      },
      watch: {
        default: {
          hiddenFromHelp: true,
          script: 'nps -p dev.watch.webpackServe,dev.watch.graphql',
        },
        webpackServe: {
          hiddenFromHelp: true,
          script: 'webpack-serve --content ./build --open --log-level silent',
        },
        webpack: {
          hiddenFromHelp: true,
          script: 'webpack --mode development --watch',
        },
        graphql: {
          hiddenFromHelp: true,
          script: 'watch -p "src/**/*.graphql" -p "src/gql/fragments/**/*.ts" -p "src/**/*.tsx" -p "src/components/**/*.ts" -p "src/services/**/*.ts" -p "src/widgets/**/*.ts" -c "nps gql.codegen"',
        },
      },
      webpack: {
        default: {
          hiddenFromHelp: true,
          script: 'nps dev',
        },
        hatchery: {
          hiddenFromHelp: true,
          script: 'nps dev.hatchery',
        },
      },
      ...generateForTargets((target) => {
        return {
          [target.name]: {
            default: {
              script: `nps clean && nps gql.codegen && nps clean.${target.name} && nps dev.${target.name}.watch`,
            },
            webpack: {
              hiddenFromHelp: true,
              script: `cross-env CUUI_BUILD_OUTPUT_PATH="${target.folder}" webpack-serve --content "${target.folder}" --log-level silent`,
            },
            watch: {
              hiddenFromHelp: true,
              script: `nps -p dev.${target.name}.webpack,dev.watch.graphql`,
            }
          },
        };
      }),
    },

    // Clean
    clean: {
      default: {
        script: 'rimraf build && rimraf dist',
        hiddenFromHelp: true,
      },
      ...generateForTargets((target) => {
        return {
          [target.name]: {
            hiddenFromHelp: true,
            script: `rimraf \"${target.folder}\"`,
          },
        };
      }),
    },

    // Copy
    copy: {
      ...generateForTargets((target) => {
        return {
          [target.name]: {
            hiddenFromHelp: true,
            script: `copyup "build/**/*" \"${target.folder}\" && nps report.copy`,
          },
        };
      }),
    },


    // GraphQL
    ...generateFor(
      [
        { name: '', api: 'https://hatcheryapi.camelotunchained.com/graphql'},
        { name: 'Local', api: 'http://localhost:1337/graphql'},
        { name: 'LocalServer', api: 'http://localhost:8000/graphql'},
      ],
      (target) => {
        const name = `gql${target.name}`;
        return {
          [name]: {
            default: {
              script: `(mkdirp src/gql && nps ${name}.schema && nps ${name}.codegen) || echo continuing...`,
            },
            schema: {
              hiddenFromHelp: true,
              script: `apollo-codegen introspect-schema ${target.api} --output src/gql/schema.json`,
            },
            codegen: {
              hiddenFromHelp: true,
              // script: 'gql-gen --schema src/gql/schema.json --template graphql-codegen-typescript-no-pascal-template --config ./gql-gen.json --out ./src/gql/interfaces.ts "src/**/*.graphql"',
              script: 'gql-gen --schema src/gql/schema.json --template graphql-codegen-typescript-no-pascal-template --config ./gql-gen.json --out ./src/gql/interfaces.ts "src/**/*.graphql" "./src/**/*.tsx"',
            },
          }
        }
      }
    ),

    // Linting
    lint: {
      default: {
        script: 'tslint -t stylish src/**/*.ts{,x} && nps report.lint',
        description: 'Run TS-Lint"',
      },
      fix: {
        script: 'tslint --fix src/**/*.ts{,x}',
        description: 'Fix TS-Lint errors',
        hiddenFromHelp: true,
      }
    },

    // Reporting
    report: {
      start: {
        script: 'echo "Build started..."',
        hiddenFromHelp: true,
      },
      copy: {
        script: 'echo "Copy complete..."',
        hiddenFromHelp: true,
      },
      success: {
        script: 'echo "Build completed successfully!"',
        hiddenFromHelp: true,
      },
      lint: {
        script: 'echo "TSLint complete"',
        hiddenFromHelp: true,
      },
      gql: {
        script: 'echo "Generating GraphQL Documents and Typings...',
        hiddenFromHelp: true,
      }
    },
  }
};
