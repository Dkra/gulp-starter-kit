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


gulp.task('sass', function() {
  return gulp.src('./src/sass/*.sass')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('css', ['sass'], function() {
  var processors = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano(),
  ];

  return gulp.src('./build/css/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.postcss(processors))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./build/css/'));
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
