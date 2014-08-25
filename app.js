var CardNode = cc.Node.extend({
  ctor:function()
  {
      this._super();
      this.status = 0;
      this.backnode = new TestNode();
      this.frontnode = new cc.Sprite(res.BackPng);

      this.attr({
            x:269,
            y:100,
            anchorX: 0.5,
            anchorY: 0.5
      });


      this.backnode.attr({
            x:0,
            y:0,
            anchorX: 0.5,
            anchorY: 0.5
      });
      this.frontnode.attr({
            x:0,
            y:0,
            anchorX: 0.5,
            anchorY: 0.5
      });
      


      this.addChild(this.backnode);
  },
  
  turn:function()
  {
    this.status = 1 - this.status;
    if(this.status == 1)
      {
        this.backnode.clear();
        this.removeChild(this.backnode,true);
        this.addChild(this.frontnode);

      }
      else
      {
      //  this.frontnode.clear();
        this.backnode = new TestNode();
      this.backnode.attr({
            x:0,
            y:0,
            anchorX: 0.5,
            anchorY: 0.5
      });
        this.removeChild(this.frontnode,true);
        this.addChild(this.backnode);
      }


  },





});


var cardNode;


var TestNode = cc.DrawNode.extend({

  ctor:function()
  {
    this._super();
    this.width = 138
    this.height = 200
    this.drawRect(new cc.vertex2(1,1),new cc.vertex2(136,198),cc.color(24,125,255),1,cc.color(253,242,245));

    var helloLabel = new cc.LabelTTF("J","Arial",25);

        helloLabel.attr({
            x:30,
            y:170,
            anchorX: 0.5,
            anchorY:0.5
        });

    this.addChild(helloLabel);

  },
  draw:function(){
    cc._drawingUtil.drawLine(new cc.Point(0,0),new cc.Point(500,500))
    this._super();
  }

});

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            function () {
                cc.log("Menu is clicked!");
            }, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);


        //this.addChild(node,180);
        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = 0;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            scale: 0.5,
            rotation: 180
        });
       // this.addChild(this.sprite, 0);
         cardNode = new CardNode();


        this.addChild(cardNode,200);

        this.sprite.runAction(
            cc.sequence(
                cc.rotateTo(2, 0),
                cc.scaleTo(2, 1, 1)
            )
        );
        helloLabel.runAction(
            cc.spawn(
               // cc.moveBy(2.5, cc.p(0, size.height - 40)),
                cc.tintTo(2.5,255,125,0)
            )
        );
        //cardNode.turn();
        cardNode.runAction(
           cc.spawn(
                cc.rotateBy(1, 720),
                cc.moveTo(1,  cc.p(480, 480))
            )
        );

        var texture = cc.textureCache.addImage(res.StayPng);
        var row = 4
        var col = 4
        var p_width= 60
        var p_height =94
        var animation = cc.Animation.create();
        for(var i =0; i < row  ; ++i)
        {
          for(var j=0;j<col;++j)
          {
            animation.addSpriteFrameWithTexture(texture, new cc.Rect(j*p_width,i*p_height,p_width,p_height));

          }
        }
        animation.setDelayPerUnit(0.05);
        animation.setRestoreOriginalFrame(true);
        this._actionStand = cc.RepeatForever.create(cc.Animate.create(animation));



        this.cat = cc.Sprite.createWithSpriteFrame(texture,new cc.Rect(0,0,60,94));
        this.cat.draw_back = this.cat.draw;
        this.cat.draw = function(ctx){
            ctx.save();
            ctx.lineWidth="5";
            ctx.strokeStyle="purple";
             ctx.beginPath();
                   ctx.moveTo(0,0);
                         ctx.lineTo(100,0);
                               ctx.lineTo(100,-100);
                               ctx.lineTo(0,-100);
                               ctx.lineTo(0,0);
                                     ctx.closePath();
                                     ctx.clip();
            this.draw_back(ctx);
            ctx.stroke();
            ctx.restore();
        }
        this.cat.attr({
          x:size.width/2,
          y:size.height/2,
        });
        this.addChild(this.cat,1000);
        this.cat.runAction(this._actionStand);

        this.cat.runAction(
           cc.spawn(
                cc.rotateBy(1, 720),
                cc.moveTo(1,  cc.p(280, 280))
            )
        );
        var that = this;
         cc.eventManager.addListener({
           event: cc.EventListener.MOUSE,         
           onTouchesMoved: function(event) {
            if(event.getButton() == cc.EventMouse.BUTTON_LEFT){
               //event.getCurrentTarget().processEvent(event);
               console.log("left click");
               that.cat.x += event.getDeltaX();
               that.cat.y += event.getDeltaY();
            }
           }   
         },this);
           cc.sys.capabilities.touches = true;
         if (cc.sys.capabilities.hasOwnProperty('touches')){

           //alert("have touch");

         }
         else
           alert("has no touch");

         cc.eventManager.addListener({
           event: cc.EventListener.TOUCH_ALL_AT_ONCE,         
           onTouchesMoved: function(touch,event) {
               //event.getCurrentTarget().processEvent(event);
               
               event = touch[0];
               that.cat.x += event.getDelta().x;
               that.cat.y += event.getDelta().y;
           }   
         },this);
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

