# use in gulp

## error
```js
// 这里会报错，因为 gulp出来的并不一种标准的文件流，而是一种： `vinyl-fs` 的东西。
gulp.task('error',function(){
    return gulp.src('./tt.txt')
            .pipe(through2(function(chunk,enc,cb){
                console.log('thr2 in gulp with error')
                cb(null,chunk)
            }))
            .pipe(gulp.dest('./'))
})

gulp.task('error',function(){
    return gulp.src('./tt.txt')
            .pipe(new require('stream').Transform({
                transform: function(chunk,enc,cb){
                    console.log('common')
                    cb(null,chunk)
                }
            }))
            .pipe(gulp.dest('./'))
})
```

## right way
```js
gulp.task('test',function(){    
  return gulp.src('./tt.txt')
    .pipe(through2.obj(function(chunk,enc,cb){
        console.log('thr2 in gulp')
        cb(null,chunk)
    }))
    .pipe(gulp.dest('./'));
})
```
