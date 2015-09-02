var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var nodemon    = require('gulp-nodemon');
var qunit = require('node-qunit-phantomjs');

gulp.task('test', function() {
  qunit('./public/unittest/createcalctest.html');
});

gulp.task('js', function() {
  return gulp.src(['server.js', 'public/app/*.js', 'public/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], ['js']);
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'server.js',
    ext: 'js html'
  })
    .on('start', ['test'])
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function() {
      console.log('Restarted!');
    });
});

gulp.task('default', ['nodemon']);
