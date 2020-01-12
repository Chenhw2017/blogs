

> 研究表明知识概念的图形化，相较于文字描述更具有直观性，有助于高效的学习及加深对知识概念的理解

http协议的文章太多了，光掘金就有"几千篇"，更别说google了，也有很多优秀的文章，但是本文将尽可能避免过多的使用文字，而是使用图形或者表格来刻画描述http及其相关生态圈概念，以便让大家能够花最少的时间更加高效直观的掌握http以及方便以后查阅，作图作表不易，你的赞就是对作者的最大的鼓励

阅读本文你将收获/了解：

- 系统的http/https知识体系
- http缓存机制
- 实践开发中如何选择缓存策略
- https及其工作机制
- 什么是证书及证书的工作机制

## http在TCP/IP模型中（发送请求发生了什么）
![TCP/IP模型](http://img.souche.com/f2e/2ba899acc4ae77962aa657ad4d86e4c7.jpg)
<center>TCP/IP模型</center>

## http知识网络

![http概念](http://img.souche.com/f2e/c19976805409e92b4fc7e29c1243d62b.jpg)
<center>http概念</center>

## 报文

### 请求方式

请求方式 | 描述
---    |  ---
GET    | GET方法请求一个指定资源的表示形式. 使用GET的请求应该只被用于获取数据.
HEAD   | HEAD方法请求一个与GET请求的响应相同的响应，但没有响应体（报文主体）,用于确认URI的有效性及资源更新的日期时间等.
POST   | POST方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用. 
PUT    | PUT方法用请求有效载荷替换目标资源的所有当前表示, **由于PUT自身不带验证机制，存在安全问题，一般不用**，若配合web程序的验证制或架构设计采用REST标准的同类web网站，可能会开放PUT方法
DELETE | DELETE方法删除指定的资源，一般不用，原因PUT
CONNECT| CONNECT方法建立一个到由目标资源标识的服务器的隧道.
OPTIONS   | 查询针对指定请求URI指定的资源支持的方法
TRACE   | TRACE方法配合Max-forwords沿着到目标资源的路径执行一个消息环回测试，**不常用（容易跨站追踪攻击）**
LINK | 建立和资源之间的联系(**HTTP/1.1已弃用**)
UNLINK| 断开连接关系(**HTTP/1.1已弃用**)
    
### 常见状态码

状 态 码   |描述
---------    | ----
1xx  | Informational(信息性状状态码)，接受的请求正在处理
2xx  | Success(成功状态码)，请求正常处理完毕
200  | OK:请求正常处理完毕，注意HEAD请求方法不返回报文主体
204  | NO CONTENT:成功处理但是返回响应不含任何实体的主体；当然也不允许返回任何实体的主体，一般用于不需要对客户端返回新内容对情况
206  | Partial Content:客户端进行了范围请求，而服务器成功执行了这部分GET请求，响应报文中包含由Content-Range指定范围的实体内容
3xx  | 重定向
301  | Moved Permanently:永久性重定向，请求的资源已经被分配新的URI,以后应使用该URI
302  | Found:临时性重定向，请求的资源已经被分配新的URI,希望**本次**应使用该URI
303  | See Other:对应当前请求的响应可以在另一个 URI 上被找到，而且客户端应当采用 GET 的方式访问那个资源。与302区别是如果POST方式希望用户能使用GET重定向，303状态码更加合适，虽然功能上是一样的
304  | Not Modified:客户端发送带有条件的请求时，服务器允许请求访问资源，但是因发生请求未满条件的情况（即可直接shying客户端未过期缓存）
307  | Temporary Redirect:临时性重定向，与302含义相同，尽管302标准禁止POST改为GET，但是实际大家并不遵守，307会遵守标准不会POST改为GET，但是对于处理响应的行为，每种浏览器可能不一样
4xx  | 客户端错误
400  | Bad Request：请求报文中存在语法错误
401  | Unauthorized：当前请求需要用户验证，弹出认证用的对话窗口；若之前已经请求过一次，则表示用户认证失败，该响应必须包含一个适用于请求资源的 WWW-Authenticate 信息头用以询问用户信息
403  | Forbidden：服务器已经理解请求，但是拒绝执行它
404  | Not Found：请求失败，请求所希望得到的资源未被在服务器上发现.也可用于当服务器不想揭示到底为何请求被拒绝或者没有其他适合的响应用的情况
405  | Method Not Allowed：请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够受的请求方法的列表
5xx  | 服务器错误
500  | Internal Server Error：服务器在执行请求时发生了错误，也可能是web应用存在bug或者临时故障
502  | Bad Gateway：此错误响应表明服务器作为网关需要得到一个处理这个请求的响应，但是得到一个错误的响应。
503  | Service Unavailable：服务器没有准备好处理请求。 常见原因是服务器因维护或超负载而停机
504  | Gateway Timeout：当服务器作为网关，不能及时得到响应时返回此错误代码



## 缓存机制

### 缓存控制相关字段
字段名称 | 可能值举例 |  缓存优先级 | 描述
:-------: | ----------| :-------:  | -------
Cache-Control | max-age=3600| 高（强缓存） | 再次请求3600s内都可以使用缓存
Expires| Sat, 10 Jan 2020 09:00:00 GMT| 高（强缓存） | 2020年1月10日9点之前再次请求都可以使用缓存
If-Modified-Since/Last-Modified|Sat, 10 Jan 2020 09:00:00 GMT| 低|第一个时间>第二个(**只能精确到秒**)，返回304，反之，200，读取服务器资源并返回实体结果
If-None-Match/ETag| 123xx | 中 | 若123xx!==ETag，则读取资源并返回实体，反之304，**注意:**，ETag判断资源是否修改的准确度虽然高于`If-Modified-Since`,但这是要牺牲服务器的资源的为前提的，因为要根据算法生成ETag需要额外开销服务器资源

> 注： 1.缓存控制字段同时存在时，会按照**优先级由高到低进行控制缓存命中控制**，在`HTTP/1.0`中，同时存在Cache-Control和Expires会忽略Cache-Control，在`HTTP/1.1`中，则会忽略`Expires`

### Cache-Control指令

#### 缓存请求指令

指令 | 参数 | 说明
---- | ----- | -----
no-cache| 无| 强制向源服务器再次验证
no-store |无 |不缓存请求或响应的任何内容
max-age = [ 秒] |必需 |响应的最大Age值
max-stale( = [ 秒]) |可省略| 接收已过期的响应
min-fresh = [ 秒] |必需 |期望在指定时间内的响应仍有效
no-transform |无 |代理不可更改媒体类型
only-if-cached |无| 从缓存获取资源
cache-extension |- |新指令标记（token）

#### 缓存响应指令

指令 | 参数 | 说明
---- | ----- | -----
public |无| 可向任意方提供响应的缓存
private |可省略| 仅向特定用户返回响应
no-cache |可省略| 缓存前必须先确认其有效性
no-store |无| 不缓存请求或响应的任何内容
no-transform |无| 代理不可更改媒体类型
must-revalidate |无| 可缓存但必须再向源服务器进行确认
proxy-revalidate |无|要求中间缓存服务器对缓存的响应有效性再进行确认
max-age = [ 秒] |必需| 响应的最大Age值
s-maxage = [ 秒] |必需| 公共缓存服务器响应的最大Age值
cache-extension |-| 新指令标记（token）

### http缓存控制工作原理

![http概念](http://img.souche.com/f2e/8331e8be26d4ef376a18488117f7de9f.jpg)
<center>http缓存控制工作流程</center>

### 实践中如何定制缓存策略

![http概念](http://img.souche.com/f2e/dc6696ab8ffcdf0ada9e2b6da2f8d97e.jpg)
<center>定制缓存策略</center>

> 在使用强缓存时，当我们设置了缓存有效时间之后，如果在有效时间静态内资源被修改，但是我们依然会使用缓存(老的)，显然生成中这是不被允许的！在单页面实践中，在打包的时候`webpack`会通过`hash`的方式修改`html`引用的静态资源文件名（否者静态资源的URI没变，依然会使用缓存），并将其嵌入`html`中生产新的`html`文件，所以我们只需要设置请求`html`资源为`no-cache`（即每次请求都会验证缓存的有效性）就可以保证即使缓存有效期内，被引用的静态资源发生了修改，也能获取到最新的改动

## 针对http的安全策略

### https

![https](http://img.souche.com/f2e/0497998d2ea6532e6adc4e1debaa8fc6.jpg)
<center>https</center>

![https](http://img.souche.com/f2e/bb3e1e73a646f7ad86b6be1f073bdf33.jpg)
<center>https示意图</center>

### https工作流程

![https](http://img.souche.com/f2e/5ac55609eee40b644907b1ceddf49507.jpg)
<center>https工作流程</center>

### 证书机制

<div style="text-align:center">
<img src="http://img.souche.com/f2e/e5df29226a9c4feb38b473ff645600fe.jpg"/>
</div>

<center>证书机制</center>


> [关于数字签名及其验证](https://www.jianshu.com/p/9db57e761255)

## 附录

### 首部字段

首部字段名 | 说明
--- | ----
Cache-Control |控制缓存的行为
Connection| 逐跳首部、连接的管理
Date |创建报文的日期时间
Pragma |报文指令
Trailer| 报文末端的首部一览
Transfer-Encoding| 指定报文主体的传输编码方式
Upgrade| 升级为其他协议
Via |代理服务器的相关信息
Warning |错误通知

### 请求首部字段

首部字段名 | 说明
--- | ----
Accept| 用户代理可处理的媒体类型
Accept-Charset |优先的字符集
Accept-Encoding |优先的内容编码
Accept-Language |优先的语言（自然语言）
Authorization |Web认证信息
Expect| 期待服务器的特定行为
From |用户的电子邮箱地址
Host| 请求资源所在服务器
If-Match| 比较实体标记（ETag）
If-Modified-Since |比较资源的更新时间
If-None-Match| 比较实体标记（与 If-Match 相反）
If-Range| 资源未更新时发送实体 Byte 的范围请求
If-Unmodified-Since |比较资源的更新时间（与If-Modified-Since相反）
Max-Forwards |最大传输逐跳数
Proxy-Authorization |代理服务器要求客户端的认证信息
Range |实体的字节范围请求
Referer| 对请求中 URI 的原始获取方
TE| 传输编码的优先级
User-Agent | HTTP 客户端程序的信息

### 响应首部字段
首部字段名 | 说明
--- | ----
Accept-Ranges |是否接受字节范围请求
Age| 推算资源创建经过时间
ETag |资源的匹配信息
Location |令客户端重定向至指定URI
Proxy-Authenticate| 代理服务器对客户端的认证信息
Retry-After |对再次发起请求的时机要求
Server| HTTP服务器的安装信息
Vary| 代理服务器缓存的管理信息
WWW-Authenticate |服务器对客户端的认证信息

### 实体首部字段

首部字段名 | 说明
--- | ----
Allow |资源可支持的HTTP方法
Content-Encoding| 实体主体适用的编码方式
Content-Language |实体主体的自然语言
Content-Length |实体主体的大小（单位：字节）
Content-Location| 替代对应资源的URI
Content-MD5 |实体主体的报文摘要
Content-Range| 实体主体的位置范围
Content-Type| 实体主体的媒体类型
Expires| 实体主体过期的日期时间
Last-Modified |资源的最后修改日期时间

### 建立TCP连接建立过程
<div style="text-align:center">
<img src="http://img.souche.com/f2e/069066d7506f89fe4d1f1a29492f5ab3.png"/>
</div>
<center>TCP连接建立</center>

### 常见应用层协议

协议简称 | 英文全称|中文全称 |描述
---- | ------ | ---- | ----
SMTP | Simple Mail Transfer Protocol |简单邮件传输协议|用于邮件发送的基于TCP的应用层协议
POP3 | Post Office Protocol - Version 3 |邮局协议版本3|用于邮件接收的基于TCP的应用层协议
DNS | Domain Name System|域名系统|用于解析域名与IP地址的基于UDP/TCP 应用层协议
DHCP |Dynamic Host Configuration Protocol|动态主机配置协议 |用于主机动态获取IP地址、缺省网关、DNS服务器等参数的基于UDP 应用层协议
CIFS |Common Internet File System |通用网络文件系统| Windows 文件共享的基于TCP的应用层协议
NFS | Network File System|网络文件系统|用于Unix / Linux 文件共享，基于UDP/TCP协议
NTP | Network Time Protocol|网络时间协议|用于时钟同步的基于UDP的应用层协议
SIP | Session Initiation Protocol|会话发起协议|IP电话信令协议，IETF协议标准，基于TCP/UDP应用层协议
H.323 |-|-|IP电话信令协议，国际电信联盟 ITU协议标准，基于TCP/UDP应用层协议
RTP |Real-time Transport Protocol|实时传输协议 |用于IP多媒体电话的语音、文字、视频等流体的传输，基于UDP的应用层协议

## 总结

http几乎深透了我们每天的开发实践中，渗透到你对它的存在习以为常而忽略它，，但它真的很重要，因为它是前后端通信的桥梁，也是前端性能优化的一个点，这块知识难点不多，但是很散，如果大家看完这篇文章（图），对http生态有个清晰或者深刻的认识，我的目的就达到了～，本人水平有限，文章如有错误或者建议，还请指教

## 参考

 - [图解http](https://kingyinliang.github.io/PDF/%E5%9B%BE%E8%A7%A3HTTP+%E5%BD%A9%E8%89%B2%E7%89%88.pdf)
- https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching?hl=zh-cn







