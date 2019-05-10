const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const merge = require('merge-stream');
const htmlmin = require('gulp-htmlmin');
const named = require('vinyl-named');

function getZtPath(ztPath, removeStr = '') {
  const findStr = '/src/subject/';
  const dir = path.dirname(ztPath);
  const ind = dir.indexOf(findStr) + findStr.length;
  return dir.slice(ind).replace(removeStr, '');
}

gulp.task('dev', () => {
  gulp.watch(['./src/subject/*/entry.js', './src/subject/*/**.vue', './src/subject/*/**/**.vue'], (event) => {
    const newPath = getZtPath(event.path);
    const pathSplit = event.path.split('/');
    const subjectRoot = pathSplit.slice(0, pathSplit.indexOf('subject') + 2).join('/');
    const entryPath = `${subjectRoot}/entry.js`;
    return gulp.src(entryPath)
      .pipe(named())
      .pipe(webpack(require('./webpack.config')({
        rootPath: subjectRoot,
        publicPath: `/subject/${newPath}`,
        outputHTML: true
      })))
      .pipe(gulp.dest(`./dist/subject/${newPath}`));
  });
  gulp.watch('./src/subject/*/*.html', (event) => {
    const newPath = getZtPath(event.path);
    return gulp.src(event.path)
      .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true, minifyCSS: true, processScripts: ['text/x-template'] }))
      .pipe(gulp.dest(`./dist/subject/${newPath}`));
  });

  gulp.watch('./src/subject/*/js/*.js', (event) => {
    const newPath = getZtPath(event.path);
    return gulp.src(event.path)
      .pipe(named())
      .pipe(webpack(require('./webpack.config')({
        publicPath: `/subject/${newPath}`,
      })))
      .pipe(gulp.dest(`./dist/subject/${newPath}`));
  });
  gulp.watch('./src/subject/*/css/*.css', (event) => {
    const newPath = getZtPath(event.path, '/css');
    task.postCss(`./src/subject/${newPath}/css/`, `./dist/subject/${newPath}/css`, [`subject/${newPath}/img`]);
  });
})

gulp.task('prod', () => {
  gulp.watch(['./src/subject/*/entry.js', './src/subject/*/**.vue', './src/subject/*/**/**.vue'], (event) => {
    const newPath = getZtPath(event.path);
    const pathSplit = event.path.split('/');
    const subjectRoot = pathSplit.slice(0, pathSplit.indexOf('subject') + 2).join('/');
    const entryPath = `${subjectRoot}/entry.js`;
    return gulp.src(entryPath)
      .pipe(named())
      .pipe(webpack(require('./webpack.config')({
        mode: 'production',
        rootPath: subjectRoot,
        publicPath: `/subject/${newPath}`,
        outputHTML: true
      })))
      .pipe(gulp.dest(`./dist/subject/${newPath}`));
  });
  gulp.watch('./src/subject/*/*.html', (event) => {
    const newPath = getZtPath(event.path);
    return gulp.src(event.path)
      .pipe(htmlmin({ collapseWhitespace: true, minifyJS: true, minifyCSS: true, processScripts: ['text/x-template'] }))
      .pipe(gulp.dest(`./dist/subject/${newPath}`));
  });

  gulp.watch('./src/subject/*/js/*.js', (event) => {
    const newPath = getZtPath(event.path);
    const pathSplit = event.path.split('/');
    const subjectRoot = pathSplit.slice(0, pathSplit.indexOf('subject') + 2).join('/');
    return gulp.src(event.path)
      .pipe(named())
      .pipe(webpack(require('./webpack.config')({
        mode: 'production',
        rootPath: subjectRoot,
        publicPath: `/subject/${newPath}`,
        outputHTML: true
      })))
      .pipe(gulp.dest(`./dist/subject/${newPath}`));
  });
  gulp.watch('./src/subject/*/css/*.css', (event) => {
    const newPath = getZtPath(event.path, '/css');
    task.postCss(`./src/subject/${newPath}/css/`, `./dist/subject/${newPath}/css`, [`subject/${newPath}/img`]);
  });
})