var gutil = require('gulp-util');
var path = require('path');
var jade = require('gulp-jade');
var newer = require('gulp-newer');
var taskName = path.basename(__filename, path.extname(__filename));

var defaultConfig = {
  'entry': [
    '<%= baseSrc %>/views/**/index.jade'
  ],
  'src': [
    '<%= baseSrc %>/{,**/}*.jade'
  ],
  'dest': '<%= baseDest %>/pages',
  'options': {
    'pretty': true
  }
};

var gulp = null;
module.exports = function () {
  gulp = this;
  var conf = this.taskConfig(taskName, defaultConfig);

  function bundle() {
    return gulp.src(conf.entry)
      .pipe(newer(conf.dest))
      .pipe(jade(conf.options))
      .on('error', gutil.log.bind(gulp))
      .pipe(gulp.dest(conf.dest))
      .pipe(gulp.pipeTimer(taskName))
  }

  gulp.watcher([].concat(conf.src), function (evt) {
    gutil.log(evt.path, evt.type);
    bundle();
  });

  return bundle();
};

module.exports.use = function (gulp, opts) {
  if (opts) {
    defaultConfig = _.merge(defaultConfig, opts);
  }
  return module.exports.bind(gulp)
}
