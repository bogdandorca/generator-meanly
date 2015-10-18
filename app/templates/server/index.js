var express = require('express'),
    chalk = require('chalk'),
    env = process.env.NODE_ENV || 'development';

var app = express(),
    config = require('../config.js')[env];
require('./config/viewEngine')(app);

require('./view/public.view')(app);

app.listen(config.port);
console.log('Application started on port ' + chalk.green.bold(config.port.toString()));