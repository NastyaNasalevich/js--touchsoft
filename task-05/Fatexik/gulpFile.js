/* global require */
var gulp = require('gulp');
var gulpConcat = require('gulp-concat');
var inject = require('gulp-js-html-inject');
var minifyJs = require('gulp-minify');
var minifyCss = require('gulp-cssmin');

gulp.task("allJsInFile", ['cssMinify'], function gulpTask() {
    gulp.src(["app/js/Dashboard/DataBaseConnection.js", "app/js/Dashboard/DashboardUpdateUsers.js", "app/js/config/*.js",
        "app/js/about/*.js", "app/js/controller.js"])
        .pipe(gulpConcat("example_concat.js"))
        .pipe(inject({
            basepath: "app/html/"
        }))
        .pipe(minifyJs())
        .pipe(gulp.dest("app/js/prod"))
});

gulp.task("cssMinify", function gulpTask() {
    gulp.src("app/css/*.css")
        .pipe(minifyCss())
        .pipe(gulp.dest('app/css/prod'))
});