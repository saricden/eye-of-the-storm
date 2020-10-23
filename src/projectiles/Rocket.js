import {GameObjects} from 'phaser';
const {Sprite} = GameObjects;

class Rocket extends Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'rocket');

    this.scene = scene;

    this.contrail = this.scene.add.particles('bullet').setDepth(40);
    this.contrailEmitter = this.contrail.createEmitter({
      x: 0,
      y: 0,
      speed: {
        min: 100,
        max: 200
      },
      lifespan: 1000,
      on: false,
      quantity: 1,
      angle: 0
    });
  }

  fire(x, y, aimX, aimY, angle) {
    this.body.reset(x, y);
    
    this.setRotation(angle);
    this.setActive(true);
    this.setVisible(true);
    this.contrailEmitter.setPosition(x, y);
    this.contrailEmitter.setAngle((angle + Math.PI / 2) * 180 / Math.PI);
    this.contrailEmitter.start();

    this.scene.physics.moveTo(this, aimX, aimY, 200);
  }

  preUpdate() {
    // const d2mc = pMath.Distance.Between(this.x, this.y, this.scene.mc.x, this.scene.mc.y);

    // if (d2mc)

    this.contrailEmitter.setPosition(this.x, this.y);
  }
}

export default Rocket;