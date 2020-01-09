
// 自定义方式创建迭代器
function makeRangeIterator(start = 0, end = Infinity, step = 1) {
    let nextIndex = start;
    let iterationCount = 0;

    const rangeIterator = {
       next: function() {
           let result;
           if (nextIndex < end) {
               result = { value: nextIndex, done: false }
               nextIndex += step;
               iterationCount++;
               return result;
           }
           return { value: iterationCount, done: true }
       }
    };
    return rangeIterator;
}

let it = makeRangeIterator(1, 10, 2);

let result = it.next();
while (!result.done) {
//  console.log(result.value); // 1 3 5 7 9
 result = it.next();
}

console.log("Iterated over sequence of size: ", result.value); // 5


// 通过生成器函数Generator语法functions生成迭代器

function* genRangeIterator(start = 0, end = Infinity, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}
var a = genRangeIterator(1,10,2)
// console.log(a.next())
// console.log(a.next())
// console.log(a.next())
// console.log(a.next())
// console.log(a.next())
// console.log(a.next())


// 可迭代对象

// generator语法
var genIteratorObj = {
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
    }
}

console.log(genIteratorObj[Symbol.iterator]());

console.log('********generator语法***********')
for (const iterator of genIteratorObj) {
    console.log(iterator)
}
// 自定义迭代器

var cusIteratorObj = {
    [Symbol.iterator]:function() {
        return makeRangeIterator(1, 10, 2);
        // let nextIndex = 1;
        // let iterationCount = 0;
        // let step = 1
        // let end = 4
        // const rangeIterator = {
        //     next: function() {
        //         let result;
        //         if (nextIndex < end) {
        //             result = { value: nextIndex, done: false }
        //             nextIndex += step;
        //             iterationCount++;
        //             return result;
        //         }
        //         return { value: iterationCount, done: true }
        //     }
        // };
        // return rangeIterator;
    }
}

console.log('********自定义语法***********')
for (const iterator of cusIteratorObj) {
    console.log(iterator)
}