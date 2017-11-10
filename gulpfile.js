var gulp       = require('gulp');
var sass       = require('gulp-sass');
var cleanCSS   = require('gulp-clean-css');
var concat     = require('gulp-concat');  
var rename     = require('gulp-rename');  
var uglify     = require('gulp-uglify');
var prefix     = require('gulp-autoprefixer');
var importCss  = require('gulp-import-css');

// Styles task
gulp.task('styles', function() {

  // create theme bootstrap
  gulp.src(['./styles/bootstrap.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('template.css'))
    .pipe(prefix({
      browsers: [
        'last 5 versions',
        'android 4',
        'opera 12', 
        'safari 8'
      ]
    }))
    .pipe(importCss())
    .pipe(cleanCSS({compatibility: 'ie10'}))
    .pipe(gulp.dest('./assets/css/'));
});

// Scripts task
gulp.task('scripts', function() {
    
    gulp.src([
      './node_modules/jquery/dist/jquery.js',
      './node_modules/three/build/three.js',
      './node_modules/three/examples/js/renderers/Projector.js',
      './node_modules/three/examples/js/renderers/CanvasRenderer.js',
      './node_modules/owl.carousel/dist/owl.carousel.js',
      './node_modules/bootstrap/js/dist/util.js',
      './node_modules/bootstrap/js/dist/scrollspy.js',
      './node_modules/odometer/odometer.js',
      './node_modules/wowjs/dist/wow.js',
      /*'./node_modules/popper.js/dist/umd/popper.js',
      './node_modules/bootstrap/js/dist/util.js',
      './node_modules/bootstrap/js/dist/carousel.js',
      './node_modules/bootstrap/js/dist/modal.js',
      './node_modules/bootstrap/js/dist/dropdown.js',
      './node_modules/bootstrap/js/dist/tooltip.js',
      './node_modules/bootstrap/js/dist/dropdown.js',
      './node_modules/bootstrap/js/dist/modal.js',
      './node_modules/bootstrap/js/dist/tab.js',
      './node_modules/bootstrap/js/dist/scrollspy.js',
      './node_modules/particles.js/particles.js',
      './node_modules/numeral/src/numeral.js',
      './node_modules/wowjs/dist/wow.js',
      './node_modules/kinetic/kinetic.js',*/
      
  	])
    .pipe(concat('core.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./assets/js/'));
});


// Watch task
gulp.task('default',function() {
  // run task initially, after that watch
  gulp.start('styles');
  gulp.start('scripts');
});