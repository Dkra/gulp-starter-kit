var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var cssnano = require('cssnano');
var del = require('del');
var browserSync = require('browser-sync').create();

/*****************************
  * Tasks

  - clean
  - jade
  - sass
  - postcss
  - js
  - images
  - build
  - watch
  - sync

*****************************/

var path = {
  // source
  src: 'src/',
  jade: 'src/jade/**/*.jade',
  sass: 'src/sass/**/*.sass',
  scripts: ['src/js/**/*.js'],
  images: 'src/images/**/*',
  // build
  build: 'build/',
  html: 'build/**/*.html',
  css: 'build/css/*.css',
  js: 'build/js/*.js'
};

/*-----------------------------
  * Clean
-----------------------------*/

gulp.task('clean', function() {
  return del([path.build]);
});

/*-----------------------------
  * Jade
-----------------------------*/

gulp.task('jade', function() {
  var config = {
      pretty: true
  };

  return gulp.src(path.jade)
    .pipe($.jade(config))
    .pipe(gulp.dest(path.build));
});

/*-----------------------------
  * Sass
-----------------------------*/

gulp.task('sass', function() {
  return gulp.src(path.sass)
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css/'));
});

/*-----------------------------
  * PostCss
-----------------------------*/

gulp.task('css', function() {
  var processors = [
    cssnano()
  ];

  return gulp.src(path.css)
    // .pipe($.sourcemaps.init({loadMaps: true}))
    .pipe($.autoprefixer({browsers: ['last 2 version']}))
    .pipe($.postcss(processors))
    .pipe($.sourcemaps.write())
    // .pipe($.uglify())
    .pipe(gulp.dest('build/css/'));
});

/*-----------------------------
  * Js
-----------------------------*/

gulp.task('js', function() {
  return gulp.src(path.scripts)
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.uglify())
    .pipe($.concat('main.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'));
});

/*-----------------------------
  * Images
-----------------------------*/

gulp.task('images', ['clean'], function() {
  return gulp.src(path.images)
    .pipe($.imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

/*-----------------------------
  * Build
-----------------------------*/

gulp.task('build', ['clean', 'jade', 'sass', 'css', 'js', 'images']);

/*-----------------------------
  * Watch
-----------------------------*/

gulp.task('watch', function() {
  gulp.watch(path.jade, ['jade']);
  gulp.watch(path.sass, ['sass']);
  gulp.watch(path.css, ['css']);
  gulp.watch(path.scripts, ['js']);
  gulp.watch(path.images, ['images']);
});

/*-----------------------------
  * BrowserSync
-----------------------------*/

gulp.task('sync', ['watch'],function() {
  // Reload List
  const reloadList = [path.css, path.html, path.js];

  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch(reloadList).on('change', browserSync.reload);
});



gulp.task('default', ['sync']);
