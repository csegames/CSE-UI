module.exports = {
  "setupFiles": [
    "./test-setup.js",
    "./test-shim.js"
  ],
  "moduleNameMapper": {
    "^hudlib(.*)$": "<rootDir>/src/lib$1",
    "^hud(.*)$": "<rootDir>/src/components/hud$1",
    "^fullscreen(.*)$": "<rootDir>/src/components/fullscreen$1",
    "^shared(.*)$": "<rootDir>/src/components/shared$1",
    "^utils(.*)$": "<rootDir>/src/components/utils$1",
    "^gql(.*)$": "<rootDir>/src/gql$1",
    "^components(.*)$": "<rootDir>/src/components$1",
    "^actions(.*)$": "<rootDir>/src/services/actions$1",
    "^services(.*)$": "<rootDir>/src/services$1",
    "^cseshared(.*)$": "<rootDir>/src/../../../shared$1",
  }
}
