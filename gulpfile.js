"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    stylus = require("gulp-stylus"),
    sourcemaps = require("gulp-sourcemaps"),
    del = require("del"),
    gutil = require("gulp-util"),
    autoprefixer = require("gulp-autoprefixer"),
    browserSync = require("browser-sync").create(),
    runSequence = require("run-sequence"),
    cp = require("child_process"),
    ghPages = require('gulp-gh-pages');


// Options

var options = {
    src: "src",
    dist: "dist"
}

var errorHandler = function (title) {
  return function(err) {
    gutil.log(gutil.colors.red("[" + title + "]"), err.toString());
    this.emit("end");
  };
};


//Tasks

gulp.task("build:scripts", function () {
    return gulp.src([options.src + "/assets/_js/main.js",
                     options.src + "/assets/_js/second.js"])
        .pipe(sourcemaps.init())
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(options.dist + "/assets/js"))
});


gulp.task("build:stylus", function(){
    return gulp.src(options.src + "/assets/_stylus/main.styl")
        .pipe(sourcemaps.init())
        .pipe(stylus())
        .on("error", errorHandler("stylus error"))
        .pipe(autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(options.dist + "/assets/css"))
        .pipe(browserSync.stream())
        .on("error", gutil.log);
})



// Special tasks for building and then reloading BrowserSync
gulp.task('build:jekyll:watch', ['build:jekyll'], function(cb) {
  browserSync.reload();
  cb();
});

gulp.task('build:scripts:watch', ['build:scripts'], function(cb) {
  browserSync.reload();
  cb();
});
//--


gulp.task("build:jekyll", function (done) {
    return cp.spawn("jekyll", ["build"], {stdio: "inherit"})
             .on("error", gutil.log)
             .on("close", done);
});


gulp.task("build", function(cb) {
    runSequence(
        "clean",
        ["build:scripts", "build:stylus"],
        "build:jekyll",
        cb);
});


gulp.task("clean", function(){
    return del("dist");
})


gulp.task("default", ["build"], function() {

    browserSync.init({
        server: options.dist,
        ogFileChanges: true
    });

  // Watch site settings
  gulp.watch(["_config.yml"], ["build:jekyll:watch"]);

  // Watch app .scss files, changes are piped to browserSync
  gulp.watch(options.src + "/**/*.styl", ["build:stylus"]);

  // // Watch app .js files
  gulp.watch(options.src + "/**/*.js", ["build:scripts:watch"]);

  // // Watch Jekyll posts
  // gulp.watch("_posts/**/*.+(md|markdown|MD)", ["build:jekyll:watch"]);

  // Watch Jekyll html files
  gulp.watch(options.src + "/**/*.html", ["build:jekyll:watch"]);

});


gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

































