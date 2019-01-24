
## 简要概念
Docker: 本意是码头工人，言外之意是集装箱；

Docker是：“一次封装，到处运行”，因为docker决绝了应用环境的问题，安装了docker的平台就能跑“docker包”，这样就决绝了“开发环境能跑，一上线就崩”的尴尬。

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的Linux机器上，也可以实现虚拟化，容器是完全使用沙箱机制，相互之间不会有任何接口。
一个完整的Docker有以下几个部分组成：
* DockerClient客户端
* Docker Daemon守护进程
* Docker Image镜像
* DockerContainer容器

Docker 是一个基于Linux容器(LXC-linux container)的高级容器引擎，基于go语言开发

学习Docker首先要了解几个概念：
* 镜像—Docker的镜像和常见的系统ISO镜像类似，包含了应用程序的信息；
* 容器—容器相当于一个可以运行起来的虚拟机，应用程序运行在容器中,Docker运行在“Docker”上；
* 仓库—仓库是存放镜像的地方，有类似git的版本控制，同样分为公开仓库(Public)和私有仓库(Private)两种形式；

Docker支持大部分的Linux发行版，通过使用Docker容器，就可以在不同的操作系统，不同的机器上运行自己的应用，不用关心硬件、运行环境之类的配置，应用程序的迁移变得非常简单。

### Docker和传统虚拟化技术的对比
相比传统虚拟机技术，Docker资源占用少，启动更快，很大的方便了项目的部署和运维。

Docker是在操作系统层面上实现虚拟化，复用本地主机的操作系统，传统方式是在硬件的基础上，虚拟出多个操作系统，然后在系统上部署相关的应用。


### Docker通常用于如下场景：
* web应用的自动化打包和发布；
* 自动化测试和持续集成、发布；
* 在服务型环境中部署和调整数据库或其他的后台应用；
* 从头编译或者扩展现有的OpenShift或Cloud Foundry平台来搭建自己的PaaS环境。

### 基础教程
http://www.docker.org.cn/book/docker/what-is-docker-16.html

Docker系统有两个程序：docker服务端和docker客户端。

其中docker服务端是一个服务进程，管理着所有的容器。 docker客户端则扮演着docker服务端的远程控制器，可以用来控制docker的服务端进程。 大部分情况下，docker服务端和客户端运行在一台机器上。

```
1. 检查版本
docker version

2. 检索
docker search tutorial
检索名字叫做tutorial的镜像。 Docker官方网站专门有一个页面来存储所有可用的镜像，网址是：https://hub.docker.com/

3. 下载
docker pull learn/tutorial
通过docker命令下载tutorial镜像 执行pull命令的时候要写完整的名字 
在docker的镜像索引网站上面，镜像都是按照用户名/镜像名的方式来存储的。有一组比较特殊的镜像，比如ubuntu这类基础镜像，经过官方的验证，值得信任，可以直接用镜像名来检索到。

4. 运行
docker run learn/tutorial echo "hello word"
在这个容器中运行"echo"命令，输出"hello word"
docker run命令有两个参数，一个是镜像名，一个是要在镜像中运行的命令。
docker容器可以理解为在沙盒中运行的进程。这个沙盒包含了该进程运行所必须的资源，包括文件系统、系统类库、shell 环境等等。
但这个沙盒默认是不会运行任何程序的。你需要在沙盒中运行一个进程来启动某一个容器。这个进程是该容器的唯一进程，所以当该进程结束的时候，容器也会完全的停止

docker run -i -t ubuntu:15.10 /bin/bash
通过docker的两个参数 -i -t，让docker运行的容器实现"对话"的能力


5. 安装
docker run learn/tutorial apt-get install -y ping
在learn/tutorial镜像里面安装ping程序。
tutorial镜像是基于ubuntu的，所以你可以使用ubuntu的apt-get命令来安装ping程序： apt-get install -y ping。
备注：apt-get 命令执行完毕之后，容器就会停止，但对容器的改动不会丢失。
在执行apt-get 命令的时候，要带上-y参数。如果不指定-y参数的话，apt-get命令会进入交互模式，需要用户输入命令来进行确认，但在docker环境中是无法响应这种交互的。

6. 保存修改
docker commit 698 learn/ping
当你对某一个容器做了修改之后（通过在容器中运行某一个命令），可以把对容器的修改保存下来，这样下次可以从保存后的最新状态运行该容器。docker中保存状态的过程称之为committing，它保存的新旧状态之间的区别，从而产生一个新的版本。

首先使用docker ps -l命令获得安装完ping命令之后容器的id。然后把这个镜像保存为learn/ping。
提示：
* 运行docker commit，可以查看该命令的参数列表。
* 你需要指定要提交保存容器的ID。(译者按：通过docker ps -l 命令获得)
* 无需拷贝完整的id，通常来讲最开始的三至四个字母即可区分。（译者按：非常类似git里面的版本号)
* 执行完docker commit命令之后，会返回新版本镜像的id号。

7. 运行新的镜像
docker run lean/ping ping www.google.com
在新的镜像中运行ping www.google.com命令。
一定要使用新的镜像名learn/ping来运行ping命令。(最开始下载的learn/tutorial镜像中是没有ping命令的)

8. 检查运行中的镜像
docker ps
docker inspect efe
使用docker ps查找某一个运行中容器的id，然后使用docker inspect命令查看容器的信息。
可以使用镜像id的前面部分，不需要完整的id。
使用docker ps命令可以查看所有正在运行中的容器列表，使用docker inspect命令我们可以查看更详细的关于某一个容器的信息。

9. 发布自己的镜像
docker push learn/ping
把learn/ping镜像发布到docker的index网站。
提示：
* docker images命令可以列出所有安装过的镜像。
* docker push命令可以将某一个镜像发布到官方网站。
* 你只能将镜像发布到自己的空间下面。这个模拟器登录的是learn帐号。



```

### 其他
http://www.runoob.com/docker/docker-hello-world.html 菜鸟教程
https://blog.lab99.org/post/docker-2016-07-14-faq.html  docker问题



```
docker pull training/webapp    // 载入镜像
docker run -d -P training/webapp python app.py
    -d:让容器在后台运行。
    -P:将容器内部使用的网络端口映射到我们使用的主机上。
docker run -d -p 5000:5000 training/webapp python app.py 

    docker run -P：随机分配端口号
    docker run -p 5000:5000：绑定特定端口号（主机的所有网络接口的5000端口均绑定容器的5000端口）
    docker run -p 127.0.0.1:5000:5000：绑定主机的特定接口的端口号
    docker run -d -p 127.0.0.1:5000:5000/udp training/webapp python app.py：绑定udp端口号
    docker port <CONTAINER_ID> 5000：查看容器的5000端口对应本地机器的IP和端口号

    查看某个镜像的网络端口
        docker ps // 获取dockerid
        docker port [dockerid] // 

docker logs [dockerid或者名字] // 查看容器内部的标准输出

docker top [dockerid或者名字] // 来查看容器内部运行的进程

docker stop [dockerid或者名字] // 停止WEB应用容器

docker start [dockerid或者名字] // 重启WEB应用容器

docker restart [dockerid或者名字] // 重启

docker rm [dockerid或者名字]  // 移除WEB应用容器 容器必须是停止状态
    docker rm -f thirsty_villani    // 如果提示正在运行，不能移除那么尝试以下命令 -f是强制移除正在运行的容器。 
    docker rm `docker ps -a -q`     // 删除所有容器
    // 如果想要自动在容器停止运行后删除，那么通过以下命令来创建容器 
    // 这样在你停止容器的运行后，它会自动remove掉，不需要再手动清理了。
    docker run -d -P --rm training/webapp python app.py 

docker ps // 查找正在运行的容器信息
    docker ps -a // 查找所有的容器信息




镜像管理
    docker images：列出本地所有镜像
    docker search <IMAGE_ID/NAME>：查找image
    docker pull <IMAGE_ID>：下载image
    docker push <IMAGE_ID>：上传image
    docker rmi <IMAGE_ID>：删除image

容器管理
    docker run -i -t <IMAGE_ID> /bin/bash：-i：标准输入给容器    -t：分配一个虚拟终端    /bin/bash：执行bash脚本
        -d：以守护进程方式运行（后台）
        -P：默认匹配docker容器的5000端口号到宿主机的49153 to 65535端口
        -p <HOT_PORT>:<CONTAINER_PORT>：指定端口号
        -name： 指定容器的名称
        -rm：退出时删除容器

    docker stop <CONTAINER_ID>：停止container
    docker start <CONTAINER_ID>：重新启动container

    docker ps
        -l：显示最后启动的容器
        -a：同时显示停止的容器，默认只显示启动状态

    docker attach <CONTAINER_ID> 连接到启动的容器
    docker logs <CONTAINER_ID>  : 输出容器日志
        -f：实时输出
    docker cp <CONTAINER_ID>:path hostpath：复制容器内的文件到宿主机目录上
```


### Docker 修改镜像源地址
```
新版的 Docker 推荐使用 json 配置文件的方式，默认为 /etc/docker/daemon.json,在该文件中加入如下内容： 
{ "registry-mirrors": ["http://hub-mirror.c.163.com"] }

直接设置 –registry-mirror 参数，仅对当前的命令有效  
docker run -p 8050:8050 scrapinghub/splash --registry-mirror=http://hub-mirror.c.163.com

修改 /etc/default/docker，加入 DOCKER_OPTS=”镜像地址”
DOCKER_OPTS="--registry-mirror=http://aad0405c.m.daocloud.io"
使用service docker restart重启Docker服务即可。
```

















