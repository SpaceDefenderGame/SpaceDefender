var SpaceDefender = SpaceDefender || {};

SpaceDefender.LevelFailed = {
	
  init: function(currentLevel) {
    //use all the area, don't distort scale
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.currentLevel = currentLevel ? currentLevel : 1;

  },

  preload: function () {
	  
	SpaceDefender.game.load.spritesheet("buttons", "/assets/images/icons/buttons.png", 265, 75);	  
	SpaceDefender.game.load.image('bitcoinIcon', 'assets/images/icons/bitcoin.png');
	SpaceDefender.game.load.image('lifeIcon', 'assets/images/icons/life-icon.png');
	
	this.load.audio('bitcoin', ['assets/audio/bitcoin.mp3', 'assets/audio/bitcoin.ogg']);
	this.load.audio('nobitcoins', ['assets/audio/nobitcoins.mp3', 'assets/audio/nobitcoins.ogg']);


    }
    , create: function () {
        this.titleText = this.game.add.text(this.game.width / 2, 100, "Mission Failed");
		this.titleText.fontSize = 45;
        this.titleText.fill = '#ff0000';
        this.titleText.anchor.set(0.5, 0.5);
		
		this.commentText = this.game.add.text(this.game.width / 2, 20+this.titleText.bottom, "You can buy 10 health or increase your bullet frequency for 100 BTC and try this level again");
		this.game.width > this.game.height ? this.vMax = this.game.width : this.vMax = this.game.height;
		this.commentText.fontSize = this.vMax / 40;
		this.commentText.wordWrap = true;
		this.commentText.wordWrapWidth = this.game.width / 1.5;
		this.commentText.align = 'center';
        this.commentText.fill = '#ffffff';
        this.commentText.anchor.set(0.5, 0);

        this.btnStart = SpaceDefender.gameButtons.addButton("playAgain", this.game.width / 2, 280+this.commentText.bottom, this.startGame, this);
		
		this.btnHealth = SpaceDefender.gameButtons.addButton("health", this.game.width / 2, 80+this.commentText.bottom, this.increaseHealth, this);
		
		this.btnBulletSpeed = SpaceDefender.gameButtons.addButton("bulletSpeed", this.game.width / 2, 180+this.commentText.bottom, this.increaseBulletSpeed, this);
		
	//initiate life icon
	this.lifeIcon = this.add.sprite(this.game.width / 12, 35, 'lifeIcon');
    this.lifeIcon.anchor.setTo(0.5, 0.5);
	this.lifeIcon.alpha = 0.9;
	this.lifeIcon.bringToTop();
	
	//initiate life text
	this.lifeText = this.add.text(this.game.width / 12 + this.lifeIcon.width, 35, SpaceDefender.maxHealth);
    this.lifeText.fill = "#FFFFFF";
    this.game.world.width / 14 > 50 ? this.lifeText.fontSize = 50 : this.lifeText.fontSize = this.game.world.width / 14;
	this.lifeText.alpha = 0.9;
    this.lifeText.anchor.set(0, 0.5);
	
	//initiate score text
	this.scoreText = this.add.text(this.game.world.width - this.game.width / 12, 35, "0");
	this.scoreText.text = SpaceDefender.score;
    this.scoreText.fill = "#FFFFFF";
    this.game.world.width / 14 > 50 ? this.scoreText.fontSize = 50 : this.scoreText.fontSize = this.game.world.width / 14;
	this.scoreText.alpha = 0.9;
    this.scoreText.anchor.set(1, 0.5);
	
	//initiate score icon	
	this.scoreLabel = this.add.sprite(this.game.world.width - this.game.width / 12 - this.scoreText.width - 20, 35, 'bitcoinIcon');
    this.scoreLabel.anchor.setTo(1, 0.5);
	this.scoreLabel.alpha = 0.9;
	this.scoreLabel.bringToTop();
	
	this.bitcoinSound = this.add.audio('bitcoin');
	this.noBitcoinsSound = this.add.audio('nobitcoins');
    }
    , startGame: function () {
        this.game.state.start('GameState', true, false, this.currentLevel);
    }
	, increaseHealth: function () {
        if (SpaceDefender.score >= 100) {
		  this.bitcoinSound.play();
		  SpaceDefender.maxHealth += 10;
		  this.lifeText.text = SpaceDefender.maxHealth;
		  SpaceDefender.score -= 100;
		  this.scoreText.text = SpaceDefender.score;
		  setTimeout ((function() {this.scoreLabel.x = this.game.world.width - this.game.width / 12 - this.scoreText.width - 20;}).bind(this), 0);
		}
		else {
			this.noBitcoinsSound.play();
			this.scoreText.fill = "#ff0000";
			setTimeout ((function() {this.scoreText.fill = "#ffffff";}).bind(this), 500);
		}
    }
	, increaseBulletSpeed: function () {		
		if (SpaceDefender.score >= 100) {
		this.bitcoinSound.play();	
        SpaceDefender.bulletFrequency += 0.2;
		SpaceDefender.score -= 100;
		this.scoreText.text = SpaceDefender.score;
		setTimeout ((function() {this.scoreLabel.x = this.game.world.width - this.game.width / 12 - this.scoreText.width - 20;}).bind(this), 0);
		}
		else {
			this.noBitcoinsSound.play();
			this.scoreText.fill = "#ff0000";
			setTimeout ((function() {this.scoreText.fill = "#ffffff";}).bind(this), 500);
		}
    }
	, startGame: function () {
        this.game.state.start('GameState', true, false, this.currentLevel);
    }
    , update: function () {

    }
  

};
