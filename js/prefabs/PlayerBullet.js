var SpaceDefender = SpaceDefender || {};

SpaceDefender.PlayerBullet = function(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'playerBullet');
  
  //some default values
  this.anchor.setTo(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
};

SpaceDefender.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceDefender.PlayerBullet.prototype.constructor = SpaceDefender.PlayerBullet;