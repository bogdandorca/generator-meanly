'use strict';

var generators = require('yeoman-generator'),
    mkdirp = require('mkdirp'),
    yosay = require('yosay'),
    chalk = require('chalk');

module.exports = generators.Base.extend({
    _getTemplateVariables: function(){
        return {
            appName: this.appName,
            appDescription: this.appDescription,
            appVersion: this.appVersion,
            appLicense: this.appLicense,
            appAuthor: this.appAuthor,
            appEmail: this.appEmail,
            styleSystem: this.styleSystem,
            postCss: this.postCss,
            appStructure: this.appStructure,
            appPort: this.appPort,
            appDatabase: this.appDatabase,
            appDatabaseName: this.appDatabaseName
        };
    },
    _getPrompts: function(){
        return [
            {
                name: 'name',
                message: 'What is the name of your project?',
                default: this.appname
            },
            {
                name: 'description',
                message: 'Mind adding a description for this project?'
            },
            {
                name: 'version',
                message: 'What is the current version?',
                default: '0.0.0'
            },
            {
                name: 'license',
                message: 'How is your project licensed?',
                default: 'MIT'
            },
            {
                name: 'yourname',
                message: 'What is your name?'
            },
            {
                name: 'email',
                message: 'What is your email address?'
            },
            {
                name: 'styleSystem',
                type: 'list',
                message: 'Which CSS extension do you want to use?',
                choices: ['CSS', 'Scss', 'Sass', 'Less'],
                filter: function(value){
                    return value.toLowerCase();
                }
            },
            {
                name: 'postCss',
                type: 'confirm',
                message: 'Would you like to include PostCSS in your project?',
                default: true
            },
            {
                name: 'appStructure',
                type: 'list',
                message: 'What kind of structure would you prefer?',
                choices: ['MVC', 'Modular'],
                filter: function(value){
                    return value.toLowerCase();
                }
            },
            {
                name: 'appPort',
                message: 'On which port will your app run?',
                default: 8080
            },
            {
                name: 'appDatabase',
                type: 'confirm',
                message: 'Would you like to add MongoDB to your project?',
                default: false
            }
        ];
    },
    _getSecondaryPrompts: function(){
        return [
            {
                name: 'appDatabaseName',
                message: 'What is the name of the database you\'ll be using?',
                default: this.appname
            }
        ];
    },
    _saveUserAnswers: function(answers){
        this.appName = answers.name;
        this.appDescription = answers.description;
        this.appVersion = answers.version;
        this.appLicense = answers.license;
        this.appAuthor = answers.yourname;
        this.appEmail = answers.email;
        this.styleSystem = answers.styleSystem;
        this.postCss = answers.postCss;
        this.appStructure = answers.appStructure;
        this.appPort = answers.appPort;
        this.appDatabase = answers.appDatabase;
    },
    _createProjectFileSystem: function(){
        var destRoot = this.destinationRoot(),
            publicDir = destRoot + '/public',
            serverDir = destRoot + '/server';
        // Gulp
        mkdirp('./gulp_tasks');
        // Public FS
        mkdirp(publicDir + '/app');
        mkdirp(publicDir + '/assets/images');
        mkdirp(publicDir + '/assets/styles');
        mkdirp(publicDir + '/template');
        mkdirp(publicDir + '/partials');
        // Server FS
        mkdirp(serverDir + '/config');
        // Chosen structure based FS
        if(this.appStructure === 'mvc'){
            mkdirp(publicDir + '/app/controllers');
            mkdirp(publicDir + '/app/directives');
            mkdirp(publicDir + '/app/services');
            mkdirp(publicDir + '/app/filters');

            mkdirp(serverDir + '/views');
            mkdirp(serverDir + '/models');
            mkdirp(serverDir + '/controllers');
        } else {
            mkdirp(publicDir + '/app/Home');
            mkdirp(serverDir + '/Public');
        }
    },
    _configFileGenerator: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            templateContext = this._getTemplateVariables();

        // Bower
        this.fs.copy(templateFiles + '/.bowerrc', destRoot + '/.bowerrc');
        this.fs.copyTpl(templateFiles + '/bower.json', destRoot + '/bower.json', templateContext);

        // npm
        this.fs.copyTpl(templateFiles + '/package.json', destRoot + '/package.json', templateContext);

        // Git
        this.fs.copyTpl(templateFiles + '/README.md', destRoot + '/README.md', templateContext);
        this.fs.copyTpl(templateFiles + '/CONTRIBUTING.md', destRoot + '/CONTRIBUTING.md', templateContext);
    },

    _initializeStylingSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            publicDir = destRoot + '/public',
            templateContext = this._getTemplateVariables();

        var styleExtension = templateContext.styleSystem;

        if(styleExtension !== 'css'){
            mkdirp(publicDir + '/assets/styles/src');
            this.fs.copy(templateFiles + '/styles/'+styleExtension+'/global.'+styleExtension, publicDir + '/assets/styles/global.'+styleExtension);
            this.fs.copy(templateFiles + '/styles/'+styleExtension+'/_variables.'+styleExtension, publicDir + '/assets/styles/src/_variables.'+styleExtension);
        }
    },
    _initializeTemplatingSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            publicDir = destRoot + '/public',
            templateContext = this._getTemplateVariables();


        this.fs.copyTpl(templateFiles + '/template/index.jade', publicDir + '/index.jade', templateContext);
        this.fs.copy(templateFiles + '/template/src/header.jade', publicDir + '/template/header.jade');
        this.fs.copyTpl(templateFiles + '/template/src/layout.jade', publicDir + '/template/layout.jade', templateContext);
        this.fs.copyTpl(templateFiles + '/template/src/scripts.jade', publicDir + '/template/scripts.jade', templateContext);
    },
    _initializeServerSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            serverDir = destRoot + '/server',
            templateContext = this._getTemplateVariables();

        this.fs.copyTpl(templateFiles + '/server/index.js', serverDir + '/index.js', templateContext);
        this.fs.copyTpl(templateFiles + '/server/config.js', './config.js', templateContext);
        this.fs.copyTpl(templateFiles + '/server/viewEngine.js', serverDir + '/config/viewEngine.js', templateContext);

        if(this.appStructure === 'mvc'){
            this.fs.copyTpl(templateFiles + '/server/public.view.js', serverDir + '/views/public.view.js', templateContext);
        } else {
            this.fs.copyTpl(templateFiles + '/server/public.view.js', serverDir + '/Public/public.view.js', templateContext);
        }
    },
    _initializeClientSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            publicDir = destRoot + '/public',
            templateContext = this._getTemplateVariables();

        this.fs.copyTpl(templateFiles + '/client/app.module.js', publicDir + '/app/app.module.js', templateContext);
        this.fs.copyTpl(templateFiles + '/client/404.jade', publicDir + '/partials/404.jade', templateContext);
        this.fs.copyTpl(templateFiles + '/client/home.jade', publicDir + '/partials/home.jade', templateContext);
        if(this.appStructure === 'mvc'){
            this.fs.copyTpl(templateFiles + '/client/home.controller.js', publicDir + '/app/controllers/home.controller.js', templateContext);
        } else {
            this.fs.copyTpl(templateFiles + '/client/home.controller.js', publicDir + '/app/Home/home.controller.js', templateContext);
        }
    },
    _initializeTaskAutomationSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            gulpDir = destRoot + '/gulp_tasks',
            templateContext = this._getTemplateVariables();

        this.fs.copyTpl(templateFiles + '/gulp/gulpfile.js', './gulpfile.js', templateContext);
        this.fs.copyTpl(templateFiles + '/gulp/src/clean.js', gulpDir + '/clean.js', templateContext);
        this.fs.copyTpl(templateFiles + '/gulp/src/clientScripts.js', gulpDir + '/clientScripts.js', templateContext);
        this.fs.copyTpl(templateFiles + '/gulp/src/injector.js', gulpDir + '/injector.js', templateContext);
        this.fs.copyTpl(templateFiles + '/gulp/src/lint.js', gulpDir + '/lint.js', templateContext);
        this.fs.copyTpl(templateFiles + '/gulp/src/server.js', gulpDir + '/server.js', templateContext);
        this.fs.copyTpl(templateFiles + '/gulp/src/specs.js', gulpDir + '/specs.js', templateContext);
        this.fs.copyTpl(templateFiles + '/gulp/src/styles.js', gulpDir + '/styles.js', templateContext);
    },

    initializing: function(){
        var message = chalk.yellow.bold('Welcome to Meanly! ') +
            chalk.yellow('Your new favorite MEAN stack generator!');

        var yosayConfig = {
            maxLength: 22
        };

        this.log(yosay(message, yosayConfig));
    },
    prompting: function(){
        var done = this.async();

        this.prompt(this._getPrompts(), function(answers){
            this._saveUserAnswers(answers);
            if(this.appDatabase){
                this.prompt(this._getSecondaryPrompts(), function(answers) {
                    this.appDatabaseName = answers.appDatabaseName;
                    done();
                }.bind(this));
            } else {
                done();
            }
        }.bind(this));
    },
    configuring: function(){
        this.config.save();
    },
    writing: function(){
        this._createProjectFileSystem();
        this._configFileGenerator();

        this._initializeStylingSystem();
        this._initializeTemplatingSystem();
        this._initializeServerSystem();
        this._initializeClientSystem();
        this._initializeTaskAutomationSystem();
    },
    install: function(){
        this.bowerInstall();
        this.npmInstall();
    }
});