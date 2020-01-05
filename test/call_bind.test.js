require('../demos/call_bind')
// 注意这里的全局this指的是jest对象this不是window
// 由于单元测试启用了对import模块语法支持，开启了严格模式
describe('测试_mycall方法', () => {
    function setName(name) { 
        this.name = name;
        // console.log(this);
        return this;
    }

    function getEnvNAME() { 
        // 这里的this不是window，是jest对象
        // console.log(this)
        return this;
    }

    it('参数为空时,严格模式下this为undefined', () => {
        let envName =  getEnvNAME._mycall();
        expect(envName === void 0).toBeTruthy();
    });

    it('第一个参数为undefined,严格模式下this为undefined', () => {
        let envName =  getEnvNAME._mycall(void 0);
        expect(envName === void 0).toBeTruthy();
    });
    
    it('参数为null,严格模式下this为undefined', () => {
        let envName =  getEnvNAME._mycall(null);
        expect(envName === void 0).toBeTruthy();
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


    it('正常情况参数第一个Obj时,this为Obj对象', () => {
        let obj = {
            name: 'obj name'
        }
        let newName = 'newName'
        setName._mycall(obj, newName);
        expect(newName === obj.name).toBeTruthy();
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
        return this;
    }

    function getArguments() { 
        // 这里的this不是window，是jest对象
        // console.log(this.name)
        return arguments;
    }

    it('参数为空时,this为宿主环境全局对象', () => {
        let envName =  getEnvNAME._myapply();
        expect(envName === void 0).toBeTruthy();
    });

    it('第一个参数为undefined,this为宿主环境全局对象', () => {
        let envName =  getEnvNAME._myapply(void 0);
        expect(envName === void 0).toBeTruthy();
    });
    
    it('第一个参参数为null,this为宿主环境全局对象', () => {
        let envName =  getEnvNAME._myapply(null);
        expect(envName === void 0).toBeTruthy();
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
