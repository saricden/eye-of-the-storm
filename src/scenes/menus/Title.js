import {Scene} from 'phaser';

class Title extends Scene {
  constructor() {
    super('scene-title');
  }

  create() {
    this.fadeGfx = this.add.graphics();
    this.fadeGfx.setDepth(100);
    this.fadeGfx.fillStyle(0x000000, 1);
    this.fadeGfx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.fadeGfx.setAlpha(1);

    this.cameras.main.setBackgroundColor(0x000000);

    this.titleText = this.add.text(
      (window.innerWidth / 2),
      (window.innerHeight / 2 - 100),
      '[Cool Name Here]',
      {
        color: '#FFF',
        fontSize: 72
      }
    );
    this.titleText.setOrigin(0.5);

    this.playBtn = this.add.text(
      (window.innerWidth / 2),
      (window.innerHeight / 2 + 100),
      'Play Game',
      {
        color: '#FFF',
        backgroundColor: '#000',
        fontSize: 36,
        padding: 5
      }
    );
    this.playBtn.setOrigin(0.5);

    this.playBtn.setInteractive();

    this.playBtn.on('pointerover', () => {
      this.playBtn.setStyle({
        backgroundColor: '#0CF',
        color: '#000'
      });
    });

    this.playBtn.on('pointerout', () => {
      this.playBtn.setStyle({
        backgroundColor: '#000',
        color: '#FFF'
      });
    });

    this.playBtn.on('pointerup', () => {
      this.bgm.stop();
      this.scene.start('scene-game');
    });

    this.tweens.add({
      targets: this.fadeGfx,
      alpha: 0,
      duration: 4000,
      repeat: 0
    });

    this.bgm = this.sound.add('music-tsote', {
      loop: true
    });
    this.bgm.play();
  }
}

export default Title;