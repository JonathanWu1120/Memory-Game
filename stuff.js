//Make tile class
var Tile = function(x,y,face){
	this.x = x;
	this.y = y;
	this.face = face;
	this.width = 70;
};
//makes the back of a card
Tile.prototype.drawBack = function(){
	fill(200,200,200);
	strokeWeight(3);
	rect(this.x,this.y,this.width,this.width);
	image(getImage("back"));
	this.up = false;
};

Tile.prototype.drawUp = function() {
	fill(200,200,200);
	strokeWeight(3);
	rect(this.x,this.y,this.width,this.width);
	image(this.face,this.x,this.y,this.width,this.width);
	this.isFaceUp = true;
};

Tile.prototype.isUnderMouse = function(x, y) {
    return (x >= this.x && x <= this.x + this.width  &&
        y >= this.y && y <= this.y + this.width);
};

var faces = [
	getImage("D_ACE"),
	getImage("D_TWO"),
	getImage("D_THREE"),
	getImage("D_FOUR"),
	getImage("D_FIVE"),
	getImage("D_SIX"),
	getImage("D_SEVEN"),
	getImage("D_EIGHT"),
	getImage("D_NINE"),
	getImage("D_TEN"),
	getImage("D_JACK"),
	getImage("D_QUEEN"),
	getImage("D_KING"),
];
var col = 2;
var row = 2;
var possibleFaces = faces.slice(0);
var selected = []
for (var i = 0; i <(col*row)/2;i++){
	var rand = floor(random(possibleFaces.length));
	var face = possibleFaces[rand];
	selected.push(face);
	selected.push(face);
	possibleFaces.splice(rand,1);
}
selected.sort(function(){
	return 0.5-Math.random();
})

var tiles = [];
for(var i = 0; i <col;i++){
	for(var j =0;i<row;i++){
		tiles.push(new Tile(i*78 + 10,j*78+40,selected.pop()));
	}
}
for(var i = 0; i<tiles.length;i++){
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
    }
};

draw = function() {
    if (delayStartFC && (frameCount - delayStartFC) > 30) {
        for (var i = 0; i < tiles.length; i++) {
            if (!tiles[i].isMatch) {
                tiles[i].drawFaceDown();
            }
        }
        flippedTiles = [];
        delayStartFC = null;
        noLoop();
    }
};