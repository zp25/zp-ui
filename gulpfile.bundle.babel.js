import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import es from 'event-stream';
import {
  PATHS,
  VENDOR,
} from './constants';

const $ = gulpLoadPlugins();
const pwd = process.cwd();

const development = entry => b => BS => b.bundle()
  .on('error', $.util.log.bind($.util, 'Browserify Error'))
  .pipe(source(`bundle.${entry}.js`))
  .pipe(gulp.dest(PATHS.scripts.tmp))
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
    .pipe($.rev())
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(PATHS.scripts.dest));

// Scripts
const tmpBundle = BS => (done) => {
  const tasks = Object.keys(PATHS.scripts.entries).map((entry) => {
    const b = browserify({
      entries: PATHS.scripts.entries[entry],
      cache: {},
      packageCache: {},
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
  const tasks = Object.keys(PATHS.scripts.entries).map((entry) => {
    const b = browserify({
      entries: PATHS.scripts.entries[entry],
      cache: {},
      packageCache: {},
    });

    // exclude vendor
    VENDOR.forEach((lib) => {
      b.exclude(lib);
    });

    b.on('log', $.util.log);

    return production(entry)(b);
  });

  const manifest = gulp.src(PATHS.manifest);

  es.merge(tasks.concat(manifest))
    .pipe($.rev.manifest({
      base: pwd,
      merge: true,
    }))
    .pipe(gulp.dest(PATHS.root))
    .on('end', done);
};

const vendor = () => {
  const b = browserify();

  VENDOR.forEach((lib) => {
    b.require(lib);
  });

  b.on('log', $.util.log);

  return b.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer())
    .pipe(gulp.dest(PATHS.scripts.tmp))
    .pipe($.uglify())
    .pipe($.size({ title: 'vendor' }))
    .pipe($.rev())
    .pipe(gulp.dest(PATHS.scripts.dest))
    .pipe($.rev.manifest({
      base: pwd,
      merge: true,
    }))
    .pipe(gulp.dest(PATHS.root));
};

export { tmpBundle, bundle, vendor };
