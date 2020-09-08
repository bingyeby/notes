### git log
    https://www.cnblogs.com/bellkosmos/p/5923439.html

    git log
    git log -p                  // 所有修改记录
    git log -p file             // 文件的修改历史记录
    git log --stat              // 每个commit 修改的文件列表 	
    git log --pretty=oneline    // 显示commit id 和 commit info
    git log --name-only         // 显示修改人 日期 修改信息
    git log --name-status       // 显示修改人 日期 修改列表 修改信息
    git log --graph             // 图形界面方式显示历史
    git log --author yourname   // 查看一下自己（或某个人）的某次提交
    git log --grep keywords     // 通过提交关键字搜索

    git config --global alias.lm  "log --no-merges --color --date=format:'%Y-%m-%d %H:%M:%S' --author='你的名字！自己修改！' --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Cblue %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit"

    git config --global alias.lms  "log --no-merges --color --stat --date=format:'%Y-%m-%d %H:%M:%S' --author='你的名字！自己修改！' --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Cblue %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit"

    git config --global alias.ls "log --no-merges --color --graph --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Cblue %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit"

    git config --global alias.lss "log --no-merges --color --stat --graph --date=format:'%Y-%m-%d %H:%M:%S' --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Cblue %s %Cgreen(%cd) %C(bold blue)<%an>%Creset' --abbrev-commit"

    

### 将远程仓的某分支拉到本地并提交到自己远程仓
    git checkout -b newb
    git reset --hard mr/newb
    git push origin newb
    若提示远程无此分支 则需要执行git fetch mr更新远程主仓分支

### diff
    git diff        // 显示当前的修改(在commit之前使用)
    git diff file1
    git diff --stat     // 
    git diff [master]...otherBranch
    git diff <localBranch> <remote>/<remoteBranch>

### git fetch
    相当于从远程获取最新版本到本地,不会自动merge,操作更安全
    git fetch origin master:temp
    git diff temp
    git merge temp
    
### git pull
    从远程获取最新版本并merge到本地


### git stash
    git stash // 缓存暂时修改
    git stash pop // 恢复并将stash删除
        git stash list
        git stash apply
        git stash drop


### git revert
    git revert 是用一次新的commit来回滚之前的commit
        revert 是在正常的commit历史中再commit一次,只不过是反向提交 HEAD是一致向前的
        
    git reset 是直接删除指定的commit
        reset 是在正常的commit历史中删除了指定的commit HEAD后移s

### 强制回退至远程某代码
    git fetch --all
    git reset --hard origin/master    [git reset --hard uu/test]
    git pull

### 在某一分支,查看另一个分支的某文件内容
    git show master:./src/index.js

### 再次加工commit描述
    git commit --ament 