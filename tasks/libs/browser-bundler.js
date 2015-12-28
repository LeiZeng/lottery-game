var jade = require('jade');
var brProcessor = require('br-processor');
var browserify = require('browserify');
var _ = require('lodash');

var path = require('path');

var processorList = [
  {
    matchTest: function(file) {
      return /\.jade$/.exec(file);
    },
    process: function(inputString) {
      return html2jsWraper(jade.render(inputString, {}));
    }
  }
];

module.exports = function(entryFile, opts) {
  var isVendor = /vendor\.js$/.exec(entryFile);
  var bundler;
  if (isVendor) {
    bundler = browserify(opts);

    _.forEach(opts.vendor, function(packageName) {
      bundler.require(packageName)
    });
  } else {
    bundler = browserify(opts);
    bundler.add(entryFile);
    _.forEach(opts.vendor, function(packageName) {
      bundler.external(packageName)
    });
  }

  // add any other browserify options or transforms here
  bundler.transform('reactify', {
    "es6": true
  });
  bundler.transform('browserify-shim');

  bundler.transform({
    processorList: processorList
  }, brProcessor);

  // bundler.plugin(require('bundle-collapser/plugin'));

  return bundler;
};

function html2jsWraper(string) {
  return [
    'module.exports=',
    escapeContent(string),
    ';'
  ].join('\'')
}

function escapeContent(content) {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/'/g, '\\\'')
    .replace(/\r?\n/g, '\\n\' +\n    \'');
}
