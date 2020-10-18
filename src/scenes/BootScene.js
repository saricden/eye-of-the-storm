import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    // Load any assets here from your assets directory
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('ui-shell', 'assets/ui-shell.png');
    
    this.load.atlas('mc-top', 'assets/mc-top.png', 'assets/mc-top.json');
    this.load.atlas('mc-bottom', 'assets/mc-bottom.png', 'assets/mc-bottom.json');

    this.load.atlas('bug', 'assets/bug.png', 'assets/bug.json');

    this.load.image('map1-tileset', 'assets/map1-tileset.png');
    this.load.tilemapTiledJSON('map1', 'assets/map1.json');

    // SFX
    this.load.audio('sfx-pistol-shot', 'assets/sfx/gunshot.mp3');
    this.load.audio('sfx-lil-splat', 'assets/sfx/splat.mp3');
    this.load.audio('sfx-big-splat', 'assets/sfx/big-splat.mp3');
    this.load.audio('sfx-ow', 'assets/sfx/ow.mp3');
    this.load.audio('sfx-dryfire', 'assets/sfx/dryfire.mp3');
    this.load.audio('sfx-reload', 'assets/sfx/reload.mp3');

    // Music
    this.load.audio('music-wow', 'assets/music/Waves_of_War.m4a');
    this.load.audio('music-tsote', 'assets/music/The_Storm_of_the_Eye.m4a');
  }

  create() {
    this.anims.createFromAseprite('mc-top');
    this.anims.createFromAseprite('mc-bottom');
    this.anims.createFromAseprite('bug');
    this.scene.start('scene-game');
  }
}

export default BootScene;