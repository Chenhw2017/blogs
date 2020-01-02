

/**
 * es3版本
 * arguments.callee.caller 当前函数的调用者（也必须是函数，否者为null）
 * arguments.callee 当前函数的引用
 * 
 * fn.call(thisArg, arg1, arg2, ...)  
 *  1. fn被调用，且fn内this指向thisArg
 *  2. this.thisArg不受任何影响（即没有任何属性成员被修改）
 *  3. call方法的返回值fn调用的返回值
 * 
 */
function globalEnv () {
    return this;
}

Function.prototype._mycall = function (thisArg) {
    if(!this instanceof Function) {
        throw new Error(`${this}.mycall is not a function`)
    }
    thisArg = thisArg || globalEnv();
    var rest = [],result;
    for (var index = 1; index < arguments.length; index++) { //arguments只支持for，不支持数组其他api
        rest.push("arguments[" + index + "]");
    }
    var uiqueFn = Date.now();
    while (thisArg.hasOwnProperty(uiqueFn)) {
        uiqueFn = Date.now();
    }
    thisArg[uiqueFn] = this; // 1
    eval('result = thisArg[uiqueFn]('+rest+')'); // 3 
    delete  thisArg[uiqueFn]; // 2
    return result;
}

var fn = function (name) {
    this.name = name
    return name
}

var obj = {
    name:'obj name'
}

var myset = new Set([1,2]);
var mymap = new Map();
mymap.set('name','chw')

// fn._mycall(obj,'haha',2,3)


console.log('********************************分割线********************************')


Function.prototype._myapply = function (thisArg) {
    if(!this instanceof Function) {
        throw new Error(`${this}.myapply is not a function`)
    } else if(!arguments.length) {  // 参数全部为空直接调用 没必要执行下面逻辑了
        return this();
    } else if (typeof arguments[1] === void 0 || typeof arguments[1] === 'string' || typeof arguments[1] === 'number') { // 
        throw new Error(`CreateListFromArrayLike called on non-object`);
    }

    var uiqueFn = Date.now();
    while (thisArg.hasOwnProperty(uiqueFn)) {
        uiqueFn = Date.now();
    }
    
    var rest = arguments[1] instanceof Array ?  arguments[1] : [], result, arr;
    //如果第二参数为空没必要在执行下面eval和循环判断了
    if(!rest.length) {
        thisArg[uiqueFn]();
        delete  thisArg[uiqueFn]; // 2
        return
    }

    for (var index = 0; index < rest[1].length; index++) {
        arr[index] = 'arguments['+index+']'
        
    }

    thisArg[uiqueFn] = this; // 1
    eval('result = thisArg[uiqueFn]('+arr+')'); // 3 
    delete  thisArg[uiqueFn]; // 2
    return result;
}


fn.apply(obj,myset)
console.log(obj,myset instanceof Array)


// fn._myapply(obj,['haha',2,3])
