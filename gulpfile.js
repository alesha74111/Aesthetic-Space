const {src, dest, watch, parallel, series} = require('gulp');

const scss   = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default; 
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const svgSprite = require('gulp-svg-sprite');
const include = require('gulp-include');

function pages() {
  return src('docs/pages/*.html')
    .pipe(include({
      includePaths: 'docs/components'
    }))
    .pipe(dest('docs'))
    .pipe(browserSync.stream())
}

function fonts() {
  return src('docs/fonts/src/*.*')
    .pipe(fonter({
      formats: ['woff', 'ttf']
    }))
    .pipe(src('docs/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('docs/fonts'))
}

function images(){
  return src(['docs/images/src/**/*.*', '!docs/images/src/**/*.svg'])
    .pipe(newer('docs/images'))
    .pipe(avif({ quality : 50}))

    .pipe(src('docs/images/src/**/*.*'))
    .pipe(newer('docs/images'))
    .pipe(webp())

    .pipe(src('docs/images/src/**/*.*'))
    .pipe(newer('docs/images'))
    .pipe(imagemin())

    .pipe(dest('docs/images'))
}

function sprite () {
  return src('docs/images/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true 
        }
      }
    }))
    .pipe(dest('docs/images'))
}

function scripts() {
  return src([
    'node_modules/swiper/swiper-bundle.js',
    'docs/js/main.js',
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('docs/js'))
    .pipe(browserSync.stream())
}

function styles() {
  return src('docs/scss/style.scss')
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(scss({ outputStyle: 'compressed' }))
    .pipe(dest('docs/css'))
    .pipe(browserSync.stream())
}

function watching() {
  browserSync.init({
    server: {
      baseDir: "docs/"
    }
  });
  watch(['docs/scss/style.scss','docs/scss/media.scss'], styles)
  watch(['docs/images/src'], images)
  watch(['docs/js/main.js'], scripts)
  watch(['docs/components/*', 'docs/pages/*'], pages)
  watch(['docs/*.html']).on('change', browserSync.reload);
}


function cleanDist() {
  return src('dist')
    .pipe(clean())
}

function building() {
  return src([
    'docs/css/style.min.css',
    '!docs/images/**/*.html',
    'docs/images/*.*',
    '!docs/images/*.svg',
    'docs/images/sprite.svg',
    'docs/fonts/*.*',
    'docs/js/main.min.js',
    'docs/**/*.html'
  ], {base : 'docs'})
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.images = images;
exports.fonts = fonts;
exports.pages = pages;
exports.building = building;
exports.sprite = sprite;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, pages, watching);
