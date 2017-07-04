import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

// Lint JavaScript
const lint = () => gulp.src('src/**/*.js')
  .pipe($.eslint())
  .pipe($.eslint.format());

// Tasks
gulp.task('default', lint);
