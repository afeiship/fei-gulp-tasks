(function() {

  'use strict';

  var gulp = require('gulp');
  var config = require('./config');
  var argv = require('yargs').argv;
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
  });

  /**
   * @thanks to:
   * http://www.jianshu.com/p/d616d3bf391f
   */

  gulp.task('bump-json', function() {
    gulp.src(['./package.json'])
      .pipe($.bump())
      .pipe(gulp.dest('./'));
  });

  gulp.task('bump-js',function(){
    gulp.src(['./src/app-cache.js'])
    .pipe($.bump())
    .pipe(gulp.dest('./src/'));
  });

  gulp.task('bump',function(){
    gulp.start([
      'bump-json',
      'bump-js'
    ]);
  });

}());
