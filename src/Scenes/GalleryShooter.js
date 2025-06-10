class GalleryShooter extends Phaser.Scene {
    constructor() {
        super("galleryShooter");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("worm", "worm.png");
        this.load.image("snake", "snakeLava.png");
        this.load.image("bee", "bee.png");
        this.load.image("mouse", "mouse.png");
        this.load.image("specialLilDude", "flyMan_fly.png");
        this.load.image("shrapnel", "slimeBlue_squashed.png");
        this.load.image("rain", "alienBlue_badge1.png");
        this.load.image("lifeSun", "sun1.png");
        this.load.image("cloud", "cloud.png");
        this.load.image("snailDamage", "snail_walk.png")
    }

    create() {
        this.round = 1;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.my = {
            raindrops: this.physics.add.group(),
            enemyGroup: this.physics.add.group(),
            specialGroup: this.physics.add.group(),
            shrapnelGroup: this.physics.add.group(),
            snailGroup: this.physics.add.group(),
            text: {},
            livesIcons: [],
            score: 0,
            shotsLeft: 0,
            health: 5,
            player: null
        };

        this.addPlayer();
        this.createUI();

        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.my.shotsLeft > 0) {
                let rain = this.physics.add.image(this.my.player.x, this.my.player.y + 50, 'rain');
                this.my.raindrops.add(rain);
                rain.setVelocityY(600);
                this.my.shotsLeft--;
                this.my.text.ammo.setText(`Shots: ${this.my.shotsLeft}`);
            }
        });

        this.physics.add.overlap(this.my.raindrops, this.my.enemyGroup, this.hitEnemy, null, this);
        this.physics.add.overlap(this.my.raindrops, this.my.specialGroup, this.hitSpecial, null, this);
        this.physics.add.overlap(this.my.shrapnelGroup, this.my.player, this.playerHit, null, this);
        this.physics.add.overlap(this.my.snailGroup, this.my.player, this.snailHit, null, this);
        this.enemyFireTimer = this.time.addEvent({
            delay: 2000,
            callback: this.enemyFireSnail,
            callbackScope: this,
            loop: true
        });

        this.initGame();
    }

    initGame() {
        this.my.shotsLeft = this.getShotsPerRound();
        this.my.enemyGroup.clear(true, true);
        this.my.specialGroup.clear(true, true);
        this.my.raindrops.clear(true, true);
        this.my.snailGroup.clear(true, true);
        this.my.shrapnelGroup.clear(true, true);

        this.spawnEnemies();
        this.spawnSpecialTarget();
        this.my.text.ammo.setText(`Shots: ${this.my.shotsLeft}`);
    }

    getShotsPerRound() {
        return this.round === 1 ? 12 : this.round === 2 ? 8 : 6;
    }

    addPlayer() {
        if (!this.my.player) {
            this.my.player = this.physics.add.image(500, 50, 'cloud');
            this.my.player.setCollideWorldBounds(true);
        } else {
            this.my.player.setPosition(500, 50);
            this.my.player.setVelocity(0, 0);
            this.my.player.setVisible(true);
            this.my.player.active = true;
        }
    }

    spawnEnemies() {
        this.my.enemyGroup.clear(true, true);
        const spacing = 100;
        const enemyTypes = ["worm", "snake", "bee", "mouse"];
    
        for (let i = 0; i < 6; i++) {
            let x = 150 + i * spacing;
    
            // Pick an enemy type by cycling through all 4 types
            let enemyType = enemyTypes[i % enemyTypes.length];
    
            let enemy = this.physics.add.image(x, 500, enemyType);
            enemy.setData("type", enemyType);
            enemy.setData("health", 1);
            enemy.setData("originalX", x);
            enemy.setData("offset", Phaser.Math.FloatBetween(0, Math.PI * 2));
    
            enemy.body.setAllowGravity(false);
            enemy.body.setImmovable(true);
            this.my.enemyGroup.add(enemy);
        }
    }

    spawnSpecialTarget() {
        this.my.specialGroup.clear(true, true);
        let special = this.physics.add.image(900, 400, "specialLilDude");
        special.setVelocityX(-80);
        special.setCollideWorldBounds(true);
        special.setBounce(1);
        this.my.specialGroup.add(special);
    }

    createUI() {
        this.my.text.score = this.add.text(10, 10, `Score: ${this.my.score}`, { font: "24px Arial", fill: "#fff" });
        this.my.text.ammo = this.add.text(10, 40, `Shots: ${this.my.shotsLeft}`, { font: "24px Arial", fill: "#fff" });

        for (let i = 0; i < 5; i++) {
            let icon = this.add.image(700 + i * 60, 50, "lifeSun").setScale(0.4);
            this.my.livesIcons.push(icon);
        }
    }

    hitEnemy(rain, enemy) {
        rain.destroy();  // fix: remove bullet
        enemy.setTint(0xff0000);
        enemy.setData("health", enemy.getData("health") - 1);

        if (enemy.getData("health") <= 0) {
            enemy.destroy();
            this.my.score++;
            this.my.text.score.setText(`Score: ${this.my.score}`);
            this.spawnShrapnel(enemy.x, enemy.y);

            if (this.my.score >= 6) {
                this.endGame(true);
            }
        }
    }

    hitSpecial(rain, special) {
        rain.destroy();
        special.destroy();

        if (this.my.health < this.my.livesIcons.length) {
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

    enemyFireSnail() {
        this.my.enemyGroup.getChildren().forEach(enemy => {
            if (!enemy.active) return;
    
            const snail = this.physics.add.image(enemy.x, enemy.y, 'snailDamage');
            this.my.snailGroup.add(snail);
    
            // Velocity toward the player
            const dx = this.my.player.x - enemy.x;
            const dy = this.my.player.y - enemy.y;
            const mag = Math.sqrt(dx * dx + dy * dy);
    
            snail.setVelocity((dx / mag) * 150, (dy / mag) * 150);
            snail.setScale(0.5);
            snail.setDepth(1);
        });
    }

    snailHit(player, snail) {
        snail.destroy();
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

    endGame(win) {
        if (win) {
            this.scene.start("winScene");
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

        this.my.enemyGroup.getChildren().forEach(enemy => {
            let t = this.time.now / 1000;
            let offset = enemy.getData("offset");
            let originalX = enemy.getData("originalX");
            enemy.x = originalX + Math.sin(t + offset) * 20;
        });

        if (
            this.my.enemyGroup.countActive(true) === 0 &&
            this.my.raindrops.countActive(true) === 0
        ) {
            this.round++;
            this.initGame();
        }
    }
}