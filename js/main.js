var SpaceDefender = SpaceDefender || {};
SpaceDefender.score = 0;
SpaceDefender.maxHealth = 100;
SpaceDefender.bulletFrequency = 2.5;
SpaceDefender.numLevels = 10;

SpaceDefender.gameButtons = new GameButtons();

//initiate the Phaser framework
SpaceDefender.game = new Phaser.Game('100%', '100%', Phaser.AUTO);

SpaceDefender.game.state.add('MainMenu', SpaceDefender.MainMenu);
SpaceDefender.game.state.add('GameState', SpaceDefender.GameState);
SpaceDefender.game.state.add('LevelInfo', SpaceDefender.LevelInfo);
SpaceDefender.game.state.add('LevelFailed', SpaceDefender.LevelFailed);
SpaceDefender.game.state.add('GameOver', SpaceDefender.GameOver);
SpaceDefender.game.state.start('MainMenu');