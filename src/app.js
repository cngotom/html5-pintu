var P2p = function(points){
  var new_points = []
  for(var i = 0;i<points.length;++i)
  {
    new_points.push({x:points[i].X,y:points[i].Y});
  }
  return new_points;
}


var p2P = function(points)
{
  var new_points = []
  for(var i = 0;i<points.length;++i)
  {
    new_points.push({X:points[i].x,Y:points[i].y});
  }
  return new_points;

}

var PolygonSprite = cc.Sprite.extend({

    polygon:[],

    draw:function(ctx)
    {
      ctx.save();
      ctx.lineWidth="5";
      ctx.strokeStyle="purple";

      var locScaleX = cc.view.getScaleX(), locScaleY = cc.view.getScaleY();
      for(var i=0;i<this.polygon.length;++i)
      {
        if(i>0)
          ctx.globalCompositeOperation="xor";
        ctx.beginPath();
        for(var j=0;j<this.polygon[i].length;++j)
        {
          var pos = {x:this.polygon[i][j].X,y:this.polygon[i][j].Y};
          ctxPos = {x:pos.x*locScaleX,y:-pos.y*locScaleY}

          if(j ==0)
            ctx.moveTo(ctxPos.x,ctxPos.y)
          else
            ctx.lineTo(ctxPos.x,ctxPos.y)
        }
        ctx.closePath();
        ctx.clip();
        ctx.stroke();
        this._super();
      }
        

      ctx.restore();



    }



})

polygon  = null; 
var BgSprite = cc.Sprite.extend({

  paths:[],
  currentPath:[],
  startPath:false,
  onMosueMoveEnd:function()
  {
     this.startPath = false;
     this.paths.push(this.currentPath);

     var subj_paths = [{x:0,y:0},{x:0,y:this.height},{x:this.width,y:this.height},{x:this.width,y:0},{x:0,y:0}]
     subj_paths = [p2P(subj_paths)];
     var clip_paths = [p2P(this.currentPath)];
     var scale = 1;
     var cpr = new ClipperLib.Clipper();
     ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
     ClipperLib.JS.ScaleUpPaths(clip_paths, scale);
     cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
     cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);

     var subject_fillType = ClipperLib.PolyFillType.pftNonZero;
     var clip_fillType = ClipperLib.PolyFillType.pftNonZero;
     var solution_paths = new ClipperLib.Paths();
     cpr.Execute(ClipperLib.ClipType.ctDifference, solution_paths, subject_fillType, clip_fillType);


     var diff_path = P2p(solution_paths);
     var diff_path = solution_paths;



     this.polySprite = new PolygonSprite(res.BgPng);
     this.polySprite.polygon = diff_path;
     this.addChild(this.polySprite);
     polygon = this.polySprite;


     this.polySprite.x = this.x + 100;
     this.polySprite.y = this.height /2 ;

     

  },
  onMosueMove:function(loc)
  {
    if(!this.startPath)
    {
      this.startPath = true;
      this.currentPath = [];

    }

    this.currentPath.push(loc);

  },
  draw:function(ctx)
  {

    //this._super(;
    this.polygon = this.currentPath;
    if(0 && this.polygon.length >2 )
      PolygonSprite.prototype.draw.call(this,ctx);
    else
      this._super();

   


    cc._drawingUtil.setLineWidth(5);
    cc._drawingUtil.setDrawColor(155, 210, 0, 255);
    if(this.currentPath.length > 2)
      cc._drawingUtil.drawPoly(this.currentPath,this.currentPath.length);

  }

});
var layer;
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,

    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        this.bgSprite = new BgSprite(res.BgPng);
        this.bgSprite.onMosueMoveEnd
        this.bgSprite.x = 100;
        this.bgSprite.y = 300;

        this.addChild(this.bgSprite);



        var that = this;
        cc.eventManager.addListener({
           event: cc.EventListener.MOUSE,         
           onMouseUp:function(event)
           {
             that.bgSprite.onMosueMoveEnd();
           },
           onMouseMove: function(event) {
            if(event.getButton() == cc.EventMouse.BUTTON_LEFT){
               //event.getCurrentTarget().processEvent(event);
               var loc = event.getLocation();
               if(1||cc.rectContainsPoint(that.bgSprite.getBoundingBox(),loc))
               {
                 nodeloc = that.bgSprite.convertToNodeSpace(loc)
                 that.bgSprite.onMosueMove(nodeloc);
               }
               else
               {
                 that.bgSprite.onMosueMoveEnd();
               }

               console.log("x="+loc.x+",y="+loc.y)
            }
           }   
         },this);
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

