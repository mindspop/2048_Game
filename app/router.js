var Backbone = require('backbone');
var GAME_APP = window.GAME_APP;

var AppRouter = Backbone.Router.extend({
	routes: {
		'*role': 'chooseRole'
	},

	chooseRole: function (role) {

		// 存储角色场景选择
		GAME_APP.ROLE = role;

		// 当角色有变化时，重新渲染游戏主界面
		GAME_APP.appView.render(role);
	}
});

module.exports = AppRouter;