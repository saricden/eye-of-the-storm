import {Physics} from 'phaser';
import Rocket from './Rocket';
const {Arcade} = Physics;
const {Group} = Arcade;

class Rockets extends Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 20,
      key: 'rocket_instance',
      active: false,
      visible: false,
      classType: Rocket
    });

    this.scene = scene;
  }

  fire(x, y, aimX, aimY, angle) {
    const rocket = this.getFirstDead(false);

    if (rocket) {
      rocket.fire(x, y, aimX, aimY, angle);
    }
  }
}

export default Rockets;