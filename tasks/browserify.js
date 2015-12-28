var _ = require('lodash');
var rename = require('gulp-rename');
var es = require('event-stream');

var path = require('path');
var fs = require('fs');

var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

var globule = require('globule');

var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

var taskName = path.basename(__filename, path.extname(__filename));

var defaultConfig = {
  entry: [
    '<%= baseSrc %>/views/**/index.js'
  ],
  vendorJson: '<%= baseSrc %>/components/vendor.json',
  vendor: '<%= baseSrc %>/views/vendor/vendor.js',
  dest: '<%= baseDest %>/assets/js',
  options: {
    externalVendor: true
  }
};

var gulp = null;
module.exports = function () {
  gulp = this;
  var conf = this.taskConfig(taskName, defaultConfig);
  var entries = globule.find(conf.entry);
  var pkg, vendor;

  if (conf.options.externalVendor) {
    entries = [conf.vendor].concat(entries);
    try {
      pkg = JSON.parse(fs.readFileSync(conf.vendorJson))
    } catch (e) {

    }
    if (_.isObject(pkg) && _.isObject(pkg.browser)) {
      vendor = _.keys(pkg.browser);
    }
  }

  return es.merge.apply(gulp, _.map(entries, function (entryFile) {

    entryFile = path.join(process.cwd(), entryFile);

    var opts = {
      basedir: path.dirname(entryFile),
      vendor: vendor
    };

    var bundler = require('./libs/browser-bundler.js')(entryFile, gulp.isWatching
      ? _.merge(opts, watchify.args, {debug: true})
      : opts
    );

    if (gulp.isWatching) {
      bundler = watchify(bundler);
      bundler.on('update', bundle);
      bundler.on('time', function (time) {
        gutil.log(gutil.colors.cyan('watchify'),
          're-bundled', 'after', gutil.colors.magenta(time > 1000 ? time / 1000 + ' s' : time + ' ms'))
      });
    }

    function bundle() {
      return bundler.bundle()
        .on('error', function (e) {
          gutil.log('Browserify Error', wrapWithPluginError(e));
        })
        .pipe(source(entryFile))
        .pipe(rename(function (pathObj) {
          if (pathObj.basename == 'index') {
            pathObj.basename = pathObj.dirname.split(path.sep).reverse()[0];
          }
          pathObj.dirname = '';
        }))
        .pipe(checkedUglify())
        .pipe(gulp.dest(conf.dest))
    }

    return bundle();

  }));

};

function checkedUglify() {
  return gutil.env.prod ? streamify(uglify({
    compress: {
      pure_funcs: ['console.log']
    }
  })) : gutil.noop()
  // return streamify(uglify({
  //   compress: {
  //     pure_funcs: ['console.log']
  //   }
  // }))
}

function wrapWithPluginError(originalError) {
  var message, opts;
  if ('string' === typeof originalError) {
    message = originalError;
  } else {
    message = originalError.annotated || originalError.message;
    opts = {
      name: originalError.name,
      stack: originalError.stack,
      fileName: originalError.fileName,
      lineNumber: originalError.lineNumber
    };
  }

  return new gutil.PluginError('watchify', message, opts);
}


module.exports.use = function (gulp, opts) {
  if (opts) {
    defaultConfig = _.merge(defaultConfig, opts);
  }
  return module.exports.bind(gulp)
}
