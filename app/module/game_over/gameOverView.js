var Backbone = require('backbone');
var gameOverTpl = require('./gameOver.ejs');

var GameOverView = Backbone.View.extend({
	className: 'mask game-over-mask',
	template : gameOverTpl,

	events: {
		'click .start-btn': 'resetView',
		'click .role-btn' : 'hideMask'
	},

	initialize: function () {
		this.render();
	},

	render: function () {
		this.$el.html(this.template());
		return this;
	},

	resetView: function () {

		// 重置当前游戏角色视图
		GAME_APP[GAME_APP.ROLE + 'GridsCollection'].reset();
		GAME_APP[GAME_APP.ROLE + 'HeaderModel'].resetScore();

		this.$el.hide();
	},

	hideMask: function () {
		this.$el.hide();
	}
});

module.exports = GameOverView;