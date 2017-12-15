var SpaceDefender = SpaceDefender || {};

SpaceDefender.GameState = {

   //initiate game settings
   init: function(currentLevel) {

      this.game.cache = new Phaser.Cache(this.game);
      this.game.load.reset();
      this.game.load.removeAll();
      //use all the area, don't distort scale
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      //initiate physics system
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //game constants
      this.playerSpeed = SpaceDefender.speed;
      this.playerHealth = SpaceDefender.maxHealth;
      this.bulletSpeed = -1000;
      this.bulletFrequency = SpaceDefender.bulletFrequency;

      //level data
      this.currentLevel = currentLevel ? currentLevel : 1;

   },

   //load the game assets before the game starts
   preload: function() {
      this.load.audio('orchestra', ['assets/audio/battlemusic' + this.currentLevel + '.mp3',
         'assets/audio/battlemusic' + this.currentLevel + '.ogg'
      ]);


      this.load.image('background', 'assets/images/backgrounds/background' + this.currentLevel + '.jpg');
      this.load.image('bullet', 'assets/images/icons/bullet.png');
      this.load.image('bullet2', 'assets/images/icons/bullet2.png');
      this.load.image('bullet3', 'assets/images/icons/bullet3.png');
      this.load.image('bullet4', 'assets/images/icons/bullet4.png');
      this.load.image('bullet5', 'assets/images/icons/bullet5.png');
      this.load.image('shell', 'assets/images/icons/shell.png');
      this.load.image('playerBullet', 'assets/images/icons/player-bullet.png');
      this.load.image('enemyParticle', 'assets/images/icons/enemyParticle.png');
      this.load.image('playerParticle', 'assets/images/icons/playerParticle.png');
      this.load.image('lifeIcon', 'assets/images/icons/life-icon.png');
      this.load.image('bitcoinIcon', 'assets/images/icons/bitcoin.png');

      //cargo images
      this.load.image('medicine', 'assets/images/cargo/red-cross.png');
      this.load.image('bomb', 'assets/images/cargo/bomb.png');
      this.load.image('diamond', 'assets/images/cargo/diamond.png');
      this.load.image('bitcoin', 'assets/images/cargo/bitcoin.png');
      this.load.image('fastFire', 'assets/images/cargo/fast-fire.png');
      this.load.image('slowFire', 'assets/images/cargo/slow-fire.png');
      this.load.image('fastSpeed', 'assets/images/cargo/fast-speed.png');
      this.load.image('slowSpeed', 'assets/images/cargo/slow-speed.png');

      //player sprite
      this.load.spritesheet('player', 'assets/images/icons/player.png', 70, 104, 5, 0, 0);

      //enemies sprites
      this.load.spritesheet('blueEnemy', 'assets/images/enemies/blue-enemy.png', 40, 55, 3, 0, 0);
      this.load.spritesheet('lightBlueEnemy', 'assets/images/enemies/light-blue-enemy.png', 50, 44, 3,
         0, 0);
      this.load.spritesheet('redBlackEnemy', 'assets/images/enemies/red-black-enemy.png', 50, 87, 3, 0,
         0);
      this.load.spritesheet('grayEnemy', 'assets/images/enemies/gray-enemy.png', 50, 50, 3, 0, 0);
      this.load.spritesheet('boss1', 'assets/images/enemies/boss1.png', 150, 152, 3, 0, 0);
      this.load.spritesheet('boss2', 'assets/images/enemies/boss2.png', 176, 152, 3, 0, 0);
      this.load.spritesheet('boss3', 'assets/images/enemies/boss3.png', 147, 152, 3, 0, 0);
      this.load.spritesheet('boss4', 'assets/images/enemies/boss4.png', 147, 152, 3, 0, 0);

      //load level data
      this.load.text('level1', 'assets/data/level1.json');
      this.load.text('level2', 'assets/data/level2.json');
      this.load.text('level3', 'assets/data/level3.json');
      this.load.text('level4', 'assets/data/level4.json');
      this.load.text('level5', 'assets/data/level5.json');
      this.load.text('level6', 'assets/data/level1.json');
      this.load.text('level7', 'assets/data/level2.json');
      this.load.text('level8', 'assets/data/level3.json');
      this.load.text('level9', 'assets/data/level4.json');
      this.load.text('level10', 'assets/data/level5.json');

      //load sound effects
      this.load.audio('victory', ['assets/audio/victory.mp3', 'assets/audio/victory.ogg']);
      this.load.audio('mission-failed', ['assets/audio/mission-failed.mp3',
         'assets/audio/mission-failed.ogg'
      ]);
      this.load.audio('good-cargo', ['assets/audio/good-cargo.mp3', 'assets/audio/good-cargo.ogg']);
      this.load.audio('bad-cargo', ['assets/audio/bad-cargo.mp3', 'assets/audio/bad-cargo.ogg']);
      this.load.audio('player-damage', ['assets/audio/playerdamage.mp3', 'assets/audio/bad-cargo.ogg']);
      this.load.audio('enemy-explosion', ['assets/audio/enemyexplosion.mp3',
         'assets/audio/bad-cargo.ogg'
      ]);

   },
   //executed after everything is loaded
   create: function() {

      //play background music	
      this.orchestra = this.add.audio('orchestra');
      this.orchestra.loop = true;
      this.orchestra.play();


      //moving background
      this.background = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height,
         'background');
      this.background.autoScroll(0, 100);

      this.cursors = this.game.input.keyboard.createCursorKeys();

      //initiate player bullets and player shooting
      this.initBullets();
      this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND / this.bulletFrequency, this.createPlayerBullet,
         this);



      //initiate the enemies
      this.initEnemies();

      //player
      this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.height - 100,
         'player', 0);
      this.player.animations.add('fly', [0, 1, 2], 15, true);
      this.player.animations.add('damage', [0, 3, 4], 15, false);
      this.player.animations.play('fly');
      this.player.anchor.setTo(0.5);
      this.player.health = this.playerHealth;
      this.game.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;

      //initiate life icon
      this.lifeIcon = this.add.sprite(this.game.width / 12, 35, 'lifeIcon');
      this.lifeIcon.anchor.setTo(0.5, 0.5);
      this.lifeIcon.alpha = 0.9;
      this.lifeIcon.bringToTop();

      //initiate life text
      this.lifeText = this.add.text(this.game.width / 12 + this.lifeIcon.width, 35, this.playerHealth);
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
      this.speedText.text = 'Speed: ' + Math.round((this.playerSpeed / 200) * 100) + '%';
      this.speedText.fill = '#FFFFFF';
      this.game.world.width / 20 > 35 ? this.speedText.fontSize = 35 : this.speedText.fontSize = this.game
         .world.width / 20;
      this.speedText.alpha = 0.7;
      this.speedText.anchor.set(1, 0.5);

      //initiate rate of fire text
      this.rateText = this.add.text(this.game.width / 12, this.game.height - 35, '0');
      this.rateText.text = 'Rate of fire: ' + Math.round((this.bulletFrequency / 2.5) * 100) + '%';
      this.rateText.fill = '#FFFFFF';
      this.game.world.width / 20 > 35 ? this.rateText.fontSize = 35 : this.rateText.fontSize = this.game
         .world.width / 20;
      this.rateText.alpha = 0.7;
      this.rateText.anchor.set(0, 0.5);

      //load level
      this.loadLevel();

      //load sound effects
      this.victorySound = this.add.audio('victory');
      this.missionFailedSound = this.add.audio('mission-failed');
      this.goodCargoSound = this.add.audio('good-cargo');
      this.badCargoSound = this.add.audio('bad-cargo');
      this.healthSound = this.add.audio('health');
      this.playerDamageSound = this.add.audio('player-damage');
      this.enemyExplosionSound = this.add.audio('enemy-explosion');
      this.playerDamageSound.volume = 0.6;
      this.enemyExplosionSound.volume = 0.6;

   },
   update: function() {

      this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);
      this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.damagePlayer, null, this);
      this.game.physics.arcade.overlap(this.cargoes, this.player, this.collectCargo, null, this);

      //player is not moving by default
      this.player.body.velocity.x = 0;
      this.player.body.velocity.y = 0;

      //listen to user input on touchscreen or mouse
      if (this.game.input.activePointer.isDown) {
         //get the location of the touch
         let targetX = this.game.input.activePointer.position.x;
         let targetY = this.game.input.activePointer.position.y;
         let rot = this.game.physics.arcade.moveToXY(this.player, targetX, targetY, this.playerSpeed);
      }


      //listen to user input on keybord
      if (this.cursors.left.isDown) {
         this.player.body.velocity.x = -this.playerSpeed;
      }

      if (this.cursors.right.isDown) {
         this.player.body.velocity.x = this.playerSpeed;
      }

      if (this.cursors.up.isDown) {
         this.player.body.velocity.y = -this.playerSpeed;
      }

      if (this.cursors.down.isDown) {
         this.player.body.velocity.y = this.playerSpeed;
      }
   },

   //initiate the player bullets group
   initBullets: function() {
      this.playerBullets = this.add.group();
      this.playerBullets.enableBody = true;
   },

   //create or reuse a bullet - pool of objects
   createPlayerBullet: function() {
      let bullet = this.playerBullets.getFirstExists(false);

      //only create a bullet if there are no dead ones available to reuse
      if (!bullet) {
         bullet = new SpaceDefender.PlayerBullet(this.game, this.player.x, this.player.top);
         this.playerBullets.add(bullet);
      } else {
         //reset position
         bullet.reset(this.player.x, this.player.top);
      }

      //set velocity
      bullet.body.velocity.y = this.bulletSpeed;

   },

   initEnemies: function() {

      this.enemies = this.add.group();
      this.enemies.enableBody = true;

      this.enemyBullets = this.add.group();
      this.enemyBullets.enableBody = true;

      this.cargoes = this.add.group();
      this.cargoes.enableBody = true;

   },

   damageEnemy: function(bullet, enemy) {
      enemy.damage(1);
      bullet.kill();
   },

   damagePlayer: function(player, bullet) {
      let damage = Math.round(this.game.rnd.integerInRange(1, 5) * this.game.difficultyCoefficient);
      this.playerDamageSound.play();
      this.player.animations.play('damage');
      setTimeout((function() {
         this.player.animations.play('fly')
      }).bind(this), 300);
      this.player.health -= damage;
      this.lifeText.text = this.player.health;
      this.lifeText.fill = '#ff0000';
      setTimeout((function() {
         this.lifeText.fill = '#ffffff';
      }).bind(this), 500);

      //make particles when we damaged
      this.makeParticles(damage, 'playerParticle');
      bullet.kill();

      if (this.player.health < 1) {
         this.player.health = 0;
         this.lifeText.text = this.player.health;
         this.missionFailed = this.add.audio('mission-failed');
         this.missionFailed.play();
         this.makeParticles(100, 'playerParticle');
         this.killPlayer();
      }
   },

   collectCargo: function(player, cargo) {
      switch (cargo.cargoType) {
         case 'medicine':
            if (this.player.health < SpaceDefender.maxHealth) {
               let healthIncrement = Math.round(20 * Math.pow(this.game.difficultyCoefficient, 2));
               this.player.health += healthIncrement;
               this.player.health > SpaceDefender.maxHealth ? this.player.health = SpaceDefender.maxHealth :
                  this.player.health = this.player.health;
               this.lifeText.text = this.player.health;
               this.lifeText.fill = '#00ff00';
               setTimeout((function() {
                  this.lifeText.fill = '#ffffff';
               }).bind(this), 500);
               cargo.kill();
               this.goodCargoSound.play();
            }

            break;

         case 'bomb':
            this.player.health -= 10 * this.game.difficultyCoefficient;
            this.lifeText.text = this.player.health;
            this.lifeText.fill = '#ff0000';
            setTimeout((function() {
               this.lifeText.fill = '#ffffff';
            }).bind(this), 500);
            this.makeParticles(20, 'playerParticle');
            cargo.kill();
            this.badCargoSound.play();

            if (this.player.health < 1) {
               this.player.health = 0;
               this.lifeText.text = this.player.health;
               this.makeParticles(100, 'playerParticle');
               this.killPlayer();
            }
            break;

         case 'diamond':

            this.player.health += 10;
            this.player.health > SpaceDefender.maxHealth ? this.player.health = SpaceDefender.maxHealth :
               this.player.health = this.player.health;
            SpaceDefender.score += 10;
            this.lifeText.text = this.player.health;
            this.lifeText.fill = '#00ff00';
            setTimeout((function() {
               this.lifeText.fill = '#ffffff';
            }).bind(this), 500);
            this.scoreText.text = SpaceDefender.score;
            this.scoreText.fill = '#00ff00';
            setTimeout((function() {
               this.scoreText.fill = '#ffffff';
            }).bind(this), 500);
            setTimeout((function() {
               this.scoreLabel.x = this.game.world.width - this.game.width / 12 - this.scoreText
                  .width - 20;
            }).bind(this), 0);
            cargo.kill();
            this.goodCargoSound.play();
            break;

         case 'bitcoin':
            SpaceDefender.score += Math.round(30 * this.game.difficultyCoefficient);
            this.scoreText.text = SpaceDefender.score;
            this.scoreText.fill = '#00ff00';
            setTimeout((function() {
               this.scoreText.fill = '#ffffff';
            }).bind(this), 500);
            setTimeout((function() {
               this.scoreLabel.x = this.game.world.width - this.game.width / 12 - this.scoreText
                  .width - 20;
            }).bind(this), 0);
            cargo.kill();
            this.goodCargoSound.play();
            break;

         case 'fastFire':
            cargo.kill();
            this.shootingTimer.delay = this.shootingTimer.delay / 1.5;
            this.bulletFrequency = this.bulletFrequency * 1.5;
            this.rateText.text = 'Rate of fire: ' + Math.round((this.bulletFrequency / 2.5) * 100) +
               '%';
            this.rateText.fill = '#00ff00';
            setTimeout((function() {
               this.rateText.fill = '#ffffff';
            }).bind(this), 500);
            setTimeout((function() {
               this.shootingTimer.delay = this.shootingTimer.delay * 1.5;
               this.bulletFrequency = this.bulletFrequency / 1.5;
               this.rateText.text = 'Rate of fire: ' + Math.round((this.bulletFrequency / 2.5) *
                  100) + '%';
            }).bind(this), 20000);
            this.goodCargoSound.play();

            break;

         case 'slowFire':
            cargo.kill();
            this.shootingTimer.delay *= 1.5;
            this.bulletFrequency = this.bulletFrequency / 1.5;
            this.rateText.text = 'Rate of fire: ' + Math.round((this.bulletFrequency / 2.5) * 100) +
               '%';
            this.rateText.fill = '#ff0000';
            setTimeout((function() {
               this.rateText.fill = '#ffffff';
            }).bind(this), 500);
            setTimeout((function() {
               this.shootingTimer.delay = this.shootingTimer.delay / 1.5;
               this.bulletFrequency = this.bulletFrequency * 1.5;
               this.rateText.text = 'Rate of fire: ' + Math.round((this.bulletFrequency / 2.5) *
                  100) + '%';
            }).bind(this), 20000);
            this.badCargoSound.play();

            break;

         case 'fastSpeed':
            cargo.kill();
            this.playerSpeed = this.playerSpeed * 1.5;
            this.speedText.text = 'Speed: ' + Math.round((this.playerSpeed / 200) * 100) + '%';
            this.speedText.fill = '#00ff00';
            setTimeout((function() {
               this.speedText.fill = '#ffffff';
            }).bind(this), 500);
            setTimeout((function() {
               this.playerSpeed = this.playerSpeed / 1.5;
               this.speedText.text = 'Speed: ' + Math.round((this.playerSpeed / 200) * 100) +
                  '%';
            }).bind(this), 20000);
            this.goodCargoSound.play();
            break;

         case 'slowSpeed':
            cargo.kill();
            this.playerSpeed = this.playerSpeed / 1.5;
            this.speedText.text = 'Speed: ' + Math.round((this.playerSpeed / 200) * 100) + '%';
            this.speedText.fill = '#ff0000';
            setTimeout((function() {
               this.speedText.fill = '#ffffff';
            }).bind(this), 500);
            setTimeout((function() {
               this.playerSpeed = this.playerSpeed * 1.5;
               this.speedText.text = 'Speed: ' + Math.round((this.playerSpeed / 200) * 100) +
                  '%';
            }).bind(this), 20000);
            this.badCargoSound.play();

            break;
      };


   },

   killPlayer: function() {
      this.missionFailed.play();
      this.player.kill();
      this.shootingTimer.loop = false;
      this.orchestra.stop();
      setTimeout((function() {
         this.game.state.start('LevelFailed', true, false, this.currentLevel)
      }).bind(this), 2000);
   },

   createEnemy: function(x, y, health, key, scale, speedX, speedY, strength) {
      let enemy = new SpaceDefender.Enemy(this.game, x, y, key, health, this.enemyBullets, this.cargoes,
         strength);
      this.enemies.add(enemy);
      enemy.reset(x, y, health, key, scale, speedX, speedY, strength);
   },

   callBoss: function() {
      let bossEnemy = this.levelData.boss;
      bossEnemy.speedX = this.game.rnd.pick([-1, 1]) * this.game.rnd.integerInRange(50, 100);
      bossEnemy.speedY = this.game.rnd.integerInRange(30, 100);
      bossEnemy.x = this.game.rnd.integerInRange(2, 8) / 10;
      this.createEnemy(bossEnemy.x * this.game.world.width, -50, bossEnemy.health, bossEnemy.key,
         bossEnemy.scale, bossEnemy.speedX, bossEnemy.speedY, bossEnemy.strength);
   },

   loadLevel: function() {

      this.currentEnemyIndex = 0;


      this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel));
      this.game.enemyCounter = this.levelData.enemies.length + 1;
      this.game.difficultyCoefficient = this.levelData.difficultyCoefficient;

      this.scheduleNextEnemy();

   },

   nextLevel: function() {
      this.orchestra.stop();
      if (this.currentLevel < SpaceDefender.numLevels) {
         this.currentLevel++;
         this.game.state.start('LevelInfo', true, false, this.currentLevel);
      } else {
         this.game.state.start('GameOver')
      }


   },

   scheduleNextEnemy: function() {
      let nextEnemy = this.levelData.enemies[this.currentEnemyIndex];

      if (nextEnemy) {

         nextEnemy.speedX = this.game.rnd.pick([-1, 1]) * this.game.rnd.integerInRange(50, 100) * this.game
            .difficultyCoefficient;
         nextEnemy.speedY = this.game.rnd.integerInRange(30, 100) * this.game.difficultyCoefficient;
         nextEnemy.x = this.game.rnd.integerInRange(2, 8) / 10;

         let nextTime = 1000 * (nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[
            this.currentEnemyIndex - 1].time));

         this.nextEnemyTimer = this.game.time.events.add(nextTime, function() {
            this.createEnemy(nextEnemy.x * this.game.world.width, -50, nextEnemy.health,
               nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);

            this.currentEnemyIndex++;
            this.scheduleNextEnemy();
         }, this);
      }
   },


   makeParticles: function(damage, type) {
      let emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
      emitter.makeParticles(type);
      emitter.minParticleSpeed.setTo(-200, -200);
      emitter.maxParticleSpeed.setTo(200, 200);
      emitter.gravity = 0;
      emitter.start(true, 500, null, Math.pow(damage, 2));
   },
};