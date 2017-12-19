var SpaceDefender = SpaceDefender || {};

SpaceDefender.MainMenu = {
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

      this.titleText = this.game.add.text(this.game.width / 2, this.game.height / 6, 'Space Defender');
      this.titleText.fontSize = this.game.width / 14;
      this.titleText.fill = '#ffffff';
      this.titleText.anchor.set(0.5, 0.5);

      this.commentText = this.game.add.text(this.game.width / 2, this.titleText.bottom + this.game.height /
         12, 'Kill your enemies and earn bitcoins');
      this.commentText.fontSize = this.game.width / 20;
      this.commentText.wordWrap = true;
      this.commentText.wordWrapWidth = this.game.width / 2;
      this.commentText.align = 'center';
      this.commentText.fill = '#ff0000';
      this.commentText.anchor.set(0.5, 0);

      this.btnStart = SpaceDefender.gameButtons.addButton('start', -1, -1, this.startGame, this);
   },
   startGame: function() {
      this.game.state.start('GameState');
   },
   update: function() {

   }
};