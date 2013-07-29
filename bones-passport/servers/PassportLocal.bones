var passport = require('passport'),
    strategy = require('passport-local').Strategy;

server = servers.Passport.extend({
    key: 'local',
    strategy: strategy
});
