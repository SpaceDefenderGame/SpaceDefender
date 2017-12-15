var SpaceDefender = SpaceDefender || {};

SpaceDefender.GameOver = {
   init: function() {
      this.game.cache = new Phaser.Cache(this.game);
      this.game.load.reset();
      this.game.load.removeAll();
      //use all the area, don't distort scale
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
   },
   preload: function() {
      SpaceDefender.game.load.spritesheet('buttons', 'assets/images/icons/buttons.png', 265, 75);
      this.load.image('background', 'assets/images/backgrounds/background-main.jpg');
   },
   create: function() {
      this.background = this.add.tileSprite(this.game.world.centerX, this.game.world.centerY, 1920,
         1200, 'background');
      this.background.anchor.set(0.5, 0.5);

      this.titleText = this.game.add.text(this.game.width / 2, this.game.height / 6, 'YOU WIN!');
      this.titleText.fill = '#ffffff';
      this.titleText.fontSize = this.game.width / 14;
      this.titleText.anchor.set(0.5, 0.5);

      this.earnedText = this.game.add.text(this.game.width / 2, this.titleText.bottom + this.game.height /
         12, 'You have earned ' + SpaceDefender.score + ' BTC');
      this.earnedText.fill = '#ffffff';
      this.earnedText.fontSize = this.game.width / 20;
      this.earnedText.anchor.set(0.5, 0.5);

      this.againText = this.game.add.text(this.game.width / 2, this.earnedText.bottom + this.game.height /
         12, 'Try Again?');
      this.againText.fill = '#ffffff';
      this.againText.fontSize = this.game.width / 14;
      this.againText.anchor.set(0.5, 0.5);

      this.btnStart = SpaceDefender.gameButtons.addButton('start', -1, -1, this.startGame, this);
   },
   startGame: function() {
      SpaceDefender.score = 0;
      SpaceDefender.maxHealth = 100;
      this.game.state.start('LevelInfo');
   },
   update: function() {

   }


};