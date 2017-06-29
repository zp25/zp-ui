const HTMLMINIFIER = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
};

const PATHS = {
  root: './',
  html: {
    src: 'example/**/*.html',
    dest: 'dist',
  },
  styles: {
    src: ['example/styles/**/*.{scss,css}', 'styles/**/*.{scss,css}'],
    tmp: '.tmp/styles',
    dest: 'dist/styles',
  },
  scripts: {
    src: ['example/scripts/**/*.js', 'src/**/*.js', 'legacy/**/*.js'],
    // browserify
    entries: {
      index: 'example/scripts/index.js',
      legacy: 'example/scripts/legacy.js',
    },
    // concat
    concat: [],
    // production不使用
    watch: [
      'example/scripts/misc/dev.js',
    ],
    tmp: '.tmp/scripts',
    dest: 'dist/scripts',
  },
  images: {
    src: 'example/images/**/*',
    tmp: '.tmp/images',
    dest: 'dist/images',
  },
  templates: {
    index: 'example/templates/index/*.hbs',
  },
  copy: ['example/*', '!example/*.html'],
  clean: ['.tmp', 'dist/*'],
  manifest: './rev-manifest.json',
  assets: ['.tmp', 'example', 'node_modules'],
};

const VENDOR = ['babel-polyfill'];

export {
  HTMLMINIFIER,
  PATHS,
  VENDOR,
};
