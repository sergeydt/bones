var Bones = require(global.__BonesPath__ || 'bones');
//console.log('Bones',Bones);

var Backbone = require('./backbone');
var _ = require('underscore');
var HTTPServer = require('express').HTTPServer;
var middleware = require('..').middleware;
var fs = require('fs');
var exec = require('child_process').exec
var util = require('util')

//var utils = require('./utils')


module.exports = Server;

function Server(plugin) {
	HTTPServer.call(this, []);
	this.plugin = plugin;
	this.initialize.apply(this, arguments);
	this.conclude.apply(this, arguments);
};

Server.prototype.__proto__ = HTTPServer.prototype;

_.extend(Server.prototype, Backbone.Events, {
	initialize: function (plugin) {},

	conclude: function (plugin) {
		// Add catchall 404 middleware and error handler for root servers.
		if (this.port) {
			this.use(middleware.notFound());
			this.error(middleware.showError());
			// Remove redundant frontmost middleware from each server that will not
			// be a root server. See `express/lib/http.js`.
		} else {
			this.stack.shift();
		}
	},

	port: null,

	start: function (callback) {

	},



	toString: function () {
		if (this.port) {
			return '[Server ' + this.constructor.title + ':' + this.address().port + ']';
		} else {
			return '[Server ' + this.constructor.title + ']';
		}
	}
});

Server.augment = Backbone.Router.augment;
Server.extend = Backbone.Router.extend;
Server.toString = function () {
	return '<Server ' + this.title + '>';
};

