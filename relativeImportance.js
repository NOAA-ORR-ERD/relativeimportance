$(document).ready(function(){
    var Triangle = (function(selector, opts){
        var canvasHTML = document.getElementById(selector);
        var ctx = canvasHTML.getContext('2d');
        var rect = canvasHTML.getBoundingClientRect();
        var offset = {top: rect.top + document.body.scrollTop, left: rect.left + document.body.scrollLeft};
        var boxSize = canvasHTML.width;
        var pressed = false;
        
        canvasHTML.addEventListener('mouseup', function(){
            pressed = false;
        });
    
        canvasHTML.addEventListener('mousedown', function(){
            pressed = true;
        });
        canvasHTML.addEventListener('mousedown', this.draw, true);
        canvasHTML.addEventListener('mousemove', function(ev) {
            if (!pressed){
                return;
            }
            this.draw(ev);
        });
      var _Opts = {
          sideLength: 100,
          point1Name: 'Point 1',
          point2Name: 'Point 2',
          point3Name: 'Point 3'
      }
      
      var optsKeys = Object.keys(opts);
      
      for (var i = 0; i < optsKeys.length; i++){
          _Opts[optsKeys[i]] = opts[optsKeys[i]];        
      }
        
      var sideLength = _Opts.sideLength;
      var boxSize = _Opts.boxSize;
      
      var triHeight = sideLength * (Math.sqrt(3) / 2);
      var vertTrans = (boxSize - triHeight) / 2 - offset.top;
      var horizTrans = (boxSize - sideLength) / 2 - offset.left;
        
      var point1 = {x: boxSize / 2 - offset.left, y: vertTrans, label: _Opts.point1Name};
      var point2 = {x: horizTrans, y: vertTrans + triHeight, label: _Opts.point2Name};
      var point3 = {x: horizTrans + sideLength, y: vertTrans + triHeight, label: _Opts.point3Name};
                
      this.getPath = function(){
          var path = new Path2D();
          path.moveTo(point1.x, point1.y);
          path.lineTo(point2.x, point2.y);
          path.lineTo(point3.x, point3.y);
          path.lineTo(point1.x, point1.y);
          return path;
      }();
       
      this.draw = function(ev){
          var mouseClick = this.getMousePosition(ev);
          console.log(mouseClick);
          var path = this.getPath;
          var collision = ctx.isPointInPath(path, mouseClick.x, mouseClick.y);
          if (ev === undefined || collision){
              ctx.clearRect(0, 0, canvasHTML.width, canvasHTML.height);
              var path = this.getPath;
              ctx.stroke(path);
              ctx.closePath();
              this.drawText();
              this.drawCircle(ev);
          }
      };
        
      this.getMousePosition = function(ev){
          if (ev === undefined){
              return {x: 0, y: 0};
          }
          var coords;
          if (ev['layerX'] !== undefined) {
              coords = {
                  x: ev.pageX - offset.left,
                  y: ev.pageY - offset.top
              };
          }
          return coords;
        }
       
      this.drawText = function(){
          var scalingFact = 1 / 10;
          var fontSize = (scalingFact * sideLength);
          ctx.font = fontSize + "px arial";
          ctx.fillText(point1.label, point1.x - textMidPoint(point1.label), point1.y - fontSize / 2);
          ctx.fillText(point2.label, point2.x - textMidPoint(point2.label), point2.y + fontSize);
          ctx.fillText(point3.label, point3.x - textMidPoint(point3.label), point3.y + fontSize);
      };
        
      function textMidPoint(text){
          return ctx.measureText(text).width / 2;
      }
        
      this.drawCircle = function drawCircle(ev){
          var coords;
          var initialY = vertTrans + sideLength * (Math.sqrt(3) / 3);
          if (ev === undefined){
              coords = {x: canvasHTML.width / 2 - offset.left, y: initialY - offset.top};
          } else {
              coords = this.getMousePosition(ev);
          }
          ctx.beginPath();
          ctx.arc(coords.x, coords.y, 5, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fill();
          return coords;
       }
        
    });
    Triangle.prototype.draw = function(){
      var mouseClick = this.getMousePosition(ev);
          var path = this.getPath;
          var collision = ctx.isPointInPath(path, mouseClick.x, mouseClick.y);
          if (ev === undefined || collision){
              ctx.clearRect(0, 0, canvasHTML.width, canvasHTML.height);
              var path = this.getPath;
              ctx.stroke(path);
              ctx.closePath();
              this.drawText();
              this.drawCircle(ev);
          }      
    };
    var triangle = new Triangle('tutorial', {sideLength: 200, point1Name: 'column',point2Name: 'surface', point3Name: 'shoreline'});
    triangle.draw();
});