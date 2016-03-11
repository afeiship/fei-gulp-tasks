(function () {

  var path = require('path');
  var gulp = require('gulp');
  var del = require('del');
  var conf = require('./conf');
  var sass = require('gulp-sass');


  gulp.task('sass', function () {
    console.log(path.join(
      conf.paths.src, '/sass/*.scss'
    ));
    return gulp.src(path.join(
      conf.paths.src, '/sass/*.scss'
      ))
      .pipe(sass(conf.sassOptions).on('error', sass.logError))
      .pipe(gulp.dest(
        path.join(conf.paths.dist, '/css')
      ));
  });


  gulp.task('sass:watch', function () {
    gulp.watch(conf.paths.src, '/sass/*.scss', ['sass'])
  });


}());
