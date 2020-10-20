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

    this.top.play({ key: 'idle', repeat: 0 });

    this.setDepth(3);

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
        if (this.scene.ui.bulletsInClip > 0) {
          this.scene.sound.play('sfx-pistol-shot');
          this.emitter.stop();

          this.scene.ui.bulletsInClip--;
          const {uiBullets} = this.scene.ui;
          for (let i = uiBullets.length - 1; i >= 0; i--) {
            const bullet = uiBullets[i];

            if (i > this.scene.ui.bulletsInClip - 1) {
              bullet.setAlpha(0.5);
            }
          }
        }

      },
      emitCallbackScope: this
    });

    this.top.on('animationcomplete', () => {
      this.top.play({ key: 'idle', repeat: 0 });
      this.isReloading = false;
    });
    
    this.scene.input.on('pointerdown', () => {
      if (!this.isDead) {
        if (!this.isReloading) {
          if (this.scene.ui.bulletsInClip > 0) {
            this.emitter.start();
            this.top.play({ key: 'fire', repeat: 0 });
          }
          else {
            this.scene.sound.play('sfx-dryfire');
          }
        }
      }
    });

    // Reload
    this.scene.input.keyboard.on('keyup-R', () => {
      const {clipMaxBullets, bulletsInClip, totalBullets, uiBullets} = this.scene.ui;

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

        this.scene.ui.totalBullets -= bulletsToReload;
        this.scene.ui.bulletsInClip += bulletsToReload;

        this.scene.ui.ammoText.setText(this.scene.ui.totalBullets);
        this.scene.sound.play('sfx-reload');
        this.top.play({ key: 'reload', repeat: 0, frameRate: 6 });
        this.isReloading = true;
      }
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

      // Bullets
      this.emitter.setPosition(this.x + (this.body.width / 2), this.y + (this.body.height / 2));
      const angleDeg = ((aimAngle) * 180 / Math.PI);
      this.emitter.setAngle(angleDeg);
    }
  }
}

export default RedLeader;