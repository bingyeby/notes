https://www.cnblogs.com/D666/p/9165088.html
linux下MySQL使用方法


mysql查看所有用户

MySQL -uroot -p 
select user,host from mysql.user;



### 创建用户并赋予权限
    https://www.cnblogs.com/SQL888/p/5748824.html
    https://www.cnblogs.com/wanghetao/p/3806888.html


    root用户登录
    ./mysql -u root -p


    select host,user,password from mysql.user;// 查看用户


    CREATE USER test IDENTIFIED BY 'password';// 创建用户 (允许外网IP访问的用户)
    
    CREATE USER 'test'@'localhost' IDENTIFIED BY '123456';// 创建用户 允许本地访问的用户（127.0.0.1）
    create user 'test'@'%' identified by '123456'; // 创建用户 允许外网IP访问的用户

    insert into mysql.user(Host,User,Password) values("localhost","test",password("123456"));// 此处的"localhost"，是指该用户只能在本地登录，不能在另外一台机器上远程登录。如果想远程登录的话，将"localhost"改为"%"，表示在任何一台电脑上都可以登录。也可以指定某台机器可以远程登录。



    GRANT ALL PRIVILEGES ON *.* TO 'username'@'localhost' IDENTIFIED BY 'password';// 赋予权限 授予用户在本地服务器对该数据库的全部权限
    GRANT ALL PRIVILEGES ON *.* TO 'username'@'%' IDENTIFIED BY 'password';// 赋予权限 授予用户通过外网IP对于该数据库的全部权限
    FLUSH PRIVILEGES;// 刷新权限

    DROP USER 'username'@'localhost';// 删除用户