import {debounce,throttle,throttle2} from '../demos/debounce_throttle'
const awaitData = require('./utils')

describe('测试防抖函数debounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    })
    test('1000ms促发多次，只执行一次', () => {
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let debounceFn = debounce(mockFn,1000);
        let i = 4;
        while (i) {
            i--;
            debounceFn();
        }
        jest.runAllTimers();
        expect(setTimeout).toHaveBeenCalledTimes(4);
        expect(count).toBe(1);
        expect(mockFn).toBeCalledTimes(1);
    });

    test('1000ms促发多次，之后再间隔1000ms在触发一次，共执行两次', () => {
        jest.useRealTimers(); // 外层为真定时器模拟实际
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let debounceFn = debounce(mockFn,1000);
        let i = 4;
        while (i) {
            i--;
            debounceFn();
        }

        function awaitData () {
            return new Promise((resolve,reject) => {
                setTimeout(() => {
                    jest.useFakeTimers(); // 真实时间走完一秒后已经确定需要开启新的定时器，这个时候没必要在用真定时器了
                    debounceFn();
                    jest.runAllTimers();
                    resolve()
                },1000)
            })
        }
        return awaitData().then(() => {
            expect(count).toBe(2);
            expect(mockFn).toBeCalledTimes(2);
        })
    });

    test('防抖的函数内this的指向为指定的对象', () => {
        let obj = {};
        let mockFn = jest.fn(function(){
            return this
        })
        let debounceFn = debounce(mockFn,1000);
        debounceFn.call(obj);
        jest.runAllTimers();
        expect(obj === mockFn.mock.results[0].value).toBeTruthy();
    });

});

describe('测试不含定时器节流函数函数throttle', () => {
    beforeEach(() => {
        jest.useRealTimers();
        // useFakeTimers是假定时器，runAllTimers会快进时间消耗掉所有定时器
        // 导致节流函数内时间错误，这里应该使用useRealTimers这样时间才是真正的时间

    })
    test('1000ms促发一次，立即执行且只执行一次', () => {
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let throttleFn = throttle(mockFn,1000);
        throttleFn();
        expect(count).toBe(1);
        expect(mockFn).toBeCalledTimes(1);
    });
    test('1000ms促发多次，有且只有第一次被执行', () => {
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let throttleFn = throttle(mockFn,1000);
        let i = 4;
        while (i) {
            i--;
            throttleFn();
        }
        expect(count).toBe(1);
        expect(mockFn).toBeCalledTimes(1);
    });

    test('1000ms促发多次，距离第一次触发900ms在触发一次，最终只会执行一次', () => {
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let throttleFn = throttle(mockFn,1000);
        let i = 4;
        while (i) {
            i--;
            throttleFn();
        }
        return awaitData(throttleFn,900).then(() => {
            expect(count).toBe(1);
            expect(mockFn).toBeCalledTimes(1);
        })
        
    });

    test('1000ms促发多次，之后再间隔1000ms在触发一次，共执行两次', () => {
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let throttleFn = throttle(mockFn,1000);
        let i = 4;
        while (i) {
            i--;
            throttleFn();
        }
        return awaitData(throttleFn, 1100).then(() => {
            expect(count).toBe(2);
        })
    });

    test('节流的函数内this的指向为指定的对象', () => {
        let obj = {};
        let mockFn = jest.fn(function(){
            return this
        })
        let throttleFn = throttle(mockFn,1000);
        throttleFn.call(obj);
        expect(obj === mockFn.mock.results[0].value).toBeTruthy();
    });

});


describe('测试含定时器节流函数函数throttle2', () => {
    beforeEach(() => {
        jest.useRealTimers();
        // useFakeTimers是假定时器，runAllTimers会快进时间消耗掉所有定时器
        // 导致节流函数内时间错误，这里应该使用useRealTimers这样时间才是真正的时间

    })

    test('1000ms促发一次，立即执行且只执行一次', () => {
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let throttleFn = throttle2(mockFn,1000);
        throttleFn();
        expect(count).toBe(1);
        expect(mockFn).toBeCalledTimes(1);
    });

    test('1000ms促发多次，总共会执行两次', () => {
        jest.useFakeTimers();
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let throttleFn = throttle2(mockFn,1000);
        let i = 4;
        while (i) {
            i--;
            throttleFn();
        }
        jest.runAllTimers();
        expect(count).toBe(2);
        expect(mockFn).toBeCalledTimes(2);
    });

    test('1000ms促发两次次，且第二次距离第一次时间间隔900，最终会执行两次并且两次执行时间间隔至少1000+900ms接近两秒', () => {
        jest.useRealTimers(); // 外层为真定时器模拟实际
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let throttleFn = throttle2(mockFn,1000);
        throttleFn();
        function awaitData () {
            return new Promise((resolve,reject) => {
                setTimeout(() => {
                    jest.useFakeTimers();
                    throttleFn();
                    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
                    jest.runAllTimers();
                    resolve()
                },900)
            })
        }
        return awaitData().then(() => {
            expect(count).toBe(2);
            expect(mockFn).toBeCalledTimes(2);
        })
        
    });

    test('1000ms促发多次，之后再间隔1000ms在触发一次，共执行两次', () => {
        let count = 0;
        let mockFn = jest.fn(() => count++)
        let throttleFn = throttle2(mockFn,1000);
        let i = 4;
        while (i) {
            i--;
            throttleFn();
        }
        return awaitData(throttleFn, 1100).then( () => {
            expect(count).toBe(2);
        })
    });

    test('节流的函数内this的指向为指定的对象', () => {
        let obj = {};
        let mockFn = jest.fn(function(){
            return this
        })
        let throttleFn = throttle2(mockFn,1000);
        throttleFn.call(obj);
        expect(obj === mockFn.mock.results[0].value).toBeTruthy();
    });

});