/**
 * gulp组件
 */
var gulp = require('gulp'); //安装->引入

/**
 * 基础组件
 * gulp-htmlmin: html压缩
 * gulp-less: less预编译
 * gulp-uglify: JS压缩
 * babel:ES6->ES5
 * pump:压缩JS专用管道
 * gulp-imagemin: 图片压缩
 * imagemin-pngquant: 图片深度压缩
 * gulp-livereload: 网页自动刷新
 * gulp-webserver: 本地服务器
 * gulp-rename: 文件重命名
 * gulp-sourcemaps: 来源地图
 * gulp-changed: 只操作有过修改的文件
 * gulp-concat: 文件合并
 * gulp-clean': 文件清理
 */

var htmlmin = require('gulp-htmlmin'),
    less = require('gulp-less'),
    cssmin = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel'),
    pump = require('pump'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    tinypng_nokey = require('gulp-tinypng-nokey'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    changed = require('gulp-changed'),
    concat = require("gulp-concat"),
    clean = require('gulp-clean');

/**
 * 全局配置
 * srcPath: 源文件path
 * distPath: 输出path
 */

var srcPath = {
    html: './',
    css: 'public/css',
    script: 'public/src',
    configjs: 'public/js',
    image: 'public/images',
    assets: 'public/assets',
    fonts: 'public/fonts',
    language: 'public/language',
    upload: 'upload'
};
var distPath = {
    html: 'dist',
    css: 'dist/public/css',
    script: 'dist/public/src',
    configjs: 'dist/public/js',
    image: 'dist/public/images',
    assets: 'dist/public/assets',
    fonts: 'dist/public/fonts',
    language: 'dist/public/language',
    upload: 'dist/upload'
}

/**
 * 开发环境任务
 */

// HTML处理----->1
gulp.task('html', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src(srcPath.html + '/*.html').pipe(changed(distPath.html)).pipe(htmlmin(options)).pipe(gulp.dest(distPath.html));
    // 找到文件-->压缩-->输出

});

// less->CSS压缩
gulp.task('less', function () {
    return gulp.src(srcPath.css + '/index.less').pipe(less()).pipe(cssmin()).pipe(gulp.dest(distPath.css));
    // 找到文件-->编译-->压缩-->输出
});

//  复制CSS,压缩用koala----->2
gulp.task('css', ['less', 'fonts'], function () {
    return gulp.src(srcPath.css + '/*.css').pipe(cssmin()).pipe(gulp.dest(distPath.css));
});

// 复制字体文件
gulp.task('fonts', function () {
    return gulp.src(srcPath.fonts + '/**').pipe(gulp.dest(distPath.fonts));
});

// 复制静态文件
gulp.task('assets', function () {
    return gulp.src(srcPath.assets + '/**').pipe(gulp.dest(distPath.assets));
});

//复制语言
gulp.task('language', function () {
    return gulp.src(srcPath.language + '/**').pipe(gulp.dest(distPath.language))
})

// 复制配置js
gulp.task('configjs', function () {
    return gulp.src(srcPath.configjs + '/*.js').pipe(gulp.dest(distPath.configjs));
});

// JS文件压缩&重命名 ------>3
gulp.task('script', ['assets', 'configjs', 'language'], function () {
    return gulp.src(srcPath.script + '/*.js').pipe(babel()).pipe(uglify({
        mangle: false
    })).pipe(gulp.dest(distPath.script));
});

// 图片压缩svg
gulp.task('imagesvg', function () {
    return gulp.src(srcPath.image + '/**/*.svg') // 指明源文件路径，如需匹配指定格式的文件，可以写成 .{png,jpg,gif,svg}
        .pipe(changed(distPath.image))
        .pipe(imagemin({
            svgoPlugins: [{
                removeViewBox: false
            }] // 不要移除svg的viewbox属性
        }))
        .pipe(gulp.dest(distPath.image)); // 输出路径
});
// 图片压缩其他格式 ----->4
gulp.task('images', ['imagesvg'], function () {
    return gulp.src(srcPath.image + '/**/*.{png,jpg,jpeg,gif,ico}') // 指明源文件路径，如需匹配指定格式的文件，可以写成 .{png,jpg,gif,svg}
        .pipe(changed(distPath.image))
        .pipe(tinypng_nokey())
        .pipe(gulp.dest(distPath.image)); // 输出路径
});
gulp.task('upload', function () {
    return gulp.src(srcPath.upload + '/**') // 指明源文件路径，如需匹配指定格式的文件，可以写成 .{png,jpg,gif,svg}
        .pipe(changed(distPath.upload))
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: false, // 无损压缩JPG图片
            svgoPlugins: [{
                removeViewBox: false
            }], // 不要移除svg的viewbox属性
            use: [pngquant({
                quality: '10-30', //min-max
                verbose: true,
                speed: 10, //1-10
            })] // 深度压缩PNG
        }))
        .pipe(gulp.dest(distPath.upload)); // 输出路径
})
// imagemin 图片压缩 all格式
gulp.task('imageall', function () {
    return gulp.src(srcPath.image + '/**/*') // 指明源文件路径，如需匹配指定格式的文件，可以写成 .{png,jpg,gif,svg}
        .pipe(changed(distPath.image))
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: false, // 无损压缩JPG图片
            svgoPlugins: [{
                removeViewBox: false
            }], // 不要移除svg的viewbox属性
            use: [pngquant({
                quality: '10-30', //min-max
                verbose: true,
                speed: 10, //1-10
            })] // 深度压缩PNG
        }))
        .pipe(gulp.dest(distPath.image)); // 输出路径
});

// 清理文件
gulp.task('clean', function () {
    return gulp.src('dist').pipe(clean());
});



/**
 * 默认任务
 */
gulp.task('default', ['clean'], function () { // 开始任务前会先执行[clean]任务
    return gulp.start('html', 'css', 'script', 'images'); // 等[clean]任务执行完毕后再执行其他任务
})
// 打包发布

/**
 * gulp帮助命令
 */
gulp.task('help', function () {
    console.log('===============帮助命令===============');
    console.log('=======npm run dev========开发环境===============');
    console.log('=======npm run pub========发布环境===============')
});