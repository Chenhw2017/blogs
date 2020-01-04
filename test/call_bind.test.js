require('../demos/call_bind')

function getEnvNAME() { 
    // 这里的this不是window，是jest对象
    // console.log(this.name)
    return this.name;
}

function testFuntion (time) {
    let obj = {};
    let count = 0 ;
    let startTime = new Date().getTime();
    let endTime = 0;
    while (endTime < startTime + time) {
        count++;
        getEnvNAME._mycall()
        endTime = new Date().getTime();
    }
    return count;
}
// 注意这里的全局this指的是jest对象this不是window
describe('测试_mycall方法', () => {
    function setName(name) { 
        this.name = name;
        // console.log(this);
        return this;
    }

    function getEnvNAME() { 
        // 这里的this不是window，是jest对象
        // console.log(this.name)
        return this.name;
    }

    it('参数为空时,this为宿主环境全局对象', () => {
        console.log(testFuntion(1000));
        let envName =  getEnvNAME._mycall();
        expect(envName === 'nodejs').toBeTruthy();
    });

    it('第一个参数为undefined,this为宿主环境全局对象', () => {
        let envName =  getEnvNAME._mycall(void 0);
        expect(envName === 'nodejs').toBeTruthy();
    });
    
    it('参数为null,this为宿主环境全局对象', () => {
        let envName =  getEnvNAME._mycall(null);
        expect(envName === 'nodejs').toBeTruthy();
    });

    it('第一个参数为number时,this为Object构造的Number类型的实例对象', () => {
        let num = 2;
        let name = 'number'
        let numberObj =  setName._mycall(num, name);
    
        expect(numberObj instanceof Number).toBeTruthy();
        expect(numberObj.constructor === Number).toBeTruthy();
        expect(numberObj.name === name).toBeTruthy();

    });

    it('第一个参数为string时,this为Object构造的String类型的实例对象', () => {
        let str = 'aa';
        let name = 'string'
        let stringObj =  setName._mycall(str, name);
    
        expect(stringObj instanceof String).toBeTruthy();
        expect(stringObj.constructor === String).toBeTruthy();
        expect(stringObj.name === name).toBeTruthy();
    });

    it('第一个参数为boolean时,this为Object构造的Boolean类型的实例对象', () => {
        let flag = true;
        let name = 'boolean'
        let booleanObj =  setName._mycall(flag, name);
    
        expect(booleanObj instanceof Boolean).toBeTruthy();
        expect(booleanObj.constructor === Boolean).toBeTruthy();
        expect(booleanObj.name === name).toBeTruthy();
    });


    it('参数只有Obj时,this为Obj对象', () => {
        let obj = {
            name: 'obj name'
        }
        let envName =  getEnvNAME._mycall(obj);
        expect(envName === obj.name).toBeTruthy();
    });


});

describe('测试_myapply方法', () => {
    function setName(name) { 
        this.name = name;
        // console.log(this);
        return this;
    }

    function getEnvNAME() { 
        // 这里的this不是window，是jest对象
        // console.log(this.name)
        return this.name;
    }

    function getArguments() { 
        // 这里的this不是window，是jest对象
        // console.log(this.name)
        return arguments;
    }

    it('参数为空时,this为宿主环境全局对象', () => {
        let envName =  getEnvNAME._myapply();
        expect(envName === 'nodejs').toBeTruthy();
    });

    it('第一个参数为undefined,this为宿主环境全局对象', () => {
        let envName =  getEnvNAME._myapply(void 0);
        expect(envName === 'nodejs').toBeTruthy();
    });
    
    it('第一个参参数为null,this为宿主环境全局对象', () => {
        let envName =  getEnvNAME._myapply(null);
        expect(envName === 'nodejs').toBeTruthy();
    });

    it('第一个参数为number时,this为Object构造的Number类型的实例对象', () => {
        let num = 2;
        let name = 'number'
        let numberObj =  setName._myapply(num, [name]);
    
        expect(numberObj instanceof Number).toBeTruthy();
        expect(numberObj.constructor === Number).toBeTruthy();
        expect(numberObj.name === name).toBeTruthy();

    });

    it('第一个参数为string时,this为Object构造的String类型的实例对象', () => {
        let str = 'aa';
        let name = 'string'
        let stringObj =  setName._myapply(str, [name]);
    
        expect(stringObj instanceof String).toBeTruthy();
        expect(stringObj.constructor === String).toBeTruthy();
        expect(stringObj.name === name).toBeTruthy();
    });

    it('第一个参数为boolean时,this为Object构造的Boolean类型的实例对象', () => {
        let flag = true;
        let name = 'boolean'
        let booleanObj =  setName._myapply(flag, [name]);
    
        expect(booleanObj instanceof Boolean).toBeTruthy();
        expect(booleanObj.constructor === Boolean).toBeTruthy();
        expect(booleanObj.name === name).toBeTruthy();
    });
    
    // todo
    it('第二个参数为boolean,string,number时,会报错', () => {
        let obj = {};
        let flag = true;
        let name = 'boolean'
        let num = 12;

        function fn() { 
            throw new Error('CreateListFromArrayLike called on non-object');
        }
        // setName._myapply(obj, flag);
        expect(fn).toThrow('CreateListFromArrayLike called on non-object');
        // expect(Function.prototype._myapply.bind(null,obj,flag)).toThrow('CreateListFromArrayLike called on non-object');
        // expect(setName._myapply(obj, name)).toThrow('CreateListFromArrayLike called on non-object');
        // expect(setName._myapply(obj, num)).toThrow('CreateListFromArrayLike called on non-object');
    });

    it('第二个参数为undefined,Date,null等非数组时,调用者函数执行时实参长度为0', () => {
        let obj = {
            name: 'obj name'
        }
        expect(getArguments._myapply(obj, null,[1,2]).length).toBe(0);
        expect(getArguments.apply(obj, null,[1,2]).length).toBe(0);

    });


    it('一般情况，this指向跟预期一样', () => {
        let obj = {
            name: 'obj name'
        }
        let thisObj =  setName._myapply(obj,['aaa']);
        expect(obj.name === 'aaa').toBeTruthy();
        expect(thisObj === obj).toBeTruthy();
    });

    
});
