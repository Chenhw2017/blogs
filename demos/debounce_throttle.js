// 1. 防抖函数`debounce`的功能就相当于帮你判断什么时候该按下快门
// 2. `fn`相当于快门
// 3. `threshhold`(阈值)就相当于`threshhold`间隔内没有再次抖动才表示稳定了
// 4. 只有稳定之后才会按下快门即执行fn

function debounce(fn, threshhold){
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this)
        },threshhold)
    };
}


function throttle2(fun, threshhold) {
    let limited = false; // 节流阀标志位
    let timer = null;
    let start = Date.now();
    threshhold = threshhold || 500
    return function (...args) {
        let current = Date.now();
        limited = limited && current- start < threshhold
        console.log('limited',limited,current- start,...args)
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

// 间隔时间threshhold内值执行一次

function throttle(fn, threshhold) {
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


export  {
    debounce,
    throttle,
    throttle2
}
