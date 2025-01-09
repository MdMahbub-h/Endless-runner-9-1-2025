import Phaser from "phaser";
import OptionsScene from "./OptionsScene";

class WelcomeScene extends Phaser.Scene {
  constructor() {
    super("WelcomeScene");
  }
  preload() {
    this.load.image("welcomebg", "assets/startbg.jpeg");
    this.load.image("welcomebgcholitos", "assets/welcomecholitos.png");
    this.load.image("progress", "assets/progress.png");
    this.load.image("progress2", "assets/progress2.png");
    this.load.image("playbtn", "assets/playBtn.png");
    this.load.image("soundOn", "assets/soundOn.png");
    this.load.image("soundOff", "assets/soundOff.png");
    this.load.image("detailsBox", "assets/descriptionBox.png");
    this.load.audio("startSound", "assets/startSound.mp3");
    this.load.image("endbg", "assets/endbg.jpeg");

    this.load.image("sky", "assets/endless_runner/parallax2/layer_04.png");
    this.load.image("clouds", "assets/endless_runner/parallax2/layer_05.png");
    this.load.image(
      "mountains",
      "assets/endless_runner/parallax2/layer_03.png"
    );
    this.load.image("trees", "assets/endless_runner/parallax2/layer_02.png");
    this.load.image("ground", "assets/endless_runner/parallax2/layer_01.png");
    this.load.image("coin", "assets/endless_runner/coin.png");
    this.load.image("missile", "assets/endless_runner/missile.png");
    this.load.image("missile2", "assets/endless_runner/missile2.png");

    this.load.audio("pickCoin", "assets/endless_runner/sounds/pickCoin.wav");
    this.load.audio("explosion", "assets/endless_runner/sounds/explode.wav");
    this.load.audio(
      "killMissile",
      "assets/endless_runner/sounds/killMissile.ogg"
    );
    this.load.audio("jumpSound", "assets/endless_runner/sounds/jumpSound.mp3");
    this.load.audio(
      "spikeSound",
      "assets/endless_runner/sounds/spikeSound.mp3"
    );

    this.load.spritesheet("player", "assets/endless_runner/player.png", {
      frameWidth: 151,
      frameHeight: 220,
    });
    this.load.spritesheet("bird", "assets/endless_runner/birdSprite.png", {
      frameWidth: 860 / 3,
      frameHeight: 793 / 3,
    });
    this.load.spritesheet("explosion", "assets/endless_runner/explosion.png", {
      frameWidth: 64,
      frameHeight: 63,
    });

    this.load.audio("game-music", "assets/sounds/game-music.mp3");
    this.load.audio("click-sound", "assets/sounds/click-sound.mp3");
    this.load.audio("onoff-sound", "assets/sounds/onoff-sound.mp3");
    this.load.audio("game-win", [
      "assets/sounds/mp3/game-win.mp3",
      "assets/sounds/ogg/game-win.ogg",
    ]);
    this.load.audio("game-lose", [
      "assets/sounds/mp3/game-lose.mp3",
      "assets/sounds/ogg/game-lose.ogg",
    ]);
  }

  create() {
    let bgCholitos = this.add
      .image(this.scale.width / 2, this.scale.height / 2.3, "welcomebgcholitos")
      .setDisplaySize(this.scale.width / 2, this.scale.width / 2);

    let width = this.scale.width;
    let height = this.scale.height * 0.9;

    let pwidth = width * 0.69;
    let pheight = 30;

    let progressBox = this.add.image(
      this.scale.width / 2,
      this.scale.height * 0.9,
      "progress"
    );
    progressBox.setDisplaySize(this.scale.width * 0.7, 40);

    let progressBox2 = this.add
      .image(this.scale.width / 2, this.scale.height * 0.9, "progress2")
      .setDepth(3);
    progressBox2.setDisplaySize(this.scale.width * 0.7, 40);
    let progressBar = this.add.graphics();

    let time = 0;
    let timer = this.time.addEvent({
      delay: 20,
      callback: () => {
        progressBar.clear();
        progressBar.fillStyle(0x40c340, 1);
        progressBar.fillRect(
          width / 2 - pwidth / 2 + 2,
          height - pheight / 2,
          pwidth * time,
          pheight
        );
        // phaser = DOMStringList;
        if (time >= 1) {
          this.time.removeEvent(timer);
          this.tweens.add({
            targets: [progressBar, progressBox, progressBox2],
            alpha: 0, // Fade to invisible
            duration: 1000, // Duration in milliseconds
            onComplete: () => {
              progressBar.destroy();
              progressBox.destroy();
              progressBox2.destroy();
              this.scene.start("StartScene");
              this.game.scene.add("OptionsScene", new OptionsScene(), true);
            },
          });
          this.tweens.add({
            targets: bgCholitos,
            alpha: 0.5,
            duration: 500,
            onComplete: () => {
              bgCholitos.destroy();
            },
          });
        } else {
          time += 0.01;
        }
      },
      callbackScope: this,
      loop: true,
    });
  }
}

export default WelcomeScene;
