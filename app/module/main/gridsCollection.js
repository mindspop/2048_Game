var Backbone = require('backbone');
var GridModel = require('../grid/gridModel');
var GRIDS_LENGTH = 16;
var _ = require('underscore');

var GridsCollection = Backbone.Collection.extend({

	model: GridModel,

	initialize: function () {
		this.BLOCKDATA_LENGTH_X = 4;
		this.BLOCKDATA_LENGTH_Y = 4;
		this.resetBlock();
	},

	isGameOver: function () {
		var blockData = this.blockData;
		var BLOCKDATA_LENGTH_X = this.BLOCKDATA_LENGTH_X;
		var BLOCKDATA_LENGTH_Y = this.BLOCKDATA_LENGTH_Y;

		// 判断是否有位置空间
		if (this.length === GRIDS_LENGTH) {

			// 4*4 布局中，判断 3*3 布局中判断每一个 gird 右边和下边是否有相同值的 grid
			for (var i = 0, l1 = BLOCKDATA_LENGTH_X - 1; i < l1; i++) {
				for (var j = 0, l2 = BLOCKDATA_LENGTH_Y - 1; j < l2; j++) {

					// 判断每一个 gird 右边和下边是否有相同值的 grid
					if (blockData[i][j] == blockData[i + 1][j] ||
					    blockData[i][j] == blockData[i][j + 1]) {
						return false;
					}
				}
			}

			// 4*4 布局中，判断最后一列中每一个 gird 下边是否有相同值的 grid
			for (var m = 0, l3 = BLOCKDATA_LENGTH_Y - 1; m < l3; m++) {

				// 判断每一个 gird 下边是否有相同值的 grid
				if (blockData[m][l3] == blockData[m + 1][l3]) {
					return false;
				}
			}

			// 4*4 布局中，判断最后一行中每一个 gird 右边是否有相同值的 grid
			for (var k = 0, l4 = BLOCKDATA_LENGTH_X - 1; k < l4; k++) {

				// 判断每一个 gird 右边是否有相同值的 grid
				if (blockData[l4][k] == blockData[l4][k + 1]) {
					return false;
				}
			}
			return true;
		}
		return false;
	},

	generateGrid     : function () {

		// 如果位置不够，则不用添加
		if (this.length === GRIDS_LENGTH) {
			return;
		}

		var blockTextMapping = this.blockTextMapping();
		var randomNum = Math.random() < 0.5 ? 2 : 4;

		var blockPos = this.generateRandomPos();
		var layoutPos = {
			top : 16 + blockPos.xPos * 144 + 'px',
			left: 16 + blockPos.yPos * 144 + 'px'
		};

		// 创建新的 model 配置
		var newModel = new this.model({
			num      : randomNum,
			text     : blockTextMapping[randomNum],
			blockPos : blockPos,
			layoutPos: layoutPos
		});
		this.blockData[blockPos.xPos][blockPos.yPos] = randomNum;

		// 给 collection 添加一个新的 gridModel
		this.add(newModel);

		return newModel;
	},

	// 生成随机位置
	generateRandomPos: function () {
		var blockData = this.blockData;
		var BLOCKDATA_LENGTH_X = this.BLOCKDATA_LENGTH_X;
		var BLOCKDATA_LENGTH_Y = this.BLOCKDATA_LENGTH_Y;
		var count = GRIDS_LENGTH - this.length;
		var zeroCount = 0;
		var randomCount = Math.floor(Math.random() * count);

		for (var i = 0, l1 = BLOCKDATA_LENGTH_X; i < l1; i++) {
			for (var j = 0, l2 = BLOCKDATA_LENGTH_Y; j < l2; j++) {
				if (!blockData[i][j]) {
					if (zeroCount === randomCount) {
						return {
							xPos: i,
							yPos: j
						}
					}
					zeroCount++;
				}
			}
		}
	},

	// 重置 blockData 二维数组
	resetBlock       : function () {
		var blockData = [];
		for (var i = 0; i < 4; i++) {
			blockData[i] = new Array(4);
		}

		this.blockData = blockData;
	},

	moveBlock       : function (direction) {

		// 获取 num-text 映射关系
		var blockTextMapping = this.blockTextMapping();
		var BLOCKDATA_LENGTH_X = this.BLOCKDATA_LENGTH_X;
		var BLOCKDATA_LENGTH_Y = this.BLOCKDATA_LENGTH_Y;
		var blockData = this.blockData;
		var that = this;
		var posOrigin;
		var pos;
		var toPos;

		switch (direction) {
			case 'left':
				for (var i = 0, l1 = BLOCKDATA_LENGTH_X; i < l1; i++) {
					posOrigin = -1;
					for (var j = 1, l2 = BLOCKDATA_LENGTH_Y; j < l2; j++) {
						if (!blockData[i][j]) {
							continue;
						}
						pos = new Array(i, j);
						toPos = this.canMoveLeft(pos, posOrigin);

						if (toPos) {
							doMove(that, pos, toPos);

							// 设置新的可移动起点
							posOrigin = toPos[1] - 1;
						}
					}
				}

				// 添加新 grid
				this.generateGrid();
				break;
			case'right':
				for (var i = 0, l1 = BLOCKDATA_LENGTH_X; i < l1; i++) {
					posOrigin = 4;
					for (var j = BLOCKDATA_LENGTH_Y - 2; j > -1; j--) {
						if (!blockData[i][j]) {
							continue;
						}
						pos = new Array(i, j);
						toPos = this.canMoveRight(pos, posOrigin);

						if (toPos) {
							doMove(that, pos, toPos);

							// 设置新的可移动起点
							posOrigin = toPos[1] + 1;
						}
					}
				}

				// 添加新 grid
				this.generateGrid();
				break;
			case'up':
				for (var i = 0, l1 = BLOCKDATA_LENGTH_Y; i < l1; i++) {
					posOrigin = -1;
					for (var j = 1, l2 = BLOCKDATA_LENGTH_X; j < l2; j++) {
						if (!blockData[j][i]) {
							continue;
						}
						pos = new Array(j, i);
						toPos = this.canMoveUp(pos, posOrigin);

						if (toPos) {
							doMove(that, pos, toPos);

							// 设置新的可移动起点
							posOrigin = toPos[0] - 1;
						}
					}
				}

				// 添加新 grid
				this.generateGrid();
				break;
			case'down':
				for (var i = 0, l1 = BLOCKDATA_LENGTH_Y; i < l1; i++) {
					posOrigin = 4;
					for (var j = BLOCKDATA_LENGTH_Y - 2; j > -1; j--) {
						if (!blockData[j][i]) {
							continue;
						}
						pos = new Array(j, i);
						toPos = this.canMoveDown(pos, posOrigin);

						if (toPos) {
							doMove(that, pos, toPos);

							// 设置新的可移动起点
							posOrigin = toPos[0] + 1;
						}
					}
				}

				// 添加新 grid
				this.generateGrid();
				break;
			default :
				break;
		}

		// 实际移动 grids
		function doMove(that, pos, toPos) {
			var score;
			var x = pos[0];
			var y = pos[1];
			var toX = toPos[0];
			var toY = toPos[1];
			var addNum;

			var removeBlcok = function () {
				that.remove(toBlock);
			};

			// 如果指定位置有 grid ，并且两个 grids 值相等，则按 grids 碰撞处理
			if (blockData[x][y] == blockData[toX][toY]) {
				blockData[toX][toY] += blockData[x][y];
				blockData[x][y] = 0;
				addNum = blockData[toX][toY];

				// 删除目的地的 grid
				var toBlock = that.filter(function (model) {
					if (model.get('blockPos').xPos === toX && model.get('blockPos').yPos === toY) {
						return true;
					}
					return false;
				});
				// setTimeout(removeBlcok, 80);
				that.remove(toBlock);

				// 修改可移动 grid 的 model 数据
				var curBlock = that.filter(function (model) {
					if (model.get('blockPos').xPos === x && model.get('blockPos').yPos === y) {
						return true;
					}
					return false;
				});
				_.invoke(curBlock, 'set', {
					blockPos : {
						xPos: toX,
						yPos: toY
					},
					layoutPos: {
						top : 16 + toX * 144 + 'px',
						left: 16 + toY * 144 + 'px'
					},
					num      : addNum,
					text     : blockTextMapping[addNum]
				});

				// 修改总得分 Model
				score = GAME_APP[GAME_APP.ROLE + 'HeaderModel'].get('score');
				GAME_APP[GAME_APP.ROLE + 'HeaderModel'].set({
					score: score + 2 * blockData[toX][toY]
				});
			} else {

				// 直接移动 grid 到指定位置
				blockData[toX][toY] = blockData[x][y];
				blockData[x][y] = 0;

				// 更新移动 grid 的显示位置
				var curBlock = that.filter(function (model) {
					if (model.get('blockPos').xPos === x && model.get('blockPos').yPos === y) {
						return true;
					}
					return false;
				});
				_.invoke(curBlock, 'set', {
					blockPos : {
						xPos: toX,
						yPos: toY
					},
					layoutPos: {
						top : 16 + toX * 144 + 'px',
						left: 16 + toY * 144 + 'px'
					}
				});
			}
		}
	},

	// 根据角色场景，选择不同 num-text 映射关系
	blockTextMapping: function () {
		var role = GAME_APP.ROLE;

		if (role == 'arch') {
			blockTextMapping = {
				2   : '实习僧',
				4   : '刷夜狗',
				8   : '画图工具',
				16  : '建筑师',
				32  : '主创',
				64  : '小组长',
				128 : '项目头',
				256 : '设计总监',
				512 : '总经理',
				1024: 'CEO',
				2048: '黑富美'
			};
		} else if (role == 'it') {
			blockTextMapping = {
				2   : '实习生',
				4   : '页面仔',
				8   : '码农',
				16  : '程序猿',
				32  : '攻城狮',
				64  : '产品狗',
				128 : '产品经理',
				256 : '产品总监',
				512 : '总经理',
				1024: 'CEO',
				2048: '白富美'
			};
		} else {
			blockTextMapping = {
				2   : '2',
				4   : '4',
				8   : '8',
				16  : '16',
				32  : '32',
				64  : '64',
				128 : '126',
				256 : '256',
				512 : '512',
				1024: '1024',
				2048: '2048'
			};
		}
		return blockTextMapping;
	},

	// 分别判断某个位置的 grid 是否能按上下左右四个方向移动
	canMoveLeft     : function (pos, posOrigin) {
		var blockData = this.blockData;
		var toPos = 0;
		var x = pos[0];
		var y = pos[1];

		for (var j = y - 1; j > posOrigin; j--) {
			if (!blockData[x][j]) {
				toPos = [x, j];
				continue;
			} else if (blockData[x][j] == blockData[x][y]) {
				toPos = [x, j];
				break;
			} else {
				break;
			}
		}
		return toPos;
	},

	canMoveRight: function (pos, posOrigin) {
		var blockData = this.blockData;
		var toPos = 0;
		var x = pos[0];
		var y = pos[1];

		for (var j = y + 1; j < posOrigin; j++) {
			if (!blockData[x][j]) {
				toPos = [x, j];
				continue;
			} else if (blockData[x][j] == blockData[x][y]) {
				toPos = [x, j];
				break;
			} else {
				break;
			}
		}
		return toPos;
	},

	canMoveUp: function (pos, posOrigin) {
		var blockData = this.blockData;
		var toPos = 0;
		var x = pos[0];
		var y = pos[1];

		for (var j = x - 1; j > posOrigin; j--) {
			if (!blockData[j][y]) {
				toPos = [j, y];
				continue;
			} else if (blockData[j][y] == blockData[x][y]) {
				toPos = [j, y];
				break;
			} else {
				break;
			}
		}
		return toPos;
	},

	canMoveDown: function (pos, posOrigin) {
		var blockData = this.blockData;
		var toPos = 0;
		var x = pos[0];
		var y = pos[1];

		for (var j = x + 1; j < posOrigin; j++) {
			if (!blockData[j][y]) {
				toPos = [j, y];
				continue;
			} else if (blockData[j][y] == blockData[x][y]) {
				toPos = [j, y];
				break;
			} else {
				break;
			}
		}
		return toPos;
	}
});

module.exports = GridsCollection;