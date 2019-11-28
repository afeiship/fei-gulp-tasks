# though2

## what-is th2
抛砖引玉，轻拍～through2是对node.js原生stream.Transform进行的封装。
源码中定义了一个DestroyableTransform一般gulp的插件都会用through2，这是因为gulp使用了vinyl-fs，而vinyl-fs使用了through2。throuhg2一般有两种用法。

## usage
through2(function(chunk,enc,cb){})
through2.obj(function(chunk,enc,cb){})



## resources
- https://www.zhihu.com/question/39391770
