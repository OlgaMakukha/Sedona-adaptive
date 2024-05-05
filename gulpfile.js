import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browsersync from 'browser-sync';
import { deleteAsync } from 'del';
import rename from 'gulp-rename';
import csso from 'postcss-csso';
import sourcemaps from 'gulp-sourcemaps';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import svgstore from 'gulp-svgstore';
import imagemin, { mozjpeg, optipng } from 'gulp-imagemin';


// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(browsersync.stream());
}

// Delete Build

export const del = () => {
  return deleteAsync('build');
}

// HTML minify

export const htmlMin = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

// JS minify

// export const jsMin = () => {
//   return gulp.src('source/js/main.js')
//     .pipe(terser())
//     .pipe(rename('main.min.js'))
//     .pipe(gulp.dest('build/js'))
//     .pipe(browsersync.stream());
// }

export const jsMin = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
    .pipe(browsersync.stream());
}

// Images

export const svgSprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

export const optimizeImg = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(imagemin([
      mozjpeg({ quality: 75, progressive: true }),
      optipng({ optimizationLevel: 5 })
    ]))
    .pipe(gulp.dest('build/img'));
}

export const copyImg = () => {
  return gulp.src('source/img/**/*.{png,jpg,svg}')
    .pipe(gulp.dest('build/img'));
}

// Copy

export const copy = () => {
  return gulp.src([
    'source/fonts/*.{woff,woff2}',
    'source/*.ico'
  ],
    {
      base: 'source'
    })
    .pipe(gulp.dest('build'));
}

// Server

export const server = (done) => {
  browsersync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

export const reload = (done) => {
  browsersync.reload();
  done();
}

// Watcher

export const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/**/*.js', gulp.series(jsMin));
  gulp.watch('source/*.html', gulp.series(htmlMin, reload));
}

// Build

export const build = gulp.series(
  del,
  copy,
  optimizeImg,
  gulp.parallel(
    styles,
    htmlMin,
    jsMin,
    svgSprite
  )
);

// Default

export default gulp.series(
  del,
  copy,
  copyImg,
  gulp.parallel(
    styles,
    htmlMin,
    jsMin,
    svgSprite
  ),
  gulp.series(
    server,
    watcher
  )
);
