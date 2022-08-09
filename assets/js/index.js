let { init, Sprite, GameLoop } = kontra

let { canvas } = init();

let sprite = Sprite({
    x: 100,        // starting x,y position of the sprite
    y: 80,
    color: 'red',  // fill color of the sprite rectangle
    width: 20,     // width and height of the sprite rectangle
    height: 40,
    dx: 2          // move the sprite 2px to the right every frame
});

let loop = GameLoop({  // create the main game loop
    update: function () { // update the game state
        sprite.update();

        // wrap the sprites position when it reaches
        // the edge of the screen
        if (sprite.x > canvas.width) {
            sprite.x = -sprite.width;
        }
    },
    render: function () { // render the game state
        sprite.render();
    }
});

loop.start();    // start the game


// // import kontra from "kontra";
// let { init, Sprite } = kontra;
// let { canvas, context } = init();

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
// obstacles.render();
