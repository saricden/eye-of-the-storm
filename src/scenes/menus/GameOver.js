import {Scene} from 'phaser';

class GameOver extends Scene {
  constructor() {
    super('scene-gameover');
  }

  create() {
    this.fadeGfx = this.add.graphics();
    this.fadeGfx.setDepth(100);
    this.fadeGfx.fillStyle(0xFFFFFF, 1);
    this.fadeGfx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.fadeGfx.setAlpha(1);

    this.cameras.main.setBackgroundColor(0xFFFFFF);

    this.titleText = this.add.text(
      (window.innerWidth / 2),
      (window.innerHeight / 2 - 100),
      'GAME OVER',
      {
        color: '#000',
        fontSize: 72
      }
    );
    this.titleText.setOrigin(0.5);

    this.homeBtn = this.add.text(
      (window.innerWidth / 2),
      (window.innerHeight / 2 + 100),
      'Return to Title Screen',
      {
        color: '#000',
        backgroundColor: '#FFF',
        fontSize: 36,
        padding: 5
      }
    );
    this.homeBtn.setOrigin(0.5);

    this.homeBtn.setInteractive();

    this.homeBtn.on('pointerover', () => {
      this.homeBtn.setStyle({
        backgroundColor: '#000',
        color: '#FFF'
      });
    });

    this.homeBtn.on('pointerout', () => {
      this.homeBtn.setStyle({
        color: '#000',
        backgroundColor: '#FFF'
      });
    });

    this.homeBtn.on('pointerup', () => {
      this.bgm.stop();
      this.scene.start('scene-title');
    });

    this.tweens.add({
      targets: this.fadeGfx,
      alpha: 0,
      duration: 4000,
      repeat: 0
    });

    this.bgm = this.sound.add('music-teod', {
      loop: true
    });
    this.bgm.play();
  }
}

export default GameOver;