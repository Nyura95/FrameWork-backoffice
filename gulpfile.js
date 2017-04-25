var gulp        = require('gulp'),
    server      = require('gulp-express');

gulp.task('server', function () {
    setTimeout(function () {
      // Start the server at the beginning of the task
      server.run(['app.js']);
      // Restart the server when file changes
      gulp.watch(['*.js', './modules/*.js', './routes/*.js', './routes/**/*.js', './modules/**/*.js']);

      process.stdin.setMaxListeners(0);
    }, 500);

});

gulp.task('default', ['server'], function() {
  gulp.watch(['*.js', './modules/*.js', './routes/*.js', './routes/**/*.js', './modules/**/*.js'], ['server']);
});
