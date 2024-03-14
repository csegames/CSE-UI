module.exports = {
    "retainLines": true,
    "presets": [
        ["@babel/env", {
        "useBuiltIns": "entry",
        "corejs": 2,
        "targets": {
            "chrome": 35.0
        }
        }]
    ],
    "plugins": [
        "@babel/syntax-jsx",
        "@babel/transform-react-jsx",
        "@babel/transform-runtime",
        "@babel/transform-modules-commonjs",
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread"
    ]
}