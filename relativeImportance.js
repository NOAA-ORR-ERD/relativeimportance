$(document).ready(function(){
    var Triangle = (function(selector, opts){
        this.canvasHTML = document.getElementById(selector);
        this.ctx = this.canvasHTML.getContext('2d');
        var rect = this.canvasHTML.getBoundingClientRect();
        this.offset = {top: rect.top + document.body.scrollTop, left: rect.left + document.body.scrollLeft};
        var boxSize = this.canvasHTML.width;
        var pressed = false;
        
        this.canvasHTML.addEventListener('mouseup', function(){
            pressed = false;
        });
    
        this.canvasHTML.addEventListener('mousedown', function(){
            pressed = true;
        });
        this.canvasHTML.addEventListener('mousedown', function(ev){
            Triangle.prototype.draw.call(this, ev);
        }.bind(this));
        this.canvasHTML.addEventListener('mousemove', function(ev) {
            if (!pressed){
                return;
            }
            Triangle.prototype.draw.call(this, ev);
        }.bind(this));
      var _Opts = {
          sideLength: 100,
          point1Name: 'Point 1',
          point2Name: 'Point 2',
          point3Name: 'Point 3'
      };
      
      var optsKeys = Object.keys(opts);
      
      for (var i = 0; i < optsKeys.length; i++){
          _Opts[optsKeys[i]] = opts[optsKeys[i]];
      }
        
      this.sideLength = _Opts.sideLength;
      
      var triHeight = this.sideLength * (Math.sqrt(3) / 2);
      this.vertTrans = (boxSize - triHeight) / 2 - this.offset.top;
      var horizTrans = (boxSize - this.sideLength) / 2 - this.offset.left;
        
      this.point1 = {x: boxSize / 2 - this.offset.left, y: this.vertTrans, label: _Opts.point1Name};
      this.point2 = {x: horizTrans, y: this.vertTrans + triHeight, label: _Opts.point2Name};
      this.point3 = {x: horizTrans + this.sideLength, y: this.vertTrans + triHeight, label: _Opts.point3Name};
    });
    
    Triangle.prototype.textMidPoint = function(text){
        return this.ctx.measureText(text).width / 2;
    };
    
    Triangle.prototype.draw = function(ev){
        var mouseClick = Triangle.prototype.getMousePosition.call(this, ev);
        var path = Triangle.prototype.getPath.call(this);
        var collision = this.ctx.isPointInPath(path, mouseClick.x, mouseClick.y);
        if (ev === undefined || collision){
            this.ctx.clearRect(0, 0, this.canvasHTML.width, this.canvasHTML.height);
            this.ctx.stroke(path);
            this.ctx.closePath();
            this.drawText();
            this.drawCircle(ev);
         }
    };
    
    Triangle.prototype.getMousePosition = function(ev){
        if (ev === undefined){
              return {x: 0, y: 0};
          }
          var coords;
          if (ev['layerX'] !== undefined) {
              coords = {
                  x: ev.pageX - this.offset.left,
                  y: ev.pageY - this.offset.top
              };
          }
          return coords;
    };
    
    Triangle.prototype.drawCircle = function(ev){
        var coords;
        var initialY = this.vertTrans + this.sideLength * (Math.sqrt(3) / 3);
        if (ev === undefined){
              coords = {x: this.canvasHTML.width / 2 - this.offset.left, y: initialY - this.offset.top};
        } else {
            coords = Triangle.prototype.getMousePosition.call(this, ev);
        }
        this.ctx.beginPath();
        this.ctx.arc(coords.x, coords.y, 5, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
        return coords;
    };
    
    Triangle.prototype.drawText = function(){
        var scalingFact = 1 / 10;
        var fontSize = (scalingFact * this.sideLength);
        this.ctx.font = fontSize + "px arial";
        this.ctx.fillText(this.point1.label, this.point1.x - this.textMidPoint(this.point1.label), this.point1.y - fontSize / 2);
        this.ctx.fillText(this.point2.label, this.point2.x - this.textMidPoint(this.point2.label), this.point2.y + fontSize);
        this.ctx.fillText(this.point3.label, this.point3.x - this.textMidPoint(this.point3.label), this.point3.y + fontSize);
    };
    
    Triangle.prototype.getPath = function(){
        var path = new Path2D();
        path.moveTo(this.point1.x, this.point1.y);
        path.lineTo(this.point2.x, this.point2.y);
        path.lineTo(this.point3.x, this.point3.y);
        path.lineTo(this.point1.x, this.point1.y);
        return path;
    };
    
    var triangle = new Triangle('tutorial', {sideLength: 200, point1Name: 'column',point2Name: 'surface', point3Name: 'shoreline'});
    triangle.draw();
});