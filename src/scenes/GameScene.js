import {Scene} from 'phaser';
import RedLeader from '../sprites/RedLeader';
import Bug from '../sprites/Bug';

class GameScene extends Scene {
  constructor() {
    super("scene-game");
  }

  resize(gameSize) {
    const {width, height} = gameSize;

    this.cameras.resize(width, height);
    console.log('resize');
  }

  create() {
    this.scale.on('resize', this.resize, this);

    // UI
    this.scene.launch('ui-game');
    this.ui = this.scene.get('ui-game');

    // Tilemap
    this.map = this.add.tilemap('map1');
    this.tileset = this.map.addTilesetImage('map1-tileset');
    this.bgLayer = this.map.createStaticLayer('bg', this.tileset);
    this.solidLayer = this.map.createDynamicLayer('fg', this.tileset);

    this.solidLayer.setCollisionByProperty({ collides: true });

    // Spawnpoints
    const spawnLayer = this.map.getObjectLayer('spawn-points');
    this.bugs = [];

    for (let s in spawnLayer.objects) {
      const point = spawnLayer.objects[s];

      if (point.name === 'mc') {
        this.mc = new RedLeader({
          scene: this,
          x: point.x,
          y: point.y
        });
        
        this.cameras.main.startFollow(this.mc);
        this.cameras.main.setFollowOffset(-(this.mc.body.width / 2), -(this.mc.body.height / 2));

        this.physics.add.collider(this.mc, this.solidLayer);
      }
      else if (point.type === 'bug') {
        const bug = new Bug({
          scene: this,
          x: point.x,
          y: point.y,
          mc: this.mc
        });

        this.physics.add.collider(bug, this.solidLayer);

        this.bugs = [
          ...this.bugs,
          bug
        ];
      }
    }

    this.enemies = [
      ...this.bugs
    ];

    this.cameraZoom = 2;
    this.cameras.main.setZoom(2);
    this.cameras.main.setBackgroundColor(0xCCCCCC);

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      // this.cameraZoom -= (deltaY * 0.005);
      // if (this.cameraZoom < 1) {
      //   this.cameraZoom = 1;
      // }
      // else if (this.cameraZoom > 4) {
      //   this.cameraZoom = 4;
      // }
      // this.cameras.main.setZoom(this.cameraZoom);
    });
    
    // Music
    this.bgm = this.sound.add('music-wow', {
      loop: true
    });
    this.bgm.play();
  }

  update(time, delta) {
    
    this.mc.update(time, delta);
    this.bugs.forEach((bug) => {
      bug.update();
    });
  }

}
export default GameScene;