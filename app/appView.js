var Backbone = require('backbone');
var $ = require('jquery');

var StartView = require('./module/start/startView');
var HeaderView = require('./module/header/headerView');
var HeaderModel = require('./module/header/headerModel');
var GridsCollection = require('./module/main/gridsCollection');
var MainView = require('./module/main/mainView');

var $startMask = $('#start-mask');
var $header = $('#header');
var $main = $('#main');

var AppView = Backbone.View.extend({
	el: '#app-wrap',

	initialize: function () {
		var startView = new StartView();
		$startMask.html(startView.el);
	},

	render: function (role) {
		if (!role) {
			$startMask.show();
		} else {
			$startMask.hide();

			// 根据选择的角色场景，渲染相应的游戏主界面
			if (typeof role === 'string') {
				var renderFun = this.toCamelCase('render', role);
				this[renderFun] && this[renderFun]();
			}
		}
	},

	renderIt: function () {

		// 清空旧视图界面，三个角色共享一个游戏主界面
		GAME_APP.headerView && GAME_APP.headerView.remove();
		GAME_APP.mainView && GAME_APP.mainView.remove();

		// 渲染 header 部分视图， 每个角色对应一个独立 headerModel
		GAME_APP.itHeaderModel || (GAME_APP.itHeaderModel = new HeaderModel());
		GAME_APP.headerView = new HeaderView({
			model: GAME_APP.itHeaderModel
		});
		$header.html(GAME_APP.headerView.el);

		// 渲染 main 部分视图，每个角色对应一个独立 gridsCollection
		GAME_APP.itGridsCollection || (GAME_APP.itGridsCollection = new GridsCollection());
		GAME_APP.mainView = new MainView({
			collection: GAME_APP.itGridsCollection
		});
		$main.html(GAME_APP.mainView.el);

		// 如果数据为空，则初始化生成两个 grids
		if (!GAME_APP.itGridsCollection.length) {
			GAME_APP.itGridsCollection.generateGrid();
			GAME_APP.itGridsCollection.generateGrid();
		}
	},

	renderArch: function () {

		// 清空旧视图界面，三个角色共享一个游戏主界面
		GAME_APP.headerView && GAME_APP.headerView.remove();
		GAME_APP.mainView && GAME_APP.mainView.remove();

		// 渲染 header 部分视图， 每个角色对应一个独立 headerModel
		GAME_APP.archHeaderModel || (GAME_APP.archHeaderModel = new HeaderModel({title: '迎娶黑富美游戏'}));
		GAME_APP.headerView = new HeaderView({
			model: GAME_APP.archHeaderModel
		});
		$header.html(GAME_APP.headerView.el);

		// 渲染 main 部分视图，每个角色对应一个独立 gridsCollection
		GAME_APP.archGridsCollection || (GAME_APP.archGridsCollection = new GridsCollection());
		GAME_APP.mainView = new MainView({
			collection: GAME_APP.archGridsCollection
		});
		$main.html(GAME_APP.mainView.el);

		// 如果数据为空，则初始化生成两个 grids
		if (!GAME_APP.archGridsCollection.length) {
			GAME_APP.archGridsCollection.generateGrid();
			GAME_APP.archGridsCollection.generateGrid();
		}
	},

	renderOther: function () {

		// 清空旧视图界面，三个角色共享一个游戏主界面
		GAME_APP.headerView && GAME_APP.headerView.remove();
		GAME_APP.mainView && GAME_APP.mainView.remove();

		// 渲染 header 部分视图， 每个角色对应一个独立 headerModel
		GAME_APP.otherHeaderModel || (GAME_APP.otherHeaderModel = new HeaderModel());
		GAME_APP.headerView = new HeaderView({
			model: GAME_APP.otherHeaderModel
		});
		$header.html(GAME_APP.headerView.el);

		// 渲染 main 部分视图，每个角色对应一个独立 gridsCollection
		GAME_APP.otherGridsCollection || (GAME_APP.otherGridsCollection = new GridsCollection());
		GAME_APP.mainView = new MainView({
			collection: GAME_APP.otherGridsCollection
		});
		$main.html(GAME_APP.mainView.el);

		// 如果数据为空，则初始化生成两个 grids
		if (!GAME_APP.otherGridsCollection.length) {
			GAME_APP.otherGridsCollection.generateGrid();
			GAME_APP.otherGridsCollection.generateGrid();
		}
	},

	// 将多个字符串拼凑成 CamelCase 样式
	toCamelCase: function () {
		var camelCase = '';
		for (var i = 0, l = arguments.length; i < l; i++) {
			var arg = arguments[i];
			if (i != 0) {
				arg = arg.charAt(0).toUpperCase() + arg.slice(1).toLowerCase();
			} else {
				arg = arg.toLowerCase();
			}
			camelCase += arg;
		}
		return camelCase;
	}
});

module.exports = AppView;