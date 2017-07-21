import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const PATHS = {
  scripts: [
    'index.js',
    'src/**/*.js',
    'legacy/**/*.js',
  ],
};

const lint = () => gulp.src(PATHS.scripts)
  .pipe($.eslint())
  .pipe($.eslint.format());

const watch = () => {
  gulp.watch(PATHS.scripts, lint);
};

// Tasks
gulp.task('build', lint);

gulp.task('default', watch);
