import Phaser from "phaser";

const createPlatform = (
  group,
  spriteWidth,
  sceneHeight,
  myTexture,
  depth = 0,
  dist = 0
) => {
  const platform = group
    .create(spriteWidth + dist, sceneHeight, myTexture)
    .setOrigin(0, 1)
    .setScale(0.5);
  group.setDepth(depth);
  if (myTexture === "ground") {
    platform.setImmovable(true);
    platform.setSize(platform.displayWidth * 2, platform.displayHeight * 2);
  }

  switch (myTexture) {
    case "ground":
      platform.setDepth(2);
      break;
    case "cloudss":
      platform.setDepth(1);
      break;
    default:
  }
};

const updatePlatform = (
  group,
  spriteWidth,
  sceneHeight,
  myTexture,
  dist = 0
) => {
  const child = group.get(spriteWidth - dist, sceneHeight, myTexture);
  child.setVisible(true);
  child.setActive(true);
  switch (myTexture) {
    case "ground":
      child.setDepth(3);
      break;
    case "clouds":
      child.setDepth(1);
      break;
    default:
  }
};

const moveBackgroundPlatform = (
  group,
  platformWidth,
  sceneHeight,
  myTexture,
  scrollFactor
) => {
  group.children.iterate((child) => {
    child.x -= scrollFactor;
    if (child.x < -child.displayWidth) {
      group.killAndHide(child);
      updatePlatform(
        group,
        platformWidth,
        sceneHeight,
        myTexture,
        scrollFactor
      );
    }
  });
};

class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.timer = 0;
    this.secondTimer = 0;
    this.healthTimer = 0;
    this.missileScore = 0;
    this.score = 0;
  }

  create() {
    this.optionsScene = this.scene.get("OptionsScene");

    this.score = 0;
    this.health = 120;

    this.scoreText = this.add
      .text(25, 45, "Score: ", {
        fontSize: "30px",
        fill: "#ffffff",
        fontFamily: '"Akaya Telivigala"',
        strokeThickness: 2,
        stroke: "#ff9900",
      })
      .setDepth(8);

    this.scoreValue = this.add
      .text(120, 45, `${this.score}`, {
        fontSize: "30px",
        fill: "#ffffff",
        fontFamily: '"Akaya Telivigala"',
        strokeThickness: 5,
        stroke: "#000",
      })
      .setDepth(8);

    this.healthText = this.add
      .text(25, 10, "Health: ", {
        fontSize: "25px",
        fill: "#ffffff",
        strokeThickness: 4,
        fontFamily: '"Akaya Telivigala"',
        stroke: "#FF69B4",
      })
      .setDepth(8);

    this.progressBox = this.add.graphics();
    this.progressBar = this.add.graphics();
    this.progressBox.setDepth(8);
    this.progressBar.setDepth(8);

    this.progressBox.lineStyle(3, 0x0275d8, 1);
    this.progressBox.strokeRect(114, 24, this.health + 4, 10);

    this.progressBar.fillStyle(0x2bdee4, 1);
    this.progressBar.fillRect(116, 25, this.health, 7);

    this.addGameBackground();

    this.player = this.physics.add
      .sprite(200, this.scale.height - 500, "player")
      .setScale(0.3);

    this.physics.add.collider(this.player, this.groundGroup);
    this.player.setGravityY(800);
    this.player.setDepth(6);
    this.player.body.setCollideWorldBounds();
    this.player.setSize(this.player.width / 2, this.player.height - 30);
    this.player.setOffset(this.player.width / 2 - 20, 30);

    this.createAnimations("run", "player", 0, 5, -1, 12);

    this.createAnimations("jump", "player", 0, 0, -1, 1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.jumpTimes = 2;
    this.jump = 0;

    // Birds SECTION

    this.birdGroup = this.physics.add.group();

    const createBird = () => {
      const myY = Phaser.Math.Between(100, 300);
      const bird = this.birdGroup
        .create(this.scale.width + 100, myY, "bird")
        .setScale(0.3);
      bird.setVelocityX(-100);
      bird.flipX = true;
      bird.setDepth(6);
      bird.setSize(bird.displayWidth - 10, bird.displayHeight - 10);
    };

    this.createAnimations("fly", "bird", 0, 8, -1, 7);

    this.birdCreationTime = this.time.addEvent({
      callback: createBird,
      delay: Phaser.Math.Between(2500, 5000),
      callbackScope: this,
      loop: true,
    });

    // Score SECTION

    this.coinGroup = this.physics.add.group();
    const createCoin = () => {
      this.createBirdDrop(this.coinGroup, "coin");
    };

    this.physics.add.collider(
      this.coinGroup,
      this.groundGroup,
      (singleCoin) => {
        singleCoin.setVelocityX(-200);
      }
    );

    this.physics.add.overlap(
      this.player,
      this.coinGroup,
      (player, singleCoin) => {
        this.optionsScene.pickCoin.play();
        singleCoin.destroy();
        this.score += 1;
        this.health += 1;
        this.scoreValue.setText(`${this.score}`);
        this.hoveringTextScore(player, "1+", "#0000ff");
      }
    );

    this.coinCreationTime = this.time.addEvent({
      callback: createCoin,
      delay: 1000,
      callbackScope: this,
      loop: true,
    });

    // Missiles SECTION

    this.missileGroup = this.physics.add.group();

    this.explosion = this.add
      .sprite(-100, -100, "explosion")
      .setScale(0.5)
      .setDepth(8);

    this.createAnimations("explode", "explosion", 0, 15, 0, 20);

    this.createAnimations("idle", "explosion", 15, 15, -1, 1);
    this.explosion.play("idle", true);

    this.physics.add.collider(
      this.player,
      this.missileGroup,
      (player, missile) => {
        if (player.body.touching.down && missile.body.touching.up) {
          this.optionsScene.killMissile.play();
          player.setVelocityY(-300);
          missile.setVelocityY(300);
          let message = "";
          if (missile.y < 400) {
            message += "+1.5";
            this.missileScore += 1.5;
          } else {
            message += "+0.5";
            this.missileScore += 0.5;
          }
          this.hoveringTextScore(player, message, "#00ff00");
        } else {
          this.optionsScene.explodeSound.play();
          if (missile.y < 350) {
            this.health -= 15;
          } else {
            this.health -= 10;
          }
          missile.destroy();
          player.setVelocityY(0);
          this.hoveringTextScore(player, "Damage", "#ff0000", "#ff0000");

          this.explosion.x = player.x;
          this.explosion.y = player.y;
          this.explosion.play("explode", true);
        }
      }
    );

    this.leftBound = this.add
      .rectangle(-50, 0, 10, this.scale.height, 0x000000)
      .setOrigin(0);
    // this.bottomBound = this.add
    //   .rectangle(0, gameState.sceneHeight, gameState.sceneWidth, 10, 0x000000)
    //   .setOrigin(0);
    this.boundGroup = this.physics.add.staticGroup();
    this.boundGroup.add(this.leftBound);
    // this.boundGroup.add(this.bottomBound);

    this.physics.add.collider(this.birdGroup, this.boundGroup, (singleBird) => {
      singleBird.destroy();
    });

    this.physics.add.collider(this.coinGroup, this.boundGroup, (singleCoin) => {
      singleCoin.destroy();
    });

    this.physics.add.collider(
      this.missileGroup,
      this.boundGroup,
      (singleMissile) => {
        singleMissile.destroy();
      }
    );

    // Health bar update

    const reduceHealthTimely = () => {
      this.health -= 0.75;
      this.progressBar.clear();
      this.progressBar.fillStyle(0x2bdee4, 1);
      this.progressBar.fillRect(116, 25, this.health, 7);
      this.healthTimer = 0;
    };

    this.time.addEvent({
      callback: reduceHealthTimely,
      delay: 500,
      loop: true,
      callbackScope: this,
    });
  }

  createAnimations(
    animKey,
    spriteKey,
    startFrame,
    endFrame,
    loopTimes,
    frameRate
  ) {
    return this.anims.create({
      key: animKey,
      frames: this.anims.generateFrameNumbers(spriteKey, {
        start: startFrame,
        end: endFrame,
      }),
      frameRate,
      repeat: loopTimes,
    });
  }

  addGameBackground() {
    const bg = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "sky"
    );
    bg.displayHeight = this.scale.height;
    bg.scaleX = bg.scaleY;

    this.cloudsGroup = this.add.group();
    this.firstMountain = this.cloudsGroup
      .create(0, this.scale.height - 200, "clouds")
      .setScale(0.5)
      .setOrigin(0, 1);
    this.cloudsWidth = this.firstMountain.displayWidth;
    this.cloudsGroup.setDepth(1);
    createPlatform(
      this.cloudsGroup,
      this.cloudsWidth,
      this.scale.height - 200,
      "clouds",
      1
    );

    this.mountainsGroup = this.add.group();
    this.firstPlateau = this.mountainsGroup
      .create(0, this.scale.height, "mountains")
      .setScale(0.5)
      .setOrigin(0, 1);
    this.mountainsWidth = this.firstPlateau.displayWidth;
    this.mountainsGroup.setDepth(2);
    createPlatform(
      this.mountainsGroup,
      this.mountainsWidth,
      this.scale.height,
      "mountains",
      2
    );

    this.treesGroup = this.add.group();
    this.firstTree = this.treesGroup
      .create(0, this.scale.height, "trees")
      .setScale(0.5)
      .setOrigin(0, 1);
    this.treesWidth = this.firstTree.displayWidth;
    this.treesGroup.setDepth(3);
    createPlatform(
      this.treesGroup,
      this.treesWidth,
      this.scale.height,
      "trees",
      5
    );

    this.groundGroup = this.physics.add.group();
    this.first = this.groundGroup
      .create(0, this.scale.height, "ground")
      .setOrigin(0, 1)
      .setScale(0.5);
    this.first.setImmovable(true);
    this.groundWidth = this.first.displayWidth;
    this.groundHeight = this.first.displayHeight;
    this.first.setSize(this.groundWidth * 2, this.groundHeight * 2);
    this.groundGroup.setDepth(4);
    createPlatform(
      this.groundGroup,
      this.groundWidth,
      this.scale.height,
      "ground",
      4
    );
  }

  createBirdDrop(group, texture) {
    if (this.birdGroup.getLength() >= 2) {
      const child =
        this.birdGroup.getChildren()[
          Phaser.Math.Between(0, this.birdGroup.getLength() - 1)
        ];
      const drop = group.create(child.x, child.y, texture).setScale(0.05);
      drop.setGravityY(700);
      drop.setGravityX(0);
      drop.setDepth(6);
      drop.setBounce(0.9);
      drop.setSize(drop.width - 200, drop.height - 200);
    }
  }

  createMissile(height, texture) {
    const missile = this.missileGroup.create(
      this.scale.width + 100,
      height * 2,
      texture
    );
    missile.setScale(0.1);
    missile.setDepth(6);
    missile.setSize(missile.width, missile.height - 250);
    missile.setOffset(0, 150);
  }

  hoveringTextScore(player, message, strokeColor, fillColor = "#ffffff") {
    const singleScoreText = this.add
      .text(player.x, player.y, message, {
        fontSize: "30px",
        fill: fillColor,
        fontFamily: '"Akaya Telivigala"',
        strokeThickness: 2,
        stroke: strokeColor,
      })
      .setDepth(7);
    singleScoreText.setAlpha(1);

    this.tweens.add({
      targets: singleScoreText,
      repeat: 0,
      duration: 1000,
      ease: "linear",
      alpha: 0,
      y: singleScoreText.y - 100,
      onComplete() {
        singleScoreText.destroy();
      },
    });
  }

  update(time, delta) {
    moveBackgroundPlatform(
      this.cloudsGroup,
      this.cloudsWidth,
      this.scale.height - 200,
      "clouds",
      0.5
    );
    moveBackgroundPlatform(
      this.mountainsGroup,
      this.mountainsWidth,
      this.scale.height,
      "mountains",
      1.5
    );
    moveBackgroundPlatform(
      this.treesGroup,
      this.treesWidth,
      this.scale.height,
      "trees",
      2.5
    );
    moveBackgroundPlatform(
      this.groundGroup,
      this.groundWidth,
      this.scale.height,
      "ground",
      4
    );

    if (this.health <= 0) {
      // const myUrl = `${fetchScoreData.apiUrl + fetchScoreData.apiKey}/scores`;
      this.scene.stop();
      this.gameOver();
    }

    if (this.missileScore >= 1) {
      this.health += 1;
      this.missileScore -= 1;
    }

    this.player.anims.play("run", true);
    this.birdGroup.children.iterate((child) => {
      child.anims.play("fly", true);
    });

    this.missileGroup.children.iterate((child) => {
      child.x -= 5;
    });

    this.timer += delta;
    if (this.timer >= 5000) {
      this.createMissile(400, "missile");
      this.timer = 0;
    }

    this.secondTimer += delta;
    if (this.secondTimer >= 7000) {
      this.createMissile(350, "missile2");
      this.secondTimer = 0;
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      if (
        this.player.body.touching.down ||
        (this.jump < this.jumpTimes && this.jump > 0)
      ) {
        this.player.setVelocityY(-400);
        this.optionsScene.jumpSound.play();

        if (this.player.body.touching.down) {
          this.jump = 0;
        }
        this.jump += 1;
      }
    }

    if (!this.player.body.touching.down) {
      this.player.anims.play("jump", true);
    }

    if (this.cursors.down.isDown) {
      if (!this.player.body.touching.down) {
        this.player.setGravityY(1300);
      }
    }

    if (this.player.body.touching.down) {
      this.player.setGravityY(800);
    }
  }

  gameOver() {
    this.isGameOver = true;
    this.scene.start("EndScene", { score: this.score });
  }
}

export default GameScene;
