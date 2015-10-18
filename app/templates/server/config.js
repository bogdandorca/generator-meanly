module.exports = {
    name: '<%= appName %>',
    description: '<%if(appDescription !== ''){%><%= appDescription %><%}%>',
    development: {
        port: <%= appPort %>,
        database: 'mongodb://localhost/ <%= appDatabaseName %>'
    },
    production: {
        port: <%= appPort %>,
        database: 'mongodb://localhost/ <%= appDatabaseName %>'
    }
};