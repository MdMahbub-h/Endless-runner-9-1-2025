import Phaser from "phaser";

class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
    this.soundOn = false;
  }

  create() {
    this.optionsScene = this.game.scene.getScene("OptionsScene");
    let welcomebg = this.add
      .image(this.scale.width / 2, this.scale.height / 2, "welcomebg")
      .setDisplaySize(this.scale.width, this.scale.height);
    this.playBtn = this.add
      .image(this.scale.width / 2, this.scale.height * 0.85, "playbtn")
      .setInteractive({ cursor: "pointer" })
      .setScale(0.4, 0.6);

    this.playBtnText = this.add
      .text(this.scale.width / 2, this.scale.height * 0.848, "Play", {
        fontFamily: "Roboto, Arial, sans-serif",
        fontSize: "40px",
        fontStyle: "italic bold",
      })
      .setOrigin(0.5, 0.5);

    welcomebg.alpha = 0;
    this.playBtn.alpha = 0;
    this.playBtnText.alpha = 0;
    this.tweens.add({
      targets: [welcomebg, this.playBtn, this.playBtnText],
      alpha: 1,
      duration: 300,
    });

    if (this.soundOn && !this.startSound.isPlaying) {
      this.startSound.play();
    }

    this.soundIcon = this.add
      .image(
        this.scale.width * 0.9,
        this.scale.height * 0.1,
        this.soundOn ? "soundOn" : "soundOff"
      )
      .setInteractive()
      .setScrollFactor(0)
      .setDepth(Infinity)
      .setScale(0.2);

    this.soundIcon.on("pointerdown", () => {
      this.tweens.add({
        targets: this.soundIcon,
        scale: 0.18,
        duration: 100,

        onComplete: () => {
          this.tweens.add({
            targets: this.soundIcon,
            scale: 0.2,
            duration: 100,

            onComplete: () => {
              if (this.soundOn) {
                this.sound.stopAll();

                this.soundIcon.setTexture("soundOff");
              } else {
                this.soundIcon.setTexture("soundOn");
                this.optionsScene.clickSound.play();
              }
            },
          });
        },
      });
    });

    let scoreBoxOn = false;
    this.playBtn.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.playBtnText],
        scale: 0.75,
        duration: 100,
      });
      this.tweens.add({
        targets: [this.playBtn],
        scaleX: 0.3,
        scaleY: 0.5,
        duration: 100,
        onComplete: () => {
          this.tweens.add({
            targets: [this.playBtnText],
            scale: 1,
            duration: 100,
          });
          this.tweens.add({
            targets: [this.playBtn],
            scaleX: 0.4,
            scaleY: 0.6,
            duration: 100,
            onComplete: () => {
              if (!scoreBoxOn) {
                this.detailsBox = this.add
                  .image(
                    this.scale.width / 2,
                    this.scale.height / 2.2,
                    "detailsBox"
                  )
                  .setScale(0.5);
                this.playBtnText.setText("Start");
                this.details = this.add
                  .text(
                    this.scale.width / 2,
                    this.scale.height / 3,
                    "You have to collect\n\nHoney Pots.Be aware\n\nof birds.A bird can\n\nsteal your honey",
                    {
                      fontFamily: "Roboto, Arial, sans-serif",
                      fontSize: "30px",
                      fontStyle: "bold",
                    }
                  )
                  .setOrigin(0.5, 0);
                scoreBoxOn = true;
              } else {
                this.tweens.add({
                  targets: [
                    welcomebg,
                    this.playBtn,
                    this.playBtnText,
                    this.detailsBox,
                    this.soundIcon,
                    this.details,
                  ],
                  alpha: 0, // Fade to invisible
                  duration: 500, // Duration in milliseconds
                  onComplete: () => {
                    welcomebg.destroy();
                    this.playBtn.destroy();
                    this.playBtnText.destroy();
                    this.detailsBox.destroy();
                    this.details.destroy();
                    this.scene.start("GameScene");
                    //this.scene.start("EndScene");
                  },
                });
              }
            },
          });
        },
      });
    });
  }
}

export default StartScene;
