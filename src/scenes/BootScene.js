import {Scene} from 'phaser';

class BootScene extends Scene {
  constructor() {
    super("scene-boot");
  }
  
  preload() {
    // Load any assets here from your assets directory
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('ui-shell-pistol', 'assets/ui-shell.png');
    this.load.image('ui-shell-shotgun', 'assets/ui-shell-shotgun.png');
    this.load.image('ui-shell-smg', 'assets/ui-shell-smg.png');
    
    this.load.atlas('mc-top', 'assets/mc-top.png', 'assets/mc-top.json');
    this.load.atlas('mc-bottom', 'assets/mc-bottom.png', 'assets/mc-bottom.json');
    this.load.atlas('mc-die', 'assets/mc-die.png', 'assets/mc-die.json');
    this.load.atlas('guns', 'assets/gun.png', 'assets/gun.json');

    this.load.atlas('bug', 'assets/bug.png', 'assets/bug.json');

    this.load.image('map1-tileset', 'assets/map1-tileset.png');
    this.load.tilemapTiledJSON('map1', 'assets/map1.json');

    // SFX
    this.load.audio('sfx-pistol-shot', 'assets/sfx/gunshot.mp3');
    this.load.audio('sfx-lil-splat', 'assets/sfx/splat.mp3');
    this.load.audio('sfx-big-splat', 'assets/sfx/big-splat.mp3');
    this.load.audio('sfx-ow', 'assets/sfx/ow.mp3');
    this.load.audio('sfx-dryfire', 'assets/sfx/dryfire.mp3');
    this.load.audio('sfx-pistol-reload', 'assets/sfx/reload.mp3');
    this.load.audio('sfx-roar', 'assets/sfx/roar.mp3');
    this.load.audio('sfx-squak', 'assets/sfx/squak.mp3');
    this.load.audio('sfx-footstep', 'assets/sfx/footstep.mp3');
    this.load.audio('sfx-death-cry', 'assets/sfx/death-cry.mp3');
    this.load.audio('sfx-shotgun-shot', 'assets/sfx/shotgun-shot.mp3');
    this.load.audio('sfx-shotgun-reload', 'assets/sfx/shotgun-reload.mp3');
    this.load.audio('sfx-smg-shot', 'assets/sfx/smg-shot.mp3');
    this.load.audio('sfx-smg-reload', 'assets/sfx/smg-reload.mp3');

    // Music
    this.load.audio('music-wow', 'assets/music/Waves_of_War.m4a');
    this.load.audio('music-tsote', 'assets/music/The_Storm_of_the_Eye.m4a');
    this.load.audio('music-teod', 'assets/music/The_End_of_Days.m4a');
  }

  create() {
    this.anims.createFromAseprite('mc-top');
    this.anims.createFromAseprite('mc-bottom');
    this.anims.createFromAseprite('mc-die');
    this.anims.createFromAseprite('guns');
    this.anims.createFromAseprite('bug');

    // this.sound.setVolume(0);

    this.scene.start('scene-title');
  }
}

export default BootScene;