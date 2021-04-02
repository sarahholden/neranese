'use strict';
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackconfig = require('../webpack.config.js');
const webpackstream = require('webpack-stream');

// CSS task
function css() {
  return gulp
    .src(['scss/**/*.scss.liquid', 'scss/*.scss.liquid'])
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('../assets/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest('../assets/'));
}

// Lint scripts
function vendorScripts() {
  return gulp
    .src([
      'js/vendor/modernizr.min.js',
      'js/vendor/gsap.min.js',
      'js/vendor/tweenmax.min.js',
      'js/vendor/splitText.min.js',
      'js/vendor/scrollTrigger.min.js',
      'js/vendor/lazysizes.min.js',
      'js/vendor/shopifyHelpers.js',
      'js/vendor/swiper.min.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../assets'))
}

// Lint scripts
function partialScripts() {
  return gulp
    .src(['js/partials/**'])
    .pipe(uglify())
    .pipe(gulp.dest('../assets'))
}

// Transpile, concatenate and minify scripts
function scripts() {
  return (
    gulp
      .src(['js/*'])
      .pipe(plumber())
      .pipe(webpackstream(webpackconfig, webpack))
      .pipe(gulp.dest('../assets'))
  );
}

/**
 * Optimize Images
 */
function imagesForAssets() {
  return gulp
    .src('images_for_assets/**')
    .pipe(newer('../assets/'))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest('../assets/'));
}

/**
 * Optimize Images (to upload to Shopify CMS)
 */
function imagesForShopify () {
  return gulp
    .src('images_for_shopify/**')
    .pipe(newer('images_for_shopify_optimized/'))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              collapseGroups: true
            }
          ]
        })
      ])
    )
    .pipe(gulp.dest('images_for_shopify_optimized/'));
}


// Watch files
function watchFiles() {
  gulp.watch('scss/**/*.scss', css);
  gulp.watch('js/vendor/*.js', gulp.series(vendorScripts));
  gulp.watch('js/partials/*.js', gulp.series(partialScripts));
  gulp.watch('js/theme.js', gulp.series(scripts));
  gulp.watch('images_for_assets/**', imagesForAssets);
  gulp.watch('images_for_shopify/**', imagesForShopify);
}



// define complex tasks
// const js = gulp.series(scripts);
// const build = gulp.series(clean, gulp.parallel(css, images, js));
const watch = gulp.parallel(watchFiles);

// export tasks
exports.images = imagesForAssets;
exports.images = imagesForShopify;
exports.css = css;
// exports.js = js;
exports.watch = watch;
