document.addEventListener("DOMContentLoaded", function(e) {
    
    //Building object to held x and y positions
    class Vec {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
    }
    
    //Data structure for the rectangles that will be created
    class Rec {
        constructor(w,h) {
            this.pos = new Vec;
            this.size = new Vec(w,h);
        }
    }
    
    //using the Rec to create the ball. The ball object will inherit from the Rec
    class Ball extends Rec {
        constructor() {
            //Size of the Rec
            super(10,10)
            //Velocity
            this.vel = new Vec;
        }
    }
    
    let canvas = document.getElementById('pong');
    let context = canvas.getContext('2d');
    
    //Creating the new ball
    let ball = new Ball;
//    ball.pos.x = 100;
//    ball.pos.y = 50;

    //Animating the ball, movement of the ball is relevant to the update method deltaTime
    function updates(deltaTime) {
        ball.pos.x += ball.vel.x * deltaTime;
    }
    
    //Canvas
    context.fillStyle = '#000';
    context.fillRect(0,0, canvas.width, canvas.height);
    
    //Ball
    context.fillStyle = '#fff';
    context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
    
});

