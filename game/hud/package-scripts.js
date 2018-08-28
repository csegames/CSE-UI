// helper function to generate scripts for each target
function generateForTargets(callback) {
  const targets = [
    { name: 'fledgling', id: 30, },
    { name: 'hatchery', id: 4, },
    { name: 'wyrmling', id: 10, },
    { name: 'wyrmlingPrep', id: 11, },
    { name: 'nuada', id: 1300, },
    { name: 'nuadaPrep', id: 1400, },
    { name: 'wolfhere', id: 1100, },
    { name: 'cube', id: 27, },
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
          script: 'cross-env CUUI_HUDBUILD_IS_BROWSER="1" nps build'
        },
        dev: {
          script: 'cross-env CUUI_HUDBUILD_IS_BROWSER="1" nps build.dev'
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
        const folderPath = `%localappdata%/CSE/CamelotUnchained/${target.id}/INTERFACE/hud`;
        return {
          [target.name]: {
            default: {
              script: `nps clean.${target.name} && cross-env CUUI_HUDBUILD_OUTPUT_PATH="${folderPath}" nps build`,
              description: `Builds the UI in production mode and copies to the ${target.name} (${target.id}) UI override directory.`,
            },
            dev: {
              script: `nps clean.${target.name} && cross-env CUUI_HUDBUILD_OUTPUT_PATH="${folderPath}" nps build.dev`,
              description: `Builds the UI in development mode and copies to the ${target.name} (${target.id}) UI override directory.`,
            }
          },
        };
      }),
    },

    // Dev
    dev: {
      default: {
        script: 'nps clean && nps gql.codegen && cross-env CUUI_HUDBUILD_IS_BROWSER="1" nps dev.watch',
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
        const folderPath = `%localappdata%/CSE/CamelotUnchained/${target.id}/INTERFACE/hud`;
        return {
          [target.name]: {
            default: {
              script: `nps clean && nps gql.codegen && nps clean.${target.name} && nps dev.${target.name}.watch`,
            },
            webpack: {
              hiddenFromHelp: true,
              script: `cross-env CUUI_HUDBUILD_OUTPUT_PATH="${folderPath}" webpack-serve --content "${folderPath}" --log-level silent`,
            },
            watch: {
              hiddenFromHelp: true,
              script: `nps -p dev.${target.name}.webpack,dev.watch.graphql`,
            }
          },
        };
      }),
    },

    // Deploy
    deploy: {
      script: 'cross-env CUUI_HUD_ENABLE_SENTRY="1" nps build && rimraf ../../../CamelotUnchained/MMO/Client/Assets/interface/hud && copyup build/**/* ../../../CamelotUnchained/MMO/Client/Assets/interface/hud',
      description: 'Deploys a fresh build to the client assets directory, CamelotUnchained & CamelotUnchained-UI repositories should be side by side in the same root directory.'
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
            script: `rimraf \"%localappdata%/CSE/CamelotUnchained/${target.id}/INTERFACE/hud\"`,
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
            script: `copyup "build/**/*" \"%localappdata%/CSE/CamelotUnchained/${target.id}/INTERFACE/hud\" && nps report.copy`,
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
              script: `(nps ${name}.schema && nps ${name}.codegen) || echo continuing...`,
            },
            schema: {
              hiddenFromHelp: true,
              script: `apollo-codegen introspect-schema ${target.api} --output src/gql/schema.json`,
            },
            codegen: {
              hiddenFromHelp: true,
              script: 'gql-gen --schema src/gql/schema.json --template graphql-codegen-typescript-no-pascal-template --config ./gql-gen.json --out ./src/gql/interfaces.ts "./src/gql/fragments/**/*.ts" "src/**/*.graphql" "./src/**/*.tsx" "./src/components/**/*.ts" "./src/widgets/**/*.ts" "./src/services/**/*.ts"',
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
