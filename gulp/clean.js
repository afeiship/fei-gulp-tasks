(function () {

  var gulp = require('gulp');
  var del = require('del');
  var conf=require('./conf');

  gulp.task('clean', function () {
    return del('dist');
  });


}());
