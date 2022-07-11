# Tinyc 

## Introduction
Tinyc, which means Tiny Chat, is a lightweight instant chat app based on web platform. It is mainly made by React, Node.js, express, MongoDB and socket.io.

Tinyc是一款轻量级的，基于web开发的一款即时线上聊天软件,主要技术栈为React, Node.js, express, MongoDB and socket.io。

## See it yourself
The chat app is now deployed on https://tinyc-chat-app.herokuapp.com/ and you can have a view of that.

TinyC部署于https://tinyc-chat-app.herokuapp.com/

## deploy locally
follow the code below to clone the whole project, install and run it:

在终端运行下列代码以开启客户端及服务器端：
```bat
git clone https://github.com/unano/tinyc
npm install
npm run dev
```
> For deploying on heroku, the backend is connected to heroku by default, please change the route from "https://tinyc-chat-app.herokuapp.com" to localhost like "http://localhost:8080" in \client\src\api\api.js and in \client\src\pages\chats.js to connect to the local server before running client and server.

代码默认连接于部署于heroku的后端，如果想连接本地服务器端，请修改\client\src\api\api.js 和 \client\src\pages\chats.js路径下的端口,将“https://tinyc-chat-app.herokuapp.com”改为例如“http://localhost:8080”。


## Features & Function introduction
由于本网页的设计上有些奇怪之处，有些可能的功能会被忽视，所以在此简略介绍该网站的大致功能。

### User login and register
注册相对简单，只需输入用户名密码。
登录界面和注册界面是一体的，默认登录框为展开注册框为收起，点击注册区域或者登录区域以进行切换：
![][login]
![][register]
对于不合法的输入会针对错误位置产生提醒：
![][loginError]
![][loginError2]
注册完成会有成功提示并自动展开登录区域：
![][registerSucceed]

### Chats page
登录成功默认进入聊天区域：
![][chat02]

聊天分群聊和私聊，可以轻松辨别
![][chat]

每个群聊的最新消息也会展示在这个界面，群组聊天会标注发言人，私聊则不会

随便点击一个群聊进入聊天，此时框内界面会左移以显示聊天区域：
![][groupChat]

右侧有个抽卡条可以查看该群群员，非管理员只能查看群员。
群管理（群创建者）可以在此添加和删除群员：
![][adminChat]

聊天输入框的高度是自适应的，不过有最大高度：
![][input]
私聊时对方在输入会有提示：
![][typing]
当你在某群聊时，其他群聊在右侧有新消息会进行提醒（可关闭，详见Settings）。
![][newMsg]

### Friends page
查看所有好友及其个性签名，其中绿色背景为在线，白色背景为下线：
![][friends]

鼠标放于好友头像会出现带“i”的按钮，点击可以查看好友信息及进行好友管理操作：
当前版本点击“i"仅能查看好友名字，以及进行好友的删除：
![][info]
![][info2]

支持好友过滤查找，也可在此处输入其他用户名来进行好友的添加，不支持重复发送申请，除非对方拒绝则可继续发送好友申请
![][send]
![][duplicate]

### Create Group page
创建群组须要填写群名，群头像以及群员，群员不能少于2个（不包括自己）。群背景可以不填写：
![][newChat01]

支持群员的搜索，方便快速查找.
必填项不能漏填否则会弹出提示。
![][createWarn]
支持群头像以及群背景的裁剪：
![][clip01]

### Personal page
点击左上角头像进入个人主页:
![][personal]
![][requests&requesting]
这里展示了用户信息，右下角为登出按钮。
在这里可以查看其他用户发给自己的好友申请并选择接收或拒绝，也可以查看自己已经发送但未被处理的好友申请。
可以更改自己的头像，用户名和签名，同时支持头像裁剪：
![][avatarClip]
点击右侧导航栏可以切换至查看自己创建的群和自己加入的群，
![][join&create]
可以鼠标悬浮于左侧小红快并点击退出加入的群聊，退出前会有二次确认(红块体积小是为了防止误触)
![][delete1]
![][exit2]

右侧可以查看自己创建的群聊，如果有人申请加入该群聊则会在群信息右侧显示数字，数字大小为申请者的人数：
![][newReq]
点击群头像群名即可查看具体信息：
![][gpInfoAdmin]
在此可以查看该群的信息，修改群头像，群名和群背景，还可以接受或拒绝其他申请用户的入群申请。
点击右侧垃圾桶可以删除该群，会有二次确认：
![][deleteGp]
![][deleteGp2]
同样支持头像的裁剪和预览以及背景的裁剪和预览：
![][clipGp2]

### Ground page
该页面为群组广场，初进入该页面网站会为用户从数据库随机抽取20个群聊展示（不满20则全拿出）。用户可以将鼠标悬浮在任何一个群信息框以展开信息：
![][gp01]
下方用户头像最多展示4个，其他则以"+（总人数-4)" 展示。鼠标悬浮于用户头像可查看姓名
用户可以在右下角申请加入群聊，右下角存在三种状态，申请入群，正在申请中，已加入群聊：
![][apply]
![][applying]
![][joined]
此处搜索不同于其他地方的搜索，因为随机抽取20个群聊不满足用户精确搜索群的需求，所以此处该搜索会从数据库直接进行查询并根据查询返回对应的群聊:
![][gpSearch]
用户可以对群聊广场的群聊进行随机排序，按创建时间排序和按群总人数排序。
右下角有一个六面骰子和20面骰子，点击它们分别是重新随机获取6个群聊和20个群聊。由于在群聊狠多的情况下全部取出群聊是不现实的，所以采用随机抽取的方式来让用户随机查看群聊。
用户点击群头像或者群名可查看群聊详细信息，该布局与管理员管理群页面类似，不同的是普通用户不能进行群内容修改，也无法看到申请加入该群的用户，取而代之的是能看到群管理员是谁。
![][gpInfo]

### Settings
点击左侧设置按钮可展开设置，第一个按钮为关闭/打开新消息提醒，关闭后新消息不会在左侧显示。
![][settings]
第二个按钮为简洁模式（去除背景）切换按钮，关闭后效果如下：
![][noBg]

[login]: ./READMEImgs/login.png
[register]: ./READMEImgs/register.png
[loginError]: ./READMEImgs/loginError.png
[loginError2]: ./READMEImgs/loginError2.png
[registerSucceed]: ./READMEImgs/registerSucceed.png
[chat02]: ./READMEImgs/chat02.png
[chat]: ./READMEImgs/chat.png
[groupChat]: ./READMEImgs/groupChat.png
[adminChat]: ./READMEImgs/adminChat.png
[input]: ./READMEImgs/input.png
[friends]: ./READMEImgs/friends.png
[info]: ./READMEImgs/info.png
[info2]: ./READMEImgs/info2.png
[deleteFriend]:./READMEImgs/deleteFriend.png
[search]:./READMEImgs/search.png
[send]:./READMEImgs/send.png
[duplicate]:./READMEImgs/duplicate.png
[newChat01]:./READMEImgs/newChat01.png
[clip01]:./READMEImgs/clip01.png
[form]:./READMEImgs/form.png
[createWarn]:./READMEImgs/createWarn.png
[personal]:./READMEImgs/personal.png
[requests&requesting]:./READMEImgs/requests&requesting.png
[avatarClip]:./READMEImgs/avatarClip.png
[join&create]:./READMEImgs/join&create.png
[delete1]:./READMEImgs/delete1.png
[exit2]:./READMEImgs/exit2.png
[newReq]:./READMEImgs/newReq.png
[gpInfoAdmin]:./READMEImgs/gpInfoAdmin.png
[deleteGp]:./READMEImgs/deleteGp.png
[deleteGp2]:./READMEImgs/deleteGp2.png
[clipGp2]:./READMEImgs/clipGp2.png
[gp01]:./READMEImgs/gp01.png
[apply]:./READMEImgs/apply.png
[applying]:./READMEImgs/applying.png
[joined]:./READMEImgs/joined.png
[gpSearch]:./READMEImgs/gpSearch.png
[gpInfo]:./READMEImgs/gpInfo.png
[settings]:./READMEImgs/settings.png
[noBg]:./READMEImgs/noBG.png
[typing]:./READMEImgs/typing.png
[newMsg]:./READMEImgs/newMsg.png