class GameApp extends egret.DisplayObjectContainer{

    /**
     * 加载进度界面
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        //设置加载进度界面
        this.loadingView  = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.loadConfig("resource/resource.json","resource/");
        console.log("start");
    }
    /**配置文件加载完成,开始预加载preload资源组。*/
    private onConfigComplete(event:RES.ResourceEvent):void{

         console.log("resource加载完成");
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
        RES.loadGroup("preload");
    }
    /** preload资源组加载完成*/
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        console.log("加载完成");
        if(event.groupName=="preload"){
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            //游戏的主类开始实例化
            var gameContainer:fighter.GameContainer = new fighter.GameContainer();
            this.addChild(gameContainer);

            var texture = RES.getRes("img_1");
            var config = RES.getRes("blowParticle");
            var system = new particle.GravityParticleSystem(texture, config);            
            this.addChild(system);
            system.start(0.2);
            //FPS
            // egret.Profiler.getInstance().run();
        }
    }
    /**preload资源组加载进度*/
    private onResourceProgress(event:RES.ResourceEvent):void {
        if(event.groupName=="preload"){
            this.loadingView.onProgress(event.itemsLoaded,event.itemsTotal);
        }
    }

}


