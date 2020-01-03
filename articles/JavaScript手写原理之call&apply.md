---
noteId: "965ab1a02e5711eab84f255da7e1e776"
tags: []

---

# JavaScript手写原理之call/apply


>call/apply在我们日常开发中也是经常会用到的两个api，如何使用它们我们并不陌生,所以今天我们讨论下如何实现它


## call

### 需求分析
> 用法：function.call(thisArg, arg1, arg2, ...)

它有以下功能与约束：

1. 参数的兼容处理
2. 调用`function`，并且指定function内this指向为`thisArg`
3. `call`没有副作用，调用之后不会对`thisArg`产生任何影响
4. 返回值为`function`调用的返回值

### 实现

 **对于第一点**

这里需要处理下参数的兼容性及相应的性能优化:

- thishisArg为`null`或者`undefined`,则`this`为宿主环境全局对象
- thishisArg 为 `null`或者`undefined`且参数只有一个时或者参数为空时，就没必要进行下面逻辑了
- thisArg如果是部分基本类型需要做处理，call内部会对这些基本类型进行转换相应类型的实例对象

```js
function globalEnv () {
    return this;
}
...
if(typeof thisArg === 'string' || typeof thisArg === 'boolean' || typeof thisArg === 'number') { 
    thisArg = new Object(thisArg);
}else if (!arguments.length || (thisArg === null || thisArg === void 0) && arguments.length === 1) { // call() || call(null)
    return this();
}

thisArg = thisArg || globalEnv();
```
> Tip:基本类型进行转换相应类型的实例对象
```js
var numberObj = new Object(22);
numberObj.constructor === Number // => true
numberObj instanceof Number // => true
numberObj instanceof Object // => true
```


**对于第二点**，我们如何实现调用`function`，并且指定function内this指向为`thisArg`呢？

我们知道函数调用时，其函数内this指向分为以下四种情况

1. 由new调用?绑定到新创建的对象。
2. 由call或者apply(或者bind)调用?绑定到指定的对象。
3. 由上下文对象调用?绑定到那个上下文对象即`obj.fn()`,`fn`内`this`指向就是`obj`。
4. 默认:在严格模式下绑定到undefined，否则绑定到全局对象。

首先,`function`不一定是构造函数所以1行不通，2是我们这次要实现的pass,因为`call`就是要绑定到指定对象，全局或者`undefined`只是其中一种情况，所以我们通过3将函数绑定到上下文对象上即`thisArg`更加符合要求,分析到这里思路就非常明确了,无非就是给绑定对象`thisArg`加个`function`方法

```js
var uiqueFn = Date.now();
while (thisArg.hasOwnProperty(uiqueFn)) { // 防止属性重复
    uiqueFn = Date.now();
}
thisArg[uiqueFn] = this; // 1
```

由于参数是从类数组对象`arguments`取出，其只支持`for`遍历，不支持数组其他api

```js
var rest = [],result;
for (var index = 1; index < arguments.length; index++) {
    rest.push("arguments[" + index + "]");
}
```
函数调用时，是以fn`(a,b,c...)`的形式调用，考虑兼容问题不实用es6的拓展运算符,改用[eval](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)的形式，如果你有更好的方法，欢迎评论👏

```js
 eval('result = thisArg[uiqueFn]('+arr+')');
```

### 对于3,4

函数调用获取结果后，将添加的属性删除即可，并把函数结果返回
```js
    delete  thisArg[uiqueFn]; // 2
    return result;
```
最后,贴下完整代码：

```js
function globalEnv () {
    return this;
}

Function.prototype._mycall = function (thisArg) {
    if(typeof thisArg === 'string' || typeof thisArg === 'boolean' || typeof thisArg === 'number') { 
        thisArg = new Object(thisArg);
    }else if (!arguments.length || (thisArg === null || thisArg === void 0) && arguments.length === 1) { // call() || call(null)
        return this();
    }
    thisArg = thisArg || globalEnv();
    var uiqueFn = Date.now();
    while (thisArg.hasOwnProperty(uiqueFn)) {
        uiqueFn = Date.now();
    }
    thisArg[uiqueFn] = this; // 1
    var rest = [],result;
    for (var index = 1; index < arguments.length; index++) { 
        rest.push("arguments[" + index + "]");
    }
    eval('result = thisArg[uiqueFn]('+rest+')'); // 3 
    delete  thisArg[uiqueFn]; // 2
    return result;
}
```

## apply

### 需求分析
> 用法：func.apply(thisArg, [argsArray])

### 实现

apply和call两者除了参数不同之外，其他没有任何区别，实现上只有对于第二个参数的错误处理有区别之外，其他几乎没有任何区别，这里我就不再赘述细节直接贴代码

> 注意⚠️：由于是检测函数类型，所以这里`instanceof`可以使用`typeof`替代进行检测，但是需注意typeof对于其他类型如null判断的是`object`,以及其他引用类型也是`object`,如`Array`、`Date`等


```js
Function.prototype._myapply = function (thisArg) {
    if(!this instanceof Function) {
        throw new Error(`${this}.myapply is not a function`)
    } else if(!arguments.length || (thisArg === null || thisArg === void 0) && arguments.length === 1) {  // 参数全部为空直接调用 没必要执行下面逻辑了
        return this();
    } else if (typeof arguments[1] === 'boolean' || typeof arguments[1] === 'string' || typeof arguments[1] === 'number') { // 兼容处理部分基本类型
        throw new Error(`CreateListFromArrayLike called on non-object`);
    }
    thisArg = thisArg || globalEnv();
    var uiqueFn = Date.now();
    while (thisArg.hasOwnProperty(uiqueFn)) {
        uiqueFn = Date.now();
    }
    var rest = arguments[1] instanceof Array ?  arguments[1] : [], result, arr = [];
    for (var index = 0; index < rest.length; index++) {
        arr[index] = 'rest['+index+']'
    }

    thisArg[uiqueFn] = this; 
    eval('result = thisArg[uiqueFn]('+arr+')'); 
    delete  thisArg[uiqueFn]; 
    return result;
}
```





