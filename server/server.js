var Bones = require(global.__BonesPath__ || 'bones');
//console.log('Bones',Bones);

var Backbone = require('./backbone');
var _ = require('underscore');
var HTTPServer = require('express').HTTPServer;
var middleware = require('..').middleware;
var io = require('socket.io');
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
//		var self = this;
//		var Files = {};
//		//this.port && this.listen(this.port, callback);
//		if (this.port) {
//			console.log('this.port',this.port);

//			var server = this.listen(this.port, callback);
//			io = io.listen(this.port);

////			io = io.listen(server);
//		}
//		io.sockets.on('connection', function (socket) {
//			socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
//				console.log("++START+++++++++++++++++");
//				var Name = data['Name'];
//				//console.log('Name',Name);
//				 Files[Name] = { //Create a new Entry in The Files Variable
//					FileSize: data['Size'],
//					Data: "",
//					Downloaded: 0
//				}
//				//console.log('Files[Name]',Files[Name]);
//				var Place = 0;
//				try {
//					console.log('try');
//					var Stat = fs.statSync('Temp/' + Name);
//					if (Stat.isFile()) {
//						Files[Name]['Downloaded'] = Stat.size;
//						Place = Stat.size / 524288;
//					}
//				} catch (er) {} //It's a New File
//				fs.open("Temp/" + Name, "a", 0755, function (err, fd) {
//					if (err) {
//						console.log(err);
//					} else {
//						Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
//						socket.emit('MoreData', {
//							'Place': Place,
//							Percent: 0
//						});
//					}
//				});
//			});

//			socket.on('Upload', function (data){
//				console.log("++UPLOAD+++++++++++++++++");
//				  var Name = data['Name'];
//				  var tags = data['Tags'];
//
//				  Files[Name]['Downloaded'] += data['Data'].length;
//				  Files[Name]['Data'] += data['Data'];
//				  //console.log('Files[Name]',Files[Name]);
//				  if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
//				  {
//				  	console.log('FULL');
//				  	//console.log(Files[Name]['Handler']);
//					 fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
//					 	var id = Bones.utils.guid();
//						//Get Thumbnail Here
//						var inp = fs.createReadStream("Temp/" + Name);
//						var out = fs.createWriteStream("Video/" + id);
//						util.pump(inp, out, function(){
//						   fs.unlink("Temp/" + Name, function () { //This Deletes The Temporary File
//							self.createVideo(id, Name, tags);
//							  //Moving File Completed
//							  //socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
//							  socket.emit('Done', {});
//						   });
//						});

//					 });
//				  }
//				  else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
//				  	console.log('NOT FULL');
//					 fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
//						Files[Name]['Data'] = ""; //Reset The Buffer
//						var Place = Files[Name]['Downloaded'] / 524288;
//						var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
//						socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
//					 });
//				  }
//				  else
//				  {
//				  	console.log('NOT FULL 2');
//					 var Place = Files[Name]['Downloaded'] / 524288;
//					 var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
//					 socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
//				  }
//			   });
//




//		});
//		return this;
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

