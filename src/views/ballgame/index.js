var fabric = require('fabric');
var $ = require('jquery');
var V = require('victor');
var _ = require('lodash');
var Shredder = require('./Shredder');

var getRandomInt = fabric.util.getRandomInt;
var zero = new V(0, 0);

$(function(){
  var balls = new Array(total),
    fetchedBalls = new Array(total),
    ending = false,
    isFetching = false,
    dt = new V(0.01, 0.01),
    canvas = __canvas = new fabric.Canvas($('#stage')[0], {
      renderOnAddRemove: false,
      selection: false
    }),
    shredder = new Shredder(total, group),
    maxx = canvas.width,
    maxy = canvas.height,
    options = {
      size: 40,
      velocity: new V(1, 1).multiply(new V(getRandomInt(20, 50), getRandomInt(20, 50))),
      acceleration: new V(0, 200),
      screen: new V(canvas.width, canvas.height),
      angle: 0,
      topEdge: 100,
      bottomEdge: 100,
      leftEdge: 520,
      rightEdge: 550
    }

  fabric.Image.fromURL('/assets/images/ball.png', blobLoaded);
  $(document)
  .on('click', function(event) {
    fetchBalls();
  })
  .on('keydown', function(event) {
    fetchBalls();
  })

  function blobLoaded(img) {
    for (var i = 0; i < total; i++) {
      var image = new fabric.Image(img.getElement(), {
        width: 40,
        height: 40,
        originX: 'center',
        originY: 'center',
        selectable: false
      });

      var number = new fabric.Text((i + 1).toString(), {
        originX: 'center',
        originY: 'center',
        fontFamily: 'Arial',
        fontSize: 14,
        fill: 'white',
        fontWeight: 'bold',
        selectable: false
      });

      var g = new fabric.Group([image, number], {
        originX: 'center',
        originY: 'center',
        left: getRandomInt(options.leftEdge + 20,
          options.screen.x - options.rightEdge - 20),
        top: getRandomInt(options.topEdge + 20,
          options.screen.y - options.bottomEdge - 20),
        selectable: false
      })
      g.vm = {};

      g.vm.size = options.size;
      g.vm.position = new V(g.left, g.top);
      g.vm.velocity = new V(4, 4).multiply(new V(getRandomInt(50, 100), getRandomInt(50, 100)));
      g.vm.acceleration = options.acceleration;
      g.vm.screen = options.screen;
      g.vm.angle = options.angle;
      g.vx = options.size;
      g.vy = options.size;
      canvas.add(g);
      balls[i] = g;
    }

    animate();
  }

  var preFetched = [];
  fetchBalls = function() {
    if (isFetching) return

    isFetching = true;
    if (fetchedBalls.length) {
      fetchedBalls
      .forEach(function(item, index) {
        if(item && balls[index].visible) {
          balls[index].visible = false;
        }
      })
      preFetched = [];
    }

    var col = 1;
    var colNum = 8;
    var current = shredder.getSplice();
    if (current){
      current
      _.sortBy(current, function(n) {
        return n
      })
      .forEach(function(item, index) {
        if (index >= colNum * col) {
          col += 1
        }
        setTimeout((function(col) {
          return function () {
            fetchBall(item, 180 + (50 * col), 160 + 50 * (index % colNum));
            if (index >= current.length - 1) {
              isFetching = false

              if (!shredder.getLength()) {
                ending = true;
                $('.forward').addClass('show');
              }
            }
          }
        })(col), 300 * index);
      })
    }
  }
  function fetchBall(number, x, y) {
    curBall = balls[number - 1];
    // cache
    fetchedBalls[number - 1] = true;
    curBall.animate('left', x, {
      duration: 600,
      onComplete: function() {
      },
      easing: fabric.util.ease['easeOutBounce']
    });
    curBall.animate('top', y, {
      duration: 600,
      onComplete: function() {
      },
      easing: fabric.util.ease['easeOutBounce']
    });
  }
  function animate() {
    if (!ending)
    for (var i = 0; i < total; i++) {
      if (fetchedBalls[i]) continue
      var ball = balls[i];

      if (ball.vm.position.distanceX(ball.vm.screen) >= - options.rightEdge
        || ball.vm.position.x <= options.leftEdge) {
          ball.vm.velocity.invertX()
      }
      if (ball.vm.position.distanceY(ball.vm.screen) >= - options.bottomEdge
        || ball.vm.position.y <= options.topEdge) {
        ball.vm.velocity.invertY()
      }

      ball.vm.position.add(ball.vm.velocity.clone().multiply(dt));
      // ball.vm.velocity.add(ball.vm.acceleration.clone().multiply(dt));

      ball.top = ball.vm.position.y;
      ball.left = ball.vm.position.x;
    }

    fabric.util.requestAnimFrame(animate, canvas.getElement());
    canvas.renderAll();
  }
})
