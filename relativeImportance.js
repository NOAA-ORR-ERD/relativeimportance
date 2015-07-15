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
        
      var point1 = {x: boxSize / 2 - this.offset.left, y: this.vertTrans + this.offset.top, label: _Opts.point1Name};
      var point2 = {x: horizTrans, y: this.vertTrans + triHeight + this.offset.top, label: _Opts.point2Name};
      var point3 = {x: horizTrans + this.sideLength, y: this.vertTrans + triHeight + this.offset.top, label: _Opts.point3Name};
    
      this.points = [point1, point2, point3];
    });
    
    Triangle.prototype.textMidPoint = function(text){
        return this.ctx.measureText(text).width / 2;   
    }
    
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
        Triangle.prototype.relativeDistances.call(this);
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
    }
    
    Triangle.prototype.drawCircle = function(ev){
        var coords;
        var initialY = this.vertTrans + this.sideLength * (Math.sqrt(3) / 3) + this.offset.top;
        if (ev === undefined){
              coords = {x: this.canvasHTML.width / 2 - this.offset.left, y: initialY};
        } else {
            coords = Triangle.prototype.getMousePosition.call(this, ev);
        }
        this.ctx.beginPath();
        this.ctx.arc(coords.x, coords.y, 5, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
        this.coords = coords;  
    }
    
    Triangle.prototype.drawText = function(){
        var scalingFact = 1 / 10;
        var fontSize = (scalingFact * this.sideLength);
        this.ctx.font = fontSize + "px arial";
        this.ctx.fillText(this.points[0].label, this.points[0].x - this.textMidPoint(this.points[0].label), this.points[0].y - fontSize / 2);
        for (var i = 1; i < this.points.length; i++){
            this.ctx.fillText(this.points[i].label, this.points[i].x - this.textMidPoint(this.points[i].label), this.points[i].y + fontSize);    
        }  
    }
    
    Triangle.prototype.getPath = function(){
        var path = new Path2D();
        path.moveTo(this.points[0].x, this.points[0].y);
        for (var i = this.points.length - 1; i > 0; i--){
            path.lineTo(this.points[i].x, this.points[i].y);
        }
        path.lineTo(this.points[0].x, this.points[0].y);
        return path;   
    }
    
    Triangle.prototype.percentDistances = function(){
        var percents = {};
        var sum = 0;
        for (var key in this.distances){
            percents[key] = this.getPercent(this.distances[key]);
            sum += percents[key];
        }
        console.log(percents, sum);
    }
    
    Triangle.prototype.getPercent = function(distance){
        return Math.abs((distance / (this.sideLength * Math.sqrt(3)))) * 100;   
    }
    
    Triangle.prototype.relativeDistances = function(){
        var distances = {};
        for (var i = 0; i < this.points.length; i++){
            var distance = this.distanceTo(this.points[i]);
            distances[this.points[i].label] = distance;
        }
        this.distances = distances;
        console.log(distances);
        this.percentDistances();
    }
    
    Triangle.prototype.distanceTo = function(point){
        return Math.sqrt(Math.pow(point.x - this.coords.x, 2) + Math.pow(point.y - this.coords.y, 2));   
    }

$(document).ready(function(){    
    var triangle = new Triangle('tutorial', {sideLength: 200, point1Name: 'column',point2Name: 'surface', point3Name: 'shoreline'});
    triangle.draw();
});