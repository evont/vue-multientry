const gulp = require("gulp");
const fs = require("fs");
const path = require("path");
const webpack = require("webpack-stream");
const minimist = require("minimist");
const postcss = require("gulp-postcss");
const htmlmin = require("gulp-htmlmin");
const named = require("vinyl-named");
const webpackConfig = require("./webpack.config");
const mergeStream = require("merge-stream");

function getPathInfo(dir) {
  const pathSplit = dir.split("/");
  const startIndex = pathSplit.indexOf("subject");
  const subjectDir = pathSplit[startIndex + 1];
  const subjectInfo = subjectDir.split("-");
  return {
    fullPath: pathSplit.slice(0, startIndex + 2).join("/"),
    dir: subjectInfo[0],
    type: subjectInfo[1],
    basename: path.basename(dir, path.extname(dir)),
    ext: path.extname(dir)
  };
}

function processJs({
  src,
  rootPath,
  publicPath,
  dest,
  template,
  outputHTML = false,
  isProd = false
}) {
  return gulp
    .src(src)
    .pipe(named())
    .pipe(
      webpack({
        config: webpackConfig({
          isProd,
          rootPath,
          publicPath,
          outputHTML,
          template
        })
      })
    )
    .pipe(gulp.dest(dest));
}

gulp.task("dev", () => {
  gulp.watch("./src/subject/*/**", event => {
    const pathInfo = getPathInfo(event.path);
    const { fullPath, dir, type, ext, basename } = pathInfo;
    if (type === "vue") {
      // vue 项目不处理css
      if (ext === ".js" || ext === ".vue" || ext === ".html") {
        const entryJs = `${fullPath}/entry.js`;
        processJs({
          src: entryJs,
          outputHTML: true,
          rootPath: fullPath,
          publicPath: `/subject/${dir}/`,
          dest: `./dist/subject/${dir}`
        });
      }
    } else {
      if (type === "map") {
        // js 与html 对应
        if (ext === ".js") {
          processJs({
            src: event.path,
            outputHTML: true,
            rootPath: fullPath,
            publicPath: `/subject/${dir}/`,
            dest: `./dist/subject/${dir}`,
            template: `${fullPath}/${basename}.html`
          });
        }
      } else {
        if (ext === ".js") {
          processJs({
            src: event.path,
            rootPath: fullPath,
            publicPath: `/subject/${dir}/`,
            dest: `./dist/subject/${dir}`
          });
        }
        if (ext === ".html") {
          return gulp
            .src(event.path)
            .pipe(
              htmlmin({
                collapseWhitespace: true,
                minifyJS: true,
                minifyCSS: true,
                processScripts: ["text/x-template"]
              })
            )
            .pipe(gulp.dest(`./dist/subject/${dir}`));
        }
      }
      if (ext === ".css") {
        return gulp
          .src(event.path)
          .pipe(postcss())
          .pipe(gulp.dest(`./dist/subject/${dir}/css`));
      }
    }
  });
});

function promiseTask(fullPath, item, dir) {
  return Promise.resolve(
    processJs({
      src: `${fullPath}/js/${item}`,
      isProd: true,
      outputHTML: true,
      rootPath: fullPath,
      publicPath: `/subject/${dir}/`,
      dest: `./dist/subject/${dir}`,
      template: `${fullPath}/${item.replace(".js", "")}.html`
    })
  );
}
const tasks = [];
function createTask(fullPath, item, dir) {
  const key = `webpack-${dir}-${item}`;
  gulp.task(key, () =>
    processJs({
      src: `${fullPath}/js/${item}`,
      isProd: true,
      outputHTML: true,
      rootPath: fullPath,
      publicPath: `/subject/${dir}/`,
      dest: `./dist/subject/${dir}`,
      template: `${fullPath}/${item.replace(".js", "")}.html`
    })
  );
  tasks.push(key);
}
gulp.task("build", () => {
  const argv = minimist(process.argv.slice(2));
  const subjectName = argv.d;
  const subjectPath = path.resolve(__dirname, `./src/subject/${subjectName}`);
  const pathInfo = getPathInfo(subjectPath);
  const { fullPath, dir, type, ext, basename } = pathInfo;
  if (type === "vue") {
    const entryJs = `${fullPath}/entry.js`;
    processJs({
      src: entryJs,
      outputHTML: true,
      rootPath: fullPath,
      publicPath: `/subject/${dir}/`,
      dest: `./dist/subject/${dir}`,
      isProd: true
    });
  } else {
    if (type === "map") {
      // js 与html 对应
      const tasks = fs.readdirSync(`${fullPath}/js/`).map(item =>
        processJs({
          src: `${fullPath}/js/${item}`,
          isProd: true,
          outputHTML: true,
          rootPath: fullPath,
          publicPath: `/subject/${dir}/`,
          dest: `./dist/subject/${dir}`,
          template: `${fullPath}/${item.replace(".js", "")}.html`
        })
      );
      return mergeStream(...tasks);
    } else {
      const htmlPro = gulp
        .src(`${fullPath}/*.html`)
        .pipe(
          htmlmin({
            collapseWhitespace: true,
            minifyJS: true,
            minifyCSS: true,
            processScripts: ["text/x-template"]
          })
        )
        .pipe(gulp.dest(`./dist/subject/${dir}`));
      
      const cssPro = gulp
        .src(`${fullPath}/css/*.css`,)
        .pipe(postcss())
        .pipe(gulp.dest(`./dist/subject/${dir}/css`));
      const jsPro = processJs({
        src: `${fullPath}/js/*.js`,
        isProd: true,
        rootPath: fullPath,
        publicPath: `/subject/${dir}/`,
        dest: `./dist/subject/${dir}`
      });
      return mergeStream(htmlPro, jsPro);
    }
  }
});
