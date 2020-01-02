var obj = {
    name:'obj name'
}
var name = 'window name'

function mybind() {

}

const module = {
    x: 42,
    getX: function() {
      return this.x;
    }
  }
  
console.log(module.getX());


function foo () {
    console.log(this.name)
}

var newFn = foo.bind();

newFn();