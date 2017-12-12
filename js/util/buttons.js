GameButtons = function () {

    
    this.addButton = function (type, xx, yy, f, scope) {
            if (xx == -1) {
                xx = SpaceDefender.game.width / 2;

            }
            if (yy == -1) {
                yy = SpaceDefender.game.height - 70;
            }

            let over = 0;
            let down = 1;

            switch (type) {

            case "start":
                over = 6;
                down = 7;
                break;

            case "playAgain":
                over = 0;
                down = 1;
                break;

            case "health":
                over = 2;
                down = 3;
                break;

            case "bulletSpeed":
                over = 4;
                down = 5;
                break;
            }

            let button = SpaceDefender.game.add.button(xx, yy, "buttons", f, scope, down, over, down);
            button.anchor.set(0.5, 0.5);
            return button;
        }
}