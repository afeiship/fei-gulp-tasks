(function () {

  var gulp = require('gulp');
  var wrench = require('wrench');

  /**
   *  This will load all js or coffee files in the gulp directory
   *  in order to load all gulp tasks
   */
  wrench.readdirSyncRecursive('./gulp').map(function (file) {
    require('./gulp/' + file);
  });


}());
