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
        script: 'nps report.start && nps clean && nps build.webpack.production && nps report.success',
        description: 'Builds the UI in production mode',
      },
      dev: {
        script: 'nps report.start && nps clean && nps build.webpack.development && nps report.success',
        description: 'Builds the UI in development mode',
      },
      browser: {
        default: {
          script: 'cross-env CUUI_LSBUILD_IS_BROWSER="1" nps build'
        },
        dev: {
          script: 'cross-env CUUI_LSBUILD_IS_BROWSER="1" nps build.dev'
        }
      },
      webpack: {
        default: {
          hiddenFromHelp: true,
          script: 'nps build',
        },
        development: {
          hiddenFromHelp: true,
          script: 'webpack --mode development --approute=""',
        },
        production: {
          hiddenFromHelp: true,
          script: 'webpack --mode production --approute=""',
        },
      },
      ...generateForTargets((target) => {
        const folderPath = `%localappdata%/CSE/CamelotUnchained/${target.id}/INTERFACE/loadingscreen`;
        return {
          [target.name]: {
            default: {
              script: `nps clean.${target.name} && cross-env CUUI_LSBUILD_OUTPUT_PATH="${folderPath}" nps build`,
              description: `Builds the UI in production mode and copies to the ${target.name} (${target.id}) UI override directory.`,
            },
            dev: {
              script: `nps clean.${target.name} && cross-env CUUI_LSBUILD_OUTPUT_PATH="${folderPath}" nps build.dev`,
              description: `Builds the UI in development mode and copies to the ${target.name} (${target.id}) UI override directory.`,
            }
          },
        };
      }),
    },

    // Dev
    dev: {
      default: {
        script: 'nps clean && cross-env CUUI_LSBUILD_IS_BROWSER="1" nps dev.watch',
        description: 'Development mode will start an http server with live reload that will watch and build whenever a file change is detected.',
      },
      watch: {
        default: {
          hiddenFromHelp: true,
          script: 'nps -p dev.watch.webpackServe',
        },
        webpackServe: {
          hiddenFromHelp: true,
          script: 'webpack-serve --content ./build --open --log-level silent',
        },
        webpack: {
          hiddenFromHelp: true,
          script: 'webpack --mode development --watch',
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
        const folderPath = `%localappdata%/CSE/CamelotUnchained/${target.id}/INTERFACE/loadingscreen`;
        return {
          [target.name]: {
            default: {
              script: `nps clean && nps clean.${target.name} && nps dev.${target.name}.watch`,
            },
            webpack: {
              hiddenFromHelp: true,
              script: `cross-env CUUI_LSBUILD_OUTPUT_PATH="${folderPath}" webpack-serve --content "${folderPath}" --log-level silent`,
            },
            watch: {
              hiddenFromHelp: true,
              script: `nps -p dev.${target.name}.webpack`,
            }
          },
        };
      }),
    },

    // Deploy
    deploy: {
      script: 'cross-env CUUI_LS_ENABLE_SENTRY="1" nps build && rimraf ../../../CamelotUnchained/MMO/Client/Assets/interface/loadingscreen && copyup build/**/* ../../../CamelotUnchained/MMO/Client/Assets/interface/loadingscreen',
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
            script: `rimraf \"%localappdata%/CSE/CamelotUnchained/${target.id}/INTERFACE/loadingscreen\"`,
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
            script: `copyup "build/**/*" \"%localappdata%/CSE/CamelotUnchained/${target.id}/INTERFACE/loadingscreen\" && nps report.copy`,
          },
        };
      }),
    },

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
      typescript: {
        script: 'echo "Running typescript compiler..."',
        hiddenFromHelp: true,
      },
    },
  }
};
