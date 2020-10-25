import {Scene} from 'phaser';

class Title extends Scene {
  constructor() {
    super('scene-title');
  }

  create() {
    this.fadeGfx = this.add.graphics();
    this.fadeGfx.setDepth(100);
    this.fadeGfx.fillStyle(0x000000, 1);
    this.fadeGfx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    this.fadeGfx.setAlpha(1);

    this.cameras.main.setBackgroundColor(0x9C9C9A);

    this.titleLetters = "Farzone".split('');
    this.letterXs = [];
    const letterXStep = ((window.innerWidth - 120) / (this.titleLetters.length - 1));
    let letterX = 60;

    console.log(this.letterXStep);

    for (let l in this.titleLetters) {
      const letter = this.titleLetters[l];

      this.add.text(
        letterX,
        (window.innerHeight / 2 - 100),
        letter,
        {
          color: '#FFF',
          fontSize: 106,
          fontFamily: 'sans-serif'
        }
      ).setOrigin(0.5).setDepth(20);

      letterX += letterXStep;
    }

    const cliffL = this.add.image(0, window.innerHeight, 'ts-cliff-l');
    cliffL.setOrigin(0, 1);
    cliffL.setDepth(10);

    const cliffR = this.add.image(window.innerWidth, window.innerHeight, 'ts-cliff-r');
    cliffR.setOrigin(1, 1);
    cliffR.setDepth(10);

    const grassStrip = this.add.graphics();
    grassStrip.setDepth(10);
    grassStrip.fillStyle(0x526838, 1);

    grassStrip.fillRect(
      cliffL.displayWidth,
      (window.innerHeight - 85),
      (window.innerWidth - cliffL.displayWidth - cliffR.displayWidth),
      85
    );

    const valley = this.add.graphics();
    valley.setDepth(9);
    valley.fillStyle(0x414735, 1);
    valley.fillRect(
      0,
      (window.innerHeight / 2 - 50),
      window.innerWidth,
      (window.innerHeight + 50)
    )

    this.storyBtn = this.add.text(
      (window.innerWidth / 2),
      (window.innerHeight / 2 + 75),
      'Story Mode',
      {
        color: '#FFF',
        fontSize: 36,
        padding: 5
      }
    );
    this.storyBtn.setOrigin(0.5);
    this.storyBtn.setDepth(20);

    this.storyBtn.setInteractive();

    this.storyBtn.on('pointerover', () => {
      this.storyBtn.setStyle({
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      });
    });

    this.storyBtn.on('pointerout', () => {
      this.storyBtn.setStyle({
        backgroundColor: ''
      });
    });

    this.storyBtn.on('pointerup', () => {
      this.bgm.stop();
      this.scene.start('scene-game');
    });

    this.defenderBtn = this.add.text(
      (window.innerWidth / 2),
      (window.innerHeight / 2 + 125),
      'Defender Mode',
      {
        color: '#FFF',
        fontSize: 36,
        padding: 5
      }
    );
    this.defenderBtn.setOrigin(0.5);
    this.defenderBtn.setDepth(20);

    this.defenderBtn.setInteractive();

    this.defenderBtn.on('pointerover', () => {
      this.defenderBtn.setStyle({
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      });
    });

    this.defenderBtn.on('pointerout', () => {
      this.defenderBtn.setStyle({
        backgroundColor: ''
      });
    });

    this.settingsBtn = this.add.text(
      (window.innerWidth / 2),
      (window.innerHeight / 2 + 175),
      'Settings',
      {
        color: '#FFF',
        fontSize: 36,
        padding: 5
      }
    );
    this.settingsBtn.setOrigin(0.5);
    this.settingsBtn.setDepth(20);

    this.settingsBtn.setInteractive();

    this.settingsBtn.on('pointerover', () => {
      this.settingsBtn.setStyle({
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      });
    });

    this.settingsBtn.on('pointerout', () => {
      this.settingsBtn.setStyle({
        backgroundColor: ''
      });
    });

    this.add.text(
      (window.innerWidth / 2),
      (window.innerHeight - 10),
      'A game by Kirk M. (@saricden)',
      {
        color: '#000',
        fontSize: 18,
        fontFamily: 'serif'
      }
    ).setOrigin(0.5, 1).setDepth(20);

    // this.settingsBtn.on('pointerup', () => {
    //   this.bgm.stop();
    //   this.scene.start('scene-game');
    // });

    this.add.image(
      (window.innerWidth / 1.25),
      (window.innerHeight / 6),
      'ts-sun'
    ).setDepth(7);

    this.add.image(
      0,
      (window.innerHeight / 2 - 50),
      'ts-mountain1'
    ).setDepth(8).setOrigin(0.5, 1);

    this.add.image(
      (window.innerWidth * 0.25),
      (window.innerHeight / 2 - 50),
      'ts-mountain2'
    ).setDepth(8).setOrigin(0.5, 1);

    this.add.image(
      (window.innerWidth * 0.5),
      (window.innerHeight / 2 - 50),
      'ts-mountain3'
    ).setDepth(8).setOrigin(0.5, 1);

    this.add.image(
      (window.innerWidth * 0.75),
      (window.innerHeight / 2 - 50),
      'ts-mountain4'
    ).setDepth(8).setOrigin(0.5, 1);

    this.add.image(
      window.innerWidth,
      (window.innerHeight / 2 - 50),
      'ts-mountain5'
    ).setDepth(8).setOrigin(0.5, 1);

    this.tweens.add({
      targets: this.fadeGfx,
      alpha: 0,
      duration: 4000,
      repeat: 0
    });

    this.bgm = this.sound.add('music-tsote', {
      loop: true
    });
    this.bgm.play();
  }
}

export default Title;