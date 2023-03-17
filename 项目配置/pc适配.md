- 通过 `scale` 缩放进行适配

```js
    /**
    js部分
    */
    mounted(){
        //初始化自适应  ----在刚显示的时候就开始适配一次
        handleScreenAuto();
        //绑定自适应函数   ---防止浏览器栏变化后不再适配
        window.onresize = () => handleScreenAuto();
    },
    deleted(){
        window.onresize = null;
    },
    methods: {
        //数据大屏自适应函数
        const handleScreenAuto = (): void => {
            const designDraftWidth = 1920;//设计稿的宽度
            const designDraftHeight = 960;//设计稿的高度
            //根据屏幕的变化适配的比例
            const scale = document.documentElement.clientWidth / document.documentElement.clientHeight < designDraftWidth / designDraftHeight ?
                (document.documentElement.clientWidth / designDraftWidth) :
                (document.documentElement.clientHeight / designDraftHeight);
            //缩放比例
            (document.querySelector('#screen') as any).style.transform = `scale(${scale}) translate(-50%)`;
        }
    }
```
