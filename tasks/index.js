var gulp = require('gulp');
var gutil = require('gulp-util');
var _ = require('lodash');
var runSequence = require('run-sequence');
var watcher = require('./libs/watcher').use(gulp);

gulp.opts = {
  baseSrc: 'src',
  baseDest: 'dist'
}

gulp.config = function(conf) {
  gulp.opts = _.merge(gulp.opts, conf);
}

gulp.require = function(task) {
  return require('./' + task).use(gulp)
}

gulp.queue = function(tasks) {
  return runSequence.bind(gulp, tasks)
}

require('./libs/config-fix').call(gulp, null);

// --watch for enable
if (gutil.env.watch) {
  gulp.setWatcher();
}

module.exports = gulp;
