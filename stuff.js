var main = function(row,column,wins){
    var win = false;
    var Button = function(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 150;
        this.height = config.height || 50;
        this.label = "Next Level?";
    };
    Button.prototype.draw = function() {
        fill(0, 255, 17);
        rect(this.x, this.y, this.width, this.height, 5);
        fill(0, 0, 0);
        textSize(19);
        textAlign(LEFT, TOP);
        text(this.label, this.x+10, this.y+this.height/4);
    };
    Button.prototype.isMouseInside = function() {
        return mouseX > this.x &&
               mouseX < (this.x + this.width) &&
               mouseY > this.y &&
               mouseY < (this.y + this.height);
    };  
    var btn1 = new Button({
        x: 100,
        y: 100,
    });
    var Tile = function(x, y, face) {
        this.x = x;
        this.y = y;
        this.face = face;
        this.width = 70;
    };
    Tile.prototype.drawFaceDown = function() {
        fill(214, 247, 202);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.width, 10);
        image(getImage("cards/back"), this.x, this.y, this.width, this.width);
        this.isFaceUp = false;
    };
    Tile.prototype.drawFaceUp = function() {
        fill(214, 247, 202);
        strokeWeight(2);
        rect(this.x, this.y, this.width, this.width, 10);
        image(this.face, this.x, this.y, this.width, this.width);
        this.isFaceUp = true;
    };
    Tile.prototype.isUnderMouse = function(x, y) {
        return x >= this.x && x <= this.x + this.width  &&
            y >= this.y && y <= this.y + this.width;
    };
    // Declare an array of all possible faces
    var faces = [
        getImage("cards/D_ACE"),
        getImage("cards/D_TWO"),
        getImage("cards/D_THREE"),
        getImage("cards/D_FOUR"),
        getImage("cards/D_FIVE"),
        getImage("cards/D_SIX"),
        getImage("cards/D_SEVEN"),
        getImage("cards/D_EIGHT"),
        getImage("cards/D_NINE"),
        getImage("cards/D_TEN"),
        getImage("cards/D_JACK"),
        getImage("cards/D_QUEEN"),
        getImage("cards/D_KING")
    ];
    // Make an array which has 2 of each, then randomize it
    var possibleFaces = faces.slice(0);
    var selected = [];
    for (var i = 0; i < (row * column) / 2; i++) {
        // Randomly pick one from the array of remaining faces
        var randomInd = floor(random(possibleFaces.length));
        var face = possibleFaces[randomInd];
        // Push twice onto array
        selected.push(face);
        selected.push(face);
        // Remove from array
        possibleFaces.splice(randomInd, 1);
    }
    // Now we need to randomize the array
    selected.sort(function() {
        return 0.5 - Math.random();
    });
    // Create the tiles
    var tiles = [];
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < column; j++) {
            tiles.push(new Tile(i * 78 + 10, j * 78 + 40, selected.pop()));
        }
    }
    background(255, 255, 255);
    // Now draw them face up
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].drawFaceDown();
    }
    var flippedTiles = [];
    var delayStartFC = null;
    var numTries = 0;
    mouseClicked = function() {
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].isUnderMouse(mouseX, mouseY)) {
                if (flippedTiles.length < 2 && !tiles[i].isFaceUp) {
                    tiles[i].drawFaceUp();
                    flippedTiles.push(tiles[i]);
                    if (flippedTiles.length === 2) {
                        numTries++;
                        if (flippedTiles[0].face === flippedTiles[1].face) {
                            flippedTiles[0].isMatch = true;
                            flippedTiles[1].isMatch = true;
                        }
                        delayStartFC = frameCount;
                        loop();
                    }
                } 
            }
        }
        var foundAllMatches = true;
        for (var i = 0; i < tiles.length; i++) {
            foundAllMatches = foundAllMatches && tiles[i].isMatch;
        }
        if (foundAllMatches) {
            fill(0, 0, 0);
            textSize(20);
            text("You found them all in " + numTries + " tries!", 20, 375);
            win = true;
        }
        if(win){
            btn1.draw();
            if(btn1.isMouseInside()){
                wins++;
                if(wins%4 === 1){column++;}
                else if (wins%4 === 2){column++;}
                else if (wins%4 === 3){row++;}
                else if(wins%4 === 0){row++;}
                main(row,column,wins);
            }
    }
    };
    draw = function() {
        if (delayStartFC && (frameCount - delayStartFC) > 30) {
            for (var i = 0; i < tiles.length; i++) {
                if (!tiles[i].isMatch) {tiles[i].drawFaceDown();}
            }
            flippedTiles = [];
            delayStartFC = null;
            noLoop();
        }
    };
};

main(2,2,0);