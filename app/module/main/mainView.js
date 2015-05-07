var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

var mainTpl = require('./main.ejs');
var GridView = require('../grid/gridView');
var GameOverView = require('../game_over/gameOverView');

var MainView = Backbone.View.extend({
	template : mainTpl,
	className: 'main',

	events: {
		'touchstart': 'touchStart',
		'touchend'  : 'touchEnd'
	},

	initialize: function () {
		this.listenTo(this.collection, {
			'add'  : this.addBlock,
			'reset': this.resetBlock
		});

		this.touchPos = [];

		this.render();
		this.collection.length && this.collection.each(this.addBlock, this);

		var moveBlock = _.bind(this.moveBlock, this);
		$(document).off('keydown');
		$(document).on('keydown', moveBlock);
	},

	render   : function () {
		this.$el.html(this.template());
		return this;
	},

	// 当新增 gridModel 时，给 mainView 添加一个 gridView
	addBlock : function (gridModel) {
		var view = new GridView({
			model: gridModel
		});
		this.$('.grids-layout').append(view.el);
	},

	// 响应用户移动 grid 操作
	moveBlock: function (event) {
		var timer;
		var that = this;
		var direction = typeof event === 'object' ? event.which : event;

		typeof event === 'object' &&
		(event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40) &&
		event.preventDefault();

		switch (direction) {
			case 37:
			{
				// 移动 grid
				this.collection.moveBlock('left');

				// 判断游戏是否结束或是否需要添加新 grid
				afterMoveBlcok(that);
				break;
			}
			case 38:
			{
				this.collection.moveBlock('up');
				afterMoveBlcok(that);
				break;
			}
			case 39:
			{
				this.collection.moveBlock('right');
				afterMoveBlcok(that);
				break;
			}

			case 40:
			{
				this.collection.moveBlock('down');
				afterMoveBlcok(that);
				break;
			}
			default:
				break;
		}

		function afterMoveBlcok(that) {
			if (that.collection.isGameOver()) {

				// 显示游戏结束界面
				timer = setTimeout(function () {
					that.showGameOverView();
				}, 1000);
			}
		}
	},

	resetBlock: function () {

		// 重置界面
		this.render();

		// 重置 blockData 二维数组
		this.collection.resetBlock();

		// 添加两个新 grids
		this.collection.generateGrid();
		this.collection.generateGrid();
	},

	showGameOverView: function () {
		if (GAME_APP.gameOverView) {
			$('.game-over-mask').show();
		} else {
			GAME_APP.gameOverView = new GameOverView();
			$('#app-wrap').append(GAME_APP.gameOverView.el);
		}
	},

	touchStart: function (evt) {
		var touchPos = this.touchPos;
		evt.preventDefault();

		touchPos[0] = {
			"x": evt.originalEvent.touches[0].pageX,
			"y": evt.originalEvent.touches[0].pageY
		};
	},

	touchEnd: function (evt) {
		var touchPos = this.touchPos;
		evt.preventDefault();

		touchPos[1] = {
			"x": evt.originalEvent.changedTouches[0].pageX,
			"y": evt.originalEvent.changedTouches[0].pageY
		};

		var touchDirection;
		var touchH = touchPos[1].x - touchPos[0].x;
		var touchV = touchPos[1].y - touchPos[0].y;
		if (touchV > 0 && Math.abs(touchV / touchH) > 1) {
			touchDirection = 40;
		}
		if (touchV < 0 && Math.abs(touchV / touchH) > 1) {
			touchDirection = 38;
		}
		if (touchH > 0 && Math.abs(touchV / touchH) < 1) {
			touchDirection = 39;
		}
		if (touchH < 0 && Math.abs(touchV / touchH) < 1) {
			touchDirection = 37;
		}

		this.moveBlock(touchDirection);
	}
});

module.exports = MainView;

//	function adaptToMobile() {
//		var touchPos = new Array;
//		$(".main-body").on("touchstart", function (evt) {
//			evt.preventDefault();
//
//			touchPos[0] = {
//				"x": evt.originalEvent.touches[0].pageX,
//				"y": evt.originalEvent.touches[0].pageY
//			};
//		});
//		$(".main-body").on("touchend", function (evt) {
//			evt.preventDefault();
//			touchPos[1] = {
//				"x": evt.originalEvent.changedTouches[0].pageX,
//				"y": evt.originalEvent.changedTouches[0].pageY
//			};
//			var touchDirection;
//			var touchH = touchPos[1].x - touchPos[0].x;
//			var touchV = touchPos[1].y - touchPos[0].y;
//			if (touchV > 0 && Math.abs(touchV / touchH) > 1) {
//				touchDirection = 40;
//			}
//			if (touchV < 0 && Math.abs(touchV / touchH) > 1) {
//				touchDirection = 38;
//			}
//			;
//			if (touchH > 0 && Math.abs(touchV / touchH) < 1) {
//				touchDirection = 39;
//			}
//			if (touchH < 0 && Math.abs(touchV / touchH) < 1) {
//				touchDirection = 37;
//			}
//			;
//			switch (touchDirection) {
//				case 37:
//				{
//					moveLeft();
//					if (isGameOver()) {
//						$(".main-body .mask").css("display", "block");
//					}
//					break;
//				}
//				case 38:
//				{
//					moveUp();
//					if (isGameOver()) {
//						$(".main-body .mask").css("display", "block");
//					}
//					break;
//				}
//				case 39:
//				{
//					moveRight();
//					if (isGameOver()) {
//						$(".main-body .mask").css("display", "block");
//					}
//					break;
//				}
//
//				case 40:
//				{
//					moveDown();
//					if (isGameOver()) {
//						$(".main-body .mask").css("display", "block");
//					}
//					break;
//				}
//				default:
//					break;
//			}
//
//		});
//	}