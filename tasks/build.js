var path = require('path')
var gutil = require('gulp-util');
var runSequence = require('run-sequence');

var gulp = null;
module.exports = function (cb) {
  gulp = this;
  gutil.log(
    gutil.colors.magenta(gulp.opts.baseSrc),
    'will', gulp.isWatching ? 'watch for building' : 'build', 'to',
    gutil.colors.magenta(gulp.opts.baseDest)
  );
  runSequence.apply(gulp, [].concat(gulp.opts.devTarget.buildQueue).concat(cb))
};

module.exports.use = function (gulp) {
  return module.exports.bind(gulp)
}
