面筋与知识总结：✨面筋 🎉知识
1.✨ https://juejin.cn/post/7064740689178787871
2.🎉 https://juejin.cn/post/7202904269535887418
3.🎉 https://interview.html5.wiki/#%E7%9F%A5%E8%AF%86%E7%82%B9%E6%A2%B3%E7%90%86
4.🎉 https://juejin.cn/post/6919373017218809864

# 一、浏览器

## 1.浏览器渲染原理

​	浏览器渲染原理是指将工程中的`HTML`、`CSS`、`Javascript`转换成用户可以看到的网页。

### 浏览器渲染的大致流程

1.处理HTML，通过解析html构建成DOM树

2.处理CSS，通过解析css构建成CSSOM树

3.将DOM和CSSOM树合并成一个渲染树

4.根据渲染树来布局，计算每个节点的位置。

5.调用GPU绘制文档，显示在浏览器页面中。

### 详细

1.浏览器逐行解析HTML字符串

2.处理HTML，将HTML解析成DOM树

3.处理CSS，将CSS解析成CSSOM树

4.在解析过程中可能会出现需要加载的外部资源，浏览器会发送请求加载外部资源，**若资源是同步加载的可能(CSS、JS)**会出现阻塞浏览器渲染线程的情况。

5.解析HTML字符串完成后，将DOM树与CSSOM树合并成渲染树

6.通过GPU将渲染树渲染到页面中。

### load和DOMContentload

load事件浏览器渲染页面完成时触发。

DOMContentLoaded事件是在DOM树构建完成后触发。

DOMContentLoaded事件是在DOM树构建完成后触发，即HTML解析完成并生成DOM树，但是CSS、JavaScript、图片等外部资源可能还在加载中。而load事件是在页面所有资源（包括CSS、JavaScript、图片等）加载完成后触发，表示整个页面已完全加载。

load事件是在浏览器完全加载页面（包括所有资源如图片、样式表、脚本等）后触发。这意味着浏览器已经解析完HTML，生成了DOM树，并完成了DOM树的构建、样式计算、布局和绘制等过程。

而DOMContentLoaded事件是在浏览器解析完HTML文档并构建了DOM树后触发。此时，浏览器已经完成了DOM树的构建，但可能尚未加载完所有资源（如图片、样式表、脚本等），因此可能还没有完成页面的完全渲染。DOMContentLoaded事件的触发时机通常在load事件之前，所以它可以用于在页面加载过程中执行一些初始化操作，而无需等待所有资源加载完毕。

总结一下，load事件在页面加载完毕后触发，而DOMContentLoaded事件在DOM树构建完成后触发。

### 解决加载CSS和JS阻塞浏览器解析html

#### CSS

##### 阻塞的原因

外联样式表link不会阻塞DOM树构成，但会阻塞浏览器渲染过程。

CSS不会阻塞浏览器解析html生成DOM树，但是在css加载完成前会阻塞CSSOM树，由于CSSOM树构建被阻塞，无法创建渲染树，从而阻塞渲染树的构建，所以CSS还是会阻塞浏览器渲染页面。

放在头部可以尽早请求CSS资源，如果将 CSS 放在页面中间或者底部，CSS 不会阻塞 DOM 构建，已经解析完成的内容会被渲染出来。

这时一旦 CSS 加载完成页面则会重新渲染，可能造成页面变化。一方面不必要的重新渲染造成额外的性能负担，另一方面页面的变化体验也非常不好。

#### JS

##### 阻塞的原因

script标签在被解析时会自动发送http请求加载外部脚本资源，若无async、defer属性，则会阻塞浏览器解析后续代码，因为浏览器会等待加载资源成功并执行脚本资源后才会向下解析html。

##### 解决方法

使用async、defer异步加载脚本资源的方式可以解决阻塞问题。

async异步加载(可能会阻塞)：当加载外部脚本资源时会发送请求，且并发解析后续html，当外部脚本资源请求完成时，会立即执行脚本代码，若在请求完成时，浏览器还未解析完html，会因为执行外部脚本代码而阻塞解析。

defer延迟加载：当加载外部脚本资源时会发送请求，且并发解析后续html，当请求完成后，不会执行代码直到浏览器把全部html解析完成后，再去执行代码。

## 2.重排重绘

​	重排或回流（reflow）、重绘（repaint）是浏览器渲染过程的机制。

### 重绘

当页面中某个元素样式的改变不会影响页面布局时（元素尺寸不发生变化或元素样式不影响其他元素的位置时），浏览器会将新样式绘制给该元素，这个过程就是重绘。

1.color

2.opacity

3.visibility

4.box-shadow

5.transform

...

### 重排

当页面中某个元素或全部元素的尺寸、大小、位置、结构发生变化时，会触发浏览器重新渲染部分元素或全部元素的过程，就是重排。

例如：

1.修改容器width、height、padding、border、margin

2.通过定位的偏移量修改容器的位置

3.浏览器尺寸变化resize

4.修改添加DOM元素

6.激活css伪类

7.查询或修改DOM的布局属性：offsetWidth、clientWidth、getComutedStyle、scrollWidth、getBoundingClientRet（在使用这些API时为了精准性，会通过重排该元素来获取到元素精确位置。）

8.字体大小

9.通过js来设置style属性的值

### 减少重排

重绘的消耗的性能较小，在性能优化时我们一般都不考虑。但重排的开销比重绘高很多，重排会导致元素的重新渲染以及重绘。总的来说就是在重排时尽量不要响应其他元素；减少读取布局属性；

通过以下方式减少重排：

1.**（使用请求动画帧）**请求动画帧API会将多次操作合并成一次渲染当中，用来取代setTimeout。

2.（**使用文档片段**）插入多个元素时，可以在内存中创建createDocumentFragment，在这个模板里面插入多个元素，最后统一放到文档流中而不是每次创建一个元素就插入到DOM树中。通过这种方式只需要计算一次重排。

3.（**提前编写好class**）通过js修改元素样式，可以先编写好样式的class，通过addClass来增加样式而不是style.xxx一个语句一个语句的修改，这样可以减少重排。

3.（**让DOM离线**）通过js修改元素样式时，可以先让元素display:none，让DOM对象离线，无论怎么修改元素样式都不会引发重绘，只需在最后修改完成时显示元素即可，这样只会重排两次。

4.（**脱离文档流**）再修改元素时先脱离文档流，修改元素完成后再进入文档流，可以在修改途中减少重排范围，脱离文档流后再怎么修改样式都只会影响当前元素的布局，只会重排当前元素。

5.使用GPU加速，例如opacity、transform、filter等属性，会直接在GPU中处理，而不是重排重绘

```css
  div{
      opacity: .8;
      will-change: opacity; /*opacity属性会在GPU中处理*/
    }
```

## 3.在浏览器上输入url到页面显示的步骤

### 粗劣

1.浏览器根据请求的URL交给DNS域名解析，找到真实的IP

2.建立TCP连接，三次握手，确认双方是否有能力接收和发起请求，通过则向服务器发送请求。

3.服务器接收到请求后，根据请求头部以及请求体相关信息，去执行相应业务逻辑，处理好后，将html字符串相应给浏览器。

4.请求完成后TCP断开连接，四次挥手

5.浏览器将响应回来的html字符串进行解析。在解析的过程会逐行读取HTML代码，将html解析成DOM tree ，将css解析成 CSSOM tree

6.在触发解析HTML字符串可能会需要加载外部资源，会发送新的http请求，若是同步加载可能会被阻塞渲染进程。

7.解析完成后，将CSSOM tree和DOM tree 合并成渲染树

8.将渲染树通过GPU处理，渲染出页面。

### 详细

1. DNS解析：浏览器首先会提取URL中的域名，然后将其发送给DNS（域名系统）服务器来获取对应的IP地址。这个过程称为DNS解析。
2. 建立TCP连接：浏览器使用获取到的目标IP地址与服务器建立TCP连接。TCP（传输控制协议）是一种可靠的网络传输协议，用于确保数据的可靠传输。
3. 发送HTTP请求：建立TCP连接后，浏览器会向服务器发送HTTP请求。其中包含了请求的方法（如GET、POST等）、请求的资源路径、请求的头部信息等。
4. 服务器处理请求：服务器接收到浏览器发送的HTTP请求后，会根据请求的资源路径和其他相关信息进行处理。这可能涉及到读取数据、查询数据库、运行脚本等操作。
5. 服务器响应：服务器处理完请求后，会将生成的响应数据发送回给浏览器。响应中包含了HTTP状态码、响应的头部信息以及响应的主体内容。
6. 浏览器渲染：当浏览器接收到服务器发送的响应数据后，会根据响应的内容进行解析和渲染。浏览器将HTML、CSS和JavaScript解析后构建DOM树、CSSOM树和JavaScript线程，然后将它们合成为渲染树（Render Tree），最后利用渲染树进行页面的渲染展示。
7. 页面加载：随着页面的渲染，浏览器会逐步加载页面中引用的资源，如图片、样式表、脚本等。这些资源的加载过程可能会触发新的HTTP请求。
8. 页面完成：当所有的资源加载完成后，页面就算加载完成了，用户可以与页面进行交互了。

## 4.浏览器缓存机制

https://juejin.cn/post/7178794675044614203#heading-2

​	浏览器缓存：浏览器将用户请求过的资源（html、js、css、资源）存储到内存（`memeory cache`）、磁盘(`disk cache`)中，当用户再一次加载这些内容时，浏览器可以直接将本地的内容加载出来，从而节省用户流量、减少服务器性能开销，是性能优化的手段之一。

​	例如：文档加载了Vue.js脚本资源，这种资源一般不会更新，完全没必要每次请求都重新加载。我们可以将其设置为缓存，这样，下次加载Vue.js就不会发送请求而是命中缓存获取缓存中的文件来加载资源。

​	缓存的缺点：若站点内容更新了，浏览器却还是根据缓存命中得到旧站点的内容，就会导致**请求的内容**和**实际内容**不一致的情况。

### 缓存资源流程

​	当浏览器发送请求时首先会从本地缓存数据库发送请求获取资源，若缓存中没有数据就会向服务器发送请求获取资源。若服务器响应的报文规定了缓存以及缓存规则，浏览器会将数据保存在本地缓存数据库中，下一次发送请求可能就会命中了。

​	资源缓存都是通过一定**规则**来约束了缓存资源的访问流程。

​	js、css、图片等资源可以使用强缓存轻松利用缓存机制减少开销，但html文档缓存建议使用协商缓存，通过检查文件是否修改决定是否复用资源结果。

### HTTP缓存规则

​	有强缓存和对比缓存（协商缓存）规则等

#### 强缓存

​	强制缓存如果生效，不需要再和服务器发生交互。

响应头中一定有`cache-control`或`expires`属性。 其http的状态码返回：`Status Code: 200  (from disk cache)`，说明强制缓存已被命中使用。

##### Cache-Control 

是 HTTP1.1 中控制网页缓存的字段，主要取值为：

- public：资源客户端和服务器都可以缓存
- privite：资源只有客户端可以缓存
- no-cache：客户端缓存资源，但是是否缓存需要经过协商缓存来验证
- no-store：不使用缓存
- max-age：缓存保质期，是相对时间

##### Expires

是HTTP1.0控制网页缓存的字段，值为一个时间戳，服务器返回该资源缓存的到期时间。

`Expires`为服务端返回的到期时间。即下一次请求时，请求时间`小于`服务端返回的到期时间，直接使用缓存数据。作为HTTP 1.0的作品，所以它基本可以忽略。

但 Expires 有个缺点，就是它判断是否过期是用本地时间来判断的，本地时间是可以自己修改的。

##### 强制缓存命中原则

当一个资源被缓存后，浏览器重新加载该资源时：

- 首先查看资源是否过期，过期了直接发送网络请求。
- 若资源未过期，会从内存中寻找，若内存有浏览器会直接加载
- 若内存中没有，浏览器会向磁盘中找，有就直接加载
- 若磁盘中也没有，浏览器会发送网络请求重新加载资源

##### 响应头部设置强缓存

​	通过响应头部设置强缓存可以在过期时间前，复用该资源结果，减少客户端和服务端的开销。	

```js
 if (req.url.includes('.js') || req.url.includes('.css')) {
     const data = await getStrStatic(`/client/${req.url}`)
     res.setHeader('Cache-Control', 'max-age=100') // 设置缓存有效期为100s
     res.end(data)
 }
```



#### 对比缓存（协商缓存）

​	**对比缓存不管是否生效，都需要与服务端发生交互。**因为服务端需要通过标识来通知浏览器是否需要使用缓存。

协商缓存是通过请求头`Last-Modified`或`Etag`来实现的，任意选择其中一个即可。`Last-Modified` 标识的是文档最后修改时间，`Etag` 是以文档内容来进行编码的。

触发条件：

- Cache-Control 的值为 no-cache （协商缓存）
- 或者 Cache-Control: max-age=0

##### last-modified

​	简单来说就是通过第一次请求时浏览器保存资源最后修改时间，后面浏览器再次发送请求时携带上该信息，服务端通过请求头部的信息与资源最后修改时间进行对比，若无变化缓存命中，若有变化缓存不命中，返回最新信息。

流程：

1. 服务器第一次响应请求时，告诉浏览器资源的最后修改时间，并存储到浏览器端。

2. 再次请求时，请求头中携带`If-Modified-Since`字段，将上次请求服务器资源的最后修改时间传到服务器与被请求资源的最后修改时间进行比对。

3. 若资源的最后修改时间大于If-Modified-Since的值，说明资源又被改动过，则响应整片资源内容，返回状态码200。

4. 若资源的最后修改时间小于或等于If-Modified-Since，说明资源无新修改，则响应HTTP 304，告知浏览器继续使用所保存的cache。

##### etag

服务器资源是否被修改的唯一标志。首次请求唯一标志被存到客户端缓存数据库。

客户端再次请求时，请求头中携带`If-None-Match`字段。服务端则将与被请求资源的唯一标识进行比对

若不同，说明资源又被改动过，则响应整片资源内容，返回状态码200；

若相同，说明资源没有被改动过，则响应HTTP 304，告知浏览器继续使用所保存的cache。

## 5.性能优化

从浏览器、资源、图片、代码层面来进行优化

### 1.浏览器

#### 1.1 减少HTTP请求

​	Chrome浏览器最多同时允许对同一个域名Host建立6个TCP连接，不同的浏览器有所区别，减少http请求也就是减少我们html里css/js等资源的数量。

#### 1.2 使用浏览器缓存策略

​	使用缓存可以提升资源加载速度，减少HTTP请求，节约客户端流量，减少服务端资源开销。

### 2.资源

#### 2.1 静态资源cdn

​	静态css/js/img等资源可以做cdn缓存，这样把资源同步到全国全球各地，用户就能更快访问到。

##### 2.2 静态资源单独域名

1. 浏览器请求并发限制（同一域名（包括二级域名）在同一时间支持的并发请求数量的限制）
2. cookie传输，单独域名，不会携带cookie
3. 方便分流和缓存（动静分离，有利于静态资源做cdn缓存）

#### 2.3 `gzip压缩`

使资源体积更小，服务端配置。
服务端配置，如nginx可配置支持gzip压缩资源传输的方式
如果浏览器支持gzip解析，服务器就会推送gzip的资源，在http的相应头里可以看到显示Content-Encoding:gzip

#### 2.3 服务端渲染（SSR）

CSR（客户端渲染）需要把大部分资源加载并执行才能保证运行，SSR只需要客户端加载当前页的资源即可运行，减少客户端首屏加载时间以及流量。

### 3.图片

#### 3.1 精灵图

​	把多个图片整合到一个图片上，只需要通过CSS设置偏移量即可完成图片展示，后续加载都走缓存，可以减少HTTP请求。

#### 3.2 字体图标

​	一些通用的小图标，如箭头，叉，可以使用字体图标，减少HTTP请求，渲染更快

#### 3.3 懒加载

​	图片按需加载，需要查看时才加载。例如进入视口加载...

#### 3.4 预加载

​	某些高清图片需要在某个页面中查看，我们可以在应用运行时通过new image先加载资源，后续需要访问该页面时即可利用缓存加载图片，快速预览图片，提升用户体验。

#### 3.5 base64

​	img标签的src属性可以是base64字符串，通过base64加载图片，可以减少HTTP请求。

### 4.代码

#### 4.1 减少全局变量的使用

1. 全局变量定义在全局执行上下文，是所有作用域链的顶端。局部找不到就会一直往上找，影响性能
2. 全局执行上下文一直存在于上下文执行栈，直到程序退出，不利于垃圾回收
3. 命名污染

#### 4.2 减少重排重绘

​	尽量避免重排重绘，减少交互卡顿。

#### 4.3 节流防抖

​	避免短时间内大量触发任务造成不必要的开销。

#### 4.4 事件委派

​	通过事件冒泡机制，减少给DOM元素绑定事件回调的次数。

### 5.场景优化

#### 5.1长列表

​	分页、按需加载、虚拟列表。

#### 5.2 复杂计算

​	复杂的同步计算导致渲染进程被阻塞，导致页面“卡顿”，可以使用 `Web Worker`开启子线程，将复杂计算交给子线程处理，子线程和主线程是相互隔离的，不会相互影响。

## 6.常见的响应状态码

HTTP状态码主要分为三大类:

> 1XX表示消息
>
> 2XX表示成功
>
> 3XX表示重定向
>
> 4XX表示客户端出错
>
> 5XX表示服务端出错

### 1XX



### 2XX

200：请求成功。

201：资源创建成功。

204：无响应体。

206：分片传输。

### 3XX

301：永久重定向

302：临时重定向

304：自上一次请求，文件没有被修改

307：临时重定义，http转https的重定向

### 4XX

400：错误的请求

401：需要身份令牌，或令牌出错

403：请求被拒绝，权限不足。

404：请求资源不存在（接口、文件、资源）

### 5XX

500：服务端未知错误

502：网关错误

503：服务暂时无法使用

504：网关超时



# 二、html

## 1.src和href的区别

`src`和`href`都是代表引用外部的资源，**最大的区别就是src会阻塞后续代码的解析，href的加载与后续代码的解析是并行的**。

**src**：表示对资源的引用，他指向的内容会嵌入到当前标签所在的位置，src会对目标url发送请求下载并应用到文档中。

**href：** 表示超文本引用，它指向一些网络资源，建立和当前元素或本文档的链接关系。当浏览器识别到它他指向的⽂件时，就会并⾏下载资源，不会停⽌对当前⽂档的处理。 常用在a、link等标签上。

## 2.defer和async

​	这两个是`script`标签独有的两个属性，他们异步的加载脚本资源而不阻塞浏览器对后续代码的解析。

**defer**：html解析到script标签时会异步加载该脚本，等到html解析完成后才执行该脚本代码。在DOMContentload事件之前执行，对于defer的脚本资源的执行，所有的脚本代码执行完成后触发DOMContentloaded之前事件。多个defer按照处于文档的顺序来加载。

**async**：html解析到script标签时会异步加载该脚本，但网络请求加载完成后会立即执行脚本代码，可能会出现浏览器未解析完html就执行了脚本代码。

**默认**：html解析到该script时，会同步加载脚本资源，加载完成后会立即执行脚本代码。注意，这一过程都是同步在进行的，所以会阻塞浏览器解析后续html字符串。

## 3.HTML5新增

1.语义化标签

2.表单属性更新，type支持email、time、range等等值，placeholder、autofocus、requierd等属性

3.Web Storage：新增session和local存储

4.新增标签：canvas、audio、video、sourse

5.拖放API

## 4.DOCTYPE的作用

​	声明文档的类型，告诉浏览器以何种标准来解析该文档。

## 5.前端性能优化

# 三、css
## 1.BFC

​	BFC块级格式化上下文，**BFC是一个独立的空间，让空间内部的子元素不会影响到外部的布局，外部的布局也不会影响BFC内部子容器的布局**

### 触发BFC

触发`BFC`的条件包含不限于：

- 根元素，即HTML元素
- 浮动元素：float值为left、right
- **overflow值不为 visible**，为 auto、scroll、hidden
- display的值为inline-block、inltable-cell、table-caption、table、inline-table、flex、inline-flex、grid、inline-grid
- position的值为absolute或fixed

### BFC的规则

1.`BFC`就是一个块级元素，块级元素会在垂直方向一个接一个的排列

2.`BFC`就是页面中的一个隔离的独立容器，容器里的标签不会影响到外部标签

3.同一个BFC下，两个元素的margin可能会发生重叠，与方向无关

4.计算`BFC`的高度时，浮动元素也参与计算

### BFC解决的问题

#### 1.解决margin重叠

在同一个bfc容器下，其子元素的margin会被重叠。这种的结果就是box1和box2的外边距发生了重叠

```html
   <style>
      * {
        margin: 0;
        padding: 0;
      }
      .box {
        margin: 0px;
        width: 100px;
        height: 100px;
        background: red;
      }
      .box:nth-of-type(1) {
        margin-bottom: 10px;
      }
      .box:nth-of-type(2) {
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box"></div>
      <div class="box"></div>
    </div>
  </body>
```

解决方法就是让某个元素成为一个BFC容器的子元素，这样就不会发生重叠了。

```html
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      .box {
        margin: 0px;
        width: 100px;
        height: 100px;
        background: red;
      }
      .container>.box{
        margin-bottom: 10px;
      }
      .bfc>.box{
        margin-top: 10px;
      }
      .bfc{
        display: flex;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box"></div>
      <div class="bfc">
        <div class="box"></div>
      </div>
    </div>
  </body>
```

#### 2.高度塌陷

​	当父容器中所有的子容器都设置了浮动脱离了文档流，则父元素就因为没有子元素在文档流中撑起高度而塌陷为0px，使用bfc的特性**bfc容器的高度会计算设置了float的后代元素的高度**，从而让父元素的高度被撑开。

下列的结果就是.fa容器的高度会因为子元素脱离了文档流而塌陷

```html
 <style>
    .fa{
      width: 200px;
      background-color: red;
    }
    .son{
      height: 150px;
      width: 150px;
      float: left;
      background-color: skyblue;
    }
  </style>
</head>
<body>
  <div class="fa">
    <div class="son"></div>
  </div>
</body>
```

使用bfc的特性，在计算父元素高度时会计算子元素的高度

```html
 <style>
    .fa{
      width: 200px;
      display: flex;
      background-color: red;
    }
    .son{
      height: 150px;
      width: 150px;
      float: left;
      background-color: skyblue;
    }
  </style>
</head>
<body>
  <div class="fa">
    <div class="son"></div>
  </div>
</body>
```

## 2.margin、padding取值问题

​	margin：1px 2px 3px 4px 则结果为：上1px，右边2px，下3px，左4px

​	margin：1px 2px 4px 则结果为：上1px、下4px，左右2px。

## 3.层叠上下文

​	层叠上下文规定了每个元素之间的显示顺序和覆盖关系。	

 	层叠上下文管理了元素之间层叠的关系。每个层叠上下文相关css属性来触发层叠上下文，这些css属性决定了每个层叠上下文的显示顺序和覆盖关系。

### 触发方式

1.根标签html就是一个层叠上下文（文档流）

2.z-index+position：**当元素的z-index属性值不为auto时且position不为static时**，会创建一个新的层叠上下文。

3.CSS3属性：opacity、transform、filter等属性都会创建元素的上下文。

**注意**：z-index：auto不会创建新的层叠上下文!!!!且z-index:0

### 作用

1.隔离元素：在某个层叠上下文中的所有元素都不会响应其他层叠上下文的布局。

2.控制元素的层叠顺序：通过z-index可以控制元素的z轴，控制同一个层叠上下文中元素的覆盖关系，z-index大的覆盖z-index小的。**非同一个层叠上下文是无法响应其他层叠上下文元素的覆盖关系的!**

3.形成层叠上下文根：让一个元素成为层叠上下文，其后代元素都在该层叠上下文中设置显示，后代元素都会覆盖该元素显示。

### 思考题01

box1、box2、son2的覆盖顺序？

```html
  <div class="box1"></div>
  <div class="box2">
    <div class="son2"></div>
  </div>
```


```css
   div {
        width: 100px;
        height: 100px;
      }
      .box1 {
        background-color: red;
        z-index: 2;
        position: relative;
        top: 20px;
        left: 20px;
      }
      .box2 {
        position: relative;
        z-index: 1;
        background-color: greenyellow;
      }
      .son2 {
        background-color: blue;
        width: 50px;
        height: 50px;
        position: absolute;
        z-index: 999;
      }
```

答案：box2、son2、box1

为什么`son2`明明是`z-index:999`但是无法覆盖`box2`的`z-index:2`呢？

这就是因为隔离性，让后代元素都在一个层叠上下文中设置覆盖关系，不会响应到其他层叠上下文中的布局。

**因为box1、box2都在html根层叠上下文中布局**，他们在同一个层叠上下文中，box1的z-index=2，box2的z-index=1，所以**决定了box1覆盖了box2**。box2中的son2在box2创建的层叠上下文中布局的，由于**隔离性**，box2中后代元素的z-index无法影响其他层叠上下文的显示关系。

如何让son2覆盖box1呢？那么就只需要让box1和son1处于同一个层叠上下文即可，**因为在同一个层叠上下文下通过z-index决定了元素的覆盖关系**。所以只需要让box1取消层叠上下文，将定位设置为auto或static即可。

### 思考题02

```css
      .box1,
      .box2 {
        width: 100px;
        height: 100px;
        position: relative;
      }
      .son-2 {
        top:30px;
        width: 80px;
        height: 80px;
        background-color: aqua;
        position: absolute;
        z-index: 99999;
      }
      .box1 {
        z-index: 10;
        background-color: red;
      }
      .box2 {
        /*z-index：auto,auto是默认值，不会创建新的层叠上下文，所以son-2属于根层叠上下文里面的*/
        z-index:auto;
        top: -50px;
        left: 50px;
        background-color: yellow;
      }
```

```html
    <div class="box1"></div>
    <div class="box2">
      <div class="son-2"></div>
    </div>
```

box1、box2、son-2的覆盖关系？

son-2、box1、box2。

为什么son-2覆盖了box1？

> box1、box2都是属于根层叠上下文的所以他们的覆盖关系通过z-index决定，由于box2是z-index：auto（默认值），则相当于z-index：0，所以box1在box2上。
**疑点:**为什么son-2会影响外部的布局呢，明明son-2属于box2创建的层叠上下文中的，son-2的覆盖关系不应该影响外部容器的。
**关键:**`在于z-index的默认值auto其作用是不创建层叠上下文并将z-index：0`。由于z-index:auto不会创建新的层叠上下文则会导致son-2是属于根层叠上下文的，box1也是根层叠上下文的，所以他们的显示关系是通过z-index决定的,所以son-2会覆盖box1

## 4.css选择器

​	css选择器是指：`将css规则作用在页面中的哪些元素中`。

​	基本选择器:父子`>`，后代` `，兄弟`+`、`~`，标签`tag`，属性选择器`[attr=value]`，id选择器、class选择器，通用选择器*，交集选择器（选择中同时满足多个选择器的标签，例如`div.son`）、并集选择器（一个css规则同时作用在多个选择器上，例如`div,p,span`），

​	伪类：nth-child、hover、first-child、last-child、last-type-of、not、active、focus..

​	伪元素：after、before...

### css选择器划分

- 简单选择器:使用了一种选择器
- 复合选择器:通过简单选择器连接而成，如:div[id=ok]，div.son...
- 复杂选择器:通过复合选择器与父子、后代、兄弟等选择器连接而成，如:div .box p

## 5.css选择器的优先级

​	css选择器优先级是指多个选择器作用于同一个元素时，浏览器以何种选择器来应用到元素上。

### 速记版

`!import`>内联样式 > ID 选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器>通用选择器

### 选择器权重

​	每种选择器都有其各自的权重，在多个选择器作用于一个元素时，就是通过计算选择器的权重从而将权重最高的选择器应用到元素上。

> 1.内联样式权重 1000（内联样式权重固定1000，所以想要覆盖内联样式可以将选择器叠加到1000以上即可覆盖内联样式）
>
> 2.id选择器权重 100
>
> 3.class、属性、 伪类选择器权重 10
>
> 4.标签、伪元素选择器权重 1
>
> 其他选择器权重均为0

如`div.box .title span`与`div#box01 div.title span `若同时作用到一个元素上：

则`div.box .title span`：1+10+10+1=22

则`div#box01 div.title span `:1+100+1+10+1=113

所以权重最高的选择器的css规则会作用在对应元素上。

## 6.包含块



一个元素的尺寸和位置通常受到包含块（containing block）的影响，因为我们时常会通过百分比来设置元素的尺寸和位置，而这个百分比的依据就是通过该元素的包含块来计算的。



包含块有两种：根标签包含块，以及相对包含块。除了根标签以外的包含块都是相对的，因为需要根据参照元素决定。



### 如何确定包含块？



确定一个元素的包含块的过程完全依赖于这个元素的 `position` 属性：



\1. 若元素的定位方式为 `static`、`relative` 或 `sticky`，则他的包含块既是距离最近的祖先块级元素。

\2. 若元素设置的定位方式为`fixed`，则他的包含块是视口(html)

\3. 若元素设置的定位方式为`absolute`，则他的包含块是距离最近的设置了***\*非静态定位\****的块级元素。



### 百分比单位



某些CSS属性若值为百分比时，就是通过其包含块决定的，例如:`width`、`height`、`padding`、`margin`。



- width，根据包含块宽度*百分比的结果来设置宽度

- height，根据包含块高度*百分比的结果来设置高度

- padding，根据包含块***\*宽度\*****百分比的结果来设置内边距(哪个方向都一样)

- margin，根据包含块***\*宽度\*****百分比的结果来设置外边距(哪个方向都一样)

# 四、JS

## cookie、session、token

​	https://juejin.cn/post/6984210017398292487

​	https://juejin.cn/post/6844903844942446600

### 1.http无状态

​	不论是cookie、session、token都是用来校验用户身份的令牌，但为什么会出现令牌？？因为HTTP是无状态的协议，上一次请求和下一次请求无任何关系、无上下文。Web应用想要知道用户的登录态就需要使用令牌了，通过令牌可以识别用户身份，从而操作对应用户的数据。

​	在客户端发送登录请求后，服务端校验后给客户端颁发令牌，客户端下次发送请求服务端就可以鉴别请求的用户了。

### 2.cookie（客户端存储）

​	cookie是HTTP头部的字段，同时cookie也可以专门保存在本地浏览器中。在登录成功后，服务端在响应头部中设置cookie，cookie数据中一般包含识别用户身份的信息，客户端接收到后会将cookie存储起来，下次发送请求浏览器会自动在请求头部中携带cookie，校验以及识别用户身份。

​	浏览器本地的cookie是可以通过JS随意添加的，所以cookie可以被伪造。服务端可以设置字段HTTP Only禁止JS随意修改某个cookie字段。

### 3.session（服务端存储）

​	session的出现是为了解决cookie会被伪造的问题。

​	所有的用户令牌由服务端维护，通过一个key：value的映射表来记录用户登录态，在客户端登录成功时，服务端创建key：value（例如:"随机字符串":"张三"）的一条记录，给客户端返回这个`key`，通过设置响应头部中设置cookie即可。客户端将`cookie`保存，下一次发送请求携带上`key`，服务端匹配查询是否有这个`key`，有则说明合法，无则说明不合法，合法通过读取这个`key`的`value`来识别这个用户。

​	可以有效避免cookie被伪造，既时客户端修改了key，服务端是无法命中映射表的。

​	但是`session`的问题是：如果存在多个服务器如负载均衡时，每个服务器的状态表**必须**同步，或者抽离出来统一管理，如使用`Redis`等服务。

### 4.token

​	`session`方案对服务端的开销是比较大的，需要维护用户登录态。而token方案采用了客户端存储+加密，服务端检验来识别用户身份的。

​	例如JWT就是使用token方案的。`JWT`由3部分构成：头部，负载和签名，加密方式采用对称加密。

1. 头部存储`Token`的类型和签名算法（上图中，类型是`jwt`，加密算法是`HS256`）
2. 负载是`Token`要存储的信息（上图中，存储了用户姓名和昵称信息）
3. 签名是由指定的算法，将转义后的头部和负载，加上密钥一同加密得到的。

最后将这三部分用`.`号连接，就可以得到了一个`Token`了。

客户端如何存储`token`呢？

1. 存在`cookie`中，虽然设置`HttpOnly`可以有效防止`XSS`攻击中`token`被窃取，但是也就意味着客户端无法获取`token`来设置`CORS`头部。
2. 存在`sessionStorage`或者`localStorage`中，可以设置头部解决跨域资源共享问题，同时也可以防止`CSRF`，但是就需要考虑`XSS`的问题防止凭证泄露。

​	

## bind、call、apply
  这三个方法都是修改函数执行时的this指向，call、apply都是立即调用函数，而bind是创建一个this指向被修改了的函数。call、apply的唯一区别就是传参方式不同而已。

 ### call
  在调用myCall时，this其实就是调用函数的那个对象，也就是目标函数。通过this指向始终都是最后调用该方法的那个对象的特性，给对象添加一个方法，最终调用该方法时this指向就是这个对象了。注意调用时不要把参数忘记了，用剩余参数来接受参数列表时获取到的是一个数组，在调用时通过展开运算符将其展开即可依次传入参数了，在调用函数后，通过delete删除改方法。

```js
// call fn.call(obj,arg1,args2....)
function myCall (obj, ...args) {
  obj[ this.name ] = this
  obj[ this.name ](...args)
  delete obj[ this.name ]
}
```

### apply
  apply和call原理差不多，只不过在调用apply时传入的参数方式不同而已，第一个参数都是目标函数this指向的目标对象，apply的第二个参数是一个数组，数组中就是调用函数的参数了。

```js
// apply  fn.apply(obj,[arg1,args2....])
function myApply (obj, args) {
  // args是一个数组
  obj[ this.name ] = this
  obj[ this.name ](...args)
  delete obj[ this.name ]
}
```

### bind
  bind是返回一个this指向被修改了的函数，需要用到闭包来延长目标函数以及目标对象的生命周期。每次调用通过bind返回的回调函数时，都会临时去给对象添加方法并调用，最后删除这样的过程。
```js
// bind fn.bind(obj)
function myBind (obj) {
  // 回调函数调用时可以通过闭包，获取到对象本身和函数上下文
  // 这里需要通过content来保存myBind调用时的那个函数
  const content = this
  return function (...args) {
    // 回调执行时，通过闭包获取content，也就调用mybind的那个函数
    // 将此函数挂载到对象自身上，并调用函数，此时的this始终为最后调用函数的对象
    obj[ content.name ] = content
    obj[ content.name ](...args)
    delete obj[ content.name ]
  }
}

```

## cookie、sessionStorage、localStorage
  区别:https://blog.csdn.net/qq_35585701/article/details/81393361?ydreferer=aHR0cHM6Ly9saW5rLmp1ZWppbi5jbi8%3D
### cookie
  cookie是存储在浏览器中**4kb**的字符串，每个网页（域）使用共享cookie，cookie会在网络请求时自动携带在请求头部中，供服务端解析识别信息，可以用来获取请求用户的身份，保存一写数据等功能。
  document.cookie是一个可读可写的属性，读取时会把当前网页（域）中的所有cookie获取出来，写入cookie时，只能添加一个有效的cookie，通常是一个键值对的字符串，并且也可以配置过期时间和域等设置。
  cookie不方便的就是对于单项cookie的读取，因为每次读取都是整个cookie数据，每个cookie数据通过分号相隔，需要通过解析才能读取。
  例如通过以下方式解析cookie数据:
  ```ts
   document.cookie.split('; ').reduce((pre,ele)=>{
    const [key,value]=ele.split('=');
    return {...pre,[key]:value}
    },{})
  ```
  cookie相关：https://juejin.cn/post/6914109129267740686#heading-0

### sessionStorage
  会话存储是存储在浏览中**5mb**的数据，每个网页（域）独享一个会话存储，这些数据都是以键值对的方式存在，这些数据会在关闭标签页时同时被销毁。通过相关api可以读写删除数据。
  ```ts
  sessionStorage.getItem('key')
  sessionStorage.setItem('key','value')
  sessionStorage.remove('key')
  sessionStorage.clear()
  ```

### localStorage
  本地存储和会话存储基本差不多，只不过他不会在关闭网页时销毁数据，只能通过用户删除或js才能删除数据。

## 深浅拷贝
  深浅拷贝主要涉及到基本数据类型和引用数据类型的区别
  基本数据类型:number,bigint,boolean,string,null,Symbol,undefined
  引用数据类型:object,function,Date,Map,Set,Promise等等
  他们最根本的区别就是，基本数据类型的数据都是保存在栈中，引用数据类型保存在堆中，变量通过保存对象在堆中的内存地址来访问属性。
  而就是因为变量保存的是对象在堆中的内存地址才会导致浅拷贝产生的问题。若两个变量同时引用相同内存地址的对象，则通过一个变量修改这个对象中的属性，会导致另一个对象访问这个对象时会发现对象的属性发生了变化。
  这就是因为两个变量都引用相同的内存地址，没有创建新的内存空间导致的问题，在拷贝引用类型的数据时，应该根据其属性来创建一个新对象，从而开辟一段新的内存空间。
 ```js
const person = {
  name: 'Mark',
  hobby:['working','playFootBall'],
  kids: [
    {
      name: 'Json',
      kids: null,
      hobby: [ 'playGame', 'playFootBall' ]
    },
    {
      name: 'Hash',
      kids: null,
      hobby: [ 'playGame', 'playFootBall' ]
    }
  ],
  [ Symbol('hash') ]: 'eysadnopasndopnDD4'
}

// 浅拷贝
function shallowCopy (obj) {
  if (obj.__proto__ === Array.prototype) {
    // 是数组
    return [ ...obj ]
  } else if (obj.__proto__ === Object.prototype) {
    // 是object
    // return {...obj}
    const newObj = {}
    Reflect.ownKeys(obj).forEach(key => {
      newObj[ key ] = obj[ key ]
    })
    return newObj
  }
  return '待完善'
}

// 深拷贝
function deepCopy (obj) {
  if (obj.__proto__ === Array.prototype) {
    // 是数组
    const newArray = []
    obj.forEach(ele => {
      if (typeof ele !== 'object' || ele === null) {
        // 是普通数据类型
        newArray.push(ele)
      } else {
        // 非普通数据类型
        const resEle = deepCopy(ele)
        newArray.push(resEle)
      }
    })
    return newArray
  } else if (obj.__proto__ === Object.prototype) {
    // 是对象
    const newObj = {}
    Reflect.ownKeys(obj).forEach(key => {
      const value = obj[ key ]
      if (typeof value !== 'object' || value === null) {
        newObj[ key ] = value
      } else {
        // 非普通数据类型
        const resValue = deepCopy(value)
        newObj[ key ] = resValue
      }
    })
    return newObj
  } else if (obj.__proto__ === Function.prototype) {
    // 是函数
    return obj
  } else {
    // 是set、map、date、promise
    return '待完善'
  }
}

 ```

## 原型
  原型包括了原型链，构造函数，原型对象，实例
  构造函数通过new操作符可以实例化一个对象
  构造函数通过prototype（显示原型）找到原型对象
  实例通过__proto__(隐式原型)找对原型对象
  原型对象中包含了构造函数和公共属性与方法，通过class声明的方法都会在原型对象中存储着。
  #### 实例
  通过构造函数创建的对象为实例
  #### 原型链
  若在访问实例属性时若自身没有该属性会通过__proto__来获取原型对象上的属性，若原型对象上还是没有，会继续通过__proto__看原型的原型对象上有无属性，直到__proto__为null，则会输出undefined，这个过程就是原型链。
  #### 原型
  原型在可以节约内存占用，将公共的方法、属性存放在原型对象上，所有该类型的实例都能访问到这些属性、方法，可以节约内存空间。在复用性可以实现继承，减少了代码冗余。
  #### 例子
  ```ts
    function A () { }
    const a = new A()
    // 实例通过隐式原型获取到原型对象
    console.log(a.__proto__ === A.prototype);
    // A实例通过隐式原型获取到函数的原型对象
    console.log(A.__proto__ === Function.prototype);
    // 函数的原型对象（一个对象实例）的原型就是对象的原型对象
    console.log(Function.prototype.__proto__ === Object.prototype);
    // 对象的原型对象的原型为null
    console.log(Object.prototype.__proto__ === null);
  ```


  ## 作用域

  作用域有：全局作用域、函数作用域、块级作用域
  全局作用域：无论在哪儿都能访问其声明的变量
  函数作用域：在函数执行时，才能访问其声明的变量
  块级作用域：在花括号内部，才能访问其声明的变量,var除外

**作用域链**：在当前作用域无法找到该变量时，会向父级作用域寻找变量，若父级作用域没有则向更层的祖先级作用域寻找该变量，直到全局作用域，整个过程就是作用域链，若还是没找到就会报错。

  ```ts
    // 全局作用域，所有作用域都能访问
    const num = 5
    function fun () {
      // 函数作用域，在函数执行时会创建
      const b = '123'
    }
    {
      // 块级作用域中的变量
      let greeting = 'Hello World!';
      var lang = 'English';
      console.log(greeting); // Prints 'Hello World!'
    }
    // 报错：Uncaught ReferenceError: b is not defined 因为b是只能在fun函数执行时在fun函数内部才能访问到
    console.log(b);
    // 变量 'English' 因为var声明的变量是全局变量
    console.log(lang);
    // 报错：Uncaught ReferenceError: greeting is not defined
    console.log(greeting);

  ```

  ## 同源策略


  ### 跨域解决方案
  #### cors

  #### 代理服务器

  #### JSONP
 jsonp就是通过浏览器加载脚本文件时，不会因为跨域而受到影响，通过下列操作即可完成一次jsonp技术解决请求跨域问题
 1.前端定义一个请求成功的函数，然后在特定时刻创建script标签，并指定请求路径src，将script标签添加到DOM中，浏览器会通过src自动发请求获取资源内容。
 2.后端接受到请求后，执行相关业务后，在响应内容时，返回一个js脚本字符串，字符串内容为：执行这个前端定义的这个回调
 3.当浏览器加载script标签完成后，就会去执行script标签，执行这个回调，这样就完成了一次jsonp请求技术了。
 为了帮助理解看下列案例：
##### LEVEL 1
  例如，前端请求跨域的脚本资源时，后端提供接口和文件，浏览器加载成功后会立即执行文件里面的代码
###### 前端：
  ```html
    <script>
      function fun () {
        console.log('你好，jsonp');
      }
    </script>
    
    <!--跨域脚本资源文件可以被浏览器加载和执行，但这种写死的方式不推荐-->
    <script src="http://127.0.0.1:8080/1.js"></script>
  ```
###### 后端:
  **服务代码**
  ```js
  // 提供api
  const server = require('http').createServer()
  const fs = require('fs')
  server.on('request', (req, res) => {
  if (req.url === '/1.js') {
      // 提供脚本文件实现jsonp
      const scriptString = fs.readFileSync('./1.js', 'utf-8')
      res.setHeader('Content-type', 'text/javascript')
      res.end(scriptString)
    } else {
      res.end('hello')
    }
  })

  server.listen(8080)
  ```
  **1.js静态资源**
  仅仅只是调用fun函数而已，注意，是因为前端定义了这个函数，当浏览器加载这个脚本文件后会立即执行该文件，所以就会执行fun函数
  ```js
    fun()
  ```
###### 结果
  浏览器成功加载跨域的脚本文件，调用定义的fun函数，并打印结果
  实际上运行就像就变成了这种
  ```html
    <script>
      function fun () {
        console.log('你好，jsonp');
      }
    </script>
    <script>

      // 加载脚本文件...，加载完成时立即执行里面的内容
      fun()

    </script>

  ```

#### LEVEL 2
  只要后端响应的是一个可以执行的js字符串代码，则只要后端返回一个js字符串就可以实现浏览器加载js文件了。
  注意:后端生成的js代码一定要注意函数名，一定要是和前端约定好的名称；调用函数时，可以将响应的结果传入作为参数。这样前端加载完成script文件后，会立即执行这个函数，函数的参数就是后端响应回来的真正结果了。
##### 前端
```html
  <script>
    function fun(data) {
      console.log(data);
    }
  </script>
  
  <!--跨域脚本资源文件可以被浏览器加载和执行，但这种写死的方式不推荐-->
  <script src="http://127.0.0.1:8080/api-jsonp"></script>

```
##### 后端
```js
// 提供api
const server = require('http').createServer()
server.on('request', (req, res) => {
 if (req.url === '/api-jsonp') {
    // 模拟业务层真实数据
    const data = JSON.stringify({
      msg: 'ok',
      code: 200,
      data: [
        {
          name: 'Mark',
          age: 18
        }
      ]
    })
    // 拼接js代码,假如约定好，前端在成功后需要调用fun这个函数，并将响应的内容注入进去
    const javascriptString = `fun(${ data })`
    res.end(javascriptString)
  }else{
    res.end('404')
  }
})

server.listen(8080)

```

##### 结果

浏览器请求脚本文件----后端完成业务逻辑---后端拼接js代码响应成功---浏览器加载成功加载js文件---执行下列代码：
```
fun({"msg":"ok","code":200,"data":[{"name":"Mark","age":18}]})
```

#### LEVEL 3 
  既然使用js加载资源文件无跨域影响，则我们可以通过动态生成js标签去加载资源，加载后则会执行js代码。
  ```html
  <script>

    function fun (data) {
      console.log(data);
    }

    JSONP('http://127.0.0.1:8080/api-jsonp')

    function JSONP (url) {
      const scriptTag = document.createElement('script')
      scriptTag.src = url
      document.body.appendChild(scriptTag)
      scriptTag.onload = () => {
        scriptTag.remove()
      }
    }
  </script>

  ```

## 元素在视口的可见性

### offset组合
这种方式只适用于元素没有被定位的情况下,都是通过元素或视口在文档的位置来判断是否进入视口了
Y轴:offsetTop+html.scrollTop+window.innerHeight
X轴:offsetLeft+html.scrollLeft+window.innerWidth
#### Y轴
y轴底部可见性
offsetTop<=window.innerHeight+html.scrollTop 若元素距离文档顶部<=文档卷上去+视口高度
y轴顶部可见性
offsetTop+clientHeight>=html.scrollTop 若元素距离文档顶部+自身高度>=文档卷上去的高度
两者同时成立，说明y轴可见
#### X轴
x轴右侧可见性
offsetLeft<=window.innerWidth+html.scrollLeft 若元素距离文档左侧<=视口宽度+文档卷过去的距离
x轴左侧可见性
offsetLeft+clientWidth>=html.scrollLeft 若元素距离文档左侧+自身宽度>=文档卷过去的距离
同时成立，说明可见
### getBoundingClientRect
通过getBoundingClientRect可以获取元素基于视口左上角的坐标等相关信息。
这种方式需要通过事件监听+getBoundingClientRect，性能消耗要大一些（getBoundingClientRect会导致页面重排？），但兼容性好
y/top：元素左上角距离视口顶部的距离
x/left：元素左上角距离视口最左侧的距离
bottom:元素底部距离视口顶部的距离
right：元素最右侧距离视口最左侧的距离
width、height：元素内容区
```ts
import { ref } from 'vue'

export default function (ele: HTMLElement, cb: Function) {
  const isInner = ref(false)

  /**
  * y轴上边完全不可见，通过bottom<=0
  * y轴底部完全不可见，通过top===window.innerHeight
  */
  /**
   * x轴左边完全不可见,right<=0
   * x轴右边完全不可见left>=window.innerWidth
   */

  const onHandleScroll = () => {
    const data = ele.getBoundingClientRect()
    // y
    if (data.bottom <= 0 || data.top >= window.innerHeight) {
      // 顶部完全不可见 和 底部不可见
      isInner.value = false
      cb(isInner.value)
      return
    }
    // x
    if (data.left >= window.innerWidth || data.right <= 0) {
      // 右侧完全不可见 和 左侧不可见
      isInner.value = false
      cb(isInner.value)
      return
    }
    isInner.value = true
    cb(isInner.value)
  }

  const start = () => {
    onHandleScroll()
    window.addEventListener('scroll', onHandleScroll)
    window.addEventListener('resize', onHandleScroll)

  }
  const stop = () => {
    window.removeEventListener('scroll', onHandleScroll)
    window.removeEventListener('resize', onHandleScroll)
  }
  start()
  return {
    start,
    stop,
    isInner
  }
}

```

### IntersectionObserver
  通过判断目标元素与容器(元素与容器在面积上是否产生交集，容器可以是窗口也可以是元素)是否产生交集，来确定元素是否显示在窗口中，当产生了交集，说明出现在窗口中了。
  API详解：https://www.cnblogs.com/ziyunfei/p/5558712.html https://juejin.cn/post/7146441070828584968
  这种方式性能消耗最小，但兼容性不好。

#### 基本使用
  IntersectionObserver，传递一个回调函数，回调函数会在目标元素与容器发生交集时会触发（回调的触发是异步的）
  ```js
  const observer = new IntersectionObserver(cb,[option])
  ```
  构造函数的第一个参数是一个回调，回调可以接受两个参数，一个是entries记录了目标元素们与容器之间交集的信息，第二个是observer实例，entries中的每一项是一个对象，**entry.isIntersecting**记录了两个元素是否产生了交集。
  构造函数的第二个参数是一个配置对象，有这些属性：
  ``root`` --- 指定**容器**。用于检查目标的可见性。默认为浏览器视口。如果指定为 null，也为浏览器视口。在指定root时，必须是目标元素的父级元素。
  ``rootMargin`` --- **容器**的扩缩边距。其传值形式与 CSS 中 margin 一样，用于控制容器每一边的扩缩(单位为 px 或%)，从而控制计算**容器**和目标元素的交集的区域范围，默认值为 0，这个属性可以让**容器**在判断交集时范围变大，这样就能提前与目标元素产生交集（**例如距离多少像素就触发回调**）
  ``threshold`` --- 阈值，回调函数触发的条件。取值范围为 0.0-1.0，默认值为 0.0。当传入数值类型时，只会触发一次。当传入数组类型时，可触发多次。如：[0,0.25,0.5,0.75,1]表示目标元素在跟元素的可见程度每多 25% 就执行一次回调。

```vue
<template>
  <div class="container">
    <div class="item" ref="itemDOM">你好</div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted } from 'vue'
const itemDOM = ref()
onMounted(() => {
  const target = itemDOM.value as HTMLDivElement
  const observer = new IntersectionObserver((entries) => {
    for (let entry of entries) {
      console.log(entry.time) // 发生变化的时间
      console.log(entry.rootBounds) // 根元素的矩形区域的信息
      console.log(entry.boundingClientRect) // 目标元素的矩形区域的信息
      console.log(entry.isIntersecting) // 目标元素与视口（或根元素）是否相交
      console.log(entry.intersectionRect) // 目标元素与视口（或根元素）的交叉区域的信息
      console.log(entry.intersectionRatio) // 目标元素与视口（或根元素）的相交比例
      console.log(entry.target) // 被观察的目标元素
    }
  })
  observer.observe(target)
})
</script>

```

### 综合对比

  渲染100个元素，进入或离开视口时改变样式，性能上intersectionObsever好过getBoundingClientRect，主要是后者会绑定太多事件回调了，还有就是会一直重排render
#### 结果
  <img src="data:image/png;base64,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f3//DIJNjdmCJMns7OyUr3oYY4/HMzb8VfU6VTTYt29fX19faWlpJBLhOE71OuPW7KrzIEmSoqhLvn0ZIAQYfnT7HRMVFg0NDQAwGAzBYDASiUSjUUmSRgvfCKac2E0TDRJoosGcQpbllpZ0o7cjFw0IgkQEghNn/KCGxhxh2rkJNNEggSYafA6YsWiACIQQARP0N9XQ0JiIpJ7TaXQoSCDL8hH2fsEYH/lcpbM12+l0fZ6K2j13VgzQOF4oinLgwIEZ7KgOSdV8jobGdKHUhvmQy8EAAOn7Hg2NkxYEGA1L0marPTevwD+rKatnGYRg7ofgJ4SRc5+5dBv1BkM8HvMPjkqCMo0+bBoaGgkQBgKBAggA5leW//KXv1xYs+R4GzUhaiKG423FFBgMhtmdbGLWEUUhFArPcQndbrf19vYdbyuG2LRxw6uvvrp69erkhcQ4Yxo0p6OhMSVIbZ5ppUVDY3qk9mFDgFRPPtdFg7kURY7DHDcP5ryFc9I8NcGowWhUlNn5oKihcRIyOvtnUoeCOS4azPFgfE4FueNisZj7++eu5DIHb6DqcgiCeO/dd15//fWhRbPkGpcvX3brLTezLPPhhx/98bnnL7vskq9+5SttbW2PPf6k0WB45JGHBEH89bO/+eSTT6++6srzzz/v0KGmO++6e1ZOPTnV1VXf+fa3n/75M319fd+67NJLLrmorq7+kUces9lt9917j8Nhf/nlP7/51tvf+fa3LrjgawcaDv7sZz+nSPLhhx/Iysp67rk/rX33vaNtIUmS1113TSwa/dMLL5WWlj780AOCwLe0tD762BNLliy65uqrfD7fww8/Go/HH3/8UavV8pe//u211/715fPOveaaq7q6um+48eajbaHbnf3E44+JoqDekAULqu+5+65wOPzEkz9ta2v70V13Ll68aN269X987vnFixbddNMNkiQ98eRPDhxoeOD+excvXvTBB+t+89v/PtpG3nzTjatWndnd3X39DTdnZmY8+siP7XZbf3//ww8/anfY77v3nlgs9rOfPd3c3HLHHT+srq5a99H63/zmv6urqu677+5YLPbgQz9ubR0n44zKGbde1fzms9uHp6AZmYyEQMT4e2hoaEzAJJNRTYt58yo/+eTTb1506bO/+e2SxYvO//KXb/vh7Saz6bxzv/Szn/3kzbfe+etf/379dddedtmlF1zw9Qcf/HFWVtbFF39zVk49CeecverOO37ocmUxDFNWVvbFL51zyaXfBgRf+9pXv/udb+/es/ueex+48MJvZGdnf+ELZ3z38h8AhrPPXnXDjdfv2bPvkUcev/jii8bN+T27PP2zn37xnHOyslwAUFRU6PX6Lv/eFT+8/U67zfaju+78yU+fam5pufbaa6655qq2tsM/fern11177XnnnXvllVc8+ujjnZ1dDz5w39G2MD8v9SALxwAAIABJREFU74knf/r9H1z13e9+22q13nbrLQ8+9OONmzZdcvFFX//a1wwGw6WXfWdhzYLKyorbbrvl6aef2bJl2yUXX3z99ddaLJZ77rl/xYrlC5Jm+jgaWMzmwcHBb1x48b59+3/xzM+dTqfdbr/u+puuuvq6YCh4/XXXvvDiS6+uXn3nnXd84cwvmM2W62+4eVFNzfLly6659urf/e4P//73mz+87dZJjv/R2i77hVflDf8clf1TQ0MjTWa3043JaFp6ylK3O/uFF19aWFOzb9/e9vaOt95864tf+pLeYNy6ZWtvb+9FF124YvnyTz/9dN/+/WvffbeiooJh/h2LxU4/bWVFRUW2O7u5qRkAKiorXlv9z3379998041mi/nj9Rv++a9/zcyqd997/9333n/hT88BQNX8yv37auPx+KZNm08/7XSGoV9d/drAQH84HP7e977b0HAwFot9/PHHixcvLijIf+ONfx9oaAgEAzk5OeqI6Suv+IHFYnE6nVu3bq1ZVOPx9D/33PN5ebmXXnoJQRAvvPDSzPqvA8Cdd9192aWXFBcXA4BOFMvKSn/88IOv/fNfOlF3+PDhHTt2iYJ41113+v3+X/ziv2rr6vr7+5cvW9bU1LRz126rzXrD9depwklBfv6qVWdlubJ8Xl9zc8tpp6/8eP2Gd9as+d7l3y0tK92/r/ZPL7wwMwvXf7wBAERRCASC8yorwuGIx9P/3nsf3nH7bXa7Y8OGDfF4fP++/RdffFEwGGxta1u9evW9995dWlqi3sZdu3cXFRXu3LULAL512aV2uz07O3v37t1Zriyr1frCCy/5/f4brr9Op9e9tvqfGz75ZAYW9g8M/L8//wUAZAX393tYlrXZbHfffdf69et37NiFEFq79t2S4uLrrr121aqz1n/0cX9/f11d/bJTTyUQ2rpte1ZW1gXf+LrD4ejp6WEY5vLvfsfpdFIUtWfP3qET1B3oXXW2cTHAJwBqrINg1HRYR9UDMQzzkycf/+drrzxw/72CINis1md//ctXX/nbF885++iddLrk5eW9+MLz1dVVAPDA/ff+87VXbrn5puNt1AhZWVm//c2v//H3v3z1K+cn7ue3v3XZ8bZriIry8pf/76W//+0vCxdWA8Btt97yz9deefSRh4+vVZmZGc/98fenrVwJACuWL//Ln1/+v/99qaSkGObGI376589cdNElzc0tP7rrzgynMxKNAUAoFOI5DjCWJCkQDAKAIPChUBgAIpEIx3JqXozCwsIrr/zB5k2bv//9ywVR2L59xzXXXH3+l8+rrCy/5577ZuxyUmBZNh6PAYAUl0RRoGlaURRZVhRF0et06si5YDDIsixN0+pPRVZMRqO6+1lnnWm2mD744INrr7368cefdGVlnrZyxTcvvHDdh+vuuee+GbucFP7+j1fOWnXOBx+u+/nTT5WVlUajMQAIhyM0TVMUFYvFotGoLMuCwMdicQCIx+MURavz/llt1iuu+P6+ffvKy8u+/vWvrH71tRtvvP7001aeccbp9933wIxdjgrLsj+66876+gMIIYwVRVGwotA0LYpCXJIAIBaL6URRlmVFlr0+H0mSgsCr9sdiMZ1Opx5n0aKa5cuXvfvuuzfeeP2mTZt9Xt83Lvj6ZZdeEgoF77rr7pm5nASFhYVLlyx+5ZXVmzd/dtrpX/jTn164+aYbTz1lqfqlPxaPEQTBc1wsFpNlORqN8DyvJj9UFBkB0ut0AEBR5IUXXtDd0+33+6+88vvqkc+49excgTW4hk5EpMzAeLSDHoTQxx9v+OZFl1pttrPOPFMNxh999BgF4+lAEMR5536ppmahXq+/6qorzeahIFd1QnOBH952y3vvvX/Jpd/+93/evOmmG/z+wI9+dO+5537JnZ19vE0DALjzztv/9a833n33/e9dfvn3v3f5woUL77//waqqqlVnnXm8TOJ5/uGHHszPzzebzYIgJOsY1113zTHTMabkww/XKYoSi8UEXgAAvd4QCAYRQgzDmE0mAOT3+w0GPQAIghgKBRODlD/+eMPmzZ/19Xl27tw1MDAQj8d279mzcdPmhx964IzTT58V20KhiFo7Mwzj8/mj0RhBkBRJEgTZPzDAMAxCYDQaw+FwNBqlaRohRFJkT2+vunsgEHj99X97PP07d+2Ox+MDg4OKgtesXXvmmV+48cbrc9zuWTFSZc+evYODXpZl1SpFpxOj0Wg8Hud5ThAEmqb9fj/PczDsShNpkHbv3vPmm297PP1r330vGApGIpHOzq531qx96qdPfvWrX5mxPRaL5Z67f7Rn795fP/sbn89PECRJkgRJxGIxr9enzunFcdyg10tRFElRdptNkiS/3y8I/NCqpCnH1q5999ChppaW1vb29t6+XlmWP/jwQ5KifnTXHdVVM6+jzl616pqrr3zk0ccODGdP7uzsamlptdltCBEAwLGcLMvBYJDnOYqiBEEIBAKq+yBJCgPuH+6a39Z2+G9/+4fH4/lo/dAEnh89+/u3H3ny49eHzoV+9dtfDQ0OxVgdoq8oykP3P/Stb33rqPYmeOqnT77yyqu33HLzf/3q13V19U899eQf/vB8cjDucDq2bd02UTB+9HoTZGdn33brzcXFxc/84pff/97la9e++8qrq++7754DBxpWr34NUoNcl9VqGRvkHr2P4ZmZmf/1y2e6uroCweCLL/7P44898sKLL33wwYdPPPHomjXvqfO0XvGD75tMJle2a9vW7SWlJQjB88+/wLLslVf+QBCEl1/+844dO45eb4L/eelP//zn6waDIb8gX+D55ubmP/zx+VtvvVmKS3/443OKopx//pfzcnOz3dl1tXXqZi+//OfDhw/feOP1RqNxzTtr16xdezRu4P97+X/+8Y/VgaD/8u9+98677uZY9t577zabzW+88W/1ETccaHg19RHvyXJlJnSM66+7RhDFJYsXvf7667xOJBDCgG+58Wa1sCxefKSFhSQJjuNkWSYIIhQKq7PSURSpVos8z8uyghAKhUIcxwJAJBIFAHWzcDis04nhcAQhxDC0OqxEr9dLUjwcjhzJeB11kApNU0/29y/0eL5cXEySJEIoEolijAWBlySZJFWDGYQIkiQjkYgaUqiRGQCo0xchBAzDhkIhnudlWYrF4izL8jwXCAQlSZpxoWYYmiTJcHgoXT1BIFEUY7E4TVOBQJCmaZZlACASiciyotOJ8bhEkmQwOLQqEAgCAEmSHMcFg0H1ilT7g8GgomCdToexEgyGBEFQp52dlnkEQXAcq94K9RGHQmGEEMexGGNZVmKxmBo3UBQZDIZIkmAYFgBkWY5GozzPxeOSGj4K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GqCjJhINUCzLYsCIQ5jEGGMEQKLQ9J2oChq0t7cFggbl5eWlXx+XSqXREzSYOXNW90GD7BFvvPFGD0dB5NcHwzAcx/XUwbqlS+Ndg8HA35TXfvklv6WqqgoAXnzxxW73sGXLlkjUaGtr+2HrVgDYu3cvABjq6nbs2AEAK1eulEqljzz66Buvvx5o9VtVVXXgwP76+noAWPPZmubmZn671+v97ttvAWDHjh38x3ma/BeswWD46KOPAODdd98NUeC1V18N/jnBKm3atAkASkvPKBlcWloa2PLFF1+YTB0AsH379u3bt/Mb161dy0cRRH6rUBSHaZphMQsERUgohAmC7CabIJqCBppA0ECn09199x+bW5qjJ2gwcdLEr776KvBnIGhgNBrFoMFvCZqlAXV5QIsmvF7vG6+/5nR2NhL1eDynT5/mXzc0NAyNWkKEtEwV+e3hyyYA//98/3WBDxpYzGdUOQ0OGhwuKgKAsrKykydPLly4MBA0kFAUTdMY45CgQZiuut0GDb7++ms+aOB2u2fNmoUx5v2VlJSUadPO+fCDDwBg5KiRn6/5nN9JcNBg4qRJBX/9q8PhWP3JJ12DBjqdjg8aeDwejUZTXFx82+23F4wp+OD999PT0/kgW9eggV6vDw4aBHKZKisq+KDBBRdcMGPmTI/bvXz58kWLFx88WNjHQyUSVahUasxynNipU0Skl6AL5l3E0DQGTBAERUlkMplMLtu0ZWPszCcl1Z8I72BwkUqlD//54bfefIsPGlAUpVKp9Hp9fX09wzCpqanNzc2RdA4eZNLT091uV2vrr6B9AADEx8f9KlQdUD2lEoFOB1dds5CmaZfD/uaKV2JnPpkt8T1RnWp05KRES9cDhULudnsiL2HZZvVUNTkLMtRuL1fV7ASASTm6kS7baZU2uEVPUaV58shhfVdPp9VYrLbwMgfKO590z8nVh5HsXwKmK621FgzXDtr3Rkgkphs4jtda5VLCbGemjPx/9s48vqri/P/PzJzl7jf7npCEEJKACCibrILigoq4ILTuBZWiv1pt69curvVbbau1X23VtmqttaitS9UARXApoAhI2ELYspHckH25+9lmfn+c5BLICgQSYN6viPfOneWZOXfunOdzZon69mBrGi47rpMOMKPtU6fbZ02zbudODxVUVX3m6WciOjUAKEq4oqLCVM88Hs8Q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">

#### 代码
  ```vue
<template>
  <div class="container">
    <div class="item" ref="itemDOM" v-for="item in list" :class="{'active':item}">你好</div>
  </div>
</template>

<script lang='ts' setup>
import { ref, onMounted,reactive } from 'vue'
// Intercetion
import useEleInWindowPro from './hooks/useEleInWindowPro'
// getBoundingClientRect
import useEleInnerWindow from './hooks/useEleInWindow';
const itemDOM = ref()
const list = reactive(Array.from({ length: 10000 }).fill(false))

onMounted(() => {
  const domList = itemDOM.value as HTMLElement[]
  console.log(domList);
  domList.forEach((ele,index) => {
    useEleInWindowPro(ele, (v:boolean) => {
      if (v) {
        list[index]=true
      } else {
        list[index]=false
      }
    })
  })
})

</script>

<style scoped lang='scss'>
.container {
  height: 500vh;

  .item {
    height: 100px;
    background-color: red;
    transition: .3s;
    margin-bottom: 10px;

    &.active {
      background-color: yellow;
    }
  }
}
</style>
  ```


## typeof instanceof

### typeof 
  typeof可以输出数据的类型，基本数据类型除了null以外都是可以正确识别其类型，null比较特殊，会输出object。对于引用数据类型除了函数以外输出function，其余都是输出object
  ```ts
    console.log(typeof true) //boolean
    console.log(typeof 1) // number
    console.log(typeof 'ok') // string
    console.log(typeof null) // object
    console.log(typeof 121n) // bigint
    console.log(typeof Symbol('hello')); // symbol
    console.log(typeof undefined); // undefined
    console.log(typeof console.log); // function
    console.log(typeof []); // object
    console.log(typeof {}); // object
  ```

### instanceof
  instanceof的语法为 `ins intanceof A`,构造函数的prototype属性是否存在实例的原型链上，可以检测一个实例是否继承与某个类

## 类型转换机制
  有显示转换和隐式转换两种方式
### 显示转换
  其实就是强制类型转换，一般有Number、parseInt（parseFloat）、String、Boolean等等
#### Number
Number对于基本数据类型的转换严格，对于引用类型的数据会调用Symbol.toPrimitive方法再调用toNumber,不过通常都是NaN。
``` js
    console.log(Number(true)) // 1
    console.log(Number(false)) // 0
    console.log(Number('asdasd')) // not a number
    console.log(Number('132')) // 132
    console.log(Number('13s2')) // nan
    console.log(Number('')) // 0
    console.log(Number(undefined)) // nan
    console.log(Number(null)) // nan
    console.log(Number({})) // 0
    console.log(Number(Symbol('hello'))) // 报错
    // ...
```
#### parseInt parseFloat
  和number差不多，不过对于字符串转换来说他是逐个解析，若碰到无法解析的就停止解析返回当前解析的结果，为第一个就不是数字就返回NaN

#### String
  将数据强制转换成字符型，基本上都是原样输出
  ```js
    console.log(String(true)) // true
    console.log(String(false)) // false
    console.log(String(1n)); // 1，bigInt会被忽略n
    console.log(String(100)); // 100
    console.log(String(1.55)); // 1.5
    console.log(String(undefined)) // 'undefined'
    console.log(String(null)) // 'null'
    console.log(String({})) // [obeject Type]
    console.log(String(Symbol('hello'))) // Symbol(hello)
  ```

#### Boolean
  将数据强制转换成布尔型，数字非0true，0false，字符串空串false，其余true，引用数据都是true，因为是那变量保存的地址值在转换
  ```js
    console.log(Boolean('123')) // true
    console.log(Boolean('')) // false
    console.log(Boolean(0)); // false
    console.log(Boolean(1.55)); // true
    console.log(Boolean(undefined)) // false
    console.log(Boolean(null)) // false
    console.log(Boolean({})) // true
    console.log(Boolean(Symbol('hello'))) // true
  ```
### 隐式转换
  隐式转换会出现在算术运算、逻辑运算、比较运算上。
#### 布尔型
  在需要布尔值的地方，系统会自动调用Boolean函数来，获得判断结果。**例如if、循环条件语句、三目运算符**
#### 数值型
  在双目的算术运算中，遇到非数字类型的数据会自动将其转换成数字型，（字符串加法除外），若遇到无法转换的，则结果就为NaN
#### 字符串
  只要是字符串与任意数据作加法运算，其结果都为字符串的拼接。

## var const let
  这三个都是声明变量的关键字。
### var
  1.若var在全局作用域下声明的变量，则变量声明在window上
  2.若var在函数作用域下声明的变量，则变量声明在该作用域中
  3.若var在全局作用域下中的块级作用域声明的变量，则变量声明在window上
  4.var变量不会收到块级约束的影响
  例1：
  ```ts
    // var 在全局作用域下声明的变量是在全局中声明的
    function fun () {
      var b = 9
    }
    fun()
    console.log(b);// error b is not defined
  ```
  例2：
  ```ts

    function fun(){
      {
        var b='9'
      }
      console.log(window.b); // undefined
      console.log(b); // 9??? var变量不会收到块级约束的影响
    }
    fun()
  ```
例3:

```js
function outer() {
  var a = 5
  function inner() {
    // 为啥是undefined，因为var声明的变量会被提示到作用域顶部
    // 由于a已经声明了，所以不会通过作用域链访问外层的a
    console.log(a) // undefined
    var a = 10
    console.log(a) // 10
  }
  return inner
}
outer()()
// 上面的outerr等同于下面的效果
function outer01() {
  var a = 5
  function inner01() {
    var a
    console.log(a)
    a = 10
    console.log(a)
  }
}

```



### const

  声明一个常量，初始化时必须声明其值，且值不允许被修改。
### let
  声明一个变量。变量只会在当前作用域中生效。

### 区别
**提升**

var声明的变量可以在声明前访问，不过都是undefined
**作用域**

var不存在块级作用域
**重复声明**

var允许同作用域重复声明，let、const不允许在同一作用域下重复声明

**暂时性死区**：

​	var变量可以在未被初始化时访问，let、const只有在变量声明后才能使用

**赋值：**

​	const初始化后就不能被重新赋值了

## 强弱类型、静态动态类型
### 强类型
  1.不允许隐式转换
  2.函数调用时实参列表必须保持和形参列表一致
### 弱类型
  1.允许隐式转换
  2.函数调用时实参列表可以随意传

### 静态语言
  变量创建时声明其类型，并且类型不允许随意修改，变量的类型在编译时确定的。

### 动态语言
  变量在程序运行时，类型可以被随意修改，变量的类型是在运行时确定的。

## 模块化
帖子:https://juejin.cn/post/7166046272300777508
### AMD
  异步加载模块，模块加载完成后再执行后续操作
### CMD
  同步加载模块，需要时才会通过require来获取导出模块。导出会输出一个对象，后续导入该模块都返回该对象，除非清空缓存，模块内部的操作不会影响导出的这个对象。

​	CMD模块化，是运行时加载的，每次执行`require`都会执行整个模块，并获得导出数据的拷贝。

### ESModule
  异步加载模块，有一个独立的模块依赖的解析阶段。并且是**编译时输出接口**，导出的是一个引用，所以通过引用修改导出的内容时，所有使用该模块的都会受到影响（浅拷贝）

​	ES模块化是编译时加载的，每次导入会得到只读的引用数据。

### CMD和ESModule的区别

1. 静态与动态：CMD是运行时才确定模块间的依赖关系，ESModule是编译时确定模块间的依赖关系。（**动态**是指对于模块的依赖关系建立在代码执行阶段；**静态**是指对于模块的依赖关系建立在代码编译阶段）

2. 引用与拷贝：CMD导入的值都是一份拷贝，ESModule导入的值是一份引用。

3. 异步与同步：CMD是调用require函数才获取模块数据，ESModule是编译时就已经加载好模块数据了。

4. 导入导出方式不一致

## requestAnimationFrame
  requestAnimationFrame可以通过JS控制动画，通过回调里面的操作来通知浏览器以该操作来重绘页面。
  在反复调用该方法时，则会每帧执行一次回调函数，但帧这个东西时根据屏幕刷新率来定的，虽说在各种显示屏下触发的间隔可能不同，但是在同一屏幕刷新率下每次执行的间隔时间都是相同的。
  定时器就不同了，可能会因为事件循环而产生时间间隔的误差（因为是红任务，红任务会在消息队列中排队到主线程处理，若到时间了但前面有任务没执行，就会产生误差），但`requestAnimationFrame`是异步任务，在反复执行时回调触发的间隔时间都是相同的。
  基本用法:`requestAnimationFrame(callback)`,回调函数可以接受一个参数，这个参数代表了从页面加载完毕到执行该回调的时间，一般用来计算动画开始时间与动画执行的时间。

  ### 案例1
  ```js
    const keyframesFun = () => {
      let start
      return function fun (timestamp) {
        // timestamp为程序开始，到执行回调函数的时间
        if (start === undefined) {
          // 获取开始时间
          start = timestamp
        }
        // 计算当前执行了多少秒了
        const nowTime = timestamp - start
        if (nowTime > 3000) {
          // 3秒后不执行动画
          return
        }
        // 通过移动了多少毫秒来设置每帧移动的偏移量
        // 公式：
        // 0.1 * nowTime，多少秒移动多少偏移量，nowTime为当前动画执行的时间
        // Math.min(0.x * nowTime,最大移动的偏移量)，可以加大倍率，直到符合预期
        box3.style.transform = `translateX(${ Math.min(0.2 * nowTime,500) }px)`
        window.requestAnimationFrame(fun)
      }
    }

    const onHandleClick = () => {
      window.requestAnimationFrame(keyframesFun())
    }

  ```
### 案例2：测试屏幕帧数
  // 帧数为
  1秒可以显示多少张图片就多少帧
  公式：1000/重绘时间间隔（ms）=多少张图片
  多少时间间隔（timestamp - lasttime）可以显示一张图片
```js
    function fun01 () {
      let lasttime = null
      return function fun (timestamp) {
        if (lasttime !== null) {
          console.log(Math.floor(timestamp - lasttime));
        }
        lasttime = timestamp
        window.requestAnimationFrame(fun)
      }
    }
    window.requestAnimationFrame(fun01())
```

### 异步任务
  结果：script--animation
```html
  <script>
    requestAnimationFrame(()=>{
      console.log('animation');
    })
    console.log('script');
  </script>
```

## 异步同步

​	同步：同步任务是只要发布了该任务，立马去执行。

​	异步：异步任务是**指无法立即去执行的任务**，要满足一定条件才回去执行，例如网络请求完成后执行的操作，元素的事件监听处理函数，计时器、延时器...

为什么会有异步？因为让浏览器主线程遇到这些异步操作时一直等待他们完成再执行后续操作，就会导致后续代码被阻塞，浏览器卡死（**因为浏览器渲染主线程要渲染页面、执行JS**），有了异步，浏览器渲染主线程才不会被阻塞。

### JS会阻塞渲染

​	为什么？因为JS和渲染是在一个进程中处理的（**必须等待上一个任务完成才能执行下一个任务**）。在执行回调时由于JS代码执行的是同步的，需要等待回调执行完成才能执行渲染任务（重排重绘）

```html
    <button>哈哈</button>
    <script>
      const button = document.querySelector('button')
      function delay(delay) {
        const currentTime = Date.now()
        for (; Date.now() - currentTime < delay; ) {}
      }
      button.addEventListener('click',()=>{
        button.innerText='ha ha'
        delay(3000)
      })
    </script>
```

## 执行上下文

在代码执行时会生成执行上下文，执行上下文中包含了：**定义的变量**、**this**、**作用域链**等。

执行上下文分为：

全局执行上下文：当前运行的网页中只存在一个全局执行上下文，根据寄生环境不同this执行不同。

函数执行上下文：在函数执行时会生成的执行上下文

### 执行上下文栈

js通过执行上下文栈来管理所有的执行上下文，在程序一个开始时就会有一个全局执行上下文被压入到栈中，每次函数执行就会生成一个新的执行上下文被压入栈中，当函数执行完成时就会被弹出栈。

### 创建执行上下文

在执行某个函数或程序时，需要先解析代码，解析的时候会根据不同的位置创建不同的上下文（全局、函数），将变量赋值为undefined，将函数声明了，才正式执行程序。

上下文类型决定了创建了不同的数据：

- 全局上下文：变量定义，函数声明
- 函数上下文：变量定义，函数声明，`this`，`arguments`

### this

​	this是执行上下文中的一个对象，this带至调用该函数的对象。根据调用者的不同其this指向也不同。若是对象调用方法的则this就指向最后调用该方法的这个对象，是全局执行的该函数，则this指向全局window。

## 异步函数

​	通过async来声明一个异步函数，异步函数执行完成时返回一个Promise成功的Promise对象

## 箭头函数与类字段语法

我们都知道箭头函数是没有this的，他的this是通过作用域链找到祖先作用域中的this来确定的。箭头函数的this是定义时就已经确定了，不会因为执行的对象不同而导致this的不同。

### 类字段语法

这种方式是类字段语法，类的属性可以直接在类的定义中声明和初始化，而不需要在构造函数中进行赋值，这种方式声明的属性会将其添加到实例上。

其实就是一种语法糖，相当于类字段语法运行在构造函数中的。

并且在这里声明的箭头函数在调用时会继承外部作用域（class）而让`this`执行实例，调用该箭头函数时，它的 `this` 值将绑定到类的实例上，而不是调用位置的上下文。

```js
class Obj {
  a = 'b'
  ok = () => {
    console.log(this);
  }
}

const obj = new Obj()

const ok = obj.ok

ok() // {a:'b',ok:[Function]}

```

### Object

为什么这种声明的方式不能让this指向obj呢？因为此箭头函数是在全局作用域中定义的。

```js

const obj = { ok: () => console.log(this) }

const ok = obj.ok

ok()

```

## 计时器和for循环

### let版本

说说下列结果

```js
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i)
  })
}
```

0 1 2 3 4

为什么？
因为每次循环时都会产生一个块级作用域并声明当前`i`的值，`setTimeout`中的回调在调用时通过作用域链访问到块级作用域中声明的i。
简单来说就是每次循环都缓存了i（在块级作用域里面声明了当前循环时的i），在回调调用时通过闭包读取到缓存值。

相当于

```js
{
	let i=0;
     setTimeout(() => {
    console.log(i)
  })
}
{
	let i=1;
     setTimeout(() => {
    console.log(i)
  })
}
{
	let i=2;
     setTimeout(() => {
    console.log(i)
  })
}
....
```



### var版本

说说下列结果

```js
for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i)
  })
}
```

5 5 5 5 5

为什么？

因为var声明的变量没有块级作用域，这种方式相当于把var声明在当前作用域中，每次循环产生的块级作用域对于var来说没有作用，当主线程同步任务的for循环完成时var声明的i已经是5了，下一个宏任务就按照注册顺序打印i了。

## Web Woker

​	`web worker`是浏览器独有的API，可以为`javascript`创建多个线程。只允许主线程创建`Web Worker`，可以让`Web Worker`执行一些后台任务。可以通过`Web Worker`创建子线程执行一些操作，例如耗费大量时间的同步操作（但不会阻塞主线程运行）、发送网络请求....有了`Web Worker`可以避免同步操作阻塞主线程渲染的问题。

​	由于创建了多个线程，为了不影响主线程，所以`Web Worker`有以下限制：

（1）**同源限制**

​	分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。

（2）**DOM 限制**

​	Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用`document`、`window`、`parent`这些对象。但是，Worker 线程可以`navigator`对象和`location`对象。

（3）**通信联系**

​	**Worker 线程**和**主线程**不在同一个上下文环境，它们不能直接通信，必须通过消息完成主线程和子线程的通信。

（4）**脚本限制**

​	Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。

（5）**文件限制**

​	Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络。



### 1.主线程

​	主线程通过`new Worker`来创建一个子线程，`Worker`构造函数必须是HTTP协议，必须加载网络脚本资源。返回一个worker实例，可以和对应子线程通信。

```js
new Worker('/index.js')  // 发送请求加载外部脚本资源，并将该资源放在子线程中执行
```

​	**通信**：

1.主线程通过`worker.postMessage`向对应的子线程发送消息

2.主线程通过`worker`的`message`监听子线程发送的消息

3.主线程通过`worker.terminate`结束子线程。

```js
      const wb = new Worker('index.js')
      // 接受子线程消息
      wb.onmessage = (data) => {
        console.log('接受子线程消息:' + data.data)
        console.log(window.a);
      }
      setTimeout(() => {
        // 向对应子线程发送消息
        wb.postMessage('hello~')
      }, 1000)
```

### 2.子线程

​	子线程里失去了很多API，不过浏览器也为子线程提供了内置API。在子线程中是不能操作DOM，并且子线程和主线程的执行上下文是不同的，所以不能共享声明的变量、函数等。

​	**通信**:

1.子线程通过`this.postMessage`与发送消息给主线程

2.子线程通过`this.addEventListen("message")`来监听主线程发送的消息。

3.子线程通过`this.close`关闭线程，释放内存

```js
this.addEventListener('message', (data) => {
  console.log('接受到主线程消息:' + data.data)
})

this.postMessage('子线程消息~~')

```

### 3.使用Web Worker的示例

​	同步计算复杂数据时，会阻塞浏览器渲染线程，从而导致页面**卡死**。若我们使用`Web Worker`就不会产生这样的后果。

​	1.不使用Web Worker（Sync）

```html
  <button>执行一段长时间阻塞主线程的代码</button>
    <input />
    <script>
      const btn = document.querySelector('button')

      function fun(time) {
        const now = Date.now()
        while (Date.now() - now <= time) {}
      }

      btn.onclick = () => {
        // 渲染进程卡死
        fun(2000)
      }
    </script>	
```

​	2.使用Web Worker

​	主线程代码：

```js
   function webworker() {
       // 执行复杂的同步任务
        const worker = new Worker('01.js')
        worker.onmessage=(e)=>{
          console.log(e.data);
          worker.terminate()
        }
      }
```

​	子线程代码：

```js
console.log('Work Load!')

fun(2000)
this.postMessage('计算完成~')
this.close()
function fun(time) {
  const now = Date.now()
  while (Date.now() - now <= time) {}
}

```

## 事件循环

​	**总结**:事件循环是JS的运行机制，JS是单线程的，意味着所有任务都需要排队依次执行，前一个任务未完成时后续任务不能被执行。为了解决任务阻塞后续任务执行就有了同步和异步任务，异步任务交给其他线程中处理，当异步任务需要执行将其放到主线程中执行。事件循环具体流程....

​	了解事件循环需要先知道JS为什么拥有事件循环机制，看看JS拥有事件循环的历史原因。

### 1.JS是单线程的

​	**单线程**意味着Web应用的所有代码都是在一个线程中运行的，同一时间只能做一件事情。为什么不能是多线程的？因为JS是需要操作DOM的，若某个线程通过DOM删除了一个元素而另一个线程有在这个元素中添加了子元素，那么浏览器以哪个线程的操作为准？为了降低复杂性，所以JS只能是单线程的。

### 2.任务队列

​	单线程就意味着所有任务都需要排队执行，前一个任务结束，后面的任务才能执行。若前一个任务耗费事件长，后续任务也需要等待前一个任务完成才能被执行。例如网络请求，就需要等待响应成功才能执行后续任务，会导致后续任务的阻塞。

> JavaScript语言的设计者意识到，这时主线程完全可以不管IO设备，挂起处于等待中的任务，先运行排在后面的任务。等到IO设备返回了结果，再回过头，把挂起的任务继续执行下去。

后来，JS有了同步任务、异步任务的把原先的任务区分开来：

同步任务：主线程中排队执行的任务，只有前一个同步任务完成，才能执行后续同步任务。

异步任务：异步任务不会阻塞同步任务的执行，会将异步任务放到浏览器其他线程中处理，当异步任务有了结果后，会将其放到**任务队列**里等待主线程执行。

​	任务队列：是用来存放异步任务的。

### 3.事件循环

​	整个JS应用的执行流程如下：

1. 主线程执行同步任务
2. 遇到异步操作时将异步任务注册给`event table`，待合适时会入队到任务队列`event queue`中
3. 主线程同步任务执行完成，查看任务队列中是否有需要执行的任务
4. 若有，出队然后执行一个任务；若无，执行完毕。
5. 主线程不断重复步骤3、4

整个执行流程就是指事件循环，事件循环就是JS的运行机制。

### 4.任务优先级

​	在node环境下，任务是有优先级的：

```js
process.nextTick()>Promise.then()>setTimeout>setImmediate。
```

​	只需要知道`nextTick`比`then`注册的任务有更高优先级。

### 5.微任务须知

​	若在本次循环的某个微任务执行时，又创建了微任务，则这个新的微任务会添加到本次循环的**微任务队尾**中，等待执行。

```js
console.log('script start')

Promise.resolve().then(() => {
  console.log('then01')
  Promise.resolve().then(() => {
    console.log('then02')
  })
})

Promise.resolve().then(() => {
  console.log('then03');
})

setTimeout(() => {
  console.log('setTimeout')
  Promise.resolve().then(() => {
    console.log('then')
  })
})

console.log('script end')

```

### 6.宏微任务相关API

#### 宏

setTimeout、setInterval、requestAnimationFrame、IO操作、UI渲染

#### 微

then、queueMicrotask、Observer、nextTick 



## 设计模式

https://juejin.cn/post/7061987842473345061

https://www.cnblogs.com/imwtr/p/9451129.html



## 给DOM绑定自定义事件

​	通过给DOM对象绑定自定义事件，即可在某一时刻触发这个事件，完成自定义事件的监听。

```js
// 绑定自定义事件
button.addEventListener('message', () => {
    console.log('message')
})

// 分发自定义事件
button.dispatchEvent(new Event('message'))
```

## Super关键字

​	super关键字可以在类的方法中使用，使用方式有3种：获取原型上的属性，调用基类构造函数，给实例添加属性

### 以函数调用

 以函数调用，`super()`只能在构造函数中使用，可以将基类的属性挂载到当前实例上。

```js
      class Person {
        constructor(name, age) {
          this.name = name
          this.age = age
        }
        say(){
          console.log('hello~')
        }
      }
      class Student extends Person {
        constructor(name, age, score) {
          // 调用父类构造函数，并且在调用时其函数this指向当前实例，就可以给student实例挂载person的属性了。
          super(name, age)
          this.score=score
        }
      }
```

### 访问属性、调用方法

访问属性，`super.xxx`，若super以对象形式调用某个方法，则此时的super为基类的原型对象。

```js
      class Person {
        constructor(name, age) {
          this.name = name
          this.age = age
        }
        say(){
          console.log('hello~')
        }
      }
      class Student extends Person {
        constructor(name, age, score) {
          super(name, age)
          // student继承person所以通过原型链可以访问person原型对象上的方法say
          // super是person的原型对象，有say方法
          console.log(this.say===super.say); // true
          this.score=score
        }
      }
```

### 在super上给某个属性赋值

若给super对象添加、修改一个属性，则会将属性挂载到实例上。

```js
      class Person {
        constructor(name, age) {
          this.name = name
          this.age = age
        }
      }
      class Student extends Person {
        constructor(name, age, score) {
          super(name, age)
          this.score = score
          // 给实例添加属性
          super.ok = 5
    	  console.log(Object.getOwnPropertyNames(this).includes('ok'));
        }
      }
```



### 注意点

1. 若派生类使用了自定义构造函数，则必须要调用`super`函数来初始化基类的属性
2. 在构造函数中，`super`函数的调用必须在使用this之前。
3. 若派生类无构造函数，JS在幕后自动生成构造函数，会自动调用`super`函数初始化基类的属性。
4. 若通过`super.xxx`调用了某个方法，且该方法中有`this`操作，此时`this`指向派生类实例。

```ts
      class Person {
        constructor(name, age) {
          this.name = name
          this.age = age
        }
        test(){
          console.log(this.score);
          return this
        }
      }
      class Student extends Person {
        constructor(name, age, score) {
          super(name, age)
          this.score = score
          // student继承person所以通过原型链可以访问person原型对象上的方法say
          // super是person的原型对象，有say方法
          console.log(this.say === super.say) // true
          // this调用方法、super调用方法时，方法的this都是指向当前实例的
          console.log(this.test()===super.test()); // true
        }
      }
```





## TS相关

### 1.type和interface的区别

​	type是类型别名，可以定义一个类型的别称。

​	interface用来定义接口，描述一个对象，interface可以重复定义。



## 手写专区

### instanceof

```ts
function MyInstanceof(obj, constructor) {
  let flag = false
  if (obj.__proto__ === constructor.prototype) {
    // 若当前对象隐式原型就是构造函数的显示原型时
    flag = true
  } else if (obj.__proto__ !== null) {
    // 若当前对象还有隐式原型时
    flag = MyInstanceof(obj.__proto__, constructor)
  } else {
    // 对象的原型的原型为null
    return false
  }
  return flag
}

console.log(MyInstanceof([], Object))

```

### New

  首先要明白new操作符做了那些事情:
  1.创建一个对象
  2.让该对象的隐式原型设置为函数的显示原型，实现继承，可以通过原型链访问基类的所有属性和方法
  3.调用修改了this指向的构造函数，让实例初始化属性
  4.返回这个对象

  ```ts
    /**
     * @param {Function} cb
     * @param {any[]} args 
     * */
    function myNew (cb, ...args) {
      // 创建一个对象
      const obj = new Object()
      // 让该对象的隐式原型指向函数的显示原型，这样对象就能拥有原型链上的所有方法和属性（实现继承）
      obj.__proto__ = cb.prototype
      // 调用构造函数，并是构造函数在指向时，其this指向当前的新对象
      cb.call(obj, ...args)
      // 返回该对象
      return obj
    }
    
    function Person (name, age) {
      this.name = name
      this.age = age
    }

    const p = myNew(Person, 'Mark', 18)
    console.log(p);
  ```

#### 注意

​	若构造函数返回了一个对象，new的返回值就是这个对象而不是新创建的对象。

```js

function Person(name) {
  this.name = name;
  return { name: "Mark" };
}

const p = new Person("John");

console.log(p); // {name:"Mark"}

```



### 深浅拷贝

​	深浅拷贝主要区别就是有没有在堆区中开辟内存区域、相同的两个变量引用的同一个对象。

### 数组的方法

```ts
// forEach every some reduce map filter
// 遍历数组，调用回调
Array.prototype._forEach = function (cb) {
  for (let i = 0; i < this.length; i++) {
    cb(this[i], i, this)
  }
}
// 遍历数组，回调中某一次返回布尔值真结束循环（数组中是否有某个元素满足其条件）
Array.prototype._some = function (cb) {
  let flag = false
  for (let i = 0; i < this.length; i++) {
    const _flag = cb(this[i], i, this)
    if (_flag) {
      flag = true
      break
    }
  }
  return flag
}
// 遍历数组，回调都返回真返回真（数组中是否每个元素都满足了某种条件）
Array.prototype._every = function (cb) {
  let i = 0
  for (; i < this.length; i++) {
    const flag = cb(this[i], i, this)
    if (!flag) {
      break
    }
  }
  return i === this.length
}
// 遍历数组，将满足条件的元素过滤出来成一个新数组
Array.prototype._filter = function (cb) {
  const arr = []
  for (let i = 0; i < this.length; i++) {
    const flag = cb(this[i], i, this)
    if (flag) {
      arr.push(this[i])
    }
  }
  return arr
}
// 遍历数组，计算出一个结果
Array.prototype._reduce = function (cb, sum = 0) {
  for (let i = 0; i < this.length; i++) {
    const res = cb(sum, this[i], i, this)
    sum = res
  }
  return sum
}
// 遍历数组，返回一个新数组
Array.prototype._map = function (cb) {
  const arr = []
  for (let index = 0; index < this.length; index++) {
    const res = cb(this[index], index, this)
    arr.push(res)
  }
  return arr
}
```

### 消息订阅模式

```ts
/**
 * 非单例的PubSub
 */
export class Pubsub {
  private channels: {
    [propsName: string]: Function[]
  }
  constructor() {
    this.channels = {}
  }
  /**
   * 发布消息
   * @param token 消息id 
   * @param args 消息发出时的参数
   */
  emit(token: string, ...args: any[]) {
    const channel = Reflect.get(this.channels, token)
    if (channel === undefined) {
      // 没有该频道，创建该频道
      this.channels[token] = []
    } else {
      // 有该频道，通知所有订阅者
      channel.forEach(cb => cb(...args))
    }
  }
  /**
   * 订阅频道
   * @param token 频道id
   * @param cb 频道更新后的回调
   */
  on(token: string, cb: Function) {
    const channel = Reflect.get(this.channels, token)
    if (channel === undefined) {
      // 无该频道 创建频道，并添加订阅者
      this.channels[token] = [cb]
    } else {
      // 保存订阅者的回调
      channel.push(cb)
    }
  }
  /**
   * 移除订阅
   * @param token 频道id 
   * @param cb 回调
   */
  remove(token: string, cb: Function) {
    const channel = Reflect.get(this.channels, token)
    if (channel) {
      const index = channel.findIndex(ele => ele === cb)
      channel.splice(index, 1)
    } else {
      throw new Error('无该频道:' + token)
    }
  }
  // 移除频道
  // 清空订阅者
}

export default new Pubsub()
```

### Promise.all

```ts
/**
 * @param {Promise[]} arr
 */
Promise._all = function (arr) {
  return new Promise((resolve, reject) => {
    const list = []
    let count = 0
    arr.forEach((p, index) => {
      p.then(
        (value) => {
          count++
          list.push({ index, value })
          if (count === arr.length) {
            resolve(
              list
                // 保证结果和传入的结果顺序保持一致。
                .sort((a, b) => a.index - b.index)
                .map((data) => data.value)
            )
          }
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  })
}

```

### Promise.race

```ts
/**
 * @param {Promise[]} arr
 */
Promise._race = function (arr) {
  return new Promise((resolve, reject) => {
    arr.some((p) => {
      p.then(
        (value) => {
          resolve(value)
        },
        (reason) => {
          reject(reason)
        }
      )
    })
  })
}

```

### Promise.allSettled

​	传入一个Promise数组，返回一个Promise对象。当数组中所有Promise实例的状态都凝固（也就是都成了fulfilled或rejected状态）时，返回的Promise对象状态设置为fulfilled，值为一个数组，数组每一项包含了Promise成功或失败、Promise成功或失败的结果。

```js
/**
 * @param {Array<Promise<any>>} arr
 * @returns
 */
Promise._allSettled = function (arr) {
  return new Promise((resolve) => {
    const list = []
    let count = 0
    arr.forEach((p, index) => {
      p.then(
        (value) => {
          count++
          // 保存结果
          list.push({ result: value, index, status: 'fulfilled' })
          if (count === arr.length) {
            // 若全部都完成了
            resolve(
              list
                .sort((a, b) => a.index - b.index)
                // 保证顺序和数组顺序一致，不能因为谁先结束谁就在前
                .map((data) => ({ result: data.result, status: data.status }))
            )
          }
        },
        (error) => {
          count++
          // 保存结果
          list.push({ result: error, index, status: 'rejected' })
          if (count === arr.length) {
            // 若全部都完成了
            resolve(
              list
                .sort((a, b) => a.index - b.index)
                .map((data) => ({ result: data.result, status: data.status }))
            )
          }
        }
      )
    })
  })
}

```



### Promise

Promise是用来处理异步回调地狱的解决方案，他可以通过链式调用来轻松解决因多次异步结果依赖导致的回调地狱问题。

#### 状态、阶段

Promise有两个阶段，三种状态：

1.当**未确定结果**阶段，promise实例其初始状态为`pending`状态。

2.当**确定结果**阶段，promise实例有`fulfilled`状态或`rejected`状态。

#### 构造函数

Promise的构造函数允许传递一个函数（成为`executor`），函数会在Promise的构造函数中执行。此函数可以接收两个参数`resovle`和`reject`这两个参数是一个函数，`promise`实例的状态就是通过这两个函数来设置的。

**resolve**:调用`resolve`可以将`promise`的状态设置为`fulfilled`，并且可以传递一个实参，为此次`promise`履行设置一个结果`value`。

**reject**：调用`reject`可以将`promise`的状态设置为`rejected`，并且可以传递一个实参，为此次`promise`拒绝设置一个原因`reason`。

**状态凝固**：当promise实例只要被改变了一次状态就不会被再次修改，保证了value和reason的值。

**executor**：会在构造函数中执行，当executor调用时内部出错，需要执行reject方法，让Promise实例设置为rejected，并设置出错的原因。

#### promise.then

![image-20230923134835932](C:\Users\Dell\AppData\Roaming\Typora\typora-user-images\image-20230923134835932.png)

`promise.then(onFulfilled,onRejected)`

then方法接受两个参数`onFulfilled`,`onRejected`，指当实例履行时执行`onFulfilled`回调，当实例拒绝是执行`onRejected`回调。



##### 1.参数检查

当这两个参数不是函数时，需要将其处理成一个默认函数，调用时获取本次promise`value`或`reason`的值。这些默认函数将来会合适时候调用。

```js
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  // 如果onFulfilled不是函数，给一个默认函数，返回value
  var realOnFulfilled = onFulfilled;
  if(typeof realOnFulfilled !== 'function') {
    realOnFulfilled = function (value) {
      return value;
    }
  }

  // 如果onRejected不是函数，给一个默认函数，返回reason的Error
  var realOnRejected = onRejected;
  if(typeof realOnRejected !== 'function') {
    realOnRejected = function (reason) {
      throw reason;
    }
  }
}
```





##### 2.（函数参数）参数的返回值

###### `onFulfilled`函数的返回值

1.若返回非Promise值，且Promise实例状态为`fulfilled`时，则`then函数`会返回一个新的Promise且新Promise的状态为履行，其value为`onFulfilled`的返回值。

2.若返回一个Promise值，则`then函数`会返回一个promise实例，其状态和结果根据`onFulfilled`或`onRejected`决定。

###### `onRejected`函数的返回值

1.若返回非Promise值时，且Promise实例状态为`rejected`时，则`then函数`会返回一个新的Promise且新Promise的状态为履行，其value为`onRejected`的返回值。

2.若返回一个Promise值，则`then函数`会返回一个promise实例，其状态和结果根据`onFulfilled`或`onRejected`决定。



##### 3.onFulfilled与onRejected执行时机

​	通过then方法我们可以告诉Promise实例在`fulfuilled`或`rejected`状态时执行相应的函数。

​	但我们需要在什么时候调用这些函数呢？换个思路想，Promise在什么时候会被设置状态呢？其实就是在`executor`中执行`resolve`、`reject`函数，所以我们可以将`onFulfilled`、`onRejected`函数保存在实例中，在调用`resolve`、`reject`时不仅要设置状态还要执行对应状态的函数。

​	这种将回调保存起来，在满足条件时执行就是订阅发布模式。



##### 4.then的返回值，链式调用

​	then的返回值是一个Promise实例，其状态和结果是根据当前Promise实例的状态和结果来定的。简单来说若两个参数都不返回Promise对象，则then函数返回一个Promise状态为fulfilled的实例，value或reason为对应参数的返回值。

###### 4.1当`onFulfilled`和`onRejected`返回非Promise值

若Promise实例为`fulfilled`，执行`onFulfilled`，则返回的Promise实例也为`fulfilled`，value为`onFulfilled`的返回值。

若Promise实例为`rejected`，执行`onRejected`，则返回的Promise实例为`fulfilled`，value为`onRejected`的返回值。

注意需要捕获`onFulfilled`执行抛出的异常，若有异常需要执行reject，将返回的Promise设置为`rejected`

伪代码(**代码暂不考虑异步**)

```js
then(onFulfilled,onRejected){
    // 省略....
    const p =  new Promise((resolve,reject)=>{
        try{
          // 需要捕获回调中的错误，设置p的状态和结果
          const result = onFulfilled(this.value)
		 resolve(result)
        }catch(error){
           reject(error)
	    }
    })  
    return p
}
```

###### 4.2 当`onFulfilled`和`onRejected`返回Promise值

​	则then的返回一个promise实例，其状态和结果根据`onFulfilled`或`onRejected`决定。

伪代码(**代码暂不考虑异步**)

```js
then(onFulfilled,onRejected){
    // 省略....
    const p =  new Promise((resolve,reject)=>{
   		try{
            const result = onFulfilled(this.value)
            if(result instanceof Promise){
                // 若函数返回结果是一个新的Promise
                // 当新Promise有结果时，去设置p的状态和结果
                result.then(
                    (r)=>resolve(r),
                    (e)=>rejecte(e)
                )
            }else{
                // 返回的是一个非Promise值，让p的状态设置为fulfilled，结果为返回值
                resolve(result)
            }
        }catch(error){
            reject(error)
        }
     
    })  
    return p
}
```

###### 4.3 解决重复引用

​	then方法中的回调函数中返回的promise不能是then方法的返回值。**注意需要让代码异步执行否则同步执行时构造函数里获取不到p导致出错**。使用queueMicrotask来创建一个微任务，这样就能确保在读取p时，p已经被初始化了。

伪代码（**不考虑异步**）

```js
then(onFulfilled,onRejected){
    // 省略....
    const p =  new Promise((resolve,reject)=>{
        queueMicrotask(()=>{
          try{
            const result = onFulfilled(this.value)
                if(result instanceof Promise){
                    if(result===p){
                        // 抛出去的错误会被trycatch捕获，从而将then返回的p设置为rejected，reason为错误信息。
                        throw new Error('重复引用Promise!')
                    }
                    // 若函数返回结果是一个新的Promise
                    // 当新Promise有结果时，去设置p的状态和结果
                    result.then(
                        (r)=>resolve(r),
                        (e)=>rejecte(e)
                    )
                }else{
                    // 返回的是一个非Promise值，让p的状态设置为fulfilled，结果为返回值
                    resolve(result)
                }
            }catch(error){
                reject(error)
            }
        })

    })  
    return p
}
```

##### 5.then中的异常

​	在then中抛出的异常或暴露的错误应该让下一个then的`onRejected`捕获执行。

```js
Promise.resolve()
.then(()=>{
	throw 'error'
})
.then(
	()=>{},
    (reason)=>{
		console.log(reason) ; //error
    }
)
```

##### 6.抽离逻辑

将then中的大部分逻辑抽离出来。要注意一定要在微任务中执行，否则获取不到p导致运行出错

```js
  /**
   * 抽离Promise.then中的逻辑
   * @param {*} value 履行或拒绝的结果
   * @param {*} p 即将返回的Promise实例
   * @param {*} cb 要执行的onFulfilled或onRejected回调
   * @param {*} resolve 履行
   * @param {*} reject 拒绝
   */
  resolvePromise(value, p, cb, resolve, reject) {
    try {
      const result = cb(value)
      if (result instanceof MyPromise) {
        // 返回的Promise
        if (result === p) {
          // 返回的Promise为then返回值的Promise
          throw new TypeError('Promise重复引用!')
        }
        // 监听返回的Promise值是什么状态从而设置p的状态和结果
        result.then(
          (v) => resolve(v),
          (e) => reject(e)
        )
      } else {
        // 返回非Promise
        resolve(value)
      }
    } catch (error) {
      // 出错，设置为fulfilled
      reject(error)
    }
  }
```

##### 7.异步处理

​	前面的代码仅仅只是做了同步处理，当是异步操作的时候，不能在调用then的时候直接处理`onFulfilled`或`onRejected`，需要在promise有结果时才能进行处理。

​	这种方式能够很好的支持异步的链式调用，当前一个promise有了结果后才会调用下一个promise.then中的回调，后面依赖前面，导致必须前面的promise有了结果才会执行后续then中的回调。

​	同时为了支持链式调用、结果暴露、解决重复引用、微任务调用，所以使用封装好的resolvePromise来操作。

```js
      if (this.status === MyPromise.PENDING) {
        // 异步
        // 将onfulfilled函数保存在履行的回调中
        this.onFulfuilledCallbacks.push(() => {
          // 该函数是在promise.resolve时才会调用
          this.runAsyncCb(() => {
            try {
              this.resolvePromise(this.value, p, _onFulfilled, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        // 将onrejected函数保存在拒绝的回调中
        this.onRejectedCallbacks.push(() => {
          // 该函数是在promise.reject时才会调用
          this.runAsyncCb(() => {
            try {
              this.resolvePromise(this.reason, p, _onRejected, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
```



#### v 0.1

​	实现Promise的状态系统

```js
class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  /**
   * Promise
   * @param {import('./index').Executor} executor
   */
  constructor(executor) {
    // 失败的初始值
    this.reason = null
    // 成功的初始值
    this.value = null
    // promise的状态
    this.status = MyPromise.PENDING
    try {
      // 执行传入的回调
      // 并将设置实例状态的方法传入进回调
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      // 若回调内部出错，则设置状态为拒绝
      this.reject(error)
    }
  }
  /**
   * 若Promise实例的状态为pending则
   * 将Promise实例的状态设置为成功
   * 并保存履行的值
   * @param {any} value
   * @example promise.resolve(1)
   */
  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      this.value = value
      this.status = MyPromise.FULFILLED
    }
  }
  /**
   * 若Promise实例状态为pending则
   * 将Promise实例状态设置为rejected
   * 并获取拒绝的原因
   * @param {any} reason
   */
  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      this.reason = reason
      this.status = MyPromise.REJECTED
    }
  }
}

```

#### v 0.2

 实现了Promise.then方法，可以在成功和失败的时候执行相应的回调，但未实现链式调用。

```js
class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  /**
   * Promise
   * @param {import('./index').Executor} executor
   */
  constructor(executor) {
    // 失败的初始值
    this.reason = null
    // 成功的初始值
    this.value = null
    // promise的状态
    this.status = MyPromise.PENDING
    // 履行的回调们
    this.onFulfuilledCallbacks = []
    // 拒绝的回调们
    this.onRejectedCallbacks = []
    try {
      // 执行传入的回调
      // 并将设置实例状态的方法传入进回调
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      // 若回调内部出错，则设置状态为拒绝
      this.reject(error)
    }
  }
  /**
   * 若Promise实例的状态为pending则
   * 将Promise实例的状态设置为成功
   * 并保存履行的值
   * 执行履行的回调们
   * @param {any} value
   * @example promise.resolve(1)
   */
  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      // 保证状态凝固
      this.value = value
      this.status = MyPromise.FULFILLED
      this.onFulfuilledCallbacks.forEach((cb) => {
        cb(this.value)
      })
    }
  }
  /**
   * 若Promise实例状态为pending则
   * 将Promise实例状态设置为rejected
   * 并获取拒绝的原因
   * 执行拒绝的回调们
   * @param {any} reason
   */
  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      // 保证状态凝固
      this.reason = reason
      this.status = MyPromise.REJECTED
      this.onRejectedCallbacks.forEach((cb) => {
        cb(this.resolve)
      })
    }
  }
  /**
   * promise.then
   * @param {import('./index').OnFulfilled} onFulfilled
   * @param {import('./index').OnRejected} onRejected
   */
  then(onFulfilled, onRejected) {
    let _onFulfiled = onFulfilled
    let _onRejected = onRejected
    // 参数检查，若不是函数，则将onFulfilled、onRejected设置为默认函数
    // 默认函数都是返回一个value或reason
    if (typeof _onFulfiled !== 'function') {
      _onFulfiled = function (value) {
        return value
      }
    }
    if (typeof _onRejected !== 'function') {
      _onRejected = function (reason) {
        throw reason
      }
    }
    // 将onfulfilled函数保存在履行的回调中
    this.onFulfuilledCallbacks.push(_onFulfiled)
    // 将onrejected函数保存在拒绝的回调中
    this.onRejectedCallbacks.push(_onRejected)
  }
}

```

v 0.3

​	实现Promise.then的同步链式调用。

```js
class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  /**
   * Promise
   * @param {import('./index').Executor} executor
   */
  constructor(executor) {
    // 失败的初始值
    this.reason = null
    // 成功的初始值
    this.value = null
    // promise的状态
    this.status = MyPromise.PENDING
    // 履行的回调们
    this.onFulfuilledCallbacks = []
    // 拒绝的回调们
    this.onRejectedCallbacks = []
    try {
      // 执行传入的回调
      // 并将设置实例状态的方法传入进回调
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      // 若回调内部出错，则设置状态为拒绝
      this.reject(error)
    }
  }
  /**
   * 若Promise实例的状态为pending则
   * 将Promise实例的状态设置为成功
   * 并保存履行的值
   * 执行履行的回调们
   * @param {any} value
   * @example promise.resolve(1)
   */
  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      // 保证状态凝固
      this.value = value
      this.status = MyPromise.FULFILLED
      this.onFulfuilledCallbacks.forEach((cb) => {
        this.runAsyncCb(() => {
          cb(this.value)
        })
      })
    }
  }
  /**
   * 若Promise实例状态为pending则
   * 将Promise实例状态设置为rejected
   * 并获取拒绝的原因
   * 执行拒绝的回调们
   * @param {any} reason
   */
  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      // 保证状态凝固
      this.reason = reason
      this.status = MyPromise.REJECTED
      this.onRejectedCallbacks.forEach((cb) => {
        this.runAsyncCb(() => {
          cb(this.reason)
        })
      })
    }
  }
  /**
   * promise.then
   * 1.同步处理
   *  当调用then时，Promise已经进入结果阶段了，可以根据状态直接执行相应回调。
   * 2.异步处理
   * 3.链式调用，返回Promise
   *  3.1 回调返回非Promise
   *  3.2 回调返回Promise
   *    3.2.1 处理一般情况
   *    3.2.2 处理重复引用
   * @param {import('./index').OnFulfilled} onFulfilled
   * @param {import('./index').OnRejected} onRejected
   */
  then(onFulfilled, onRejected) {
    let _onFulfiled = onFulfilled
    let _onRejected = onRejected
    // 参数检查，若不是函数，则将onFulfilled、onRejected设置为默认函数
    // 默认函数都是返回一个value或reason
    if (typeof _onFulfiled !== 'function') {
      _onFulfiled = function (value) {
        return value
      }
    }
    if (typeof _onRejected !== 'function') {
      _onRejected = function (reason) {
        throw reason
      }
    }
    // 链式调用
    const p = new MyPromise((resolve, reject) => {
      // 为什么要将调用等其他逻辑放在里面新promise的executor里，
      // 就是为了保证在调用onFulfilled或onRejected后
      // 可以根据异常来调用resolve，reject并设置新Promise的状态和结果
      if (this.status === MyPromise.PENDING) {
        // 异步
        // 将onfulfilled函数保存在履行的回调中
        this.onFulfuilledCallbacks.push(_onFulfiled)
        // 将onrejected函数保存在拒绝的回调中
        this.onRejectedCallbacks.push(_onRejected)
      } else if (this.status === MyPromise.FULFILLED) {
        // 同步-履行
        this.runAsyncCb(() => {
          // 异步任务，为了能读取p
          this.resolvePromise(this.value, p, onFulfilled, resolve, reject)
        })
      } else if (this.status === MyPromise.REJECTED) {
        // 同步-失败
        this.runAsyncCb(() => {
          // 异步任务，为了读取p
          this.resolvePromise(this.reason, p, onRejected, resolve, reject)
        })
      }
    })
    return p
  }
  /**
   * 抽离Promise.then中的逻辑
   * @param {*} value 履行或拒绝的结果
   * @param {*} p 即将返回的Promise实例
   * @param {*} cb 要执行的onFulfilled或onRejected回调
   * @param {*} resolve 履行
   * @param {*} reject 拒绝
   */
  resolvePromise(value, p, cb, resolve, reject) {
    try {
      const result = cb(value)
      if (result instanceof MyPromise) {
        // 返回的Promise
        if (result === p) {
          // 返回的Promise为then返回值的Promise
          throw new TypeError('Promise重复引用!')
        }
        // 监听返回的Promise值是什么状态从而设置p的状态和结果
        result.then(
          (v) => resolve(v),
          (e) => reject(e)
        )
      } else {
        // 返回非Promise
        resolve(value)
      }
    } catch (error) {
      // 出错，设置为fulfilled
      reject(error)
    }
  }
  /**
   * 创建微任务
   * @param {*} cb
   */
  runAsyncCb(cb) {
    queueMicrotask(cb)
  }
}
```

#### v 0.3

​	实现了then的异步处理

```js
class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'

  /**
   * Promise
   * @param {import('./index').Executor} executor
   */
  constructor(executor) {
    // 失败的初始值
    this.reason = null
    // 成功的初始值
    this.value = null
    // promise的状态
    this.status = MyPromise.PENDING
    // 履行的回调们
    this.onFulfuilledCallbacks = []
    // 拒绝的回调们
    this.onRejectedCallbacks = []
    try {
      // 执行传入的回调
      // 并将设置实例状态的方法传入进回调
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      // 若回调内部出错，则设置状态为拒绝
      this.reject(error)
    }
  }
  /**
   * 若Promise实例的状态为pending则
   * 将Promise实例的状态设置为成功
   * 并保存履行的值
   * 执行履行的回调们
   * @param {any} value
   * @example promise.resolve(1)
   */
  resolve(value) {
    if (this.status === MyPromise.PENDING) {
      // 保证状态凝固
      this.value = value
      this.status = MyPromise.FULFILLED
      this.onFulfuilledCallbacks.forEach((cb) => {
        cb()
      })
    }
  }
  /**
   * 若Promise实例状态为pending则
   * 将Promise实例状态设置为rejected
   * 并获取拒绝的原因
   * 执行拒绝的回调们
   * @param {any} reason
   */
  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      // 保证状态凝固
      this.reason = reason
      this.status = MyPromise.REJECTED
      this.onRejectedCallbacks.forEach((cb) => {
        cb()
      })
    }
  }
  /**
   * promise.then
   * 1.同步处理
   *  当调用then时，Promise已经进入结果阶段了，可以根据状态直接执行相应回调。
   * 2.异步处理
   * 3.链式调用，返回Promise
   *  3.1 回调返回非Promise
   *  3.2 回调返回Promise
   *    3.2.1 处理一般情况
   *    3.2.2 处理重复引用
   * @param {import('./index').OnFulfilled} onFulfilled
   * @param {import('./index').OnRejected} onRejected
   */
  then(onFulfilled, onRejected) {
    let _onFulfilled = onFulfilled
    let _onRejected = onRejected
    // 参数检查，若不是函数，则将onFulfilled、onRejected设置为默认函数
    // 默认函数都是返回一个value或reason
    if (typeof _onFulfilled !== 'function') {
      _onFulfilled = function (value) {
        return value
      }
    }
    if (typeof _onRejected !== 'function') {
      _onRejected = function (reason) {
        throw reason
      }
    }
    // 链式调用
    const p = new MyPromise((resolve, reject) => {
      // 为什么要将调用等其他逻辑放在里面新promise的executor里，
      // 就是为了保证在调用onFulfilled或onRejected后
      // 可以根据异常来调用resolve，reject并设置新Promise的状态和结果
      if (this.status === MyPromise.PENDING) {
        // 异步
        // 将onfulfilled函数保存在履行的回调中
        this.onFulfuilledCallbacks.push(() => {
          // 该函数是在promise.resolve时才会调用
          this.runAsyncCb(() => {
            try {
              this.resolvePromise(this.value, p, _onFulfilled, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        // 将onrejected函数保存在拒绝的回调中
        this.onRejectedCallbacks.push(() => {
          // 该函数是在promise.reject时才会调用
          this.runAsyncCb(() => {
            try {
              this.resolvePromise(this.reason, p, _onRejected, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      } else if (this.status === MyPromise.FULFILLED) {
        // 同步-履行
        this.runAsyncCb(() => {
          // 异步任务，为了能读取p
          this.resolvePromise(this.value, p, _onFulfilled, resolve, reject)
        })
      } else if (this.status === MyPromise.REJECTED) {
        // 同步-拒绝
        this.runAsyncCb(() => {
          // 异步任务，为了读取p
          this.resolvePromise(this.reason, p, onRejected, resolve, reject)
        })
      }
    })
    return p
  }
  /**
   * 抽离Promise.then中的逻辑
   * @param {*} value 履行或拒绝的结果
   * @param {*} p 即将返回的Promise实例
   * @param {*} cb 要执行的onFulfilled或onRejected回调
   * @param {*} resolve 履行
   * @param {*} reject 拒绝
   */
  resolvePromise(value, p, cb, resolve, reject) {
    try {
      const result = cb(value)
      if (result instanceof MyPromise) {
        // 返回的Promise
        if (result === p) {
          // 返回的Promise为then返回值的Promise
          throw new TypeError('Promise重复引用!')
        }
        // 监听返回的Promise值是什么状态从而设置p的状态和结果
        result.then(
          (v) => resolve(v),
          (e) => reject(e)
        )
      } else {
        // 返回非Promise
        resolve(value)
      }
    } catch (error) {
      // 出错，设置为fulfilled
      reject(error)
    }
  }
  /**
   * 创建微任务
   * @param {*} cb
   */
  runAsyncCb(cb) {
    queueMicrotask(cb)
  }
}
```

### 防抖动

​	单位时间内事件触发会被重置，避免事件被触发多次。将多次执行的操作合并为最后一次执行的操作。

```js
function debounce(cb, delay = 500, context = this) {
  let timer = null
  return function (...args) {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      cb.apply(context, args)
      timer = null
    }, delay)
  }
}
```

### 节流

​	单位时间内只能执行一次操作。

```js
/**
 * 节流
 * @param {Function} cb
 * @param {number} delay
 * @param {any} context
 * @returns
 */
function throttle(cb, delay = 500, context = this) {
  let time = null
  return function (...args) {
    if (time !== null) return
    time = setTimeout(() => {
      time = null
    }, delay)
    cb.apply(context, args)
  }
}
```





