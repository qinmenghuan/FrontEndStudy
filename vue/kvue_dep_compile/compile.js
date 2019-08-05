class Compile{
    constructor(el,vm){
        this.$el=document.querySelector(el);
        this.$vm=vm;

        if(this.$el){
            // 
            this.$fragment=this.node2fragement(this.$el);
            console.log("fragment:",this.$fragment);
            this.compile(this.$fragment);

            this.$el.appendChild(this.$fragment);            
        }
    }

    node2fragement(el){
        const frag=document.createDocumentFragment();
        let  child;
        while(child=el.firstChild){
            frag.appendChild(child);
        }
        return frag;
    }

    compile(el){
        const childNodes=el.childNodes;
        Array.from(childNodes).forEach(node =>{
            // debugger;
            // console.log("类型："+node.nodeType+'编译文本内容：'+node.textContent);
            // 类型判断
            if(this.isElement(node)){
                console.log('编译元素'+node.nodeName);
                const nodeAttrs=node.attributes;
                Array.from(nodeAttrs).forEach(attr=>{
                    const attrName=attr.name;
                    const exp=attr.value;
                    // 如果是指令
                    if (this.isDiretive(attrName)){
                        const dir =attrName.substring(2);
                        this[dir]&&this[dir](node,this.$vm,exp);
                    }
                    // 如果是事件
                    if (this.isEvent(attrName)){
                        let dir=attrName.substring(1);
                        this.evertHandler(node,this.$vm,exp,dir);
                        // this[dir]&&this[dir](node,this.$vm,exp);
                    }

                });

            }
            else if (this.isInterpolation(node)){
                // console.log('编译文本'+node.textContent);
                this.compileText(node);
            }

            // 递归子节点
            if (node.childNodes&&node.childNodes.length>0){
                this.compile(node);
            }
        })
    }

    compileText(node){
        // console.log("reg:",RegExp.$1);
        // let regText=RegExp.$1;
        // debugger;
        // node.textContent=this.$vm.$data[regText];

        this.update(node,this.$vm,RegExp.$1,'text');
    }

    // 更新函数 通用方法
    update(node,vm,exp,dir){
        const updaterFn=this[dir+'Updater'];

        // 初始化
        updaterFn&&updaterFn(node,vm.$data[exp]);

        // 依赖收集
        new Watcher(vm,exp,function(value){
            updaterFn&&updaterFn(node,value);
        });
    }

    textUpdater(node,value){
        node.textContent=value;
    }
    modelUpdater(node,value){
        node.value=value;
    }

    // 指令方法v-text
    text(node,vm,exp){
        this.update(node,vm,exp,'text');
    }
    // 指令方法 v-model
    model(node,vm,exp){
        this.update(node,vm,exp,"model")

        // 如果input输入值变化
        node.addEventListener("input",function(e){
            vm[exp]=e.target.value;
        })
    } 

    // 事件处理器
    evertHandler(node,vm,exp,dir){
        let fn=vm.$options.methods && vm.$options.methods[exp];
        // node.addLisener
        if(dir&&fn){
            node.addEventListener(dir,fn.bind(vm));
        }
    }

    isElement(node){
        return node.nodeType===1;
    }
    isInterpolation(node){
        return node.nodeType===3&& /\{\{(.*)\}\}/.test(node.textContent);
    }
    isDiretive(attrName){
        return attrName.indexOf("k-")==0;        
    }
    isEvent(attrName){
        return attrName.indexOf("@")==0;
    }
}