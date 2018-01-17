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
        get left() {
            return this.pos.x - this.size.x / 2;
        }
        get right() {
            return this.pos.x + this.size.x / 2;
        }
        get top() {
            return this.pos.y - this.size.y / 2;
        }
        get bottom() {
            return this.pos.y + this.size.y / 2;
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
    
    class Pong {
        constructor(canvas) {
            this._canvas = canvas;
            this._context = canvas.getContext('2d');
            
            //Creating the new ball
            this.ball = new Ball;
            this.ball.pos.x = 100;
            this.ball.pos.y = 50;
            this.ball.vel.x = 100;
            this.ball.vel.y = 100;
            
            let lastTime;
            let callback = (millsecs) => {
                if(lastTime) {
                    this.updates((millsecs - lastTime) / 1000)
                }
                lastTime = millsecs;

                //ReqAnmFrm calls a callback for the next time when the browser is ready to draw
                //In callback there is the calculation of time, how long from the last ReqAnmFrm?
                //ReqAnmFrm is used to get a ball's postition
                requestAnimationFrame(callback);
            }
            callback();
        }
        
        //Animating the ball, movement of the ball is relevant to the update method deltaTime
        updates(deltaTime) {
        this.ball.pos.x += this.ball.vel.x * deltaTime;
        this.ball.pos.y += this.ball.vel.y * deltaTime;
        
        //Detecting when the ball touches the screen
        if(this.ball.left < 0 || this.ball.right > this._canvas.width) {
            //Here, we check it horizontally
            //Inverting the ball when it touches the screen
            this.ball.vel.x = -this.ball.vel.x;
        }
        
        //Here, we check it vertically
        if(this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }
    
        //Canvas properties
        this._context.fillStyle = '#000';
        this._context.fillRect(0,0, this._canvas.width, this._canvas.height);
    
        //Ball properties
        this._context.fillStyle = '#fff';
        this._context.fillRect(this.ball.pos.x, this.ball.pos.y, this.ball.size.x, this.ball.size.y);
        }
    }
    
    let canvas = document.getElementById('pong');
    //Initialize the game
    let pong = new Pong(canvas);
});

