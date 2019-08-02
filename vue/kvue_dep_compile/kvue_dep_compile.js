

class KVue{
    constructor(options){
        this.$options=options;
        this.$data=options.data;

        this.observe(this.$data);

        
        // 例子
        // new Watcher();
        // this.$data.test;

        // 初始化
        //   new Watcher();
        //   this.$data.test;
        //   new Watcher();
        //   this.$data.foo.bar;

        new Compile(options.el,this);

        console.log("this2:",this);
        // created执行
        if(options.created){
            // this指向实例化对象
            options.created.call(this);
        }
    }
    observe(data){
        if(!data||typeof data !== 'object'){
            return;
        }
        Object.keys(data).forEach((key)=>{
            this.defineReactive(data,key,data[key]);
        })
    }
    defineReactive(obj,key,val){
        this.observe(val);

        const dep=new Dep();

        Object.defineProperty(obj,key,{
            get(){
                Dep.target&&dep.addWatcher(Dep.target);
                return val;
            },
            set(newval){
                if (newval===val){
                    return;
                }
                val =newval;
                console.log("属性更新了1：",key);
                // debugger
                // 依赖更新
                dep.notify();
                // console.log("最新data:".this.$data);
            }
        });
    }
}

// Dep 用来管理Watcher
class Dep{
    constructor(){
        // 存放若干watcher
        this.watchers=[];
    }

    addWatcher(watcher){
        this.watchers.push(watcher);
    }

    notify(){
        this.watchers.forEach(watcher=>watcher.update());
    }
}



class Watcher {
    constructor(){
        // 将当前watcher实例指定到
        Dep.target=this;
    }
    update(){
        console.log("watcher更新了");
    }
}