## readFile，read, createReadStream writeFile，write， createWriteStream

### readFile和writeFile
1. readFile方法是将要读取的文件内容完整读入缓存区，再从该缓存区中读取文件内容，具体操作如下：
```
fs.readFile('./test.txt', 'utf8', function(err, data){
    console.log(data);  
});
```
2. writeFile方法是将要写入的文件内容完整的读入缓存区，然后一次性的将缓存区中的内容写入都文件中
```
fs.writeFile('./message.txt', '这是第一行',function(err){
    if(err) console.log('写文件操作失败');
    else console.log('写文件操作成功');
});
```
以上的读写操作，Node.js将文件内容视为一个整体，为其分配缓存区并且一次性将文件内容读取到缓存区中，在这个期间，Node.js将不能执行任何其他处理。所以当读写大文件的时候，有可能造成缓存区“爆仓”。

### read和write
1. read或readSync方法读取文件内容是不断地将文件中的一小块内容读入缓存区，最后从该缓存区中读取文件内容
```js
var fs = require('fs');
fs.open('./message.txt','r',function(err,fd){
    var buf = new Buffer(225);
    //读取fd文件内容到buf缓存区
    fs.read(fd,buf,0,9,3,function(err,bytesRead,buffer){
        console.log(buf.slice(0,bytesRead).toString());
    }); 
    var buff = new Buffer(225);
    //位置设置为null会默认从文件当前位置读取
    fs.read(fd,buff,0,3,null,function(err,bytesRead,buffer){
        console.log(buff.slice(0,bytesRead).toString());
    });

    var buffer = new Buffer(225);
    //同步方法读取文件
    var bytesRead = fs.readFileSync(fd,buffer,0,9,3);
    console.log(bytesRead);
    console.log(buffer.slice(0,bytesRead).toString());
});
```
2. write或writeSync方法写入内容时，node.js执行以下过程：
* 将需要写入的数据写入到一个内存缓存区；
* 待缓存区写满后再将缓存区中的内容写入到文件中；
* 重复执行步骤1和步骤2，知道数据全部写入文件为止。
```js
var fs = require('fs');
var buf = new Buffer('我喜爱编程');
fs.open('./mess.txt','w',function(err,fd){
    fs.write(fd,buf,3,9,0,function(err,written,buffer){
        fs.write(fd,buf,12,3,null,function(err,written,buffer){
            if(err) console.log('写文件操作失败');
            console.log('写文件操作成功');
        });
    });
    //同步写入
    fs.writeSync(fd,buf,3,9,0);
});
```
以上读写操作，node.js会将文件分成一块一块逐步操作，在读写文件过程中允许执行其他操作。

但有的时候我们并不关心整个文件的内容，而只关注从文件中读取到的某些数据，以及读取到数据时需要执行的处理，这时我们可以使用文件流来处理。

3. createReadStream和createWriteStream
* createReadStream方法创建一个将文件内容读取为流数据的ReadStream对象
* createWriteStream方法创建一个将流数据写入文件中的WriteStream对象

```js
let writerStream = fs.createWriteStream('test.json');
writerStream.write(JSON.stringify({a:'11'}, undefined, 2), 'UTF8');
writerStream.end();
```
### 中文汉字占二个字节还是三个字节长度
    英文字母
        字节数 : 1;编码：GB2312
        字节数 : 1;编码：GBK
        字节数 : 1;编码：GB18030
        字节数 : 1;编码：ISO-8859-1
        字节数 : 1;编码：UTF-8
        字节数 : 4;编码：UTF-16
        字节数 : 2;编码：UTF-16BE
        字节数 : 2;编码：UTF-16LE

    中文汉字
        字节数 : 2;编码：GB2312
        字节数 : 2;编码：GBK
        字节数 : 2;编码：GB18030
        字节数 : 1;编码：ISO-8859-1
        字节数 : 3;编码：UTF-8
        字节数 : 4;编码：UTF-16
        字节数 : 2;编码：UTF-16BE
        字节数 : 2;编码：UTF-16LE

        由于二进制文件有其独立的编码解码规则，而这一规则通常是不同于文本文件的编码解码规则的，所以当我们用记事本打开二进制文件，也就是说，我们尝试用ASCII码的规则去解读二进制文件时，会出现乱码。因为：

        同样的一串字符串 00000000 00000000 00000000 00000001 在二进制文件里可能想表达的是一个4字节的整数1，而误用ASCII码解码便会输出NUL NUL NUL SOH。
