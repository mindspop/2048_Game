// 引入 gulp
var gulp = require('gulp');

// 引入组件
var sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    gutil        = require('gulp-util'),
    sourcemaps   = require('gulp-sourcemaps'),
    filter       = require('gulp-filter'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss    = require('gulp-minify-css');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

// 编译Sass
gulp.task('sass', function () {
	gulp.src('./app/style.scss')
			.pipe(sourcemaps.init())
			.pipe(sass())
			.on('error', gutil.log)
			.pipe(autoprefixer())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./app/build'));
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
		'./**/*.png'
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

gulp.task('default', ['sass', 'webpack-dev-server', 'build-dev'], function () {
	gulp.watch("./app/**/*.scss", ['sass']);
});

// 配置上线环境下的打包任务
gulp.task("build", ["webpack:build", "sass:build"]);
gulp.task('sass:build', function () {
	gulp.src('./app/style.scss')
			.pipe(sass())
			.on('error', gutil.log)
			.pipe(autoprefixer())
			.pipe(minifyCss())
			.pipe(gulp.dest('./app/build'));
});
gulp.task("webpack:build", function (callback) {

	// 修改基础配置项
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(new webpack.optimize.UglifyJsPlugin());

	// 启动 webpack 打包
	webpack(myConfig, function (err, stats) {
		if (err) {
			throw new gutil.PluginError("webpack:build", err);
		}
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}));
		callback();
	});
});

// 配置开发环境下打包任务
gulp.task("build-dev", function () {
	gulp.watch(["./app/**/*"], ["webpack:build-dev"]);
});

// 修改基础配置项
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// 启动 webpack 打包
var devCompliler = webpack(myDevConfig);
gulp.task('webpack:build-dev', function () {

	devCompliler.run(function (err, stats) {
		if (err) {
			throw new gutil.PluginError('webpack:build-dev', err);
		}
		gutil.log('[webpack:build-dev]', stats.toString({
			colors: true
		}));
	});
});

// 配置 server
gulp.task('webpack-dev-server', function () {

	// 修改 webpack 配置项
	var myConfig = Object.create(webpackConfig);
	myConfig.devtool = 'eval';
	myConfig.debug = true;

	// 启动 webpack server
	new WebpackDevServer(webpack(myConfig), {
		publicPath: '/' + myConfig.output.publicPath,
		hot       : true,
		stats     : {
			colors: true
		}
	}).listen(80, 'localhost', function (err) {
				if (err) {
					throw new gutil.PluginError('webpack-dev-server', err);
				}
				gutil.log('[webpack-dev-server]', 'http://localhost:80/webpack-dev-server/index.html');
			});
});



