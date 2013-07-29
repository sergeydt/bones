var env = process.env.NODE_ENV || 'development';
var middleware = require('..').middleware;

server = Bones.Server.extend({});

//console.log('models', Bones);


// process.env.port
server.prototype.port = process.env.NODE_PORT || 3000;

server.prototype.initialize = function(app) {
	var async = require("async");
    this.port = app.config.port || this.port;

    // Middleware provides body decoding, CSRF validation et al.
    // Place other servers before this one ONLY when you intend to circumvent
    // these safeguards.
    this.use(new servers['Middleware'](app));

    // Debugging server provides facilities for easier client side debugging.
    if (env === 'development') {
        this.use(new servers['Debug'](app));
    }

    // The Route server provides default routes for /api/Model as well as
    // the /assets/bones routes.
    this.use(new servers['Route'](app));

    // The Asset server provides each plugin's asset folder at /asset/pluginname.
    this.use(new servers['Asset'](app));

//	this.q = async.queue(function (task, callback) {
//		var self = this;
//		console.log('++++++++++++++++++++++++++++++++++++hello++++++++++++++++++++++++++++++++++++++ ' + task.name);
//		var options = {};
//		options.urls = task.video_urls;
//		options.bucket = 'oxhim';
//		options.folder = 'out_video/'
//		options.id = task.id;
//		uploadUrls(options, function() {
//			console.log('here first array finished');
//			var options = {};
//			options.urls = task.pictures;
//			options.bucket = 'oxhim';
//			options.folder = 'out_screen/'
//			options.id = task.id;
//			uploadUrls(options, function() {
//				var options = {};
//				options.urls = task.rewids;
//				options.bucket = 'oxhim';
//				options.folder = 'out_rewids/'	
//				options.id = task.id;			
//				uploadUrls(options, function() {
//					var options = {};
//					puburl = './assets/public_video/'+task.id+'/'+task.id+'.mp4'
//					options.urls = [puburl];
//					options.bucket = 'oxhim';
//					options.id = task.id;
//					options.folder = 'public_video/'
//					uploadUrls(options, function() {
//						console.log('DELETE');
//						self.deletFiles(task.video);	
//						callback(null, task.id);						
//					})

//				});
//			})
//		})	    
//	//    callback();
//	}, 1);





};
