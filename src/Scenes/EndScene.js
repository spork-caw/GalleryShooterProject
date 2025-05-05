class EndScene extends Phaser.Scene {
    constructor()
{
super('endScene');
}

create() {
    this.add.text( 400,300, 'Game Over', {fontSize: '48px', fill: '#fff'}).setOrigin(0.5);
    this.add.text( 400,340, 'Press SPACE to Restart', {fontSize: '24px', fill: '#fff'}).setOrigin(0.5);
    
    this.input.keyboard.on('keydown-SPACE', () => {
        this.scene.start('galleryShooter');

    });
}

}