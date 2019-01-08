### nodejs与mysql的连接

1. 新建一个连接：（连接的都是同一个数据库）
![image.png](http://upload-images.jianshu.io/upload_images/2806075-89acf03f9de511ed.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
2. 新建数据库：
![image.png](http://upload-images.jianshu.io/upload_images/2806075-a4ca30d9e7f0e4a2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
3. 新建表：
![image.png](http://upload-images.jianshu.io/upload_images/2806075-fc6bfbf29ede79bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 连接方式：
1. 连接数据库
```javascript
let db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'test2'});
```

2. 数据库修改：
![image.png](http://upload-images.jianshu.io/upload_images/2806075-82127aade7929f0b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

3. 关于主键的自增
![image.png](http://upload-images.jianshu.io/upload_images/2806075-0ecf14dcb95ba9ea.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

4. 数据查询
```javascript
db.query(`SELECT username FROM user_table WHERE username=111`, (err, data) => { // 查询
    if (err) {
        console.log(err);
        console.log(0);
    } else if (data.length > 0) {
        console.log(1);
    } else {
    }
});

db.query(`INSERT INTO user_table (username,password,online) VALUES('1111','2111',"0")`, err => { // 插入
    if (err) {
        console.log(err);
        console.log(2);
    } else {
        console.log(3);
    }
});
```