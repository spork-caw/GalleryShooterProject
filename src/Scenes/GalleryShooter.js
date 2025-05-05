class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("galleryShooter");
    }

    preload() 
    {
        this.load.setPath("./assets/"); 
        this.load.image("duckBrown", "duck_outline_target_brown.png");
        this.load.image("duckYellow", "duck_outline_target_yellow.png");
        this.load.image("targetRed", "target_red3.png");
        this.load.image("shrapnel", "shot_brown_small.png");
        this.load.image("bullet", "shot_blue_large.png");
        this.load.image("lifeDuck", "duck_back.png");
        this.load.image("rifle", "rifle.png");
    }

create() {
    this.round = 1;

    this.cursors = this.input.keyboard.createCursorKeys();

    this.my = {
        bullets: this.physics.add.group(),
        duckGroup: this.physics.add.group(),
        specialGroup: this.physics.add.group(),
        shrapnelGroup: this.physics.add.group(),
        text: {},
        livesIcons: [],
        score: 0,
        shotsLeft: 0,
        health: 3,
        player: null
    };

    this.addPlayer();
    this.createUI();

    this.input.keyboard.on('keydown-SPACE', () => {
        if (this.my.shotsLeft > 0) {
            let bullet = this.physics.add.image(this.my.player.x, this.my.player.y - 50, 'bullet');
            this.my.bullets.add(bullet);
            bullet.setVelocityY(-400);
            this.my.shotsLeft--;
            this.my.text.ammo.setText(`Shots: ${this.my.shotsLeft}`);
        }
    });

    this.physics.add.overlap(this.my.bullets, this.my.duckGroup, this.hitDuck, null, this);
    this.physics.add.overlap(this.my.bullets, this.my.specialGroup, this.hitSpecial, null, this);
    this.physics.add.overlap(this.my.shrapnelGroup, this.my.player, this.playerHit, null, this);

    this.initGame(); 
}

initGame() {
    this.my.shotsLeft = this.getShotsPerRound();


    this.my.duckGroup.clear(true, true);
    this.my.specialGroup.clear(true, true);
    this.my.bullets.clear(true, true);
    this.my.shrapnelGroup.clear(true, true);

    this.spawnDucks();
    this.spawnSpecialTarget();

    this.my.text.ammo.setText(`Shots: ${this.my.shotsLeft}`);
}


getShotsPerRound() {
    return this.round === 1 ? 12 : this.round === 2 ? 8 : 6;
}

addPlayer() {
    if (!this.my.player) {
        this.my.player = this.physics.add.image(500, 750, 'rifle');
        this.my.player.setCollideWorldBounds(true);
    } else {
        this.my.player.setPosition(500, 750);
        this.my.player.setVelocity(0, 0);
        this.my.player.setVisible(true);
        this.my.player.active = true;
    }
}


spawnDucks() {
    this.my.duckGroup.clear(true, true);
    const spacing = 100;
    for (let i = 0; i < 5; i++) {
        let x = 150 + i * spacing;
        let duckType = i % 2 === 0 ? "duckBrown" : "duckYellow";
        let duck = this.physics.add.image(x, 150, duckType);
        duck.setData("type", duckType);
        duck.setData("health", 1);

    
        duck.setData("originalX", x);
        duck.setData("offset", Phaser.Math.FloatBetween(0, Math.PI * 2));

        duck.body.setAllowGravity(false);
        duck.body.setImmovable(true); 
        this.my.duckGroup.add(duck);
    }
}

spawnSpecialTarget() {
    this.my.specialGroup.clear(true, true);
    let special = this.physics.add.image(900, 250, "targetRed");
    special.setVelocityX(-80);
    special.setCollideWorldBounds(true);
    special.setBounce(1);
    this.my.specialGroup.add(special);
}

createUI() {
    this.my.text.score = this.add.text(10, 10, `Score: ${this.my.score}`, { font: "24px Arial", fill: "#fff" });
    this.my.text.ammo = this.add.text(10, 40, `Shots: ${this.my.shotsLeft}`, { font: "24px Arial", fill: "#fff" });

    for (let i = 0; i < 3; i++) {
        let icon = this.add.image(750 + i * 90, 750, "lifeDuck");
        this.my.livesIcons.push(icon);
    }
}

hitDuck(bullet, duck) {
    bullet.destroy();
    duck.setTint(0xff0000);
    duck.setData("health", duck.getData("health") - 1);

    if (duck.getData("health") <= 0) {
        duck.destroy();
        this.my.score++;
        this.my.text.score.setText(`Score: ${this.my.score}`);
        this.spawnShrapnel(duck.x, duck.y);
    }
}

hitSpecial(bullet, special) {
    bullet.destroy();
    special.destroy();

    if (this.my.health < 3) {
        this.my.health++;
        this.updateLivesUI();
    }
}

spawnShrapnel(x, y) {
    let shard = this.physics.add.image(x, y, "shrapnel");
    shard.setDepth(1);
    shard.setScale(0.5);
    shard.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));
    shard.body.setAllowGravity(false);

    this.my.shrapnelGroup.add(shard);

    this.tweens.add({
        targets: shard,
        x: this.my.player.x,
        y: this.my.player.y,
        duration: 800,
        ease: 'Sine.easeIn',
        onComplete: () => {
            shard.destroy();
        }
    });
}

playerHit(player, shrapnel) {
    shrapnel.destroy();
    this.my.health--;
    this.updateLivesUI();

    if (this.my.health <= 0) {
        this.endGame(false);
    }
}

updateLivesUI() {
    for (let i = 0; i < this.my.livesIcons.length; i++) {
        this.my.livesIcons[i].setVisible(i < this.my.health);
    }
}

endGame(win = false) {
    if (win) {
        this.time.delayedCall(2000, () => {
            this.round++;
            this.initGame();
        });
    } else {
        this.scene.start("endScene");
    }
}

update() {
    if (this.cursors.left.isDown) {
        this.my.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
        this.my.player.setVelocityX(200);
    } else {
        this.my.player.setVelocityX(0);
    }


    this.my.duckGroup.getChildren().forEach(duck => {
        let t = this.time.now / 1000; 
        let offset = duck.getData("offset");
        let originalX = duck.getData("originalX");
        duck.x = originalX + Math.sin(t + offset) * 20;
    });

    if (
        this.my.duckGroup.countActive(true) === 0 &&
        this.my.bullets.countActive(true) === 0
    ) {
        this.round++;
        this.initGame();
    }
    
}
}
