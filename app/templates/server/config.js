module.exports = {
    name: '<%= appName %>',
    description: '<%if(appDescription !== ''){%><%= appDescription %><%}%>',
    development: {
        port: <%= appPort %><%if(appDatabase){%>,
        database: 'mongodb://localhost/<%=appDatabaseName%>'<%}%>
    },
    production: {
        port: <%= appPort %><%if(appDatabase){%>,
        database: 'mongodb://localhost/<%=appDatabaseName%>'<%}%>
    }
};