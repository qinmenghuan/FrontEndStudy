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
        let regText=RegExp.$1;
        // debugger;
        node.textContent=this.$vm.$data[regText];
    }

    isElement(node){
        return node.nodeType===1;
    }

    isInterpolation(node){
        return node.nodeType===3&& /\{\{(.*)\}\}/.test(node.textContent);
    }
}