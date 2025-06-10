class WinScene extends Phaser.Scene {
    constructor() 
{
super('winScene');
}

create() {
    this.add.text(400, 300, 'YOU WIN!', {font: '48px', fill: '#fff'}).setOrigin(0.5);
    this.add.text( 400,340, 'Press SPACE to Restart', {fontSize: '24px', fill: '#fff'}).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
        this.scene.start('galleryShooter');
    });
}

}