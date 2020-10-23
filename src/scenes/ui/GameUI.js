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

    this.totalBullets = {
      'pistol': 100,
      'shotgun': 40,
      'smg': 500,
      'rocket-launcher': 12
    };
    this.clipMaxBullets = {
      'pistol': 20,
      'shotgun': 8,
      'smg': 40,
      'rocket-launcher': 4
    };
    this.bulletsInClip = {
      'pistol': this.clipMaxBullets['pistol'],
      'shotgun': this.clipMaxBullets['shotgun'],
      'smg': this.clipMaxBullets['smg'],
      'rocket-launcher': this.clipMaxBullets['rocket-launcher']
    };
    this.clipRows = {
      'pistol': 2,
      'shotgun': 1,
      'smg': 4,
      'rocket-launcher': 1
    };
    this.uiBullets = {
      'pistol': [],
      'shotgun': [],
      'smg': [],
      'rocket-launcher': []
    };

    this.ammoText = {
      'pistol': null,
      'shotgun': null,
      'smg': null,
      'rocket-launcher': null
    };

    // Clip UI
    for (let g in this.clipRows) {
      const visible = (g === this.mc.currentWeapon);

      for (let y = 0; y < this.clipRows[g]; y++) {
        const rowTotal = (this.clipMaxBullets[g] / this.clipRows[g]);
        for (let x = 0; x < rowTotal; x++) {
          const uiBullet = this.add.image(0, 0, `ui-shell-${g}`);
          uiBullet.setPosition(
            (20 + x * (uiBullet.displayWidth + 10)),
            (20 + y * (uiBullet.displayHeight + 10))
          )
          uiBullet.setScrollFactor(0);
          uiBullet.setDepth(100);
          uiBullet.setVisible(visible);
          uiBullet.setOrigin(0, 0);

          this.uiBullets[g] = [
            ...this.uiBullets[g],
            uiBullet
          ];
        }
      }
    }

    for (let r in this.clipRows) {
      const visible = (r === this.mc.currentWeapon);
      this.ammoText[r] = this.add.text(
        15,
        (22 + this.clipRows[r] * (this.uiBullets[r][0].displayHeight + 10)),
        this.totalBullets[r],
        {
          color: '#FFF',
          fontSize: 20
        }
      );
      this.ammoText[r].setOrigin(0, 0);
      this.ammoText[r].setDepth(100);
      this.ammoText[r].setVisible(visible);
    }

    // UI background
    this.bgClip = this.add.graphics();
    this.bgClip.fillStyle(0x0033CC, 0.5);
    this.bgClip.fillRect(
      0,
      0,
      (30 + (this.clipMaxBullets[this.mc.currentWeapon] / this.clipRows[this.mc.currentWeapon] * (this.uiBullets[this.mc.currentWeapon][0].displayWidth + 10))),
      (40 + this.clipRows[this.mc.currentWeapon] * (this.uiBullets[this.mc.currentWeapon][0].displayHeight + 10) + (this.ammoText[this.mc.currentWeapon].displayHeight))
    );

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
    this.miniMap.setBounds(0, 0, this.gameScene.solidLayer.width, this.gameScene.solidLayer.height);
    this.miniMap.setBackgroundColor(0xCCCCCC);

    this.miniMap.setZoom(0.3);

    // UI background
    this.uiBgGFX.fillStyle(0x0033CC, 0.5);

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

  showAmmoUI(gun) {
    for (let g in this.clipRows) {
      const visible = (g === gun);

      for (let y = 0; y < this.clipRows[g]; y++) {
        const rowTotal = (this.clipMaxBullets[g] / this.clipRows[g]);
        for (let x = 0; x < rowTotal; x++) {
          const bulletIndex = ((y * rowTotal) + x);
          const uiBullet = this.uiBullets[g][bulletIndex];
          uiBullet.setVisible(visible);
        }
      }

      this.ammoText[g].setVisible(visible);
    }

    
    // Clip bg
    this.bgClip.clear();
    this.bgClip.fillStyle(0x0033CC, 0.5);
    this.bgClip.fillRect(
      0,
      0,
      (30 + (this.clipMaxBullets[gun] / this.clipRows[gun] * (this.uiBullets[gun][0].displayWidth + 10))),
      (40 + this.clipRows[gun] * (this.uiBullets[gun][0].displayHeight + 10) + (this.ammoText[gun].displayHeight))
    );
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
      const gun = this.mc.currentWeapon;
      this.uiHpBarGFX.fillStyle(0x0033CC, 0.5);
      this.uiHpBarGFX.fillRect(
        (60 + (this.clipMaxBullets[gun] / this.clipRows[gun] * (this.uiBullets[gun][0].displayWidth + 10))),
        10,
        window.innerWidth - (80 + (this.clipMaxBullets[gun] / this.clipRows[gun] * (this.uiBullets[gun][0].displayWidth + 10))),
        60
      );
      this.uiHpBarGFX.fillStyle(0xFFFFFF, 1);
      this.uiHpBarGFX.fillRect(
        (70 + (this.clipMaxBullets[gun] / this.clipRows[gun] * (this.uiBullets[gun][0].displayWidth + 10))),
        20,
        (window.innerWidth - (100 + (this.clipMaxBullets[gun] / this.clipRows[gun] * (this.uiBullets[gun][0].displayWidth + 10)))) * (this.mc.hp / this.mc.maxHP),
        40
      );
    }
  }
}

export default GameUI;