module.exports = {
  "setupFiles": [
    "./test-setup.js",
    "./test-shim.js"
  ],
  "moduleNameMapper": {
    "components(.*)$": "<rootDir>/src/components$1",
    "context(.*)$": "<rootDir>/src/components/context$1"
  }
}