'use strict';

var generators = require('yeoman-generator'),
    mkdirp = require('mkdirp'),
    yosay = require('yosay'),
    chalk = require('chalk');

module.exports = generators.Base.extend({
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
                name: 'styleExtension',
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
        this.styleExtension = answers.styleExtension;
        this.templatingSystem = answers.templatingSystem;

        callback();
    },
    _createProjectFileSystem: function(){
        var destRoot = this.destinationRoot(),
            publicDir = destRoot + '/public',
            serverDir = destRoot + '/server';
        //
        mkdirp('/gulp_tasks');
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
            templateContext = {
                appName: this.appName,
                appDescription: this.appDescription,
                appVersion: this.appVersion,
                appLicense: this.appLicense,
                appAuthor: this.appAuthor,
                appEmail: this.appEmail
            };

        // Bower
        this.fs.copy(templateFiles + '/.bowerrc', destRoot + '/.bowerrc');
        this.fs.copyTpl(templateFiles + '/bower.json', destRoot + '/bower.json', templateContext);

        // npm
        this.fs.copyTpl(templateFiles + '/package.json', destRoot + '/package.json', templateContext);

        // Git
        this.fs.copyTpl(templateFiles + '/README.md', destRoot + '/README.md', templateContext);
        this.fs.copyTpl(templateFiles + '/CONTRIBUTING.md', destRoot + '/CONTRIBUTING.md', templateContext);
    },
    _stylingSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            publicDir = destRoot + '/public';

        var styleExtension = this.styleExtension;

        if(styleExtension === 'sass' || styleExtension === 'scss'){
            mkdirp(publicDir + '/assets/styles/src');
            this.fs.copy(templateFiles + '/styles/sass/global.'+styleExtension, publicDir + '/assets/styles/global.'+styleExtension);
            this.fs.copy(templateFiles + '/styles/sass/_variables.'+styleExtension, publicDir + '/assets/styles/src/_variables.'+styleExtension);
        }
    },
    _templateingSystem: function(){
        var destRoot = this.destinationRoot(),
            templateFiles = this.sourceRoot(),
            publicDir = destRoot + '/public',
            templateContext = {
                appName: this.appName,
                appDescription: this.appDescription,
                appVersion: this.appVersion,
                appLicense: this.appLicense,
                appAuthor: this.appAuthor,
                appEmail: this.appEmail
            };

        var templatingSystem = this.templatingSystem;

        this.fs.copyTpl(templateFiles + '/template/index.'+templatingSystem, publicDir + '/index.'+templatingSystem, templateContext);
        this.fs.copy(templateFiles + '/template/src/header.'+templatingSystem, publicDir + '/template/header.'+templatingSystem);

        if(templatingSystem === 'jade'){
            this.fs.copyTpl(templateFiles + '/template/src/layout.jade', publicDir + '/template/layout.jade', templateContext);
            this.fs.copyTpl(templateFiles + '/template/src/scripts.jade', publicDir + '/template/scripts.jade', templateContext);
        }
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

        this._stylingSystem();
        this._templateingSystem();
    },
    //install: function(){
    //    this.bowerInstall();
    //    this.npmInstall();
    //}
});