document.addEventListener("DOMContentLoaded", function(e) {
    
    //Building object to held x and y positions
    class Vec {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        
        get len() {
            
            //Hypothesis of the triangle, stabilizing the velocity
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        
        set len(value) {
            const fact = value / this.len;
            this.x *= fact;
            this.y *= fact;
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
            
            //Setting the score numbers
            this.CHAR_PIXEL = 10;
            this.CHARS = [
                '111101101101111',
                '010010010010010',
                '111001111100111',
                '111001111001111',
                '101101111001001',
                '111100111001111',
                '111100111101111',
                '111001001001001',
                '111101111101111',
                '111101111001111'
                
            ].map(str => {
                const canvas = document.createElement('canvas');
                canvas.height = this.CHAR_PIXEL * 5;
                canvas.width = this.CHAR_PIXEL * 3;
                const context = canvas.getContext('2d');
                context.fillStyle = '#fff';
                
                //Iterate and create elements
                str.split('').forEach((fill, i) => {
                    if(fill === '1') {
                        context.fillRect(
                            (i % 3) * this.CHAR_PIXEL, 
                            (i / 3 | 0) * this.CHAR_PIXEL,
                            this.CHAR_PIXEL,
                            this.CHAR_PIXEL);
                    }
                });
                return canvas;
            });
            
            this.reset();
        }
        
        collide(player, ball) {
            if(player.left < ball.right && player.right > ball.left &&
               player.top < ball.bottom && player.bottom > ball.top) {
                 
                //Tweaking the velocity
                const len = ball.vel.len;
                
                //Negating the velocity
                ball.vel.x = - ball.vel.x;
                
                ball.vel.y += 300 * (Math.random() - .5);
                
                //Speeding up the ball's velocity
                ball.vel.len = len * 1.05;
            }
        }
        
        draw() {
            //Canvas properties
            this._context.fillStyle = '#000';
            this._context.fillRect(0,0, this._canvas.width, this._canvas.height);

            this.drawRect(this.ball);
            
            //Drawing the players
            this.players.forEach(player => this.drawRect(player));
            
            this.drawScore();
        }
        
        drawRect(rect) {
            //Ball properties
            this._context.fillStyle = '#fff';
            this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
        }
        
        drawScore() {
            const align = this._canvas.width / 3;
            const CHAR_W = this.CHAR_PIXEL * 4;
            this.players.forEach((player, index) => {
                
                //Convert into characters
                const chars = player.score.toString().split('');
                const offset = align * 
                                (index + 1) - 
                                (CHAR_W * chars.length / 2) + 
                                this.CHAR_PIXEL / 2;
                chars.forEach((char, pos) => {
                    this._context.drawImage(this.CHARS[char | 0],
                                           offset + pos * CHAR_W,
                                           20);
                });
            });
        }
        
        //Make sure that the ball gests back to the canvas after going away
        reset() {
            //Put the ball in the middle of the canvas
            this.ball.pos.x = this._canvas.width / 2;
            this.ball.pos.y = this._canvas.height / 2;
            
            //initialize velocity with a click
            this.ball.vel.x = 0;
            this.ball.vel.y = 0;
        }
        
        //Check the ball's speed, we can start when it isn't moving
        start() {
            if(this.ball.vel.x === 0 && this.ball.vel.y === 0) {
                
            //Randomizing the direction in which the ball goes    
            this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : - 1);
            this.ball.vel.y = 300 * (Math.random() * 2 - 1);
                
            //Securing the consistency of the ball's speed
            this.ball.vel.len = 200;
            }
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
        
        //Mitigating the mouse turn-backs
        const scale = event.offsetY / event.target.getBoundingClientRect().height;
        pong.players[0].pos.y = canvas.height * scale;
    });
    
    canvas.addEventListener('click', event => {
        pong.start();
    });
});

