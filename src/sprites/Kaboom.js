import {GameObjects} from 'phaser';
const {Sprite} = GameObjects;

class Kaboom extends Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'kaboom');

    this.scene = scene;

    this.on('animationcomplete', () => {
      this.setVisible(false);
    });
  }

  boom(x, y) {
    this.body.reset(x, y);
    this.setScale(2);
    this.setActive(true);
    this.setVisible(true);

    this.scene.sound.play('sfx-kaboom');
    this.play({ key: 'boom', repeat: 0, frameRate: 14 });
    
  }
}

export default Kaboom;