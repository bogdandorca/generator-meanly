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
            styleSystem: this.styleExtension,
            templatingSystem: this.templatingSystem,
            appDevelopmentPort: this.appDevelopmentPort,
            appProductionPort: this.appProductionPort,
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
                message: 'Mind if you add a description for this project? Might help at some point'
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
                choices: ['I\'ll stick to the old rusty CSS', 'Scss', 'Sass'],
                filter: function(value){
                    return value.toLowerCase();
                }
            },
            {
                name: 'templatingSystem',
                type: 'list',
                message: 'Which templating system do you want to use?',
                choices: ['html', 'jade'],
                filter: function(value){
                    return value.toLowerCase();
                }
            },
            {
                name: 'appDevelopmentPort',
                message: 'On which port will your app run on the development environment?',
                default: 8080
            },
            {
                name: 'appProductionPort',
                message: 'On which port will your app run on the production environment?',
                default: 80
            },
            {
                name: 'appDatabaseName',
                message: 'Which database will you use?',
                default: this.appname
            }
        ];
    },
    _saveUserAnswers: function(answers, callback){
        this.appName = answers.name;
        this.appDescription = answers.description;
        this.appVersion = answers.version;
        this.appLicense = answers.license;
        this.appAuthor = answers.yourname;
        this.appEmail = answers.email;
        this.styleSystem = answers.styleSystem;
        this.templatingSystem = answers.templatingSystem;
        this.appDevelopmentPort = answers.appDevelopmentPort;
        this.appProductionPort = answers.appProductionPort;
        this.appDatabaseName = answers.appDatabaseName;

        callback();
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

        if(styleExtension === 'sass' || styleExtension === 'scss'){
            mkdirp(publicDir + '/assets/styles/src');
            this.fs.copy(templateFiles + '/styles/sass/global.'+styleExtension, publicDir + '/assets/styles/global.'+styleExtension);
            this.fs.copy(templateFiles + '/styles/sass/_variables.'+styleExtension, publicDir + '/assets/styles/src/_variables.'+styleExtension);
        }
    },
    _initializeTemplatingSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            publicDir = destRoot + '/public',
            templateContext = this._getTemplateVariables();

        var templatingSystem = templateContext.templatingSystem;

        this.fs.copyTpl(templateFiles + '/template/index.'+templatingSystem, publicDir + '/index.'+templatingSystem, templateContext);
        this.fs.copy(templateFiles + '/template/src/header.'+templatingSystem, publicDir + '/template/header.'+templatingSystem);

        if(templatingSystem === 'jade'){
            this.fs.copyTpl(templateFiles + '/template/src/layout.jade', publicDir + '/template/layout.jade', templateContext);
            this.fs.copyTpl(templateFiles + '/template/src/scripts.jade', publicDir + '/template/scripts.jade', templateContext);
        }
    },
    _initializeServerSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            serverDir = destRoot + '/server',
            templateContext = this._getTemplateVariables();

        this.fs.copyTpl(templateFiles + '/server/index.js', serverDir + '/index.js', templateContext);
        this.fs.copyTpl(templateFiles + '/server/config.js', './config.js', templateContext);
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
            this._saveUserAnswers(answers, done);
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
    },
    install: function(){
        this.bowerInstall();
        this.npmInstall();
    }
});