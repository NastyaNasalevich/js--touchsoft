/* global require */

var gulp = require('gulp');
var server = require('browser-sync');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var del = require('del');
var rigger = require('gulp-rigger');

var config = {
    server: {
        baseDir: './build'
    },
    notify: false
};

var path = {
    build: {
        html:  'build/',
        js:    'build/js/',
        css:   'build/style/',
        img:   'build/img/'
    },
    app: {
        html:  'app/*.html',
        js:    'app/js/main.js',
        style: 'app/style/main.sass',
        img:   'app/img/**/*.*'
    },
    watch: {
        html:  'app/**/*.html',
        js:    'app/js/**/*.js',
        css:   'app/style/**/*.sass',
        img:   'app/img/**/*.*'
    },
    clean:     './build'
};

// template
gulp.task('html:build', function buildTemplate() {
    gulp.src(path.app.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(server.reload({stream: true})); 
});

// styles
gulp.task('css:build', function buildStyle() {
    gulp.src(path.app.style)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix({
            browsers: ['last 15 versions']
        }))
        .pipe(minifyCss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.css))
        .pipe(server.reload({stream: true}));
});

// js
gulp.task('js:build', function buildJS() {
    gulp.src(path.app.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.js))
        .pipe(server.reload({stream: true}));
});

// img
gulp.task('image:build', function buildIMG() {
    gulp.src(path.app.img)
		.pipe(imagemin({ 
            progressive: true, 
            optimizationLevel: 3
        }))
        .pipe(gulp.dest(path.build.img));
});

// clean
gulp.task('clean', function cleanDirectory() {
    del.sync(path.clean);
});

// build
gulp.task('build', ['clean', 'html:build', 'css:build', 'js:build', 'image:build']);

// server
gulp.task('server', function runServer() {
    server(config);
});

// watch
gulp.task('watch', function watchChanges() {
    gulp.watch(path.watch.html, ['html:build']);
    gulp.watch(path.watch.css, ['css:build']);
    gulp.watch(path.watch.js, ['js:build']);
});

// default
gulp.task('default', ['clean', 'build', 'server', 'watch']);