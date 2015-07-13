$(document).ready(function(){
    var canvas = $('#tutorial');
    var canvasHTML = $('#tutorial')[0];
    var ctx = canvasHTML.getContext('2d');
    var offset = canvas.offset();
    var triangle = new Triangle(200, canvasHTML.width, 'column', 'surface', 'shoreline');
    var pressed = false;
    render();
    
    canvasHTML.addEventListener('mouseup', function(){
        pressed = false;
    });
    canvasHTML.addEventListener('mousedown', function(){
        pressed = true;
    });
    canvasHTML.addEventListener('mousedown', render, true);
    canvasHTML.addEventListener('mousemove', function(ev) {
        if (!pressed){
            return;
        }
        render(ev);
    });
    
    function render(ev){
        var mouseClick = getMousePosition(ev);
        var path = triangle.getPath;
        var collision = ctx.isPointInPath(path, mouseClick.x, mouseClick.y);
        if (ev === undefined || collision){
            ctx.clearRect(0, 0, canvasHTML.width, canvasHTML.height);
            triangle.draw();
            drawCircle(ev);
        }
    }
    
    function drawCircle(ev){
        var coords;
        var initialY = triangle.vertTrans + triangle.sideLength * (Math.sqrt(3) / 3);
        if (ev === undefined){
            coords = {x: canvasHTML.width / 2 - offset.left, y: initialY - offset.top};
        } else {
            coords = getMousePosition(ev);
        }
        ctx.clearRect(0,0, canvasHTML.width, canvas.height);
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    
    function getMousePosition(ev){
      if (ev === undefined){
          return {x: 0, y: 0};
      }
      var coords;
      var offset = $(canvasHTML).offset();
      if (ev['layerX'] !== undefined) {
          coords = {
              x: ev.pageX - offset.left,
              y: ev.pageY - offset.top
          };
      }
      return coords;
    }
    
    function Triangle(sideLength, boxSize, pointOneText, pointTwoText, pointThreeText){
      this.sideLength = sideLength;
      this.boxSize = boxSize;
      
      this.triHeight = sideLength * (Math.sqrt(3) / 2);
      this.vertTrans = (boxSize - this.triHeight) / 2 - offset.top;
      var horizTrans = (boxSize - sideLength) / 2 - offset.left;
        
      var point1 = {x: boxSize / 2 - offset.left, y: this.vertTrans};
      var point2 = {x: horizTrans, y: this.vertTrans + this.triHeight};
      var point3 = {x: horizTrans + sideLength, y: this.vertTrans + this.triHeight};
        
      this.getPath = function(){
          var path = new Path2D();
          path.moveTo(point1.x, point1.y);
          path.lineTo(point2.x, point2.y);
          path.lineTo(point3.x, point3.y);
          path.lineTo(point1.x, point1.y);
          return path;
      }();
       
      this.draw = function(){
          var path = this.getPath;
          ctx.stroke(path);
          ctx.closePath();
          this.drawText();
      };
       
      this.drawText = function(){
          var scalingFact = 1 / 10;
          var fontSize = (scalingFact * sideLength);
          ctx.font = fontSize + "px arial";
          ctx.fillText(pointOneText, point1.x - textMidPoint(pointOneText), point1.y - fontSize / 2);
          ctx.fillText(pointTwoText, point2.x - textMidPoint(pointTwoText), point2.y + fontSize);
          ctx.fillText(pointThreeText, point3.x - textMidPoint(pointThreeText), point3.y + fontSize);
      };
        
      function textMidPoint(text){
          return ctx.measureText(text).width / 2;
      }
        
    }
    
});