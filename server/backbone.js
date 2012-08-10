var Backbone = module.exports = require('../shared/backbone');

//Backbone.sync = function() {
//    throw new Error('No default sync method');
//};



// Create a new backbone-mongodb handler for a database 'documents'.
var mongo = require('bones-mongodb')({
    host: '127.0.0.1',
    port: 27017,
    name: 'documents'
});

// Create database and assign sync method to Backbone.
mongo.install(function(err) {
    Backbone.sync = mongo.sync;
});

// Backbone.sync will now load and save models from a 'documents' mongo db.
