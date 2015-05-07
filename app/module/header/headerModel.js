var Backbone = require('backbone');

var HeaderModel = Backbone.Model.extend({
	defaults  : {
		score       : 0,
		highestScore: 0,
		title       : "赢取白富美游戏"
	},

	// 重置得分数据
	resetScore: function () {
		this.set({
			score: 0
		});
	}
});

module.exports = HeaderModel;