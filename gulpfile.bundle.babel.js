import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserify from 'browserify';
import watchify from 'watchify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import es from 'event-stream';

const $ = gulpLoadPlugins();
const PATHS = {
  entries: {
    index: 'app/scripts/index.js',
    es6: 'app/scripts/index.es6.js',
  },
  tmp: '.tmp/scripts',
  dest: 'dist/scripts',
};
const VENDOR = ['babel-polyfill'];

const tmpBundle = BS => (done) => {
  const tasks = Object.keys(PATHS.entries).map((entry) => {
    const b = browserify({
      entries: PATHS.entries[entry],
      cache: {},
      packageCache: {},
      transform: [babelify],
      plugin: [watchify],
      debug: true,
    });

    // exclude vendor
    VENDOR.forEach((lib) => {
      b.exclude(lib);
    });

    // 只有执行bundle()后watchify才能监听update事件
    b.on('update', () => development(entry)(b)(BS));
    b.on('log', $.util.log);

    return development(entry)(b)(BS);
  });

  es.merge(tasks).on('end', done);
};

const bundle = (done) => {
  const tasks = Object.keys(PATHS.entries).map((entry) => {
    const b = browserify({
      entries: PATHS.entries[entry],
      cache: {},
      packageCache: {},
      transform: [babelify],
    });

    // exclude vendor
    VENDOR.forEach((lib) => {
      b.exclude(lib);
    });

    b.on('log', $.util.log);

    return production(entry)(b);
  });

  es.merge(tasks).on('end', done);
};

// Scripts
const development = entry => b => BS => b.bundle()
  .on('error', $.util.log.bind($.util, 'Browserify Error'))
  .pipe(source(`bundle.${entry}.js`))
  .pipe(gulp.dest(PATHS.tmp))
  .pipe(BS.stream({ once: true }));

const production = entry => b => b.bundle()
  .on('error', $.util.log.bind($.util, 'Browserify Error'))
  .pipe(source(`bundle.${entry}.js`))
  .pipe(buffer())
  .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.uglify({
      // preserveComments: 'license',
      compress: {
        global_defs: {
          'DEV': false,
        },
      },
    }))
    .pipe($.size({ title: 'scripts' }))
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(PATHS.dest));

function vendor() {
  const b = browserify();

  VENDOR.forEach((lib) => {
    b.require(lib);
  });

  b.on('log', $.util.log);

  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(gulp.dest(PATHS.tmp))
    .pipe($.uglify())
    .pipe($.size({ title: 'vendor' }))
    .pipe(gulp.dest(PATHS.dest));
}

export { tmpBundle, bundle, vendor };
