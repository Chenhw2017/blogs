
# JavaScript手写原理之节流与防抖

> 节流与防抖这两个概念大家并不陌生，可是你是否真正了解两者的真正区别？是否能够在实际开发中知道什么时候该用防抖？什么用节流？

## 阅读本文你将收获：
  
- 清晰认识防抖与节流之间的区别，并能够正确的应用与实际开发中
- 多样的代码实现
- 闭包的特性的应用

## 什么是防抖

> debounce(fn, threshhold) 

技术最终都要服务于社会，任何脱离业务（社会）实际的都是耍流氓，防抖当然也不例外，实际生活中对于拍照（人工防抖，不是智能那种:joy:），如果你在自拍，你肯定不会在镜头没稳定之前，按下快门吧（PS:如果你想要这种模糊效果当我没说:no_mouth:），也就是镜头不稳（手抖）你不会按下快门，如果你感觉稳了，才会按下快门，类似：
  
1. 防抖函数`debounce`的功能就相当于帮你判断什么时候该按下快门
2. `fn`相当于快门
3. `threshhold`(阈值)就相当于人体感知稳定的需要经历的时间阈值
4. 只有稳定之后才会按下快门即执行fn，也就是说一旦间隔`threshhold`有一次抖动都会重新判断稳定
5. 如果`threshhold`间隔内一直稳定不下来，第一次触发`threshhold`ms之后fn不会被执行，同理一直不稳定，fn永远不会被执行（假入死循环）

```JS
// fn => 2
function debounce(fn, threshhold){ // 1
    if(!fn instanceof Function) {
        throw new TypeError('Expected a function')
    }
    let timer = null;
    return function () {
        clearTimeout(timer); // 3
        timer = setTimeout(() => { 
            fn.apply(this) // 4 
        },threshhold)
    };
}
```

代码浅析：`debounce`就相当于帮你判断是什么时候该按下快门，要执行的fn相当于快门，人体的感知稳定时间阈值为`threshhold`,如果连续两次调用（对应拍照抖动）小于`threshhold`,那么肯定要重新设置稳定间隔的起始点也就是重置`clearTimeout(timer)`,当然如果两次间隔超过`threshhold`,重置已经无法影响了已经发生的调用了，最后定时器执行`fn.apply(this)`就是手终于不抖可以按下快门啦:joy:


## 什么是节流

> throttle(fn, threshhold) 

实际生活中,节流这一概念其实生活中有很多例子，比如这快过年了，火车站考虑到大家的安全，对进站进行节流（官方应该叫限流，其实表达都是同一个意思）因为单位时间内车站的接待（容纳）人数是有限的，还有大家更加熟悉的例子，王者荣耀或者英雄联盟这类moba游戏，都有攻速上限（攻速2.5），换句话说哦假设程序设定了英雄一秒最多A五下，那么即使你手速再快，1s内也A不出第六下，通过以上例子我们可以得出：
  
1. `threshhold`间隔内函数`fn`无论触发多少次，第一次触发到`threshhold`ms后都是只执行一次
2. 第二次触发距离第一次时间超过`threshhold`，则第二次会立即执行

根据这两点，有两种实现方式

### 第一种

```js
function throttle(fn, threshhold) {
    if(!fn instanceof Function) {
        throw new TypeError('Expected a function')
    }
    let limited = false;  // 节流阀标志位
    let start = Date.now();
    threshhold = threshhold || 500
    return function (...args) {
        let current = Date.now();
        limited = limited && current- start < threshhold
        if(!limited) {
                fn.apply(this,args);
                limited = true;
                start = Date.now();
        }
    }
}
```

代码浅析：通过`limited`节流阀标志位模拟当前是否需要节流（限流），第一次默认`fales`即首次不限流（车站为空的:joy:），限流之后(`limited = true`)且只有两次时间间隔(`current- start`)超过`threshhold`,才会除去限制，调用fn即车站让旅客进站进入新的周期重置开始时间`start`

### 第二种

```js
function throttle2(fun, threshhold) {
    if(!fun instanceof Function) {
        throw new TypeError('Expected a function')
    }
    let limited = false; // 节流阀标志位
    let timer = null;
    let start = Date.now();
    threshhold = threshhold || 500
    return function (...args) {
        let current = Date.now();
        limited = limited && current- start < threshhold
        if (limited) {
            clearTimeout(timer)
            timer = setTimeout(() => {
                limited = true
                start = Date.now()
                fun.apply(this, args)
            }, threshhold)
        }else {
            limited = true
            start = Date.now();
            fun.apply(this,args)
        }
    }
}
```

代码浅析：第二种使用了`setTimeout`定时器的方式，多加了如果最后一次触发距离上一次调用`fn`小于`threshhold`则这次设置的定时器回调将会在下一个`threshhold`周期内执行，所以这种方式触发多次`fn`总共会执行`两次`,只是第二次会在下一个`threshhold`周期内执行

> 节流两种方式对比
> - 第一种，一个`threshhold`间隔内多次促发，`fn`只会被执行一次，最后一次并不会进入下一个周期执行，比如连续1秒内平A了5次超过限度（节流）5次，第六次并不会说下一秒自动平A，而是直接舍去
>  - 第二种，一个`threshhold`间隔内多次促发，`fn`总共会执行两次，注意第二次会进入**下一个**`threshhold`周期执行


## 两者比较

相同点：

- 其实本质上都是为了节省程序的性能（防止高频函数调用）
- 借助了闭包的特性来缓存变量（状态）
- 都可以使用setTimeout实现
  
区别：

- 使用防抖，可能n个`threshhold`时间间隔之后`fn`也没执行，但是使用节流触发的`threshhold`间隔内有且只执行一次
- 同样`threshhold`间隔内连续触发，防抖只执行一次，而节流会执行两次，只是在不同的`threshhold`周期内
- 侧重点不同，防抖侧重于稳定只能执行一次，而节流强调限周期内次数，即执行频率，不限制所有时间内的总次数

## 应用场景

### 防抖：

- 一些表单元素的校验，如手机号，邮箱，用户名等
- 部分搜索功能的联想结果实现

### 节流：

- 一些鼠标的跟随动画实现
- scroll，resize, touchmove, mousemove等极易持续性促发事件的相关动画问题，降低频率

## 总结

无论什么技术都有他擅长的地方，技术与实现的优与劣不能单从技术方面去考量，这样是没有意义的，如对于节流函数的两种方式，他们都有适合的场景，比如你的产品需要类似游戏内限制攻速的，显然节流的第一种方案更合适，元芳你怎么看?:laughing:(ps:[github源码地址](https://github.com/Chenhw2017/blogs/blob/master/demos/debounce_throttle.js)含单测)


## 参考链接

- https://lodash.com/docs/4.17.15#debounce


