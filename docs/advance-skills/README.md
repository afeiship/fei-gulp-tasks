# advance skills
- https://csspod.com/advanced-tips-for-using-gulp-js/
- https://www.npmjs.com/package/orchestrator
- https://www.cnblogs.com/520yang/articles/5039328.html

## 基础任务
> Gulp 的语法相比 Grunt 要直观很多，配置一个基础任务完全是小菜一碟：

```js
gulp.task('scripts', function() {
  return gulp.src('./src/**/*.js')
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/'));
});
```


## 不兼容 stream？
- 使用 gulp 过程中，偶尔会遇到 Streaming not supported 这样的错误。
- 这通常是因为常规流与 vinyl 文件对象流有差异
- gulp 插件使用了只支持 buffer （不支持 stream）的库。

~~~
不能把 Node 常规流直接传递给 gulp 及其插件。
下面的代码试图使用 gulp-uglify 和 gulp-rename 转换一个读取流的内容，然后使用 gulp.dest() 写入结果
~~~

```js
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('bundle', function() {
  return fs.createReadStream('app.js')
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('dist/'));
});
```
显然，上面的代码会抛出错误。
为什么不能把读取流传送给 gulp 插件呢？Gulp 不是传说中的 streaming 构建工具吗？
没错，但是上面的代码忽略了 gulp 预期输入的是 Vinyl 文件对象，直接输入读取流当然不行。


## 译者注：
Gulp 管道中的「流」不是操作 Strings 和 Buffers 的常规 Node.js 流，而是启用 object mode 的流。
Gulp 中的流发送的是 vinyl 文件对象。
~~~
Streams that are in object mode can emit generic JavaScript values other than Buffers and Strings.
~~~

## Vinyl 文件对象
Gulp 使用 vinyl-fs ，并从 vinyl-fs 继承了 gulp.src() 和 gulp.dest() 方法。
而 vinyl-fs 使用了 vinyl 文件对象，即 「虚拟文件格式」。
要在 gulp 及其插件中使用常规读取流，需要把读取流转换为 vinyl 文件对象先。


## vinyl-source-stream 便是一个转换工具：
```js
var source = require('vinyl-source-stream');
var marked = require('gulp-marked');

fs.createReadStream('*.md')
  .pipe(source())
  .pipe(marked())
  .pipe(gulp.dest('dist/'));
```

- 下面的例子使用 [Browserify][] 打包，最后把结果转换成 vinyl 文件对象流。
```js
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');

gulp.task('bundle', function() {
  return browserify('./src/app.js')
    .bundle()
    .pipe(source('bundle.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});
```
搞定！vinyl-source-stream 使用指定的文件名创建了一个 vinyl 文件对象实例
因此可以不再使用 gulp-rename（gulp.dest 将用此文件名写入结果）。

## gulp.dest
gulp.dest() 创建一个写入流，使用来自 src 的文件名创建文件，并根据需要使用 mkdirp创建文件夹。
写入文件后，还可以继续传送 stream 进行其他操作（比如 gzip 数据然后写入其他文件）

## stream 和 Buffer
Vinyl 文件对象的内容可以是以下三种形式：

- Stream
- Buffer
- null
对于常规读取流，发射的是数据块（chunk）：
```js
fs.createReadStream('/usr/share/dict/words').on('data', function(chunk) {
  console.log('Read %d bytes of data', chunk.length);
});
// > Read 65536 bytes of data
```

## gulp.src
与常规流不同，gulp.src() 传输的流是把内容转换成 buffer 的 vinyl 文件对象
因此 gulp 中得到的不是数据块（chunk），而是包含 buffer 的虚拟文件。
Vinyl 文件格式有一个 contents 属性来存放文件内容（buffer 或者 stream 或者 null）。

译者注：通过 vinyl 对象的以下方法可以判断 contents 属性存放内容的类型：

isBuffer(): Returns true if file.contents is a Buffer.
isStream(): Returns true if file.contents is a Stream.
isNull(): Returns true if file.contents is null.

## Gulp 默认使用 buffer：

```js
gulp.src('/usr/share/dict/words').on('data', function(file) {
  console.log('Read %d bytes of data', file.contents.length);
});
```

## Gulp 默认使用 buffer

`虽然一般推荐 stream 化数据`，但是许多 gulp 插件基于使用 buffer 的库开发。
`有时则是需要基于完整的源内容做转换`，比如基于字符串的正则替换，分块的文件可能会出现匹配遗漏的情况。
同样地，诸如 UglifyJS 及 Traceur compiler 之类的工具也需要完整的文件输入（至少是 JavaScript 句法完整的字符串）。

因此 gulp 选择默认`使用内容转换成 buffer 的 vinyl 对象流`，以方便处理。

`转换成 buffer 的缺点是对于大文件处理效率低下，因为文件发射回对象流之前必须完整读取`。但对于常见的文本文件，如 JavaScript、CSS、模板等，使用 buffer 只是很小的花销，不会真正损害性能。


## 当然，设置 buffer: false 选项，可以让 gulp 禁用 buffer：
```js
gulp.src('/usr/share/dict/words', {buffer: false}).on('data', function(file) {
  var stream = file.contents;
  stream.on('data', function(chunk) {
    console.log('Read %d bytes of data', chunk.length);
  });
});
```

## Stream 和 Buffer 之间转换


### 从 Stream 到 Buffer
基于依赖的模块返回的是 stream， 以及 gulp 插件对 stream 的支持情况，有时需要把 stream 转换为 buffer（反之亦然）。如前面所言，很多插件只支持 buffer，如 gulp-uglify、gulp-traceur，使用时可以通过 gulp-buffer 转换：
```js
var source = require('vinyl-source-stream');
var buffer = require('gulp-buffer');
var uglify = require('gulp-uglify');

fs.createReadStream('./src/app.js')
  .pipe(source('app.min.js')) // 常规流转换成 vinyl 对象
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('dist/'));
```
或者，蛋疼的例子：

```js
var buffer = require('gulp-buffer'),
var traceur = require('gulp-traceur');

gulp.src('app.js', {buffer: false})
  .pipe(buffer()) // 把 vinyl 对象 `contents` 由 Stream 转换为 Buffer
  .pipe(traceur())
  .pipe(gulp.dest('dist/'));
```


## 从 Buffer 到 Stream
也可以通过使用 gulp-streamify 或者 gulp-stream 插件，让只支持 buffer 的插件直接处理 stream。这样在基于 buffer 的插件前、后都可以使用基于 stream 的插件了。

```js
var wrap = require('gulp-wrap');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');

gulp.src('app.js', { buffer: false })
  .pipe(wrap('(function(){<%= contents %>}());'))
  .pipe(streamify(uglify()))
  .pipe(gulp.dest('build'))
  .pipe(gzip())
  .pipe(gulp.dest('build'));
```


## 任务流程

如果需要执行自定义或者动态的任务，了解 gulp 所使用的 Orchestrator 模块会很有帮助。gulp.add 等同于 Orchestrator.add，实际上所有方法都继承自 Orchestrator 模块。下列情形可能会需要 Orchestrator：

不想 gulp 任务列表被「私有任务」弄乱（比如不把任务暴露给命令行工具）
动态或者可重用的子任务
