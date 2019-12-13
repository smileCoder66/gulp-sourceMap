let gulp = require('gulp')
const htmlmin = require('gulp-htmlmin') //压缩html
const cleanCss = require('gulp-clean-css') //压缩css
const jsUglify = require('gulp-uglify-es').default //压缩js-es6
const sourcemaps = require('gulp-sourcemaps') //创建sourcemap
// const pump = require("pump") //pump() 泵
const fs = require('fs')

const sendPath = './dist' //输出路径

//node非空文件夹无法直接删除,只能遍历
const delDir = (paths) => {
  const files = fs.readdirSync(paths)
  files.forEach(file => {
    let curPath = `${paths}/${file}`
    if (fs.statSync(curPath).isDirectory()) delDir(curPath) //递归删除文件夹
    else fs.unlinkSync(curPath) //删除文件
  })
  fs.rmdirSync(paths)//内容空了,再删文件夹
}

if (fs.existsSync(sendPath)) delDir(sendPath)
//如果已存在输出的文件夹路径 则先删除

const html = (taskName, src, dest) => {
  gulp.task(taskName, () => {
    return gulp.src(src)
      .pipe(htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
      }))
      .pipe(gulp.dest(dest))
  })
}

const js = (taskName, src, dest, Iscompress) => {
  if (Iscompress) {
    gulp.task(taskName, () => {
      return gulp.src(src)
        .pipe(sourcemaps.init())
        .pipe(jsUglify())
        .pipe(sourcemaps.write('./')) //写下的路径已经处于输送路径
        .pipe(gulp.dest(dest))
    })
  } else {
    gulp.task(taskName, () => gulp.src(src).pipe(gulp.dest(dest)))
  }
}

const css = (taskName, src, dest) => {
  gulp.task(taskName, () => {
    return gulp.src(src)
      .pipe(cleanCss())
      .pipe(gulp.dest(dest))
  })
}

const images = (taskName, src, dest) => {
  gulp.task(taskName, () => gulp.src(src).pipe(gulp.dest(dest)))
}

const goods = [{
  type: 'html',
  src: ['./src/*.html'],
  dest: `${sendPath}`,
  methods: html
}, {
  type: 'js',
  src: ['./src/js/*.js'],
  dest: `${sendPath}/js`,
  Iscompress: true, //压缩输送or直接输送
  methods: js
}, {
  type: 'css',
  src: ['./src/css/*.css'],
  dest: `${sendPath}/css`,
  methods: css
}, {
  type: 'images',
  src: ['./src/images/*.png', './src/images/*.jpg', './src/images/*.webp'],
  dest: `${sendPath}/images`,
  methods: images
  //图片只处理输送,不压缩(在第三方平台压缩效果会比gulp好太多)
}]

let taskQueue = []

goods.forEach(({
  type,
  src,
  dest,
  Iscompress,
  methods
}) => {
  const taskName = `exe task ${type}`
  taskQueue.push(taskName)
  if (!Iscompress) methods(taskName, src, dest)
  else methods(taskName, src, dest, Iscompress)
})

gulp.task('default', gulp.series(taskQueue, () => {
  return new Promise((resolve, reject) => {
    console.log('操作完成')
    resolve()
  })
}))