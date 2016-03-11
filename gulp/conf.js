(function () {

  var gutil = require('gulp-util');

  exports.paths = {
    dist: 'dist',
    src: 'src'
  };

  exports.sassOptions = {
    outputStyle: 'compressed'
  };

  exports.errorHandler = function (inTitle) {
    return function (err) {
      gutil.log(gutil.colors.red('[' + inTitle + ']'), err.toString());
      this.emit('end');
    };
  };


}());
