var gulp = require('./tasks');

gulp.config({
  baseDest: 'dest'
})

gulp.task('clean', gulp.require('clean'));
gulp.task('sass', gulp.require('sass'));
gulp.task('jade', gulp.require('jade'));
gulp.task('mirror', gulp.require('mirror'));
gulp.task('browserify', gulp.require('browserify'));
gulp.task('server', gulp.require('server'));

gulp.task('build', ['clean'], function() {
  return gulp.queue([
    'sass',
    'jade',
    'browserify',
    'mirror'
  ])();
})
gulp.task('default', ['clean'], function(cb) {
  gulp.setWatcher();
  return gulp.queue([
    'sass',
    'jade',
    'browserify',
    'mirror',
    'server'
  ])(cb);
})
