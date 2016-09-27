import gulp from 'gulp';
import del from 'del';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

const $ = gulpLoadPlugins();
const BS = browserSync.create();
const AUTOPREFIXER_CONFIG = { browsers: ['last 1 version'] };
const PATHS = {
  html: {
    src: 'app/**/*.html',
  },
  styles: {
    src: 'app/styles/**/*.{scss,css}',
    tmp: '.tmp/styles',
  },
  scripts: {
    src: 'app/scripts/**/*.js',
    concat: [
      'app/scripts/utils/**/*.js',
      'app/scripts/main.js'
    ],
    entries: [
      'app/scripts/main.es6.js'
    ],
    tmp: '.tmp/scripts',
  },
  images: {
    src: 'app/images/**/*',
  },
  assets: ['.tmp', 'app', 'node_modules'],
};
const VENDOR = ['babel-polyfill'];

// Lint JavaScript
function lint() {
  return gulp.src(PATHS.scripts.src)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!BS.active, $.eslint.failOnError()))
}

// Styles
function sass() {
  const processors = [
    autoprefixer(AUTOPREFIXER_CONFIG)
  ];

  return gulp.src(PATHS.styles.src)
    .pipe($.newer(PATHS.styles.tmp))
    .pipe($.sourcemaps.init())
      .pipe($.sass({ precision: 10 })
        .on('error', $.sass.logError)
      )
      .pipe($.postcss(processors))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(PATHS.styles.tmp))
    .pipe(BS.stream({ once: true }));
}

// Scripts
function vendor() {
  const b = browserify({
    debug: true,
  });

  VENDOR.forEach(lib => {
    b.require(lib);
  });

  b.on('log', $.util.log);

  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(gulp.dest(PATHS.scripts.tmp));
}

function script() {
  return gulp.src(PATHS.scripts.concat)
    .pipe($.newer(PATHS.scripts.tmp))
    .pipe($.sourcemaps.init())
      .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(PATHS.scripts.tmp))
    .pipe(BS.stream({ once: true }));
}

function bundle() {
  const b = browserify({
    entries: PATHS.scripts.entries,
    cache: {},
    packageCache: {},
    transform: [babelify],
    plugin: [watchify],
    debug: true,
  });

  VENDOR.forEach(lib => {
    b.exclude(lib);
  });

  // 只有执行bundle()后watchify才能监听update事件
  b.on('update', () => development(b));
  b.on('log', $.util.log);

  return development(b);
}

function development(b) {
  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(PATHS.scripts.tmp))
    .pipe(BS.stream({ once: true }));
}

// Serve
function serve() {
  BS.init({
    notify: false,
    logPrefix: 'components',
    server: {
      baseDir: PATHS.assets,
    },
    port: 3000,
  });

  gulp.watch(PATHS.html.src).on('change', BS.reload);
  gulp.watch(PATHS.styles.src, sass);
  gulp.watch(PATHS.images.src).on('change', BS.reload);

  gulp.watch(PATHS.scripts.src, lint);
  gulp.watch(PATHS.scripts.concat, script);
}

// Clean output directory
function cleanTmp() {
  return del(['.tmp']);
}

// Tasks
gulp.task('clean', gulp.series(cleanTmp, vendor));
gulp.task(vendor);
gulp.task(script);
gulp.task(bundle);

// run scripts, sass first and run browserSync before watch
gulp.task('default',
  gulp.series(
    gulp.parallel(script, bundle, sass),
    serve
  )
);
