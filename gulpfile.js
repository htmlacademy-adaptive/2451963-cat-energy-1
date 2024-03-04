import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import uglify from 'gulp-uglify';

// Scripts

const scripts = () => {
  return gulp.src('source/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
}

// Minify HTML

const minifyHTML = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Optimize Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'));
}

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

//Build

const build = gulp.series(gulp.parallel(styles, optimizeImages, minifyHTML, scripts));

export default gulp.series(
  build,
  server,
  watcher
);
