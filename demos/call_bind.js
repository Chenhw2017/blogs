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


console.log('********************************分割线********************************')


Function.prototype._myapply = function (thisArg) {
    if(typeof thisArg === 'string' || typeof thisArg === 'boolean' || typeof thisArg === 'number') { 
        thisArg = new Object(thisArg);
    } else if (!arguments.length || (thisArg === null || thisArg === void 0) && arguments.length === 1) {  // 参数全部为空直接调用 没必要执行下面逻辑了
        return this();
    } else if (typeof arguments[1] === "boolean" || typeof arguments[1] === 'string' || typeof arguments[1] === 'number') { // 兼容处理部分基本类型
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


