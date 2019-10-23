 env = 'development';
// env = 'production';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    minifyHTML = require('gulp-minify-html'),
    sourcemaps = require('gulp-sourcemaps'),
    // postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    zip = require('gulp-zip'),
    htmlreplace = require('gulp-html-replace'),
    rename = require("gulp-rename"),
    stylish = require('jshint-stylish'),
    jshint = require('gulp-jshint'),
    // lec = require ('gulp-line-ending-corrector'),
    htmlPartial = require('gulp-html-partial'),
    htmlbeautify = require('gulp-html-beautify'),
    stripCssComments = require('gulp-strip-css-comments'),
    // gcmq = require('gulp-group-css-media-queries'),
    pngcrush = require('imagemin-pngcrush'),
    imagemin = require('gulp-imagemin'),
    uncss = require('gulp-uncss'),
   // plumber = require('gulp-plumber'),
    purify = require('gulp-purifycss'),
  //  notify = require('gulp-notify'),
    browserSync = require('browser-sync').create();

var env,
    jsSources,
    sassSources,
    htmlSources,
    outputDir,
    bootstrapSources,
    port,
    sassStyle;

var reload = browserSync.reload;

port = 8888

if (env === 'development') {
  outputDir = 'development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'production/';
  sassStyle = 'compressed';
}

jsSources = [
  // 'tools/js/jquery.js',
  'tools/js/nav.js',
  // 'components/scripts/jquery.scrollmagic.min.js',
  'tools/js/script.js'
];

sassSources = 'tools/sass/style.scss';
htmlSources = outputDir + '*.html';
bootstrapSources = 'tools/sass/vendor/bootstrap-4.0.0-alpha.6/scss/bootstrap-grid.scss';


// sass
function Sass() {
    return sass(sassSources, {
      sourcemap: true,
      style: sassStyle
    })
    .on('error', function (err) {
        console.error('Error!', err.message);
    })
    .pipe(autoprefixer())
    // .pipe(gcmq())
    // .pipe(uncss({
    //         html: [htmlSources],
    //         ignore: ['#header .btn.toggel span','#header .active']
    //     }))  //Removing Unused CSS
    // .pipe(purify(['development/js/script.js', htmlSources],{rejected:true}))
    .pipe(gulpif(env === 'development', sourcemaps.write()))
    .pipe(gulpif(env === 'production', stripCssComments()))
    .pipe(gulpif(env === 'production', rename({suffix: '.min'})))
    .pipe(gulp.dest(outputDir + 'css'))
    .pipe(connect.reload())
   //.pipe(browserSync.stream());
}// sass


//js
function js(done) {
  'use strict';

  gulp.src(jsSources)
  //  .pipe(plumber())
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    


  gulp.src(jsSources)

    .pipe(concat('script.js'))
    // .pipe(browserify())
   // .pipe(plumber())
    .on('error', gutil.log)
    .pipe(gulpif(env === 'development', sourcemaps.init()))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulpif(env === 'production', rename({suffix: '.min'})))
    .pipe(gulpif(env === 'development', sourcemaps.write()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
    done();
}//js



//connect
function Connect(done) {
  'use strict';
  connect.server({
    root: './',
    livereload: true,
    port: port
  });
  done()
  }; // connect

//browser-sync
function browsersync(done) {
    browserSync.init(gulpif(env === 'production', {
        // proxy: "127.0.0.98:80/s04/production/",
        proxy: "127.0.0.98:" + port + "/production/",
        port:8080,
        // server: "./development",
        open:false, 
        notify: false
    }, function (err, bs) {
      if (err)
        console.log(err);
      else
        console.log('BrowserSync is ready.');
      }),
    gulpif(env === 'development', {
        // proxy: "127.0.0.98:80/s04/development/",
        proxy: "127.0.0.98:" + port + "/development/",
        port:8080 ,
        // server: "./development",
        notify: false, 
        open:false 
    }, function (err, bs) {
      if (err)
        console.log(err);
      else
        console.log('BrowserSync is ready.');
      })
    );
    done()
};//browser-sync



//environment
function Env(done) {
 if (env === 'production'){
        console.log(' env = production!!\n environment is production files will be output in production \n█▀▀█ █▀▀█ █▀▀▀█ █▀▀▄ █  █ █▀▀█ ▀▀█▀▀ ▀█▀ █▀▀▀█ █▄  █\n█▄▄█ █▄▄▀ █   █ █  █ █  █ █      █    █  █   █ █ █ █\n█    █  █ █▄▄▄█ █▄▄▀ ▀▄▄▀ █▄▄█   █   ▄█▄ █▄▄▄█ █  ▀█\n');
      }else if (env === 'development') {
        console.log(' env = development!!\n environment is development files will be output in development\n█▀▀▄ █▀▀▀ █   █ █▀▀▀ █    █▀▀▀█ █▀▀█ █▀▄▀█ █▀▀▀ █▄  █ ▀▀█▀▀\n█  █ █▀▀▀  █ █  █▀▀▀ █    █   █ █▄▄█ █ █ █ █▀▀▀ █ █ █   █  \n█▄▄▀ █▄▄▄  ▀▄▀  █▄▄▄ █▄▄█ █▄▄▄█ █    █   █ █▄▄▄ █  ▀█   █\n');
      }else {
    console.log(' environment not defined\n█  █ █▄  █ █▀▀▄ █▀▀▀ █▀▀▀ ▀█▀ █▄  █ █▀▀▀ █▀▀▄\n█  █ █ █ █ █  █ █▀▀▀ █▀▀▀  █  █ █ █ █▀▀▀ █  █\n▀▄▄▀ █  ▀█ █▄▄▀ █▄▄▄ █    ▄█▄ █  ▀█ █▄▄▄ █▄▄▀\n');
      }
      done();
};////environment


// watch
function Watch(done) {
  'use strict';
  gulp.watch(['tools/sass/**/*.scss', 'tools/sass/*.scss'], Sass);
  // gulp.watch([bootstrapSources, 'tools/sass/vendor/bootstrap-4.0.0-alpha.6/scss/*.scss'], ['bootstrap']);
  // gulp.watch('development/*.html').on('change', browserSync.reload);
  gulp.watch(jsSources, js);
  // gulp.watch(['development/*.php', '*/*.php']);
  // gulp.watch('development/img/**/*.*', ['images']);
  // gulp.watch(['tools/html-page/html-partials/*.html','tools/html-page/*.html'],['html-partials']);
  // gulp.watch(['development/css/*.css', '*/*.css']).on('change', browserSync.reload);
done()
};//watch


//default
gulp.task('default', gulp.series(gulp.parallel(Watch, Connect, browsersync, Sass, js), function test(done) {
  //environment
  if (env === 'production'){
        console.log(' env = production!!\n environment is production files will be output in production \n█▀▀█ █▀▀█ █▀▀▀█ █▀▀▄ █  █ █▀▀█ ▀▀█▀▀ ▀█▀ █▀▀▀█ █▄  █\n█▄▄█ █▄▄▀ █   █ █  █ █  █ █      █    █  █   █ █ █ █\n█    █  █ █▄▄▄█ █▄▄▀ ▀▄▄▀ █▄▄█   █   ▄█▄ █▄▄▄█ █  ▀█\n');
      }else if (env === 'development') {
        console.log(' env = development!!\n environment is development files will be output in development\n█▀▀▄ █▀▀▀ █   █ █▀▀▀ █    █▀▀▀█ █▀▀█ █▀▄▀█ █▀▀▀ █▄  █ ▀▀█▀▀\n█  █ █▀▀▀  █ █  █▀▀▀ █    █   █ █▄▄█ █ █ █ █▀▀▀ █ █ █   █  \n█▄▄▀ █▄▄▄  ▀▄▀  █▄▄▄ █▄▄█ █▄▄▄█ █    █   █ █▄▄▄ █  ▀█   █\n');
      }else {
    console.log(' environment not defined\n█  █ █▄  █ █▀▀▄ █▀▀▀ █▀▀▀ ▀█▀ █▄  █ █▀▀▀ █▀▀▄\n█  █ █ █ █ █  █ █▀▀▀ █▀▀▀  █  █ █ █ █▀▀▀ █  █\n▀▄▄▀ █  ▀█ █▄▄▀ █▄▄▄ █    ▄█▄ █  ▀█ █▄▄▄ █▄▄▀\n');
      }//environment
     done()
}));//default

// gulp.task("default", Watch)
