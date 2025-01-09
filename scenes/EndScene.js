import Phaser from "phaser";

class EndScene extends Phaser.Scene {
  constructor() {
    super("EndScene");
  }

  create({ score }) {
    this.soundOn = true;

    let bg = this.add
      .image(this.scale.width / 2, this.scale.height / 3.5, "endbg")
      .setDisplaySize(this.scale.width, this.scale.height * 1.8)
      .setAlpha(0.9);

    let detailsBox = this.add
      .image(this.scale.width / 2, this.scale.height / 2.5, "detailsBox")
      .setScale(0.5);

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
                this.soundOn = false;
                this.soundIcon.setTexture("soundOff");
              } else {
                this.soundOn = true;
                this.soundIcon.setTexture("soundOn");
              }
            },
          });
        },
      });
    });

    this.replayBtn = this.add
      .image(this.scale.width / 2, this.scale.height * 0.85, "playbtn")
      .setInteractive({ cursor: "pointer" })
      .setScale(0.6);

    this.playBtnText = this.add
      .text(this.scale.width / 2, this.scale.height * 0.848, "Play Again", {
        fontFamily: "Roboto, Arial, sans-serif",
        fontSize: "40px",
        fontStyle: "italic bold",
      })
      .setOrigin(0.5, 0.5);

    // this.homeBtn = this.add
    //   .image(this.scale.width / 2 - 80, this.scale.height * 0.83, "homebtn")
    //   .setInteractive({ cursor: "pointer" })
    //   .setScale(1.5);

    // this.homeBtn.on("pointerdown", () => {
    //   this.tweens.add({
    //     targets: [this.homeBtn],
    //     scale: 1.3,
    //     duration: 100,
    //     onComplete: () => {
    //       this.tweens.add({
    //         targets: [this.homeBtn],
    //         scale: 1.5,
    //         duration: 100,
    //         onComplete: () => {
    //           this.soundOn = false;
    //           this.scene.start("StartScene");
    //         },
    //       });
    //     },
    //   });
    // });

    let scoreText = this.add
      .text(this.scale.width / 2 + 5, this.scale.height / 3.5, score, {
        fontSize: "70px",
        fontStyle: "bold",
      })
      .setOrigin(0, 0.5);
    // this.add
    //   .image(this.scale.width / 2 - 35, this.scale.height / 3.5, "honeypot")
    //   .setScale(0.3)
    //   .setOrigin(0.5, 0.5);
    let winText = this.add
      .text(this.scale.width / 2, this.scale.height / 2.25, "You Win!!!", {
        fontSize: "50px",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0.5);

    this.replayBtn.on("pointerdown", () => {
      this.tweens.add({
        targets: [this.playBtnText],
        scale: 0.75,
        duration: 100,
      });
      this.tweens.add({
        targets: [this.replayBtn],
        scale: 0.5,
        duration: 100,
        onComplete: () => {
          this.tweens.add({
            targets: [this.playBtnText],
            scale: 1,
            duration: 100,
          });
          this.tweens.add({
            targets: [this.replayBtn],
            scale: 0.6,
            duration: 100,
            onComplete: () => {
              this.tweens.add({
                targets: [
                  bg,
                  detailsBox,
                  this.replayBtn,
                  this.playBtnText,
                  scoreText,
                  winText,
                  this.soundIcon,
                ],
                alpha: 0, // Fade to invisible
                duration: 500, // Duration in milliseconds
                onComplete: () => {
                  bg.destroy();
                  detailsBox.destroy();
                  this.replayBtn.destroy();
                  this.playBtnText.destroy();
                  scoreText.destroy();
                  winText.destroy();

                  this.scene.start("StartScene");
                },
              });
            },
          });
        },
      });
    });
  }
}

export default EndScene;
