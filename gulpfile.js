"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const del = require("del");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const imagemin = require("gulp-imagemin");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");

// initialize browsersync
function browserSyncInit() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "dist"
    }
  });
}

// reload browsersync
function reload(done) {
  browserSync.reload();
  done();
}

// clean assets
function clean() {
  return del(["'dist/**'"]);
}

// handle html
function html() {
  return gulp.src("./src/*.html").pipe(gulp.dest("./dist"));
}

// handle css
function style() {
  return gulp
    .src("./src/styles/styles.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer("last 2 versions"), cssnano()]))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

// handle js
function scripts() {
  return gulp
    .src("./src/scripts/scripts.js")
    .pipe(
      webpackStream(webpackConfig),
      webpack
    )
    .pipe(gulp.dest("./dist/js"));
}

// optimize images
function images() {
  return gulp
    .src("./src/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/images"));
}

// watch files
function watchFiles() {
  gulp.watch("./src/*.html", gulp.series(html, reload));
  gulp.watch("./src/styles/**/*.scss", style);
  gulp.watch("./src/scripts/**/*.js", gulp.series(scripts, reload));
  gulp.watch("./src/images/**/*", gulp.series(images, reload));
}

const watch = gulp.parallel(watchFiles, browserSyncInit);
const build = gulp.series(clean, gulp.parallel(html, style, scripts, images));

exports.watch = watch;
exports.build = build;
