import {Scene} from 'phaser';

class GameUI extends Scene {
  constructor() {
    super('ui-game');
  }

  create() {
    this.uiBgGFX = this.add.graphics();
    this.uiBgGFX.setScrollFactor(0);
    this.uiBgGFX.setDepth(90);

    this.gameScene = this.scene.get('scene-game');
    this.mc = this.gameScene.mc;
    this.totalBullets = 250;
    this.clipMaxBullets = 20;
    this.clipRows = 2;
    this.bulletsInClip = this.clipMaxBullets;
    this.uiBullets = [];
    this.lastRowY = 0;

    // Clip UI
    for (let y = 0; y < this.clipRows; y++) {
      const rowTotal = (this.clipMaxBullets / this.clipRows);
      for (let x = 0; x < rowTotal; x++) {
        const uiBullet = this.add.image((20 + x * 16), (20 + y * 22), 'ui-shell');
        uiBullet.setScrollFactor(0);
        uiBullet.setDepth(100);

        this.uiBullets = [
          ...this.uiBullets,
          uiBullet
        ];
        this.lastRowY = (20 + y * 16);
      }
    }

    this.ammoText = this.add.text(15, (this.lastRowY + 38), this.totalBullets, {
      color: '#FFF',
      fontSize: 20
    });
    this.ammoText.setOrigin(0, 1);
    this.ammoText.setDepth(100);

    // Mini Map
    const miniMapWidth = (window.innerWidth * 0.25);
    const miniMapHeight = (window.innerHeight * 0.25);
    this.miniMap = this.gameScene.cameras.add(
      window.innerWidth - miniMapWidth - 20,
      window.innerHeight - miniMapHeight - 20,
      miniMapWidth,
      miniMapHeight
    );

    this.miniMap.startFollow(this.gameScene.mc);
    this.miniMap.setBackgroundColor(0xCCCCCC);

    this.miniMap.setZoom(0.3);

    // UI background
    this.uiBgGFX.fillStyle(0x0033CC, 0.5);

    // Clip bg
    this.uiBgGFX.fillRect(
      0,
      0,
      (40 + (this.clipMaxBullets / this.clipRows * 16)),
      (40 + this.clipRows * 22)
    );

    // MiniMap bg... Border :(
    this.uiBgGFX.fillRect(
      window.innerWidth - miniMapWidth - 40,
      window.innerHeight - miniMapHeight - 40,
      20,
      miniMapHeight + 40
    );
    this.uiBgGFX.fillRect(
      window.innerWidth - 20,
      window.innerHeight - miniMapHeight - 40,
      20,
      miniMapHeight + 40
    );
    this.uiBgGFX.fillRect(
      window.innerWidth - miniMapWidth - 20,
      window.innerHeight - 20,
      miniMapWidth,
      20
    );
    this.uiBgGFX.fillRect(
      window.innerWidth - miniMapWidth - 20,
      window.innerHeight - miniMapHeight - 40,
      miniMapWidth,
      20
    );

    this.uiHpBarGFX = this.add.graphics();

    this.fadeGfx = this.add.graphics();
    this.fadeGfx.setDepth(1000);
  }

  fadeToWhite() {
    this.fadeGfx.fillStyle(0xFFFFFF, 1);
    this.fadeGfx.setAlpha(0);
    this.fadeGfx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.tweens.add({
      targets: this.fadeGfx,
      alpha: 1,
      duration: 4000,
      repeat: 0,
      onComplete: () => {
        this.gameScene.scene.start('scene-gameover');
        this.scene.stop();
      }
    });
  }

  update() {
    this.uiHpBarGFX.clear();

    if (this.mc.hp > 0) {
      this.uiHpBarGFX.fillStyle(0x0033CC, 0.5);
      this.uiHpBarGFX.fillRect(
        (60 + (this.clipMaxBullets / this.clipRows * 16)),
        10,
        window.innerWidth - (80 + (this.clipMaxBullets / this.clipRows * 16)),
        60
      );
      this.uiHpBarGFX.fillStyle(0xFFFFFF, 1);
      this.uiHpBarGFX.fillRect(
        (70 + (this.clipMaxBullets / this.clipRows * 16)),
        20,
        (window.innerWidth - (100 + (this.clipMaxBullets / this.clipRows * 16))) * (this.mc.hp / this.mc.maxHP),
        40
      );
    }
  }
}

export default GameUI;