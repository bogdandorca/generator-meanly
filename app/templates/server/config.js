module.exports = {
    name: '<%= appName %>',
    description: '<%if(appDescription !== ''){%><%= appDescription %><%}%>',
    development: {
        port: <%= appDevelopmentPort %>,
        database: 'mongodb://localhost/ <%= appDatabaseName %>'
    },
    production: {
        port: <%= appProductionPort %>,
        database: 'mongodb://localhost/ <%= appDatabaseName %>'
    }
};