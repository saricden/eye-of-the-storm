import {GameObjects, Math as pMath} from 'phaser';

const {Container} = GameObjects;

class RedLeader extends Container {
  constructor({scene, x, y}) {
    const top = scene.physics.add.sprite(0, 0, 'mc-top');
    const bottom = scene.physics.add.sprite(0, 0, 'mc-bottom');
    const dead = scene.physics.add.sprite(0, 0, 'mc-die').setVisible(false);
    const pistol = scene.physics.add.sprite(0, 0, 'pistol').setVisible(false);

    super(scene, x, y, [
      bottom,
      top,
      dead,
      pistol
    ]);

    this.top = top;
    this.bottom = bottom;
    this.dead = dead;
    this.scene = scene;
    this.pistol = pistol;

    this.currentWeapon = 'shotgun';

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setSize(32, 32);

    this.setDepth(50);

    const centerX = (this.body.width / 2);
    const centerY = (this.body.height / 2);

    this.top.setPosition(centerX, centerY);
    this.bottom.setPosition(centerX, centerY);
    this.dead.setPosition(centerX, centerY);

    this.top.setOrigin(0.5, 0.5);

    this.top.play({ key: `idle-${this.currentWeapon}`, repeat: 0 });

    this.maxHP = 20;
    this.hp = this.maxHP;
    this.invicible = false;

    this.isReloading = false;
    this.isDead = false;
    
    this.prevFrameName = '';

    // Bullets
    const enemyCollider = {
      contains: (x, y) => {
        let hit = false;

        this.scene.enemies.forEach((enemy) => {
          if (enemy.sprite.body.hitTest(x, y) && !enemy.isDead) {
            enemy.hp -= 1;
            enemy.alerted = true;
            if (enemy.enemyType === 'bug') {
              this.scene.sound.play('sfx-squak');
            }
            hit = true;
          }
        });

        return hit;
      }
    };

    const bullets = this.scene.add.particles('bullet').setDepth(2);
    this.emitter = bullets.createEmitter({
      x,
      y,
      speed: 500,
      lifespan: 2000,
      on: false,
      quantity: 1,
      angle: 0,
      deathZone: { type: 'onEnter', source: enemyCollider },
      emitCallback: () => {
        this.emitter.stop();
      },
      emitCallbackScope: this
    });

    this.top.on('animationcomplete', () => {
      this.top.play({ key: `idle-${this.currentWeapon}`, repeat: 0 });
      this.isReloading = false;
    });
    
    // SHOOT
    this.scene.input.on('pointerdown', () => {
      if (!this.isDead) {
        if (!this.isReloading) {
          if (this.scene.ui.bulletsInClip[this.currentWeapon] > 0) {
            
            const {mousePointer} = this.scene.input;
            const aimPoint = this.scene.cameras.main.getWorldPoint(mousePointer.x, mousePointer.y);
            const aimX = aimPoint.x;
            const aimY = aimPoint.y;
            const aimAngle = pMath.Angle.Between(this.x, this.y, aimX, aimY);
            const angleDeg = ((aimAngle) * 180 / Math.PI);

            if (this.currentWeapon === 'pistol') {
              // configure emitter for single shot
              this.emitter.fromJSON({
                speed: 500,
                lifespan: 2000,
                quantity: 1
              });

              this.emitter.setAngle(angleDeg);

              this.scene.sound.play('sfx-pistol-shot');
            }
            else if (this.currentWeapon === 'shotgun') {
              // configure emitter for spread shot
              this.emitter.fromJSON({
                speed: 500,
                lifespan: 400,
                quantity: 8
              });

              this.emitter.setAngle({
                min: angleDeg - 30,
                max: angleDeg + 30
              });

              this.scene.sound.play('sfx-shotgun-shot');
            }


            this.scene.ui.bulletsInClip[this.currentWeapon]--;
            const uiBullets = this.scene.ui.uiBullets[this.currentWeapon];
            for (let i = uiBullets.length - 1; i >= 0; i--) {
              const bullet = uiBullets[i];

              if (i > this.scene.ui.bulletsInClip[this.currentWeapon] - 1) {
                bullet.setAlpha(0.5);
              }
            }

            this.emitter.start();
            this.top.play({ key: `fire-${this.currentWeapon}`, repeat: 0 });
          }
          else {
            this.scene.sound.play('sfx-dryfire');
          }
        }
      }
    });

    // Reload
    this.scene.input.keyboard.on('keyup-R', () => {
      const clipMaxBullets = this.scene.ui.clipMaxBullets[this.currentWeapon];
      const bulletsInClip = this.scene.ui.bulletsInClip[this.currentWeapon];
      const totalBullets = this.scene.ui.totalBullets[this.currentWeapon];
      const uiBullets = this.scene.ui.uiBullets[this.currentWeapon];

      if (totalBullets > 0 && bulletsInClip < clipMaxBullets) {
        let bulletsToReload = (clipMaxBullets - bulletsInClip);

        // Incomplete clip
        if (totalBullets - bulletsToReload < 0) {
          bulletsToReload = totalBullets;

          uiBullets.forEach((bullet, i) => {
            if (i >= bulletsInClip && i < bulletsInClip + bulletsToReload) {
              bullet.setAlpha(1);
            }
          });
        }
        // Full clip
        else {
          uiBullets.forEach((bullet) => {
            bullet.setAlpha(1);
          });
        }

        this.scene.ui.totalBullets[this.currentWeapon] -= bulletsToReload;
        this.scene.ui.bulletsInClip[this.currentWeapon] += bulletsToReload;

        this.scene.ui.ammoText[this.currentWeapon].setText(this.scene.ui.totalBullets[this.currentWeapon]);
        this.scene.sound.play('sfx-reload');
        this.top.play({ key: `reload-${this.currentWeapon}`, repeat: 0, frameRate: 6 });
        this.isReloading = true;
      }
    });

    // Change weapon
    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (deltaY < 0 && this.currentWeapon !== 'pistol') {
        this.currentWeapon = 'pistol';
        this.scene.ui.showAmmoUI('pistol');
        this.scene.sound.play('sfx-reload');
      }
      else if (deltaY > 0 && this.currentWeapon !== 'shotgun') {
        this.currentWeapon = 'shotgun';
        this.scene.ui.showAmmoUI('shotgun');
        this.scene.sound.play('sfx-shotgun-reload');
      }
      this.top.play({ key: `idle-${this.currentWeapon}`, repeat: 0 });
    });

    this.moveSpeed = 150;
    this.WSAD = this.scene.input.keyboard.addKeys('W,S,A,D');
  }

  receiveDamage(damage) {
    if (!this.invicible && !this.isDead) {
      this.hp -= damage;

      // Take damage
      if (this.hp > 0) {
        this.invicible = true;
        
        this.scene.sound.play('sfx-ow');

        this.scene.tweens.add({
          targets: this,
          alpha: 0.25,
          yoyo: true,
          repeat: 10,
          duration: 50,
          onComplete: () => {
            this.invicible = false;
          }
        });
      }
      // Dead
      else {
        this.scene.sound.play('sfx-death-cry');
        this.hp = 0;
        this.die();
      }
    }
  }

  die() {
    if (!this.isDead) {
      const {mousePointer} = this.scene.input;
      const aimPoint = this.scene.cameras.main.getWorldPoint(mousePointer.x, mousePointer.y);
      const aimX = aimPoint.x;
      const aimY = aimPoint.y;
      const aimAngle = pMath.Angle.Between(this.x, this.y, aimX, aimY);

      this.isDead = true;

      this.body.setVelocity(0);
      this.top.setVisible(false);
      this.bottom.setVisible(false);
      this.dead.setVisible(true);
      this.dead.play({ key: 'mc-fall', repeat: 0, frameRate: 20 });
      this.dead.setRotation(aimAngle + (Math.PI / 2));

      this.pistol.setVisible(true);
      const xOffset = pMath.Between(-50, 50);
      const yOffset = pMath.Between(-50, 50);
      const deg = pMath.Between(0, 360);

      this.scene.tweens.add({
        targets: this.pistol,
        x: xOffset,
        y: yOffset,
        angleDeg: deg,
        duration: 200,
        repeat: 0
      });

      this.scene.bgm.stop();
      this.scene.cameras.main.zoomTo(1.5, 4500);
      this.scene.ui.fadeToWhite();
    }
  }

  update(time, delta) {
    if (!this.isDead) {
      const {W, S, A, D} = this.WSAD;
      const {mousePointer} = this.scene.input;
      const aimPoint = this.scene.cameras.main.getWorldPoint(mousePointer.x, mousePointer.y);
      const aimX = aimPoint.x;
      const aimY = aimPoint.y;
      const aimAngle = pMath.Angle.Between(this.x, this.y, aimX, aimY);

      this.emitter.setPosition(this.x + (this.body.width / 2), this.y + (this.body.height / 2));

      // Step sfx
      const currentFrameName = this.bottom.frame.name;
      if (this.prevFrameName !== '' && currentFrameName !== this.prevFrameName && (currentFrameName === '2' || currentFrameName === '6')) {
        this.scene.sound.play('sfx-footstep');
      }

      this.prevFrameName = currentFrameName;

      this.top.setRotation(aimAngle + (Math.PI / 2));

      if (W.isDown) {
        this.body.setVelocityY(-this.moveSpeed);
      }
      else if (S.isDown) {
        this.body.setVelocityY(this.moveSpeed);
      }
      else {
        this.body.setVelocityY(0);
      }

      if (A.isDown) {
        this.body.setVelocityX(-this.moveSpeed);
      }
      else if (D.isDown) {
        this.body.setVelocityX(this.moveSpeed);
      }
      else {
        this.body.setVelocityX(0);
      }

      // anims + rotations
      if (W.isDown && A.isDown) {
        this.bottom.play({ key: 'run', repeat: -1 }, true);
        this.bottom.setRotation(Math.PI + (Math.PI / 1.5));
      }
      else if (W.isDown && D.isDown) {
        this.bottom.play({ key: 'run', repeat: -1 }, true);
        this.bottom.setRotation(Math.PI / 4);
      }
      else if (W.isDown) {
        this.bottom.play({ key: 'run', repeat: -1 }, true);
        this.bottom.setRotation(0);
      }
      else if (S.isDown && A.isDown) {
        this.bottom.play({ key: 'run', repeat: -1 }, true);
        this.bottom.setRotation(Math.PI + (Math.PI / 4));
      }
      else if (S.isDown && D.isDown) {
        this.bottom.play({ key: 'run', repeat: -1 }, true);
        this.bottom.setRotation(Math.PI - (Math.PI / 4));
      }
      else if (S.isDown) {
        this.bottom.play({ key: 'run', repeat: -1 }, true);
        this.bottom.setRotation(Math.PI);
      }
      else if (A.isDown) {
        this.bottom.play({ key: 'run', repeat: -1 }, true);
        this.bottom.setRotation(Math.PI + (Math.PI / 2));
      }
      else if (D.isDown) {
        this.bottom.play({ key: 'run', repeat: -1 }, true);
        this.bottom.setRotation(Math.PI - (Math.PI / 2));
      }
      else {
        this.bottom.stop();
        this.bottom.setFrame(0);
      }
    }
  }
}

export default RedLeader;