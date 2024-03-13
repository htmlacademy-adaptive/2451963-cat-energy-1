import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import imagemin from 'gulp-imagemin';

const { src, dest, watch, series } = gulp;
const { stream, init, reload } = browser;

// Minify HTML

const minifyHTML = () => {
  return src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('build'));
}

// Styles

export const styles = () => {
  return src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(dest('build/css', { sourcemaps: '.' }))
    .pipe(stream());
}

// Optimize images

const optimizeImages = () => {
  return src('source/img/**/*')
    .pipe(imagemin())
    .pipe(dest('build/img'));
}

// Fonts

const fonts = () => {
  return src([
    'source/fonts/**/*.woff',
    'source/fonts/**/*.woff2'
  ])
    .pipe(dest('build/fonts'));
}

// Server

const server = (done) => {
  init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  watch('source/sass/**/*.scss', series(styles));
  watch('source/*.html').on('change', series(minifyHTML, reload));
}

// Build

const build = series(styles, minifyHTML, optimizeImages, fonts)

export default series(
  build,
  server,
  watcher
);
