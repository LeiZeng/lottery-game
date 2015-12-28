var _ = require('lodash');
var path = require('path');
var gutil = require('gulp-util');

module.exports = function () {

  var opts = {
    'drupalRoot': 'htdocs',
    'default': {},
    'drupal': {},
    'module': {},
    'theme': {},
    'feature': {}
  };

  opts = _.merge(opts, this.opts);

  opts.destination = {
    "theme": "<%= drupalRoot %>/sites/all/themes/custom",
    "module": "<%= drupalRoot %>/sites/all/modules/custom",
    "feature": "<%= drupalRoot %>/sites/all/modules/features",
    "drupal": "<%= drupalRoot %>"
  };

  // --dev=:devType
  var envInputDevType = gutil.env.dev || gutil.env.d;
  // --name=:devName
  var envInputDevName = gutil.env.name || gutil.env.n;


  var devType = _.has(opts.destination, envInputDevType) ? envInputDevType : _.keys(opts.destination)[0];

  if (devType == 'drupal') {

    opts.baseSrc = ['src', devType].join('.');
    opts.baseDest = [opts.destination[devType]].join('/');
  } else if (!!devType) {
    var devName = envInputDevName || opts.default[devType];
    var devNameList = _.keys(opts[devType]);

    if (!_.isEmpty(devNameList)) {
      opts.default[devType] = _.indexOf(devNameList, devName) > -1 ? devName : devNameList[0];

      opts.baseSrc = ['src', devType, opts.default[devType]].join('.');
      opts.baseDest = [opts.destination[devType], opts.default[devType]].join('/');
    }
  }

  opts.devTarget = _.merge({
      buildQueue: [],
      tasks: {}
    },
    opts[devType][opts.default[devType]] || opts[devType]);

  opts = render(opts, opts);

  this.opts = opts;

  this.taskConfig = function (taskName, defaultConfig) {
    return render(_.merge(defaultConfig, opts.devTarget.tasks[taskName]), opts);
  }

};

function render(target, data) {
  return JSON.parse(_.template(JSON.stringify(target), data));
}
