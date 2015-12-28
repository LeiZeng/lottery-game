var _ = require('lodash');
var gutil = require('gulp-util');
var jade = require('jade');
var gulpJade = require('gulp-jade');

module.exports = function (conf) {
  var isPhp = conf && conf.injector && conf.injector == 'php';
  var isJsp = conf && conf.injector && conf.injector == 'jsp';

  var options = _.merge(conf, {
    jade: jade,
    locals: {
      php: php,
      jsp: jsp
    }
  });

  jade.filters.jsp = jsp;
  jade.filters.php = function(str) {
    return '\r\n' + php(str)
  };

  function jsp(str) {
    if (isJsp) {
      return str;
    }
    return '';
  }

  function php(str) {
    if (isPhp) {
      return ['<?php', String(str).trim(), '?>'].join(' ')
    }
    return '';
  }


  return gulpJade(options)
};
