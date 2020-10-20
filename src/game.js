import './main.css';
import Phaser, {Game} from 'phaser';
import BootScene from './scenes/BootScene';
import GameScene from './scenes/GameScene';
import GameUI from './scenes/ui/GameUI';
import GameOver from './scenes/menus/GameOver';
import Title from './scenes/menus/Title';

const config = {
  type: Phaser.WEB_GL,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: document.body,
    width: '100%',
    height: '100%'
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  pixelArt: true,
  scene: [
    BootScene,
    Title,
    GameScene,
    GameOver,
    GameUI
  ]
};

const game = new Game(config);