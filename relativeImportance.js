$(document).ready(function(){
    var canvas = $('#tutorial');
    var canvasHTML = $('#tutorial')[0];
    var ctx = canvasHTML.getContext('2d');
    var triangle = new Triangle(200, canvasHTML.width);
    render();
    
    canvasHTML.addEventListener('mousedown', render, true);
    canvasHTML.addEventListener('mouseup', function(ev) {
        
    });
    
    function render(ev){
        var mouseClick = getMousePosition(ev);
        var path = triangle.getPath();
        var collision = ctx.isPointInPath(path, mouseClick.x, mouseClick.y)
        if (ev === undefined || collision){
            ctx.clearRect(0, 0, canvasHTML.width, canvasHTML.height);
            triangle.draw();
            drawCircle(ev);
        }
    }
    
    function drawCircle(ev){
        var coords; 
        if (ev === undefined){
            coords = {x: canvasHTML.width / 2, y: canvasHTML.width / 2};    
        } else {
            coords = getMousePosition(ev);
        }
        ctx.clearRect(0,0, canvasHTML.width, canvas.height);
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();
    }
    
    function getMousePosition(ev){
      if (ev === undefined){
          return {x: 0, y: 0};
      }
      var coords;
      var offset = $(canvasHTML).offset();
      if (ev['layerX'] != undefined) {
          coords = {
              x: ev.pageX - offset.left,
              y: ev.pageY - offset.top
          };
      }
      return coords;  
    }
    
    function Triangle(sideLength, boxSize){
      this.sideLength = sideLength;
      this.boxSize = boxSize;
        
      this.getPath = function(){
          var path = new Path2D();
          var offset = canvas.offset();
          var triHeight = sideLength * (Math.sqrt(3) / 2);
          var vertTrans = (boxSize - triHeight) / 2 - offset.top;
          var horizTrans = (boxSize - sideLength) / 2 - offset.left;
          var point1 = {x: boxSize / 2 - offset.left, y: vertTrans};
          var point2 = {x: horizTrans, y: vertTrans + triHeight};
          var point3 = {x: horizTrans + sideLength, y: vertTrans + triHeight};
          path.moveTo(point1.x, point1.y);
          path.lineTo(point2.x, point2.y);
          path.lineTo(point3.x,point3.y);
          path.lineTo(point1.x, point1.y); 
          return path;
      };
        
      this.draw = function(){
          var path = this.getPath();
          ctx.stroke(path);
      };
      
      this.getPoints = function(){
          return this.vertices;
      };
    }
    
});