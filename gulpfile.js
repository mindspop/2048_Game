// 引入 gulp
var gulp = require('gulp');

// 引入组件
var sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    gutil       = require('gulp-util'),
    sourcemaps  = require('gulp-sourcemaps'),
    filter      = require('gulp-filter');

var webpack = require('webpack');
var WebpackServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

// 编译Sass
gulp.task('sass', function () {

	gulp.src('./**/*.scss')
			.pipe(sourcemaps.init())
			.pipe(sass())
			.on('error', gutil.log)
			.pipe(sourcemaps.write('./', {sourceRoot: './'}))
			.pipe(gulp.dest('./'));
});

// 解决多个 scss 同时重复编译问题
// function genCss(files){
//     gulp.src(files)
//         .pipe(sourcemaps.init())
//         .pipe(sass())
//         .on('error', gutil.log)
//         .pipe(sourcemaps.write('./', {sourceRoot: './'}))
//         .pipe(gulp.dest('./'));
// }

gulp.task('browser-sync', function () {
	var files = [
		//暂时未解决browser-sync的SSI支持
		//需要用sever或者其他http服务器开8000端口
		'./**/*.html',
		'./**/*.shtml',
		'./**/*.css',
		'./**/*.png',
		'./**/*.js'
	];

	browserSync.init(files, {
		proxy         : '127.0.0.1:8000',
		port          : 80,
		ghostMode     : true,
		snippetOptions: {
			// Provide a custom Regex for inserting the snippet.
			rule: {
				match: /<.*>/i,
				fn   : function (snippet, match) {
					return match + snippet;
				}
			}
		}
	});
});

gulp.task('default', ['sass', 'browser-sync'], function () {
	gulp.watch("./**/*.scss", ['sass']);
});


