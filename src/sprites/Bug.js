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

    this.setDepth(60);

    this.maxHP = 10;
    this.hp = this.maxHP;
    this.isDead = false;
    this.enemyType = 'bug';
    this.alerted = false;
    this.damageOnTouch = 5;

    this.sprite.play({ key: 'bug-move', repeat: -1, frameRate: 4 });

    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.sprite.setPosition((this.body.width / 2), (this.body.height / 2));
  }

  drawHealthBar() {
    this.hpBar.clear();
    this.hpBar.fillStyle(0x333333);
    this.hpBar.fillRect(0, (this.body.height / 2), this.body.width, 6);
    this.hpBar.fillStyle(0xCC0000);
    this.hpBar.fillRect(
      2,
      (this.body.height / 2 + 2),
      ((this.body.width - 4) * (this.hp / this.maxHP)),
      2
    );
  }

  update() {
    const d2mc = pMath.Distance.Between(this.x, this.y, this.mc.x, this.mc.y);
    const closeToMC = (d2mc < 300);
    const hasHP = (this.hp > 0);

    if (hasHP) {
      if (closeToMC || this.alerted) {
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
      this.setDepth(40);
    }
  }
}

export default Bug;