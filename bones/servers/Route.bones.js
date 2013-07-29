var path = require('path');
var env = process.env.NODE_ENV || 'development';
var headers = { 'Content-Type': 'application/json' };

server = Bones.Server.extend({});

var options = {
    type: '.js',
    wrapper: Bones.utils.wrapClientFile,
    sort: Bones.utils.sortByLoadOrder
};

// TODO: This should be moved to the initialize method!
server.prototype.assets = {
    vendor: new mirror([
        require.resolve(path.join(__dirname, '../assets/jquery')),
        require.resolve('underscore'),
        require.resolve('backbone')
    ], { type: '.js' }),
    core: new mirror([
        require.resolve(path.join(__dirname, '../shared/utils')),
        require.resolve(path.join(__dirname, '../client/utils')),
        require.resolve(path.join(__dirname, '../shared/backbone')),
        require.resolve(path.join(__dirname, '../client/backbone'))
    ], { type: '.js' }),
    models: new mirror([], options),
    views: new mirror([], options),
    routers: new mirror([], options),
    templates: new mirror([], options)
};

if (env === 'development') {
    server.prototype.assets.core.unshift(require.resolve(path.join(__dirname, '../assets/debug')));
}

// TODO: This should be moved to the initialize method!
server.prototype.assets.all = new mirror([
    server.prototype.assets.vendor,
    server.prototype.assets.core,
    server.prototype.assets.routers,
    server.prototype.assets.models,
    server.prototype.assets.views,
    server.prototype.assets.templates
], { type: '.js' });

// Stores models, views served by this server.
// TODO: This should be moved to the initialize method!
server.prototype.models = {};
server.prototype.views = {};

// Stores instances of routers registered with this server.
// TODO: This should be moved to the initialize method!
server.prototype.routers = {};

server.prototype.initialize = function(app) {
    this.registerComponents(app);
    this.initializeAssets(app);
    this.initializeModels(app);
};

server.prototype.registerComponents = function(app) {
    var components = ['routers', 'models', 'views', 'templates'];
    components.forEach(function(kind) {
        for (var name in app[kind]) {
            app[kind][name].register(this);
        }
    }, this);
};

server.prototype.initializeAssets = function(app) {
    this.get('/assets/bones/vendor.js', this.assets.vendor.handler);
    this.get('/assets/bones/core.js', this.assets.core.handler);
    this.get('/assets/bones/routers.js', this.assets.routers.handler);
    this.get('/assets/bones/models.js', this.assets.models.handler);
    this.get('/assets/bones/views.js', this.assets.views.handler);
    this.get('/assets/bones/templates.js', this.assets.templates.handler);

    this.get('/assets/bones/all.js', this.assets.all.handler);
};

server.prototype.initializeModels = function(app) {
    this.models = app.models;
    _.bindAll(this, 'loadModel', 'getModel', 'saveModel', 'delModel', 'loadCollection');
    this.get('/api/:model/:id', [this.loadModel, this.getModel]);
    this.post('/api/:model', [this.loadModel, this.saveModel]);
    this.put('/api/:model/:id', [this.loadModel, this.saveModel]);
    this.del('/api/:model/:id', [this.loadModel, this.delModel]);
    this.get('/api/:collection', this.loadCollection.bind(this));
};

function reg_replace(o) {
    _.each(o, function (v, k) {
        switch (typeof v) {
            case 'string':
                var m1 = v.match(/\/(.*)\/(.*)/);
                if (m1) v = new RegExp(m1[1], m1[2] || '');
                if (v === 'true') v = true;
                if (v === 'false') v = false;
                o[k] = v;
                break;
            case 'number':
                break
            default:
                reg_replace(v)
        }
    })
}

server.prototype.loadCollection = function(req, res, next) {
    var name = Bones.utils.pluralize(req.params.collection);
    //console.log('req.url', req.url);
    //console.log('req.query', req.query);

 //   console.log('loadCollection', name, req.query);
    if (name =='Videoes') {
        name = 'Videos'    
    }
//    if (name =='Categorieses') {
//        name = 'Categories'    
//    }
    var filter = {};
    var sort = {};
    var skip = null;
    var limit = null;
	var regexp = /\'/g;
    
    //console.log('filter11111111111111111111', req.query.filter);
    if (req.query.filter) {
    	//console.log('aaaa',req.query.filter);
    	filter = (req.query.msie)?JSON.parse(req.query.filter.replace(regexp, '"')):JSON.parse(req.query.filter);
        reg_replace(filter)
    }
    
    //console.log('filter2', req.query.filter);

    if (req.query.sort) {
    	sort = (req.query.msie)?JSON.parse(req.query.sort.replace(regexp, '"')):JSON.parse(req.query.sort);
    }
    
    if (req.query.skip) {
    	skip = (req.query.msie)?JSON.parse(req.query.skip.replace(regexp, '"')):JSON.parse(req.query.skip);
       // console.log('skip', skip);
    }

    if (req.query.limit) {
    	limit = (req.query.msie)?JSON.parse(req.query.limit.replace(regexp, '"')):JSON.parse(req.query.limit);
        //console.log('limit', limit);
    }
    

    if (name in this.models) {
        // Pass any querystring paramaters to the collection.
        req.collection = new this.models[name]([], req.query);
        //console.log('loadCollection', req.collection);
        req.collection.fetch({
            isClient: true,
            filter: filter,
            sort: sort,
            skip:skip,
            limit:limit,
            success: function(collection, resp) {
                res.send(resp, headers);
            },
            error: function(collection, err) {
                var error = err instanceof Object ? err.message : err;
                next(new Error.HTTP(error, err && err.status || 500));
            }
        });
    } else {
        next();
    }
};

server.prototype.loadModel = function(req, res, next) {
//	console.log('loadModel');
    var name = req.params.model;
    if (name in this.models) {
        // Pass any querystring paramaters to the model.
        req.model = new this.models[name]({ id: req.params.id }, req.query);
    }
    next();
};

server.prototype.getModel = function(req, res, next) {
    if (!req.model) return next();
    req.model.fetch({
        isClient: true,
        success: function(model, resp) {
            res.send(resp, headers);
        },
        error: function(model, err) {
            var error = err instanceof Object ? err.message : err;
            next(new Error.HTTP(error, err && err.status || 404));
        }
    });
};

server.prototype.saveModel = function(req, res, next) {
    if (!req.model) return next();
    req.model.save(req.body, {
        isClient: true,
        success: function(model, resp) {
            res.send(resp, headers);
        },
        error: function(model, err) {
            var error = err instanceof Object ? err.message : err;
            next(new Error.HTTP(error, err && err.status || 409));
        }
    });
};

server.prototype.delModel = function(req, res, next) {
    if (!req.model) return next();
    req.model.destroy({
        success: function(model, resp) {
            res.send({}, headers);
        },
        error: function(model, err) {
            var error = err instanceof Object ? err.message : err;
            next(new Error.HTTP(error, err && err.status || 409));
        }
    });
};

