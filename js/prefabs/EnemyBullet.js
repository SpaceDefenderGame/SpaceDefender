var SpaceDefender = SpaceDefender || {};

SpaceDefender.EnemyBullet = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'bullet');
  
  //some default values
  this.anchor.setTo(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
};

SpaceDefender.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceDefender.EnemyBullet.prototype.constructor = SpaceDefender.EnemyBullet;