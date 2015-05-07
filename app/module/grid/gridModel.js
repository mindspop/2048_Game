var Backbone = require('backbone');

var GridModel = Backbone.Model.extend({
	defaults: {
		// 用来计算得分和处理与 text 映射关系
		num      : 2,

		// grid 显示的名称
		text     : "",

		// grid 在二维数组的位置
		blockPos : {
			xPos: 0,
			yPos: 0
		},

		// grid 渲染位置
		layoutPos: {
			top : 0,
			left: 0
		}
	}
});

module.exports = GridModel;