

class KVue{
    constructor(options){
        this.$options=options;
        this.$data=options.data;

        this.observe(this.$data);
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
        Object.defineProperty(obj,key,{
            get(){
                return val;
            },
            set(newval){
                if (newval===val){
                    return;
                }
                val =newval;
                console.log("属性更新了：",key);
                // console.log("最新data:".this.$data);
            }
        });
    }
}