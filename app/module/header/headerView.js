var Backbone = require('backbone');
var headerTpl = require('./header.ejs');

var HeaderView = Backbone.View.extend({
	className: 'header',
	template : headerTpl,

	events: {
		'click .start-btn': 'resetView'
	},

	initialize: function () {
		this.listenTo(this.model, {
			'change': this.render
		});

		this.render();
	},

	render: function () {

		// 当得分重置为 0 时
		if (!this.model.get('score')) {

			// 获取之前变化的得分
			var preScore = this.model.previous('score');

			// 更新最高得分
			var highestScore = this.model.get('highestScore');
			(highestScore < preScore) && this.model.set({
				highestScore: preScore
			}, {silent: true});
		}

		this.$el.html(this.template(this.model.toJSON()));

		return this;
	},

	resetView: function () {

		// 清空 grids 数据，触发 reset 事件，更新 mainView
		GAME_APP[GAME_APP.ROLE + 'GridsCollection'].reset();

		// 重置当前得分
		this.model.resetScore();
	}
});

module.exports = HeaderView;