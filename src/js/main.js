(function(window, document) {

  class Cat {
    constructor(name, age){
      this.name = name;
      this.age = age;
    }

    sayHi() {
      console.log('hihi!'+this.name);
    }
  }

})(window, document);
