'use strict';

var fs = require('fs');

var browserSync = require('browser-sync').create();

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var sourcePath = 'src/';
var targetPath = 'dest/';

gulp.task('default', ['build', 'lint'], function() {
    return $.notify('Deploy Success');
});

gulp.task('web', ['build', 'live'], function() {
    return browserSync.init({
        'files': '**',
        'open': false,
        'server': {
            'baseDir': './',
            'directory': true
        }
    });
});

gulp.task('clean', function() {
    return gulp.src(targetPath)
        .pipe($.clean());
});

gulp.task('build', ['clean'], function () {
    return gulp.start('build:style');
});

gulp.task('build:style', function() {
    // Simple Module Build
    var arrPath = fs.readdirSync(sourcePath);
    arrPath.forEach (function (item) {
        var path = sourcePath + item + '/';
        return gulp.src([path + 'reset.styl', path + '{!reset,*}.styl'])
            .pipe($.stylus())
            .pipe($.concat(item + '.css'))
            .pipe(gulp.dest(targetPath + 'assets/'));
    });
    // All Modules Build
    gulp.src([sourcePath + 'Core/{reset,!reset,*}.styl', sourcePath + '{!Core,*}/*.styl'])
        .pipe($.stylus())
        .pipe($.concat('lafite.css'))
        .pipe($.autoprefixer())
        .pipe(gulp.dest(targetPath))
        .pipe($.minifyCss())
        .pipe($.rename('lafite.min.css'))
        .pipe(gulp.dest(targetPath));
});

gulp.task('live', ['build'], function () {
    $.watch(sourcePath + '{**,}*.{css,styl}', function () {
        gulp.start('build:style')
            .pipe(browserSync.reload);
    });
    $.watch(sourcePath + '{**,}*.{htm,html}', function () {
        gulp.pipe(browserSync.reload);
    });
});

gulp.task('lint', ['build'], function () {
    // content
});