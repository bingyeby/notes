
### linux下MySQL使用方法
    Linux mysql 基础操作
    https://www.cnblogs.com/xoray007/p/mysql_linux_database_use.html

    linux下MySQL使用方法
    https://www.cnblogs.com/D666/p/9165088.html
    
    Linux下MySQL 数据库的基本操作
    https://www.cnblogs.com/Glory-D/p/7518541.html

    


### 创建用户并赋予权限
    https://www.cnblogs.com/SQL888/p/5748824.html
    https://www.cnblogs.com/wanghetao/p/3806888.html


    root用户登录
    ./mysql -u root -p  // 回车后,输入密码

    select host,user,password from mysql.user;  // 查看用户

    CREATE USER test IDENTIFIED BY 'password';  // 创建用户 (允许外网IP访问的用户)
    
    CREATE USER 'test'@'localhost' IDENTIFIED BY '123456';  // 创建用户 允许本地访问的用户（127.0.0.1）
    create user 'test'@'%' identified by '123456';          // 创建用户 允许外网IP访问的用户

    insert into mysql.user(Host,User,Password) values("localhost","test",password("123456"));// 此处的"localhost"，是指该用户只能在本地登录，不能在另外一台机器上远程登录。如果想远程登录的话，将"localhost"改为"%"，表示在任何一台电脑上都可以登录。也可以指定某台机器可以远程登录。


    GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost' IDENTIFIED BY 'password'; // 赋予权限 授予用户在本地服务器对该数据库的全部权限
    GRANT ALL PRIVILEGES ON *.* TO 'username'@'%' IDENTIFIED BY 'password';         // 赋予权限 授予用户通过外网IP对于该数据库的全部权限
    FLUSH PRIVILEGES;// 刷新权限

    DROP USER 'username'@'localhost';// 删除用户


### mysql导入导出sql文件
    https://www.cnblogs.com/yuwensong/p/3955834.html
    
    导出数据库
        mysqldump -uroot -p abc > abc.sql       // 导出数据和表结构 (敲回车后会提示输入密码)
        mysqldump -uroot -p -d abc > abc.sql    // 只导出表结构
    
    导入数据库1
        use abc;                    // 选择数据库
        set names utf8;             // 设置数据库编码
        source /home/abc/abc.sql;   // 导入数据（注意sql文件的路径）

    导入数据库2
        mysql -uroot -p abc < abc.sql   // mysql -u用户名 -p密码 数据库名 < 数据库名.sql







