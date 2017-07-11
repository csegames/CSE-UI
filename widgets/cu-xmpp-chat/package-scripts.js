module.exports = {
  scripts: {
    lint: {
      script: '',//'tslint src/**/*.ts{,x}',
      description: 'Run TS-Lint"',
      hiddenFromHelp: true,
      fix: {
        script: 'tslint --fix src/**/*.ts{,x}',
        description: 'Fix TS-Lint errors',
        hiddenFromHelp: true,
      }
    },
    clean: {
      default: {
        script: 'nps clean.temps && rimraf build && rimraf lib',
        hiddenFromHelp: true,
      },
      temps: {
        script: 'rimraf tmp && rimraf tmpp',
        hiddenFromHelp: true,
      },
    },
    copy: {
      default: {
        script: 'copyup src/third-party/**/* src/images/**/* src/font/**/* src/hud.html src/**/*.ico src/**/*.ui tmp/**/*.d.ts tmpp/**/* src/**/*.scss lib',
        hiddenFromHelp: true,
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
        script: 'node-sass src/index.scss -o lib/css --importer node_modules/sass-importer-node/sass-importer-node.js --quiet && nps report.sass',
        hiddenFromHelp: true,
      },
      babel: {
        script: 'babel tmp -d tmpp -q',
        hiddenFromHelp: true,
      },
      default: {
        script: 'nps report.start && nps lint && nps report.lint && tsc && nps report.tsc && nps build.babel && nps report.babel && nps build.sass && nps copy && nps report.copy && nps clean.temps && nps report.success',
        description: 'Build the module.',
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
    },
  }
};
