var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var cssnano = require('cssnano');
var del = require('del');

var paths = {
  scripts: [],
  images: './src/images/**/*'
};

gulp.task('clean', function() {
  return del(['build']);
});

gulp.task('clean:html', function() {
  return del(['build/html']);
});

gulp.task('jade', ['clean:html'], function() {
  var config = {
      pretty: true
  };

  return gulp.src('./src/jade/**/*.jade')
    .pipe($.jade(config))
    .pipe(gulp.dest('build/html'));
});

gulp.task('sass', function() {
  return gulp.src('./src/sass/*.sass')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('css', ['sass'], function() {
  var processors = [
    cssnano()
  ];

  return gulp.src('./build/css/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.postcss(processors))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css/'));
});

// Javascript Babel(es6) + Eslint +  uglify
gulp.task('js', function() {
  return gulp.src('src/js/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
    .pipe($.concat('all.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('images', ['clean'], function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['watch'], function() {

});
