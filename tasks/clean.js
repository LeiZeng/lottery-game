var path = require('path');
var del = require('del');
var gutil = require('gulp-util');

var gulp = null;

module.exports = function (cb) {
  gulp = this;

  gutil.log('Dest', gutil.colors.magenta(path.join(process.cwd(), gulp.opts.baseDest)), 'removed.');
  del([gulp.opts.baseDest], cb);
};

module.exports.use = function (gulp) {
  return module.exports.bind(gulp)
}
