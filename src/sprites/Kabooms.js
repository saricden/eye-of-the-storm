import {Physics} from 'phaser';
import Kaboom from './Kaboom';
const {Arcade} = Physics;
const {Group} = Arcade;

class Kabooms extends Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 20,
      key: 'kaboom_instance',
      active: false,
      visible: false,
      classType: Kaboom
    });
  }

  boom(x, y) {
    const kaboom = this.getFirstDead(false);

    if (kaboom) {
      kaboom.boom(x, y);
    }
  }
}

export default Kabooms;