let { init, Sprite, GameLoop } = kontra

let { canvas } = init();

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
for (let i = 0; i < 10; i++) {
    obstacleArray.push(makeObstacle());
};
// let obstacles = Sprite({
//     type: "obstacle",
//     x: 50,
//     y: 50,
//     dx: Math.random() * 4 - 2,
//     dy: Math.random() * 4 - 2,
//     radius: 30,
//     render() {
//         this.context.strokeStyle = "white";
//         this.context.beginPath();
//         this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//         this.context.stroke();
//     },
// });
let loop = GameLoop({
    update() {
        let canvas = kontra.getCanvas();
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


