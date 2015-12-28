var gutil = require('gulp-util');
var connect = require('gulp-connect');
var path = require('path');
var compression = require('compression')

var gulp = null;
module.exports = function () {
  var port = gutil.env.port || gutil.env.p || 9999
  gulp = this;

  if (gulp.isWatching) {
    connect.server({
      middleware: function(connect, opt) {
        return [
          compression()
        ]
      },
      root: [
        gulp.opts.baseDest
      ],
      port: port
    });
  }
};

module.exports.use = function (gulp) {
  return module.exports.bind(gulp)
}
