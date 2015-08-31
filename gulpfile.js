var gulp      = require('gulp');
//var jshint    = require('gulp-jshint');
var cache     = require('gulp-cached');
var csscomb   = require('gulp-csscomb');
var prettify  = require('gulp-jsbeautifier');
var plumber   = require('gulp-plumber');
var uglify    = require('gulp-uglifyjs');
var less      = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var notify    = require('gulp-notify');
var rename    = require('gulp-rename');
var header    = require('gulp-header');
var wrap      = require('gulp-wrap');
var exec      = require('gulp-exec');
var pkg       = require('./package.json');

var base = 'resource-bundles/SC_Community.resource/';

// -------------------------------------------------------------------------------------------------
// Shared resource path locations
// -------------------------------------------------------------------------------------------------
// jsWatchMin - Files that will be watched then minified into a single Javascript file upon changes
// jsLint - Files that will be ran through the linter
// scLESS - File that will be used to compile LESS to CSS
// cssWatch - Files that will be watched for changes then compiled upon changes
// -------------------------------------------------------------------------------------------------
  var srcPaths = {
    jsWatchMin:   [base + 'script/vendor/**/*.js', base + 'script/ui-init.js'],
    jsLint:       [base + 'script/**/*.js', base + '!script/vendor/**/*.js'],
    scLESS: [base + 'less/sc.less'],
    cleanCSS:     [base + 'less/**/*.less', base + '!less/vendor/**/*.less'],
    cssWatch:  [base + 'less/**/*.less']
  };

// -------------------------------------------------------------------------------------------------
// Build resource path locations
// -------------------------------------------------------------------------------------------------
// js - Compiled/minified Javascript output location
// css - Compiled/minified CSS output location
// -------------------------------------------------------------------------------------------------
  var buildPaths = {
    js: base + 'script',
    css: 'src/components'
  };

// -------------------------------------------------------------------------------------------------
// Error handler
// -------------------------------------------------------------------------------------------------
  var onError = function(err) {
    notify.onError({
      title:    'Gulp',
      subtitle: 'Failure!',
      message:  'Error: <%= error.message %>'
    })(err);
    this.emit('end');
  };

// -------------------------------------------------------------------------------------------------
// Header appended to all compiled files as a notice
// -------------------------------------------------------------------------------------------------
var compiledBanner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version <%= pkg.version %>',
  ' * @author <%= pkg.author %>',
  ' *',
  ' * COMPILED FILE DO NOT DIRECTLY EDIT',
  ' */',
  ''].join('\n');

// -------------------------------------------------------------------------------------------------
// JavaScript Tasks
// -------------------------------------------------------------------------------------------------

  // Runs JSLint and formats all custom JavaScript files except "vendor" files in the src/js/vendor directory.
  //
  // Configuration files:
  // JS Lint: /.jsintrc
  // JS Beautifer: /.jsbeautifyrc
  //
  // For more information view:
  // JS Lint: https://www.npmjs.org/package/gulp-jshint/
  // JS Beautifer: https://github.com/tarunc/gulp-jsbeautifier
  // -----------------------------
  gulp.task('cleanJS', function() {
    return gulp.src(srcPaths.jsLint, {base: './'})
      .pipe(plumber())
      .pipe(cache('cleanJS'))
      //.pipe(jshint())
      //.pipe(jshint.reporter('jshint-stylish'))
      //.pipe(prettify({config: '.jsbeautifyrc'}))
      .pipe(gulp.dest('./'));
  });

  // Minifies all the JavaScript in the jsWatchMin paths
  // -----------------------------
  gulp.task('minifyJS', ['cleanJS'], function() {
    return gulp.src(srcPaths.jsWatchMin)
      .pipe(plumber())
      .pipe(uglify('all.min.js', {
        mangle: true,
        outSourceMap: true
      }))
      .pipe(header(compiledBanner, { pkg : pkg } ))
      .pipe(gulp.dest(buildPaths.js));
  });

  // Build JavaScript tasks
  // -----------------------------
  gulp.task('buildJS', ['minifyJS']);

// -------------------------------------------------------------------------------------------------
// CSS Tasks
// -------------------------------------------------------------------------------------------------
  
  // Runs CSSComb and formats all custom LESS files.
  //
  // Configuration files:
  // /.csscomb.json
  //
  // For more information view:
  // http://csscomb.com
  // -----------------------------
  gulp.task('cleanCSS', function() {
    return gulp.src(srcPaths.cleanCSS, {base: './'})
      .pipe(plumber({errorHandler: onError}))
      .pipe(cache('csscomb'))
      .pipe(gulp.dest('./'));
  });

  // Compile LESS files into CSS
  // -----------------------------

  gulp.task('compileCSS', ['cleanCSS'], function() {
    return gulp.src(srcPaths.scLESS)
      .pipe(plumber({errorHandler: onError}))
      .pipe(exec('mavensmate clean-project'))
      .pipe(less())
      .pipe(wrap('<apex:component controller="SC_CSSMainController" layout="none" >\n<%= contents %>\n</apex:component>'))
      .pipe(rename("SC_CSSMain.component"))
      .pipe(gulp.dest(buildPaths.css))
      .pipe(exec('mavensmate compile-metadata src/components/SC_CSSMain.component'))
      .pipe(notify({
        title: 'Gulp',
        subtitle: 'Success',
        message: 'LESS compiled'
      }));
  });


// -------------------------------------------------------------------------------------------------
// Watch Tasks
// -------------------------------------------------------------------------------------------------
  gulp.task('watch', function() {
    gulp.watch(srcPaths.jsWatchMin, ['buildJS']);
    gulp.watch(srcPaths.cssWatch, ['compileCSS']);
  });

// -------------------------------------------------------------------------------------------------
// The default task (called when you run `gulp` from cli)
// -------------------------------------------------------------------------------------------------
  gulp.task('default', ['buildJS', 'compileCSS', 'watch']);
