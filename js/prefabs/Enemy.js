var SpaceDefender = SpaceDefender || {};

SpaceDefender.Enemy = function(game, x, y, key, health, enemyBullets, cargoes, strength) {

   Phaser.Sprite.call(this, game, x, y, key);

   this.game = game;
   this.difficultyCoefficient = this.game.difficultyCoefficient;

   //enable physics

   this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);
   this.anchor.setTo(0.5);
   this.health = health;

   this.enemyBullets = enemyBullets;
   this.cargoes = cargoes;
   this.strength = strength || 1;

   this.enemyTimer = this.game.time.create(false);
   this.enemyTimer.start();

   this.scheduleShooting();
   this.rotateEnemy();

};

SpaceDefender.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
SpaceDefender.Enemy.prototype.constructor = SpaceDefender.Enemy;

SpaceDefender.Enemy.prototype.update = function() {

   //bounce on the borders
   if (this.position.x < 0.05 * this.game.world.width) {
      this.position.x = 0.05 * this.game.world.width + 2;
      this.body.velocity.x = this.game.rnd.integerInRange(50, 100) * this.difficultyCoefficient;
      this.body.velocity.y = this.game.rnd.integerInRange(-100, 100) * this.difficultyCoefficient;
   } else if (this.position.x > 0.95 * this.game.world.width) {
      this.position.x = 0.95 * this.game.world.width - 2;
      this.body.velocity.x = this.game.rnd.integerInRange(-100, -50) * this.difficultyCoefficient;
      this.body.velocity.y = this.game.rnd.integerInRange(-100, 100) * this.difficultyCoefficient;
   } else if (this.position.y < 0.05 * this.game.world.height && this.body.velocity.y < 0) {
      this.position.y = 0.05 * this.game.world.height + 2;
      this.body.velocity.x = this.game.rnd.pick([-1, 1]) * this.game.rnd.integerInRange(50, 100) * this.difficultyCoefficient;
      this.body.velocity.y = this.game.rnd.integerInRange(20, 100) * this.difficultyCoefficient;
   } else if (this.position.y > 0.7 * this.game.world.height) {
      this.position.y = 0.7 * this.game.world.height - 2;
      this.body.velocity.x = this.game.rnd.pick([-1, 1]) * this.game.rnd.integerInRange(50, 100) * this.difficultyCoefficient;
      this.body.velocity.y = this.game.rnd.integerInRange(-20, -100) * this.difficultyCoefficient;
   }


   //kill if off world in the bottom
   if (this.position.y > this.game.world.height) {
      this.kill();
   }
};

SpaceDefender.Enemy.prototype.damage = function(amount) {
   Phaser.Sprite.prototype.damage.call(this, amount);
   //play 'getting hit' animation
   this.play('getHit');

   //Enemy run away when injured
   this.body.velocity.x *= this.game.rnd.pick([-1.3, 1.3]) * this.difficultyCoefficient;

   //particle explosion
   if (this.health <= 0) {
      SpaceDefender.GameState.enemyExplosionSound.play();
      let emitter = this.game.add.emitter(this.x, this.y, 100);
      emitter.makeParticles('enemyParticle');
      emitter.minParticleSpeed.setTo(-200, -200);
      emitter.maxParticleSpeed.setTo(200, 200);
      emitter.gravity = 0;
      emitter.start(true, 500, null, 100);

      SpaceDefender.score += Math.round(3 * this.strength);
      SpaceDefender.GameState.scoreText.text = SpaceDefender.score;
      setTimeout((function() {
         SpaceDefender.GameState.scoreLabel.x = SpaceDefender.GameState.game.world.width -
            SpaceDefender.GameState.game.width / 12 - SpaceDefender.GameState.scoreText.width -
            20;
      }).bind(this), 0);
      this.throwCargo();
      this.game.enemyCounter--;

      //call a Boss Enemy
      if (this.game.enemyCounter === 3) {
         SpaceDefender.GameState.callBoss();
      };

      //end level if all enemies and boss are killed
      if (this.game.enemyCounter < 1) {
         SpaceDefender.GameState.victorySound.play();
         setTimeout((function() {
            SpaceDefender.GameState.nextLevel();
         }), 500);
      };

      this.enemyTimer.pause();
   }
};

SpaceDefender.Enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY) {
   Phaser.Sprite.prototype.reset.call(this, x, y, health);

   this.loadTexture(key);
   this.scale.setTo(scale);
   this.body.velocity.x = speedX;
   this.body.velocity.y = speedY;

   this.enemyTimer.resume();
};

SpaceDefender.Enemy.prototype.scheduleShooting = function() {

   this.shoot();
   if (this.key === 'redBlackEnemy') {
      this.enemyTimer.add(Phaser.Timer.SECOND * 3.1 / this.strength, this.scheduleShooting, this);
   } else {
      this.enemyTimer.add(Phaser.Timer.SECOND * 1.3 / this.strength, this.scheduleShooting, this);
   }
};

SpaceDefender.Enemy.prototype.rotateEnemy = function() {
   if (this.key !== 'redBlackEnemy') {
      this.rotate();
      this.enemyTimer.add(Phaser.Timer.SECOND / 10, this.rotateEnemy, this);
   }
};

SpaceDefender.Enemy.prototype.shoot = function() {
   if (this.key === 'redBlackEnemy') {
      bullet = new SpaceDefender.EnemyBullet(this.game, this.x, this.bottom, this.key);
      this.enemyBullets.add(bullet);
      this.game.physics.arcade.moveToXY(bullet, this.x, this.game.world.height, 150);
   } else if (Math.abs(SpaceDefender.GameState.player.x / this.game.world.width - this.x / this.game.world
         .width) < 0.15 * this.difficultyCoefficient) {
      bullet = new SpaceDefender.EnemyBullet(this.game, this.x, this.bottom, this.key);
      this.enemyBullets.add(bullet);
      let bulletDirection = this.game.physics.arcade.moveToObject(bullet, SpaceDefender.GameState.player,
         350 * this.difficultyCoefficient);
      bullet.rotation = bulletDirection - 1.5;
   }

};

SpaceDefender.Enemy.prototype.rotate = function() {
   if (Math.abs(SpaceDefender.GameState.player.x / this.game.world.width - this.x / this.game.world.width) <
      0.2 * this.difficultyCoefficient) {
      this.rotation = this.game.physics.arcade.angleBetween(this, SpaceDefender.GameState.player) - 1.5;
   } else {
      this.rotation = 0;
   }
};

SpaceDefender.Enemy.prototype.throwCargo = function() {
   let cargoType;
   switch (this.game.rnd.integerInRange(1, 16)) {
      case 1:
         {
            cargoType = 'medicine';
            break;
         }

      case 2:
         {
            cargoType = 'bomb';
            break;
         }

      case 3:
         {
            cargoType = 'diamond';
            break;
         }

      case 4:
         {
            cargoType = 'bitcoin';
            break;
         }

      case 5:
         {
            cargoType = 'fastFire';
            break;
         }

      case 6:
         {
            cargoType = 'slowFire';
            break;
         }

      case 7:
         {
            cargoType = 'fastSpeed';
            break;
         }

      case 8:
         {
            cargoType = 'slowSpeed';
            break;
         }

      default:
         {
            cargoType = null;
            break;
         }
   }

   cargo = new SpaceDefender.Cargo(this.game, this.x, this.bottom, cargoType);
   this.cargoes.add(cargo);

   cargo.body.velocity.y = 450;
}