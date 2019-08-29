module.exports = {
  "env": {
    "development": {
      "presets": [
        ["@babel/env", {
          "useBuiltIns": "entry",
          "corejs": "3.0.0",
          "targets": {
            "chrome": 35.0
          }
        }],
        "@babel/preset-typescript",
        "@csegames/linaria/babel"
      ],
      "plugins": [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-jsx",
        ["babel-plugin-emotion", { "sourceMap": true, "autoLabel": true, "hoist": true }],
        "@babel/plugin-transform-react-jsx",
        "babel-plugin-transform-react-display-name",
        "babel-plugin-graphql-tag",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-transform-modules-commonjs",
        "@babel/proposal-class-properties",
			  "@babel/proposal-object-rest-spread"
      ]
    },
    "production": {
      "presets": [
        ["@babel/env", {
          "useBuiltIns": "entry",
          "corejs": "3.0.0",
          "targets": {
            "chrome": 35.0
          }
        }],
        "@babel/preset-typescript",
        "@csegames/linaria/babel"
      ],
      "plugins": [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-jsx",
        ["babel-plugin-emotion", { "sourceMap": true, "autoLabel": false, "hoist": true }],
        "@babel/plugin-transform-react-jsx",
        "babel-plugin-transform-react-display-name",
        "babel-plugin-graphql-tag",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-transform-modules-commonjs",
        "@babel/proposal-class-properties",
			  "@babel/proposal-object-rest-spread"
      ]
    }
  }
}
