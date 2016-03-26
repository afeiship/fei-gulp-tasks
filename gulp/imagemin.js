(function () {

  var gulp = require('gulp');
  var imagemin = require('gulp-imagemin');
  var pngquant = require('imagemin-pngquant');
  var conf=require('./conf');


  gulp.task('imagemin', function () {
    return gulp.src([path.join(conf.paths.src, '/images/**/*')])
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
      }))
      .pipe(gulp.dest(path.join(conf.paths.dist, '/images')));
  });


}());
