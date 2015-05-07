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

//var $ = require('jquery');
//
//$(document).ready(function () {
//	var audioEle = $(".love-block audio")[0];
//	$(".love-block .audio-btn").on("touchend", function () {
//		var $this = $(this);
//		if ($this.hasClass("music-on")) {
//			$this.removeClass("music-on").addClass("music-off");
//			audioEle.pause();
//		} else {
//			$this.addClass("music-on").removeClass("music-off");
//			audioEle.play();
//		}
//
//	});
//
//	$(".love-block .audio-btn").trigger("touchend");
//	audioEle.pause();
//	setTimeout(function () {
//		$(".love-block .audio-btn").trigger("touchend");
//	}, 100);

//	function isShowLove() {
//		for (var i = 0; i < blockData.length; i++) {
//			for (var j = 0; j < blockData[0].length; j++) {
//				if (blockData[i][j] == 8) {
//					return true;
//				}
//			}
//			;
//		}
//		;
//		return false;
//	}
//
//
//	function showLoveBlock() {
//		$(".love-block .audio-btn").trigger("touchend");
//
//		$("#love-block").css("height", window.innerHeight - 120);
//		//打印字符函数
//		$.fn.autotype = function () {
//			var _this = $(this);
//			var str = _this.html();
//			// 正则替换代码行之间添加的多个空格，不去除换行输出会有明显的停顿：实际是在输出多个空格
//			str = str.replace(/(\s){2,}/g, "$1");
//			var index = 0;
//			$(this).html('');
//			var timer = function () {
//				var args = arguments;
//				var current = str.slice(index, index + 1);
//				// html标签完整输出,如：<p>
//				if (current == '<') {
//					index = str.indexOf('>', index) + 1;
//				} else {
//					index++;
//				}
//				//位运算符: 根据setInterval运行奇偶次来判断是否加入下划线字符“_”，使输入效果更逼真
//				if (index < str.length - 1) { //打印字符倒数第2个字符开始，不加下划线字符，以防止结束符可能会多输出一下划线字符
//					_this.html(str.substring(0, index) + (index & 1 ? '_' : ''));
//				} else {
//					_this.html(str.substring(0, index));
//					// clearTimeout(timer);
//					clearInterval(timerInterval);
//				}
//				;
//			};
//			var timerInterval = setInterval(timer, 150);
//
//			// 延迟1s开始
//			setTimeout(timer, 1000);
//			// timer();
//		};
//		$(".love-block .text-block").autotype();
//
//		// setTimeout(function(){
//		//     $(".love-block .text-body").autotype();
//		// }, 1000);
//		// setTimeout(function(){
//		//     $(".love-block .text-body").autotype("2222222222行");
//		// }, 5000);
//
//		var zrender = require('zrender/zrender');
//		var HeartShape = require('zrender/shape/Heart');
//		var TextShape = require('zrender/shape/Text');
//		var Animation = require('zrender/animation/Animation');
//
//		zr = zrender.init(document.getElementById('love-block'));
//		var width = Math.ceil(zr.getWidth());
//		var height = Math.ceil(zr.getHeight());
//		var util = require('zrender/tool/util');
//		var eventTool = require('zrender/tool/event');
//		var guid = require('zrender/tool/guid');
//		var gameRunning;
//		var shapeList = [];
//		var heartShapes = [];
//		var pointText;
//		var knife;
//		var hasCatched = {};
//		var gamTicket;
//		var timeTicket;
//		var timeInterval;
//		var gameTime = 10;
//		var timer;
//		var clearHeart = false;
//		var heartShapeBig = new HeartShape({
//			style    : {
//				x        : 320,
//				y        : 350,
//				a        : 30,
//				b        : 45,
//				brushType: 'fill',
//				color    : '#E73225',
//				opacity  : 1,
//				id       : guid(),
//				z        : 100
//			},
//			hoverable: false
//		});
//		zr.addShape(heartShapeBig);
//		zr.render();
//
//		var audioPlay = function () {
//			audioEle.play(); //音频将被加载并播放
//		};
//		// $(".love-block .audio-btn").on("click", audioPlay);
//
//		$(".continue-btn").on("touchend", function () {
//			$(".love-block").hide();
//			$(".text-block2").hide();
//			$(".text-block3").hide();
//			audioEle.pause();
//			$(this).hide();
//			zr.clear();
//		});
//
//		function getRandomNum(from, to) {
//			return from + Math.floor(Math.random() * to);
//		}
//
//		clearInterval(timeInterval);
//		timeInterval = setInterval(function () {
//			for (var i = 0; i < 8; i++) {
//				var randomSize = getRandomNum(12, 20);
//				var heartShape = new HeartShape({
//					style    : {
//						x        : getRandomNum(0, 640),
//						y        : getRandomNum(0, 800),
//						a        : randomSize,
//						b        : 1.5 * randomSize,
//						brushType: 'fill',
//						color    : Math.random() > 0.5 ? '#ee6d66' : '#E73225',
//						opacity  : 00,
//						id       : guid()
//					},
//					hoverable: false
//				});
//				heartShapes.push(heartShape);
//				zr.addShape(heartShape);
//				zr.refresh();
//				zr.animate(heartShape.id, 'style')
//						.when(500, {
//							opacity: 0.5
//						})
//						.start('easing');
//				// zr.animate(heartShape.id, 'style')
//				//     .delay(6*1000)
//				//     .when(500, {
//				//         x: 320,
//				//         y: 400,
//				//         opacity: 0
//				//     })
//				//     .done(function() {
//				//         zr.delShape(heartShape.id);
//				//         setTimeout(function() {
//				//             clearInterval(timeInterval);
//				//         }, 1000);
//				//     })
//				//     .start('easing');
//				// zr.refresh();
//			}
//			;
//			// if (heartShapes.length >= 50) {
//			//     clearHeart = true;
//			// }
//		}, 500);
//
//		// if (clearHeart) {
//		//     moveHeartShape();
//		//     setTimeout(function(){
//		//         clearInterval(timeInterval);
//		//     }, 1000);
//		// }
//		setTimeout(function () {
//			moveHeartShape();
//			setTimeout(function () {
//				clearInterval(timeInterval);
//			}, 500);
//		}, 7 * 1000);
//
//		function moveHeartShape() {
//			var timer;
//			var currentSizeA = 30;
//			var currentSizeB;
//			clearInterval(timer);
//			timer = setInterval(function () {
//				currentSizeA += 10;
//				currentSizeB = 1.5 * currentSizeA;
//				if (!heartShapes.length) {
//					clearInterval(timer);
//					zr.animate(heartShapeBig.id, 'style', true)
//							.when(500, {
//								a: currentSizeA + 5,
//								b: 1.5 * (currentSizeA + 5)
//							})
//							.when(1000, {
//								a: currentSizeA - 5,
//								b: 1.5 * (currentSizeA - 5)
//							})
//							.start('easing');
//					$(".love-block .text-block2").show().autotype();
//					setTimeout(function () {
//						$(".love-block .text-block3").show().autotype();
//						setTimeout(function () {
//							$(".love-block .continue-btn").show();
//						}, 3000);
//					}, 15 * 1000);
//				}
//				;
//				heartShapes.length > 15 ? length = 15 : length = heartShapes.length;
//				for (var i = 0; i < length; i++) {
//					zr.animate(heartShapes[i].id, 'style')
//							.when(800, {
//								x      : 320,
//								y      : 350,
//								opacity: 0
//							})
//							.done(function () {
//								// zr.delShape(heartShapes[i].id);
//								zr.animate(heartShapeBig.id, 'style')
//										.when(600, {
//											a: currentSizeA,
//											b: currentSizeB
//										})
//										.start('easing');
//							})
//							.start('easing');
//				}
//				;
//				for (var i = 0; i < length; i++) {
//					heartShapes.shift();
//				}
//				;
//			}, 500);
//		}
//
//		zr.refresh();
//	}
//});
