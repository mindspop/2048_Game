var Backbone = require('backbone');
var gridTpl = require('./grid.ejs');
var _ = require('underscore');

var GridView = Backbone.View.extend({
	template: gridTpl,

	initialize: function () {
		this.listenTo(this.model, {
			'change:layoutPos': this.moveBlock,
			'remove'          : this.clear
		});

		this.render();
		this.$('.block').addClass('animation-show');
	},

	render: function () {
		this.$el
				.html(this.template(this.model.toJSON()))
				.find('.block')
				.addClass(arguments[0]) // 当需要添加 animation-bump class
				.removeClass('animation-show');
		return this;
	},

	moveBlock: function (model) {

		// 计算模块可移动距离
		var newPos = model.get('layoutPos');
		var oldPos = model.previous('layoutPos');
		var distanceY = parseInt(newPos.top) - parseInt(oldPos.top);
		var distanceX = parseInt(newPos.left) - parseInt(oldPos.left);

		// 添加移动动画
		this.$('.block').animate({
			top : '+=' + distanceY + 'px',
			left: '+=' + distanceX + 'px'
		}, 150);

		// 添加 grids 碰撞动画效果
		var showBump = function () {
			if (model.hasChanged('num')) {
				this.render('animation-bump');
			}
		};
		showBump = _.bind(showBump, this);
		setTimeout(showBump, 100);
	},

	clear: function () {
		var that = this;
		var clearEl = function () {
			that.remove();
		};
		setTimeout(clearEl, 100);
	}
});

module.exports = GridView;