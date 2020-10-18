import {GameObjects, Math as pMath} from 'phaser';

const {Container} = GameObjects;

class RedLeader extends Container {
  constructor({scene, x, y}) {
    const top = scene.physics.add.sprite(0, 0, 'mc-top');
    const bottom = scene.physics.add.sprite(0, 0, 'mc-bottom');
    super(scene, x, y, [
      bottom,
      top
    ]);

    this.top = top;
    this.bottom = bottom;
    this.scene = scene;

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.body.setSize(32, 32);

    const centerX = (this.body.width / 2);
    const centerY = (this.body.height / 2);

    this.top.setPosition(centerX, centerY);
    this.bottom.setPosition(centerX, centerY);

    this.top.setOrigin(0.5, 0.5);

    this.top.play({ key: 'idle', repeat: 0 });

    this.setDepth(3);

    this.isReloading = false;

    // Bullets
    const enemyCollider = {
      contains: (x, y) => {
        let hit = false;

        this.scene.enemies.forEach((enemy) => {
          if (enemy.sprite.body.hitTest(x, y) && !enemy.isDead) {
            enemy.hp -= 1;
            if (enemy.enemyType === 'bug') {
              this.scene.sound.play('sfx-ow');
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
      if (!this.isReloading) {
        if (this.scene.ui.bulletsInClip > 0) {
          this.emitter.start();
          this.top.play({ key: 'fire', repeat: 0 });
        }
        else {
          this.scene.sound.play('sfx-dryfire');
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

  update(time, delta) {
    const {W, S, A, D} = this.WSAD;
    const {mousePointer} = this.scene.input;
    const aimPoint = this.scene.cameras.main.getWorldPoint(mousePointer.x, mousePointer.y);
    const aimX = aimPoint.x;
    const aimY = aimPoint.y;
    const aimAngle = pMath.Angle.Between(this.x, this.y, aimX, aimY);


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

    // animations + rotations

    // There might be something to this...
    // if (aimY > this.y) {
    //   this.bottom.setFlipY(true);
    // }
    // else if (aimY < this.y) {
    //   this.bottom.setFlipY(false);
    // }

    // if (aimX > this.x) {
    //   this.bottom.setFlipX(false);
    // }
    // else if (aimX < this.x) {
    //   this.bottom.setFlipX(false);
    // }

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

export default RedLeader;