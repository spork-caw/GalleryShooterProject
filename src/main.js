//got a lot of help from Aslan Gilman!!

// debug with extreme prejudice
"use strict"
//test 
// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 800,
    backgroundColor: "#222",
    physics: {
        default: 'arcade',  
        arcade: {
            gravity: { y: 0 },
            debug: false        
        }
    },
    scene: [GalleryShooter, WinScene, EndScene]
}

// Global variable to hold sprites
var my = {sprite: {}, text:{}};

const game = new Phaser.Game(config);

