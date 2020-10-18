import {GameObjects, Math as pMath} from 'phaser';

const {Container} = GameObjects;

class Bug extends Container {
  constructor({scene, x, y, mc}) {
    const sprite = scene.physics.add.sprite(0, 0, 'bug');
    const hitBarGfx = scene.add.graphics();

    super(scene, x, y, [
      sprite,
      hitBarGfx
    ]);

    this.scene = scene;
    this.mc = mc;
    this.sprite = sprite;
    this.hpBar = hitBarGfx;

    this.maxHP = 15;
    this.hp = this.maxHP;
    this.isDead = false;
    this.enemyType = 'bug';

    this.sprite.play({ key: 'bug-move', repeat: -1, frameRate: 4 });

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

  drawHealthBar() {
    this.hpBar.clear();
    this.hpBar.fillStyle(0x333333);
    this.hpBar.fillRect(-(this.body.width / 2), 0, this.body.width, 6);
    this.hpBar.fillStyle(0xCC0000);
    this.hpBar.fillRect(
      -(this.body.width / 2 - 2),
      2,
      ((this.body.width - 4) * (this.hp / this.maxHP)),
      2
    );
  }

  update() {
    const d2mc = pMath.Distance.Between(this.x, this.y, this.mc.x, this.mc.y);
    const closeToMC = (d2mc < 300);
    const isAlive = (this.hp > 0);

    if (isAlive) {
      if (closeToMC) {
        const a2mc = pMath.Angle.Between(this.x, this.y, this.mc.x, this.mc.y);
        this.sprite.setRotation(a2mc + (Math.PI / 2));
        this.scene.physics.moveTo(this, this.mc.x, this.mc.y, 40);
      }
      else {
        // idle
        this.body.reset(this.x, this.y);
      }
      this.drawHealthBar();
    }
    else if (!this.isDead) {
      this.hpBar.clear();
      this.body.reset(this.x, this.y);
      this.sprite.play({ key: 'bug-splat', repeat: 0 });
      this.scene.sound.play('sfx-big-splat');
      this.isDead = true;
    }
  }
}

export default Bug;