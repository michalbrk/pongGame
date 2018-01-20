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
    
    class Player extends Rec {
        constructor() {
            super(20, 100);
            this.score = 0;
        }
    }
    
    class Pong {
        constructor(canvas) {
            this._canvas = canvas;
            this._context = canvas.getContext('2d');
            
            //Creating the new ball
            this.ball = new Ball;

            
            //Creating instances of players
            this.players = [
                new Player,
                new Player,
            ];
            
            this.players[0].pos.x = 40;
            this.players[1].pos.x = this._canvas.width - 40;
            
            //Adjusting the players position in the middle
            this.players.forEach(player => {
                player.pos.y = this._canvas.height / 2;
            });
            
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
            
            this.reset();
        }
        
        collide(player, ball) {
            if(player.left < ball.right && player.right > ball.left &&
               player.top < ball.bottom && player.bottom > ball.top) {
                 
                //Negating the velocity
                ball.vel.x = - ball.vel.x;
            }
        }
        
        draw() {
            //Canvas properties
            this._context.fillStyle = '#000';
            this._context.fillRect(0,0, this._canvas.width, this._canvas.height);

            this.drawRect(this.ball);
            
            //Drawinf the players
            this.players.forEach(player => this.drawRect(player));
        }
        
        drawRect(rect) {
            //Ball properties
            this._context.fillStyle = '#fff';
            this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
        }
        
        //Make sure that the ball gests back to the canvas after going away
        reset() {
            //Put the ball in the middle of the canvas
            this.ball.pos.x = this.ball._canvas.width / 2;
            this.ball.pos.y = this.ball._canvas.height / 2;
            
            //initialize velocity with a click
            this.ball.vel.x = 0;
            this.ball.vel.y = 0;
        }
        
        //Animating the ball, movement of the ball is relevant to the update method deltaTime
        updates(deltaTime) {
            this.ball.pos.x += this.ball.vel.x * deltaTime;
            this.ball.pos.y += this.ball.vel.y * deltaTime;

            //Detecting when the ball touches the screen
            if(this.ball.left < 0 || this.ball.right > this._canvas.width) {
                
                //Measuring the score
                const playerId = this.ball.vel.x < 0 | 0;
                this.players[playerId].score++;
                this.reset();
            }

            //Here, we check it vertically
            if(this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
                this.ball.vel.y = -this.ball.vel.y;
            }
            
            //Making the player 2 (computer) move and follow the ball
            this.players[1].pos.y = this.ball.pos.y;
            
            //Testing the collision
            this.players.forEach(player => this.collide(player, this.ball));

            this.draw();
    
        }
    }
    
    let canvas = document.getElementById('pong');
    //Initialize the game
    let pong = new Pong(canvas);
    
    //Creating movement for the player 1 (mouse)
    canvas.addEventListener('mousemove', event => {
        pong.players[0].pos.y = event.offsetY;
    });
});

