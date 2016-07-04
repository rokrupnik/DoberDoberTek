/////// SETTINGS ////////////

var browser = "firefox"

// Plugins can't be stores in package.josn right now.
//  - They are published to plugin registry rather than npm.
//  - They don't list their dependency plugins in their package.json.
//    This might even be impossible because dependencies can be platform specific.
var plugins = ['org.apache.cordova.file'];


var pkg = require('./package.json');
var cordova_lib = require('cordova-lib');
var cdv = cordova_lib.cordova.raw;
var del = require('del');

var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var webpack = require('webpack-stream');
var copy = require('gulp-copy2');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

//////////////////////// TASKS /////////////////////////////

// All cordova-lib calls (except "cordova create") must be done from within
// the cordova project dir because cordova-lib determines projectRoot from
// process.cwd() in cordova-lib/src/cordova/util.js:isCordova()

// Check js code for errors
gulp.task('lint', function() {
    return gulp.src('src/js/index.js')
    .pipe(eslint({
		extends: 'eslint:recommended',
		// globals: {
		// 	"require": true,
		// 	"Libraries": true,
		// 	"$": true,
		// 	"_": true
		// },
		envs: ['browser'],
		rules: {
			"no-console": ['warn']
		}
    }))
    .pipe(eslint.format())
	.pipe(eslint.failAfterError());
});
 
gulp.task('optimize', ["webpack"], function() {
  return gulp.src('www/js/libs.js')
    .pipe(uglify())
    .pipe(gulp.dest('www/js'));
});

// Statically include all require() js stuff
gulp.task('webpack', shell.task([
    'webpack ./src/js/libs.js ./www/js/libs.js',
    'webpack ./src/js/index.js ./www/js/index.js',
]));

//build css files 
gulp.task('sass', function () {
  return gulp.src('./src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./www/css'))
    .pipe(browserSync.reload({
        stream: true
    }));
});

// Copy static files
gulp.task('copy', function() {
	var paths = [
        {src: 'src/img/**', dest: 'www/img/'},
        {src: 'node_modules/bootstrap/dist/css/bootstrap.css', dest: 'www/css/lib/'},
        {src: 'src/index.html', dest: 'www/index.html'},

        // {src: 'src/js/index.js', dest: 'www/js/index.js'},
    ];
	return copy(paths)
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('build', ['lint', 'webpack', 'sass',  'copy'], function() {});

gulp.task('android', ['build'], function(cb) {
    return cdv.run({platforms:['android'], options:['--device']});
});

gulp.task('browser', ['build'], function() {
    return cdv.run({platforms:['browser'], options:['--target=' + browser]});
});

gulp.task('clean', function(cb) {del(['www'], cb);});

gulp.task('watch:browser', function () {
    gulp.watch(['src/js/*.js', 'src/index.html'], ['browser']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'www'
        },
    });
});

gulp.task('watch', ['build', 'browserSync'], function (){
  gulp.watch(['src/js/*.js', 'src/index.html'], ['build']); 
  gulp.watch(['src/sass/*.scss'], ['sass']); 
  // Other watchers
});
