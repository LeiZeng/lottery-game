var fs = require('fs');
var gulp = require('gulp');
var _ = require('lodash');
var gutil = require('gulp-util');
var es = require('event-stream');
var path = require('path');
var tps = require('./ckeditor.templates.js');
var html = fs.readFileSync('./html.ejs').toString();

var style = '/sites/all/themes/custom/sunbk/css/main.css'
var classes = 'ckeditor'

es.readArray(tps)
  .pipe(es.map(function(item, callback) {
    item.style = item.style || style;
    item.classes = item.classes || classes;
    var file = new gutil.File({
      cwd: __dirname,
      path: path.join(__dirname, (item.title || 'no title').replace(/[\-\s]+/g, '-').toLowerCase() + '.html'),
      contents: new Buffer(_.template(html, item))
    });

    callback(null, file)
  }))
  .pipe(gulp.dest('../templates'))