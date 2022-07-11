# tinyc 
<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526085/gitHubIntro/tinyc_zbwc2t.png" width=50% height=50%>


## Introduction

tinyc, which means 'tiny chat', is a lightweight instant chat app based on web platform. It is mainly made by React, Node.js, express, MongoDB and socket.io.

tinyc，意思为tiny chat, 是一款轻量级的，基于web开发的一款即时线上聊天软件,主要技术栈为React, Node.js, express, MongoDB and socket.io。

## See it yourself

The chat app is now deployed on https://tinyc-chat-app.herokuapp.com/ and you can have a view of that.

TinyC部署于https://tinyc-chat-app.herokuapp.com/

To quickly experience, you can use the proived accunt: 

> Username: passenger Password: Passenger0101

login with this account so that you don't need to create several accounts and add friends to experience all kinds of functions,since we cretated several chats and add several friends in this account:

为了能方便快速体验各种功能，而不用创建多个新账号后互加好友才能体验各种功能，这里提供了一个账户以供体验和测试：

> Username: passenger Password: Passenger0101

## deploy locally

follow the code below to clone the whole project, install and run it:

在终端运行下列代码以开启客户端及服务器端：
```bat
git clone https://github.com/unano/tinyc
npm install
npm run dev
```
> For deploying on heroku, the backend is connected to heroku by default, please change the route from "https://tinyc-chat-app.herokuapp.com" to localhost like "http://localhost:8080" in \client\src\api\api.js and in \client\src\pages\chats.js to connect to the local server before running client and server.

> 代码默认连接于部署于heroku的后端，如果想连接本地服务器端，请修改\client\src\api\api.js 和 \client\src\pages\chats.js路径下的端口,将“https://tinyc-chat-app.herokuapp.com”改为例如“http://localhost:8080”。


## Features & Function introduction

由于本网页的设计上有些奇怪之处，有些可能的功能会被忽视，所以在此简略介绍该网站的大致功能。

### **User login and register**

注册相对简单，只需输入用户名密码。
登录界面和注册界面是一体的，默认登录框为展开注册框为收起，点击注册区域或者登录区域以进行切换：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526074/gitHubIntro/login_swqmmy.png" width=48%>
<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526084/gitHubIntro/register_uqejsj.png" width=47.4%>

对于不合法的输入会针对错误位置产生提醒：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526078/gitHubIntro/loginError2_loljgr.png" width=50%>
<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526077/gitHubIntro/loginError_vewp5c.png" width=50%>


注册完成会有成功提示并自动展开登录区域：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526084/gitHubIntro/registerSucceed_rodxnk.png" width=50%>

### **Chats page**

登录成功默认进入聊天区域：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526003/gitHubIntro/chat02_fomohm.png" width=70%>

聊天分群聊和私聊，可以轻松辨别:

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525995/gitHubIntro/chat_zqn28k.png" width=70%>

每个群聊的最新消息也会展示在这个界面，群组聊天会标注发言人，私聊则不会

随便点击一个群聊进入聊天，此时框内界面会左移以显示聊天区域：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526051/gitHubIntro/groupChat_xbcwxq.png" width=70%>

右侧有个抽拉条可以查看该群群员，非管理员只能查看群员。
群管理（群创建者）可以在此添加和删除群员：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525994/gitHubIntro/adminChat_kecb5c.png" width=70%>

聊天输入框的高度是自适应的，不过有最大高度：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526071/gitHubIntro/input_y3k6nl.png" width=70%>

私聊时对方在输入会有提示：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657527173/gitHubIntro/typing_u7ae9j.png" width=50%>

当你在某群聊时，其他聊天在右侧有新消息会进行提醒（可关闭，详见Settings）。

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526082/gitHubIntro/newMsg_rpkube.png" width=70%>

### **Friends page**

查看所有好友及其个性签名，其中绿色背景为在线，白色背景为下线：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526010/gitHubIntro/friends_mtajya.png"  width=70%>

鼠标放于好友头像会出现带“i”的按钮，点击可以查看好友信息及进行好友管理操作：
当前版本点击“i"仅能查看好友名字，以及进行好友的删除：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526061/gitHubIntro/info_eg7mbq.png"  width=40%>
<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526076/gitHubIntro/info2_y2bhxx.png"  width=70%>
<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525997/gitHubIntro/deleteFriend_njqfqo.png"  width=70%>


支持好友过滤查找，也可在此处输入其他用户名来进行好友的添加，不支持重复发送申请，除非对方拒绝则可继续发送好友申请

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526085/gitHubIntro/search_cogsf4.png"  width=70%>

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526085/gitHubIntro/send_xxmy0n.png"  width=70%>

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525998/gitHubIntro/duplicate_fx8laz.png"  width=70%>


### **Create Group page**

创建群组须要填写群名，群头像以及群员，群员不能少于2个（不包括自己）。群背景可以不填写：

支持群员的搜索，方便快速查找.
必填项不能漏填否则会弹出提示。

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525995/gitHubIntro/createWarn_xmcnr1.png" width=70%>

支持群头像以及群背景的裁剪：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525997/gitHubIntro/clip01_wojqfw.png" width=100%>

### **Personal page**

点击左上角头像进入个人主页:

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526084/gitHubIntro/personal_jgbryi.png" width=20%>


<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526085/gitHubIntro/requests_requesting_rbwff9.png" width=70%>

这里展示了用户信息，右下角为登出按钮。

在这里可以查看其他用户发给自己的好友申请并选择接收或拒绝，也可以查看自己已经发送但未被处理的好友申请。

可以更改自己的头像，用户名和签名，同时支持头像裁剪：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525995/gitHubIntro/avatarClip_aee48q.png" width=90%>

点击右侧导航栏可以切换至查看自己创建的群和自己加入的群，

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526076/gitHubIntro/join_create_aogwjk.png" width=70%>

可以鼠标悬浮于左侧小红块并点击退出加入的群聊，退出前会有二次确认(红块体积小是为了防止误触)

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525997/gitHubIntro/delete1_dcafu5.png" width=50%>

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526002/gitHubIntro/exit2_nud0zb.png" width=50%>

右侧可以查看自己创建的群聊，如果有人申请加入该群聊则会在群信息右侧显示数字，数字大小为申请者的人数：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526083/gitHubIntro/newReq_i1tvxq.png" width=50%>

点击群头像群名即可查看具体信息：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526035/gitHubIntro/gpInfoAdmin_ipky8f.png" width=70%>

在此可以查看该群的信息，修改群头像，群名和群背景，还可以接受或拒绝其他申请用户的入群申请。

点击右侧垃圾桶可以删除该群，会有二次确认：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525998/gitHubIntro/deleteGp_tem5jx.png" width=50%>
<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525998/gitHubIntro/deleteGp2_qxg9vw.png" width=50%>

同样支持头像的裁剪和预览以及背景的裁剪和预览：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525998/gitHubIntro/clipGp_tuq8bs.png" width=90%>


### **Ground page**

该页面为群组广场，初进入该页面网站会为用户从数据库随机抽取20个群聊展示（不满20则全拿出）。用户可以将鼠标悬浮在任何一个群信息框以展开信息：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526056/gitHubIntro/gp01_kgm6fc.png" width=70%>

下方用户头像最多展示4个，其他则以"+（总人数-4)" 展示。鼠标悬浮于用户头像可查看姓名

用户可以在右下角申请加入群聊，右下角存在三种状态，申请入群，正在申请中，已加入群聊：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525996/gitHubIntro/apply_uodmn0.png" width=70%>
<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657525982/gitHubIntro/applying_ix0lbp.png" width=70%>
<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526065/gitHubIntro/joined_hcm1xu.png" width=70%>

此处搜索不同于其他地方的搜索，因为随机抽取20个群聊不满足用户精确搜索群的需求，所以此处该搜索会从数据库直接进行查询并根据查询返回对应的群聊:

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526039/gitHubIntro/gpSearch_sepjpa.png" width=60%>

用户可以对群聊广场的群聊进行随机排序，按创建时间排序和按群总人数排序。
右下角有一个六面骰子和20面骰子，点击它们分别是重新随机获取6个群聊和20个群聊。由于在网站总群聊很多的情况下全部取出群聊是不现实的，所以采用随机抽取的方式来让用户随机查看群聊。

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657530613/gitHubIntro/dice_pzpuhv.png" width=30%>

用户点击群头像或者群名可查看群聊详细信息，该布局与管理员管理群页面类似，不同的是普通用户不能进行群内容修改，也无法看到申请加入该群的用户，取而代之的是能看到群管理员是谁。

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526060/gitHubIntro/gpInfo_hishth.png" width=70%>

### **Settings**

点击左侧设置按钮可展开设置，第一个按钮为关闭/打开新消息提醒，关闭后新消息不会在左侧显示。

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526085/gitHubIntro/settings_nacrto.png" width=20%>

第二个按钮为简洁模式（去除背景）切换按钮，关闭后效果如下：

<img src="https://res.cloudinary.com/drspqpjo3/image/upload/v1657526085/gitHubIntro/typing_zmuutb.png" width=80%>
