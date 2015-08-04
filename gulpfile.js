'use strict';

var fs = require('fs');

var gulp = require('gulp');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

var sourcePath = 'src/';
var targetPath = 'dest/';

gulp.task('default', ['build', 'lint'], function() {
    return notify('Deploy Success');
});

gulp.task('clean', function() {
    return gulp.src(targetPath)
        .pipe(clean());
});

gulp.task('build', ['clean'], function() {
    // Simple Module Build
    var arrPath = fs.readdirSync(sourcePath);
    arrPath.forEach (function (item) {
        var path = sourcePath + item + '/';
        return gulp.src([path + 'reset.styl', path + '{!reset,*}.styl'])
            .pipe(stylus())
            .pipe(concat(item + '.css'))
            .pipe(gulp.dest(targetPath + 'assets/'));
    });
    // All Modules Build
    gulp.src([sourcePath + 'Core/{reset,!reset,*}.styl', sourcePath + '{!Core,*}/*.styl'])
        .pipe(stylus())
        .pipe(concat('lafite.css'))
        .pipe(autoprefixer())
        .pipe(gulp.dest(targetPath))
        .pipe(minifyCss())
        .pipe(rename('lafite.min.css'))
        .pipe(gulp.dest(targetPath));
});

gulp.task('lint', ['build'], function() {
    // content
});