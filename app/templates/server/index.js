var express = require('express'),
    chalk = require('chalk'),<%if(appDatabase){%>
    mongoose = require('mongoose'),<%}%>
    env = process.env.NODE_ENV || 'development';

// Config
var app = express(),
    config = require('../config.js')[env];
require('./config/viewEngine')(app);
<%if(appDatabase){%>
// Database
mongoose.connect(config.database);
console.log(chalk.green.bold('Database connection established'));<%}%>
// Views<%if(appStructure === 'mvc'){%>
require('./views/public.view')(app);<%} else {%>
require('./Public/public.view')(app);<%}%>

app.listen(config.port);
console.log('Application started on port ' + chalk.green.bold(config.port.toString()));