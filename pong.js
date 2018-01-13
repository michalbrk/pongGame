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
    ball.pos.x = 100;
    ball.pos.y = 50;
    ball.vel.x = 100;
    ball.vel.y = 100;
    
    let lastTime;
    
    
    function callback(millsecs) {
        if(lastTime) {
            updates((millsecs - lastTime) / 1000)
        }
        lastTime = millsecs;
        
        //ReqAnmFrm calls a callback for the next time when the browser is ready to draw
        //In callback there is the calculation of time, how long from the last ReqAnmFrm?
        //ReqAnmFrm is used to get a ball's postition
        requestAnimationFrame(callback);
    }

    //Animating the ball, movement of the ball is relevant to the update method deltaTime
    function updates(deltaTime) {
        ball.pos.x += ball.vel.x * deltaTime;
        ball.pos.y += ball.vel.y * deltaTime;
    
        //Canvas properties
        context.fillStyle = '#000';
        context.fillRect(0,0, canvas.width, canvas.height);
    
        //Ball properties
        context.fillStyle = '#fff';
        context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
    }
    
    callback();
});

