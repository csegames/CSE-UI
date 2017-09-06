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
    copy: {
      misc: 'copyup src/assets/**/* src/third-party/**/* src/sounds/**/* src/images/**/* src/font/**/* src/**/*.html src/videos/**/* dist/ui src/dev.config.js dist/ui',
      patcher: 'copyup dist/ui/**/* PatchClient/cpui'
    },
    babel: 'babel tmp -d tmpp',
    browserify: {
      default: 'mkdirp dist/ui/js && browserify tmpp/index.js -o dist/ui/js/%npm_package_config_name%.js --fast --noparse=FILE -u camelot-unchained -u es6-promise -u eventemitter3 -u isomorphic-fetch -u moment -u node-xmpp-client -u normalizr -u react -u react-addons-css-transition-group -u react-dom  -u react-redux -u react-tap-event-plugin -u redux -u redux-thunk -u reflux',
      lib: 'mkdirp dist/ui/js && browserify -r camelot-unchained -r es6-promise -r eventemitter3 -r isomorphic-fetch -r moment -r node-xmpp-client -r normalizr -r react -r react-addons-css-transition-group -r react-dom  -r react-redux -r react-tap-event-plugin -r redux -r redux-thunk -r reflux > dist/ui/js/lib.js'
    },
    build: {
      sass: 'node-sass src -o dist/ui/css --importer node_modules/sass-importer-node/sass-importer-node.js',
      default: 'rimraf tmp && rimraf tmpp && rimraf dist/ui && nps browserify.lib && nps lint && nps build.sass && nps copy.misc -s && tsc && nps babel && nps browserify && rimraf tmp && rimraf tmpp'
    },
    publish: 'nps build',
    serve: 'http-server -p 9000 dist/ui/',
    debug: 'nps build && nps copy.patcher && nps patcher',
    patcher: 'cd Patchclient && start CamelotUnchained.exe canPatchSelf=0 outputUI=0'
  }
};
