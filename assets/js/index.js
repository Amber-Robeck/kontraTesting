let { init, Sprite, GameLoop, initKeys, keyPressed } = kontra

let { canvas } = init();
initKeys();

// let sprite = Sprite({
//     x: 100,        // starting x,y position of the sprite
//     y: 80,
//     color: 'red',  // fill color of the sprite rectangle
//     width: 20,     // width and height of the sprite rectangle
//     height: 40,
//     dx: 2          // move the sprite 2px to the right every frame
// });

// let loop = GameLoop({  // create the main game loop
//     update: function () { // update the game state
//         sprite.update();

//         // wrap the sprites position when it reaches
//         // the edge of the screen
//         if (sprite.x > canvas.width) {
//             sprite.x = -sprite.width;
//         }
//     },
//     render: function () { // render the game state
//         sprite.render();
//     }
// });

// loop.start();    // start the game

let obstacleArray = [];
let allowShoot = true;
let timeDelay = 400;

//create random obstacles
function makeObstacle() {
    // let obstacle = Sprite({
    //     x: canvas.width,
    //     y: Math.random() * canvas.height,
    //     width: 20,
    //     height: 20,
    //     color: 'red',
    //     dx: -2
    // });
    // obstacleArray.push(obstacle);

    return Sprite({
        type: "obstacle",
        x: 50,
        y: 50,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        radius: 30,
        render() {
            this.context.strokeStyle = "white";
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.context.stroke();
        },
    });
};

//push ten obstacles to the array
for (let i = 0; i < 20; i++) {
    obstacleArray.push(makeObstacle());
};

function makeBullet(x, y) {
    return Sprite({
        type: "bullet",
        x: x,
        y: y - 10,
        dx: 0,
        dy: -6,
        radius: 5,
        //time to live
        ttl: 50,
        render() {
            this.context.strokeStyle = "white";
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            this.context.stroke();
        }
    });
    // return Sprite({
    //     type: "bullet",
    //     x: x,
    //     y: y,
    //     dx: player.dx,
    //     dy: player.dy + 10,
    //     //time to live
    //     ttl: 25,
    //     width: 1,
    //     height: 1,
    //     color: "white"
    //     // render() {
    //     //     this.context.fillStyle = this.color;
    //     //     this.context.fillRect(this.x, this.y, this.width, this.height);
    //     // }
    // });
};

let player = Sprite({
    type: "player",
    x: 150,
    y: 250,
    radius: 20,
    width: 10,
    update() {
        if (keyPressed("arrowleft") && this.x - this.radius > 0) {
            this.x -= 2;
        }
        if (keyPressed("arrowright") && this.x + this.radius < canvas.width / 2) {
            this.x += 2;
            //why is this.x 300?
            // console.log(this.x);
            // console.log(this.radius);
            // console.log(canvas.width);
        }
        if (keyPressed("arrowup") && this.y - this.radius > 0) {
            this.y -= 2;
        }
        if (keyPressed("arrowdown") && this.y + this.radius < canvas.height / 2) {
            this.y += 2;
        }
        if (keyPressed("space") && allowShoot) {
            allowShoot = false;
            setTimeout(() => {
                allowShoot = true;
            }, timeDelay);
            let bullet = makeBullet(this.x, this.y);
            obstacleArray.push(bullet);
        }
        this.advance();
    },
    render() {
        this.context.strokeStyle = "white";
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();
    }
});

obstacleArray.push(player);

// function collision(ob1x, ob1y, ob1radius, ob2x, ob2y, ob2radius) {
//     let xDiff = ob1x - ob2x;
//     let yDiff = ob1y - ob2y;
//     let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
//     return distance < ob1radius + ob2radius;
// }

// http://www.gamedevelopment.blog/collision-detection-circles-rectangles-and-polygons/
//added 20 to get the ojects closer before disappearing
function newCollision(ob1, ob2) {
    let xDiff = Math.abs(ob1.x - ob2.x);
    let yDiff = Math.abs(ob1.y - ob2.y);
    let distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    return distance + 20 < ob1.radius + ob2.radius;
}


let loop = GameLoop({
    update() {
        let canvas = kontra.getCanvas();
        // console.log(obstacleArray.length);
        // if (obstacleArray.length === 1) {
        //     window.alert("You Win!");
        // }
        //collision detection for player
        for (let i = 0; i < obstacleArray.length; i++) {
            //if obstacle loop
            if (obstacleArray[i].type === "obstacle") {
                for (let j = 0; j < obstacleArray.length; j++) {
                    if (obstacleArray[j].type !== "obstacle") {
                        let obstacle = obstacleArray[i];
                        let player = obstacleArray[j];
                        // let padding = 10;

                        // if (collision(obstacle.x, obstacle.y, obstacle.radius, player.x, player.y, player.radius)) {
                        if (newCollision(obstacle, player)) {
                            // console.log("collision");
                            obstacle.ttl = 0;
                            player.ttl = 0;
                            break;
                        }

                        // if (obstacle.x + obstacle.radius - padding > player.x - player.radius - padding &&
                        //     obstacle.x - obstacle.radius < player.x + player.radius &&
                        //     obstacle.y + obstacle.radius > player.y - player.radius &&
                        //     obstacle.y - obstacle.radius < player.y + player.radius) {
                        //     obstacle.ttl = 0;
                        //     player.ttl = 0;
                        // }
                    }
                }
            }
        }

        //filter out !isAlive obstacles
        obstacleArray = obstacleArray.filter((obstacle) => obstacle.isAlive());
        //loop through the obstacles array and update each obstacle
        obstacleArray.forEach(obstacle => {
            obstacle.update();
            //if object leaves the left edge
            if (obstacle.x < 0) {
                obstacle.x = canvas.width;
            }
            //if object leaves the top edge 
            else if (obstacle.y < 0) {
                obstacle.y = canvas.height;
            }
            //if object leaves the right edge
            else if (obstacle.x > canvas.width) {
                obstacle.x = 0;
            }
            //if object leaves the bottom edge 
            else if (obstacle.y > canvas.height) {
                obstacle.y = 0;
            }
        });
    },
    render() {
        //loop through the obstacles array and render each obstacle
        obstacleArray.forEach(obstacle => {
            obstacle.render();
        });
    }
}).start();


