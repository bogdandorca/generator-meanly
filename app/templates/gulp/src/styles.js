var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    chalk = require('chalk'),
    argv = require('yargs').argv,
    gulpif = require('gulp-if');

<%if(styleSystem === 'sass' || styleSystem === 'scss'){%>
    var sass = require('gulp-sass');
    var parseStylesheets = function(){
        return sass().on('error', sass.logError);
    };
<%} else if(styleSystem === 'less'){%>
    var less = require('gulp-less');
    var parseStylesheets = function(){
        return less();
    };
<%}%>

var filename;
argv.production ? filename = 'global.min.css' : filename = 'global.css';

var styles = function(){
    console.log(chalk.cyan('Processing style files...'));
    gulp.src('./public/assets/styles/global.scss')
        <%if(styleSystem !== 'css'){%>.pipe(parseStylesheets())<%}%>
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulpif(argv.production, minifyCss()))
        .pipe(gulpif(argv.production, rename(filename)))
        .pipe(gulp.dest('./public/assets/styles/'));

    console.log(chalk.green('Style files processed'));
};

module.exports = styles;