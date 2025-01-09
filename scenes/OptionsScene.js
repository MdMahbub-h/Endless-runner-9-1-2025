import Phaser from "phaser";

class OptionsScene extends Phaser.Scene {
  soundsOn = true;

  constructor() {
    super({
      key: "OptionsScene",
      active: true,
    });
  }

  create() {
    this.soundsOn = localStorage.getItem("sounds_on") === "true" ? true : false;
    this.gameMusic = this.sound.add("game-music", { loop: true, volume: 0.5 });
    this.gameWin = this.sound.add("game-win");
    this.gameLose = this.sound.add("game-lose");
    this.clickSound = this.sound.add("click-sound");
    this.onOffSound = this.sound.add("onoff-sound");

    this.pickCoin = this.createSoundEffect("pickCoin", 0.3, false);
    this.explodeSound = this.createSoundEffect("explosion", 0.4, false);
    this.killMissile = this.createSoundEffect("killMissile", 0.1, false);
    this.jumpSound = this.createSoundEffect("jumpSound", 0.05, false);
    this.spikeSound = this.createSoundEffect("spikeSound", 0.2, false);

    this.gameMusic.play();

    this.soundBtn = this.add
      .image(this.scale.width - 25, 10, "sound-on")
      .setScale(0.06)
      .setDepth(4)
      .setOrigin(1, 0)
      .setInteractive({ cursor: "pointer" });

    if (!this.soundsOn) {
      this.gameMusic.setVolume(0);
      this.gameWin.setVolume(0);
      this.gameLose.setVolume(0);
      this.clickSound.setVolume(0);
      this.onOffSound.setVolume(0);
      this.pickCoin.setVolume(0);
      this.explodeSound.setVolume(0);
      this.killMissile.setVolume(0);
      this.jumpSound.setVolume(0);
      this.spikeSound.setVolume(0);
      this.soundBtn.setTexture("sound-off");
    }

    this.soundBtn.on("pointerup", () => {
      if (this.soundsOn) {
        this.soundsOn = false;
        this.onOffSound.play();
        this.gameMusic.setVolume(0);
        this.gameWin.setVolume(0);
        this.gameLose.setVolume(0);
        this.clickSound.setVolume(0);
        this.onOffSound.setVolume(0);
        this.pickCoin.setVolume(0);
        this.explodeSound.setVolume(0);
        this.killMissile.setVolume(0);
        this.jumpSound.setVolume(0);
        this.spikeSound.setVolume(0);
        this.soundBtn.setTexture("sound-off");
      } else {
        this.soundsOn = true;
        this.onOffSound.play();
        this.gameMusic.setVolume(0.5);
        this.gameWin.setVolume(1);
        this.gameLose.setVolume(1);
        this.clickSound.setVolume(1);
        this.onOffSound.setVolume(1);
        this.pickCoin.setVolume(0.3);
        this.explodeSound.setVolume(0.4);
        this.killMissile.setVolume(0.1);
        this.jumpSound.setVolume(0.05);
        this.spikeSound.setVolume(0.2);
        this.soundBtn.setTexture("sound-on");
      }
      localStorage.setItem("sounds_on", this.soundsOn);
    });
  }

  createSoundEffect(soundKey, volumeLevel, loopStatus = false) {
    const effect = this.sound.add(soundKey, { loop: loopStatus });
    effect.volume = volumeLevel;
    return effect;
  }
}

export default OptionsScene;
