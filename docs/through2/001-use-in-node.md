# use in node(std)
> 这个只是写法的封装，功能是一样的。

```js
fs.createReadStream('./tt.txt')
.pipe(through2(function(chunk,enc,cb){
    console.log('thr2')
    cb(null,chunk)
}))
.pipe(fs.createWriteStream('./aa.txt'))

fs.createReadStream('./tt.txt')
.pipe(new require('stream').Transform({
    transform: function(chunk,enc,cb){
        console.log('common')
        cb(null,chunk)
    }
}))
.pipe(fs.createWriteStream('./aa.txt'))
```

## conclution
> 用法是一样的，只是api看起来更加的简洁，省去了new require('steam')这种语法
