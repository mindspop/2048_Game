var Backbone = require('backbone');
var startTpl = require('./start.ejs');

var StartView = Backbone.View.extend({
	className: 'start-mask',
	template : startTpl,

	initialize: function () {
		this.render();
	},

	render: function () {
		this.$el.html(this.template());
		return this;
	}
});

module.exports = StartView;