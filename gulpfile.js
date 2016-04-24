var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var cssnano = require('cssnano');
var del = require('del');
var browserSync = require('browser-sync').create();

var paths = {
  jade: 'src/jade/**/*.jade',
  html: 'build/**/*.html',
  css: 'build/css/*.css',
  sass: 'src/sass/**/*',
  scripts: ['src/js/**/*'],
  images: 'src/images/**/*'
};

/*-----------------------------
  * Clean
-----------------------------*/

gulp.task('clean', function() {
  return del(['build']);
});

gulp.task('clean:html', function() {
  return del(['build/*.html']);
});

/*-----------------------------
  * Jade
-----------------------------*/

gulp.task('jade', ['clean:html'], function() {
  var config = {
      pretty: true
  };

  return gulp.src('./src/jade/**/*.jade')
    .pipe($.jade(config))
    .pipe(gulp.dest('build'));
});

/*-----------------------------
  * Sass
-----------------------------*/

gulp.task('sass', function() {
  return gulp.src('./src/sass/*.sass')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest('./build/css/'));
});

/*-----------------------------
  * PostCss
-----------------------------*/

gulp.task('css', function() {
  var processors = [
    cssnano()
  ];

  return gulp.src('./build/css/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: ['last 2 version']}))
    .pipe($.postcss(processors))
    .pipe($.sourcemaps.write('.'))
    // .pipe($.uglify())
    .pipe(gulp.dest('./build/css/'));
});

/*-----------------------------
  * Javascript
-----------------------------*/

gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
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
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

/*-----------------------------
  * Watch
-----------------------------*/

gulp.task('watch', function() {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.css, ['css']);
  gulp.watch(paths.scripts, ['js']);
  gulp.watch(paths.images, ['images']);
});

/*-----------------------------
  * BrowserSync
-----------------------------*/

gulp.task('sync', ['watch'],function() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  watchList = [paths.css, paths.html, 'build/js/*.js'];

  gulp.watch(watchList).on('change', browserSync.reload);
});



gulp.task('default', ['watch']);
