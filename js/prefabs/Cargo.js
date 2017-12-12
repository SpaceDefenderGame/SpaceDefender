var SpaceDefender = SpaceDefender || {};

SpaceDefender.Cargo = function(game, x, y, cargoType) {
  
  
  
  Phaser.Sprite.call(this, game, x, y, cargoType);
  
  this.cargoType = cargoType;
  //some default values  
  this.anchor.setTo(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
};

SpaceDefender.Cargo.prototype = Object.create(Phaser.Sprite.prototype);
SpaceDefender.Cargo.prototype.constructor = SpaceDefender.Cargo;