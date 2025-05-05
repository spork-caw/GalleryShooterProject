// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 1000,
    height: 800,
    physics: {
        default: 'arcade',  
        arcade: {
            gravity: { y: 0 },
            debug: false        
        }
    },
    scene: [GalleryShooter, EndScene]
}

// Global variable to hold sprites
var my = {sprite: {}, text:{}};

const game = new Phaser.Game(config);

