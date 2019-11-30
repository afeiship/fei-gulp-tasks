(function() {
  var gulp = require("gulp");
  var prefix = require("../plugins/prefix");

  gulp.task("prefix", function() {
    return gulp
      .src("./src/prefix-demo.js")
      .pipe(prefix("__add__"))
      .pipe(gulp.dest("dist"));
  });
})();
