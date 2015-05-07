var $ = require('jquery');

$(document).ready(function () {
	var Backbone = require('backbone');

	var app = app || {};

	// 设置全局应用程序对象，以后被其它模块使用
	window.GAME_APP = app;

	var AppView = require('./appView');
	app.appView = new AppView();

	var AppRouter = require('./router');
	var appRouter = new AppRouter();
	Backbone.history.start();
});
