var nodeModulePlugin = require("rollup-plugin-node-resolve");
var commonjsPlugin = require("rollup-plugin-commonjs");
var jsonPlugin = require("rollup-plugin-json");

// The `tar` package specifies file modes with leading zeroes. Unfortunately,
// this does not parse in Javascript 'strict mode', which Rollup's parser uses
// to slurp in commonjs-based modules. This plugin re-writes instances to their
// ordinary octal equivalents.
//
// @TODO: upgrade `tar` in favor the modern version that doesn't do anything
//        fussy with regards to leading 0s, and remove this plugin.
var rewriteLeadingZeroPlugin = {
  transform: function(code, id) {
    if (id.indexOf("node_modules/tar") < 0) return;

    return {
      code: code.replace(/\b0\d+\b/g, function(match) {
        return parseInt(match, 8);
      }),
      map: { mappings: "" }
    };
  }
};

module.exports = {
  input: "index.js",
  output: {
    file: "bundle.js",
    format: "cjs"
  },
  plugins: [
    rewriteLeadingZeroPlugin,
    nodeModulePlugin(),
    commonjsPlugin(),
    jsonPlugin()
  ]
};
