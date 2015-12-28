var gutil = require('gulp-util');
var path = require('path');
var newer = require('gulp-newer');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var taskName = path.basename(__filename, path.extname(__filename));

var defaultConfig = {
  'entry': [
    '<%= baseSrc %>/views/{,**/}index.scss'
  ],
  'src': [
    '<%= baseSrc %>/views/{,**/}*.scss'
  ],
  'dest': '<%= baseDest %>/assets/css',
  'options': {
    errLogToConsole: true,
    includePaths: [
      '<%= baseSrc %>/sass/',
    ]
  }
};

var gulp = null;
module.exports = function () {
  gulp = this;
  var conf = this.taskConfig(taskName, defaultConfig);

  function bundle() {
    return gulp.src(conf.entry)
      // .pipe(newer(conf.dest))
      .pipe(sass(conf.options))
      .pipe(prefix(['> 1%', 'last 2 version', 'ie 8', 'Firefox ESR', 'Opera 12.1'], { cascade: true }))
      .pipe(rename(function(pathObj) {
        if (pathObj.basename == 'index') {
          pathObj.basename = pathObj.dirname.split(path.sep).reverse()[0]
        }
        pathObj.dirname = '';
      }))
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
