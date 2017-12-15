var SpaceDefender = SpaceDefender || {};

SpaceDefender.LevelInfo = {

   init: function(currentLevel) {
      this.game.cache = new Phaser.Cache(this.game);
      this.game.load.reset();
      this.game.load.removeAll();
      //use all the area, don't distort scale
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.currentLevel = currentLevel ? currentLevel : 1;
   },

   preload: function() {

      SpaceDefender.game.load.spritesheet('buttons', 'assets/images/icons/buttons.png', 265, 75);
      SpaceDefender.game.load.image('bitcoinIcon', 'assets/images/icons/bitcoin.png');
      SpaceDefender.game.load.image('lifeIcon', 'assets/images/icons/life-icon.png');

      this.load.audio('bitcoin', ['assets/audio/bitcoin.mp3', 'assets/audio/bitcoin.ogg']);
      this.load.audio('nobitcoins', ['assets/audio/nobitcoins.mp3', 'assets/audio/nobitcoins.ogg']);
      this.load.image('background', 'assets/images/backgrounds/background-level.jpg');


   },
   create: function() {
      this.background = this.add.tileSprite(this.game.world.centerX, this.game.world.centerY, 1920,
         1080, 'background');
      this.background.anchor.set(0.5, 0.5);

      this.titleText = this.game.add.text(this.game.width / 2, 100, 'Level');
      this.titleText.text = 'Level ' + this.currentLevel;
      this.titleText.fontSize = 50;
      this.titleText.fill = '#ffffff';
      this.titleText.anchor.set(0.5, 0.5);

      this.commentText = this.game.add.text(this.game.width / 2, 20 + this.titleText.bottom,
         'You can buy 10 health, rate of fire or speed for 100 BTC and go to the next level');
      this.game.width > this.game.height ? this.vMax = this.game.width : this.vMax = this.game.height;
      this.commentText.fontSize = this.vMax / 40;
      this.commentText.wordWrap = true;
      this.commentText.wordWrapWidth = this.game.width / 1.3;
      this.commentText.align = 'center';
      this.commentText.fill = '#ffffff';
      this.commentText.anchor.set(0.5, 0);

      this.btnHealth = SpaceDefender.gameButtons.addButton('health', this.game.width / 2, 80 + this.commentText
         .bottom, this.increaseHealth, this);

      this.btnBulletSpeed = SpaceDefender.gameButtons.addButton('bulletSpeed', this.game.width / 2, 50 +
         this.btnHealth.bottom, this.increaseBulletSpeed, this);

      this.btnPlayerSpeed = SpaceDefender.gameButtons.addButton('playerSpeed', this.game.width / 2, 50 +
         this.btnBulletSpeed.bottom, this.increasePlayerSpeed, this);

      this.btnStart = SpaceDefender.gameButtons.addButton('start', this.game.width / 2, 50 + this.btnPlayerSpeed
         .bottom, this.startGame, this);

      //decrease buttons size for smartphones
      if (this.game.height < 650) {
         this.btnHealth.scale.x = 0.6;
         this.btnBulletSpeed.scale.x = 0.6;
         this.btnPlayerSpeed.scale.x = 0.6;
         this.btnStart.scale.x = 0.6;
         this.btnHealth.scale.y = 0.6;
         this.btnBulletSpeed.scale.y = 0.6;
         this.btnPlayerSpeed.scale.y = 0.6;
         this.btnStart.scale.y = 0.6;
         this.btnHealth.y = 40 + this.commentText.bottom
         this.btnBulletSpeed.y = 40 + this.btnHealth.bottom;
         this.btnPlayerSpeed.y = 40 + this.btnBulletSpeed.bottom;
         this.btnStart.y = 40 + this.btnPlayerSpeed.bottom;
      }

      //initiate life icon
      this.lifeIcon = this.add.sprite(this.game.width / 12, 35, 'lifeIcon');
      this.lifeIcon.anchor.setTo(0.5, 0.5);
      this.lifeIcon.alpha = 0.9;
      this.lifeIcon.bringToTop();

      //initiate life text
      this.lifeText = this.add.text(this.game.width / 12 + this.lifeIcon.width, 35, SpaceDefender.maxHealth);
      this.lifeText.fill = '#FFFFFF';
      this.game.world.width / 14 > 50 ? this.lifeText.fontSize = 50 : this.lifeText.fontSize = this.game
         .world.width / 14;
      this.lifeText.alpha = 0.9;
      this.lifeText.anchor.set(0, 0.5);

      //initiate score text
      this.scoreText = this.add.text(this.game.world.width - this.game.width / 12, 35, '0');
      this.scoreText.text = SpaceDefender.score;
      this.scoreText.fill = '#FFFFFF';
      this.game.world.width / 14 > 50 ? this.scoreText.fontSize = 50 : this.scoreText.fontSize = this.game
         .world.width / 14;
      this.scoreText.alpha = 0.9;
      this.scoreText.anchor.set(1, 0.5);

      //initiate score icon	
      this.scoreLabel = this.add.sprite(this.game.world.width - this.game.width / 12 - this.scoreText.width -
         20, 35, 'bitcoinIcon');
      this.scoreLabel.anchor.setTo(1, 0.5);
      this.scoreLabel.alpha = 0.9;
      this.scoreLabel.bringToTop();

      //initiate speed text
      this.speedText = this.add.text(this.game.world.width - this.game.width / 12, this.game.height -
         35, '0');
      this.speedText.text = 'Speed: ' + Math.round((SpaceDefender.speed / 200) * 100) + '%';
      this.speedText.fill = '#FFFFFF';
      this.game.world.width / 20 > 35 ? this.speedText.fontSize = 35 : this.speedText.fontSize = this.game
         .world.width / 20;
      this.speedText.alpha = 0.7;
      this.speedText.anchor.set(1, 0.5);

      //initiate rate of fire text
      this.rateText = this.add.text(this.game.width / 12, this.game.height - 35, '0');
      this.rateText.text = 'Rate of fire: ' + Math.round((SpaceDefender.bulletFrequency / 2.5) * 100) +
         '%';
      this.rateText.fill = '#FFFFFF';
      this.game.world.width / 20 > 35 ? this.rateText.fontSize = 35 : this.rateText.fontSize = this.game
         .world.width / 20;
      this.rateText.alpha = 0.7;
      this.rateText.anchor.set(0, 0.5);

      this.bitcoinSound = this.add.audio('bitcoin');
      this.noBitcoinsSound = this.add.audio('nobitcoins');
   },
   startGame: function() {
      this.game.state.start('GameState', true, false, this.currentLevel);
   },
   increaseHealth: function() {
      if (SpaceDefender.score >= 100) {
         this.bitcoinSound.play();
         SpaceDefender.maxHealth += 10;
         this.lifeText.text = SpaceDefender.maxHealth;
         this.lifeText.fill = '#00ff00';
         setTimeout((function() {
            this.lifeText.fill = '#ffffff';
         }).bind(this), 500);
         SpaceDefender.score -= 100;
         this.scoreText.text = SpaceDefender.score;
         setTimeout((function() {
            this.scoreLabel.x = this.game.world.width - this.game.width / 12 - this.scoreText.width -
               20;
         }).bind(this), 0);
      } else {
         this.noBitcoinsSound.play();
         this.scoreText.fill = '#ff0000';
         setTimeout((function() {
            this.scoreText.fill = '#ffffff';
         }).bind(this), 500);
      }
   },
   increaseBulletSpeed: function() {
         if (SpaceDefender.score >= 100) {
            this.bitcoinSound.play();
            SpaceDefender.bulletFrequency += 0.25;
            SpaceDefender.score -= 100;
            this.scoreText.text = SpaceDefender.score;
            this.rateText.text = 'Rate of fire: ' + Math.round((SpaceDefender.bulletFrequency / 2.5) * 100) +
               '%';
            this.rateText.fill = '#00ff00';
            setTimeout((function() {
               this.rateText.fill = '#ffffff';
            }).bind(this), 500);
            setTimeout((function() {
               this.scoreLabel.x = this.game.world.width - this.game.width / 12 - this.scoreText.width -
                  20;
            }).bind(this), 0);
         } else {
            this.noBitcoinsSound.play();
            this.scoreText.fill = '#ff0000';
            setTimeout((function() {
               this.scoreText.fill = '#ffffff';
            }).bind(this), 500);
         }
      }

      ,
   increasePlayerSpeed: function() {
      if (SpaceDefender.score >= 100) {
         this.bitcoinSound.play();
         SpaceDefender.speed += 20;
         SpaceDefender.score -= 100;
         this.scoreText.text = SpaceDefender.score;
         this.speedText.text = 'Speed: ' + Math.round((SpaceDefender.speed / 200) * 100) + '%';
         this.speedText.fill = '#00ff00';
         setTimeout((function() {
            this.speedText.fill = '#ffffff';
         }).bind(this), 500);
         setTimeout((function() {
            this.scoreLabel.x = this.game.world.width - this.game.width / 12 - this.scoreText.width -
               20;
         }).bind(this), 0);
      } else {
         this.noBitcoinsSound.play();
         this.scoreText.fill = '#ff0000';
         setTimeout((function() {
            this.scoreText.fill = '#ffffff';
         }).bind(this), 500);
      }
   },
   startGame: function() {
      this.game.state.start('GameState', true, false, this.currentLevel);
   },
   update: function() {

   }
};