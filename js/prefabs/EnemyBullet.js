var SpaceDefender = SpaceDefender || {};

SpaceDefender.EnemyBullet = function(game, x, y, key) {
   switch (key) {
      case 'redBlackEnemy':
         Phaser.Sprite.call(this, game, x, y, 'shell');
         break;

      case 'blueEnemy':
         Phaser.Sprite.call(this, game, x, y, 'bullet');
         break;

      case 'lightBlueEnemy':
         Phaser.Sprite.call(this, game, x, y, 'bullet2');
         break;

      case 'grayEnemy':
         Phaser.Sprite.call(this, game, x, y, 'bullet3');
         break;

      case 'boss1':
      case 'boss2':
      case 'boss3':
      case 'boss4':
         Phaser.Sprite.call(this, game, x, y, 'bullet4');
         break;

      default:
         Phaser.Sprite.call(this, game, x, y, 'bullet');
         break;
   }


   //some default values
   this.anchor.setTo(0.5);
   this.checkWorldBounds = true;
   this.outOfBoundsKill = true;
};

SpaceDefender.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
SpaceDefender.EnemyBullet.prototype.constructor = SpaceDefender.EnemyBullet;