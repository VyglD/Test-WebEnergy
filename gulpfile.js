const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const clean = require(`gulp-clean`);
const imagemin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const webpCSS = require(`gulp-webp-css`);
const htmlhint = require(`gulp-htmlhint`);
const htmlValidator = require(`gulp-w3c-html-validator`);
const htmlmin = require(`gulp-htmlmin`);
const pug = require(`gulp-pug`);
const pugLinter = require(`gulp-pug-linter`);
const sourcemap = require(`gulp-sourcemaps`);
const sass = require(`gulp-dart-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`postcss-csso`);
const rename = require(`gulp-rename`);
const browserify = require(`browserify`);
const babelify = require(`babelify`);
const terser = require(`gulp-terser`);
const source = require(`vinyl-source-stream`);
const buffer = require(`vinyl-buffer`);
const argv = require(`yargs`).argv;
const gulpif = require(`gulp-if`);
const server = require(`browser-sync`).create();

const FOLDER = {
  SRC: `source`,
  BUILD: `build`,
  MARKUP: `markup`,
  PUG: `pug`,
  STATIC: `static`,
  IMG: `img`,
  STYLES: `styles`,
  CSS: `css`,
  SCRIPTS: `scripts`,
  JS: `js`,
};

const PATH = {
  PUG: `${FOLDER.SRC}/${FOLDER.MARKUP}/${FOLDER.PUG}`,
  STATIC: `${FOLDER.SRC}/${FOLDER.STATIC}`,
  IMG: `${FOLDER.SRC}/${FOLDER.IMG}`,
  STYLES: `${FOLDER.SRC}/${FOLDER.STYLES}`,
  BUILD_STYLES: `${FOLDER.BUILD}/${FOLDER.CSS}`,
  SCRIPTS: `${FOLDER.SRC}/${FOLDER.SCRIPTS}`,
  BUILD_SCRIPTS: `${FOLDER.BUILD}/${FOLDER.JS}`,
};

PATH.PUG_PAGES = `${PATH.PUG}/pages`;

const copy = (paths, base = FOLDER.SRC) => {
  return gulp.src(paths, {base, allowEmpty: true})
    .pipe(gulp.dest(FOLDER.BUILD));
};

const minifyPictures = (paths) => {
  return gulp.src(paths, {base: FOLDER.SRC})
    .pipe(
        gulpif(
            argv.production,
            imagemin([
              imagemin.mozjpeg({progressive: true}),
              imagemin.optipng({optimizationLevel: 3}),
              imagemin.svgo({plugins: [{removeViewBox: false}]})
            ])
        )
    )
    .pipe(gulp.dest(FOLDER.BUILD));
};

const formattedPictures = (paths) => {
  const method = argv.production ? 6 : 0;

  return gulp.src(paths, {base: FOLDER.SRC})
    .pipe(webp({
      method,
      quality: 100
    }))
    .pipe(gulp.dest(FOLDER.BUILD));
};

const addNewImg = (path) => {
  minifyPictures([path]);
  formattedPictures([path]);
};

const addNewWebp = (path) => {
  formattedPictures([path]);
};

const addNewSvg = (path) => {
  minifyPictures([path]);
};

gulp.task(`test-pug`, () => {
  return gulp.src(`${PATH.PUG}/**/*.pug`)
    .pipe(pugLinter({
      reporter: `default`,
      failAfterError: true
    }));
});

gulp.task(`test-html`, () => {
  return gulp.src(`${FOLDER.BUILD}/*.html`)
    .pipe(plumber())
    .pipe(htmlhint(`.htmlhintrc`))
    .pipe(htmlhint.reporter())
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter());
});

gulp.task(`test`, gulp.series(`test-pug`, `test-html`));

gulp.task(`clean`, () => {
  return gulp.src(FOLDER.BUILD, {allowEmpty: true})
    .pipe(clean());
});

gulp.task(`copy-static-files`, () => {
  return copy(`${PATH.STATIC}/**/*`, PATH.STATIC);
});

gulp.task(`minify-pictures`, () => {
  return minifyPictures([`${PATH.IMG}/**/*.{png,jpg,svg}`]);
});

gulp.task(`formatted-pictures`, () => {
  return formattedPictures([`${PATH.IMG}/**/*.{png,jpg}`]);
});

gulp.task(`markup`, () => {
  return gulp.src(`${PATH.PUG_PAGES}/*.pug`)
    .pipe(pug())
    .pipe(
        gulpif(
            argv.production,
            htmlmin({
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
            })
        )
    )
    .pipe(gulp.dest(FOLDER.BUILD));
});

gulp.task(`styles`, () => {
  const isProd = Boolean(argv.production);

  return gulp.src(`${PATH.STYLES}/index.scss`)
    .pipe(plumber())
    .pipe(
        gulpif(
            !isProd,
            sourcemap.init()
        )
    )
    .pipe(sass())
    .pipe(postcss([
      autoprefixer,
      csso(
          {
            comments: false,
          }
      )
    ]))
    .pipe(rename(`style.min.css`))
    .pipe(webpCSS([`.jpg`, `.jpeg`, `.png`]))
    .pipe(
        gulpif(
            !isProd,
            sourcemap.write()
        )
    )
    .pipe(gulp.dest(PATH.BUILD_STYLES));
});

gulp.task(`scripts`, () => {
  const isProd = Boolean(argv.production);

  return Promise.resolve(
      browserify({
        entries: `${PATH.SCRIPTS}/index.js`,
        debug: !isProd
      })
        .transform(babelify)
        .bundle()
        .pipe(source(`bundle.js`))
        .pipe(buffer())
        .pipe(
            gulpif(
                !isProd,
                sourcemap.init({loadMaps: true})
            )
        )
        .pipe(
            gulpif(
                isProd,
                terser()
            )
        )
        .pipe(rename(`app.min.js`))
        .pipe(
            gulpif(
                !isProd,
                sourcemap.write()
            )
        )
        .pipe(gulp.dest(PATH.BUILD_SCRIPTS))
  ).catch(() => {});
});

gulp.task(`build`, gulp.series(
    `clean`,
    `copy-static-files`,
    `minify-pictures`,
    `formatted-pictures`,
    `markup`,
    `styles`,
    `scripts`
));

gulp.task(`refresh`, () => {
  server.reload();
});

gulp.task(`server`, () => {
  server.init({
    server: FOLDER.BUILD,
    port: 11552,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch(`${PATH.PUG}/**/*.pug`).on(`all`, gulp.series(`markup`, `refresh`));
  gulp.watch(`${PATH.STYLES}/**/*.scss`).on(`all`, gulp.series(`styles`, `refresh`));
  gulp.watch(`${PATH.SCRIPTS}/**/*.js`).on(`all`, gulp.series(`scripts`, `refresh`));
  gulp.watch(`${PATH.IMG}/**/*.{png,jpg}`).on(`add`, (args) => {
    addNewImg(args);
    server.reload();
  });
  gulp.watch(`${PATH.IMG}/**/*.webp`).on(`add`, (args) => {
    addNewWebp(args);
    server.reload();
  });
  gulp.watch(`${PATH.IMG}/**/*.svg`).on(`add`, (args) => {
    addNewSvg(args);
    server.reload();
  });
  gulp.watch(`${PATH.IMG}/**/*.svg`).on(`change`, (args) => {
    copy(args);
    server.reload();
  });
  gulp.watch(`${PATH.STATIC}/**/*`)
    .on(`all`, gulp.series(`copy-static-files`, `markup`, `refresh`));
});

gulp.task(`start`, gulp.series(`build`, `server`));
