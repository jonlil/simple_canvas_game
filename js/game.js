// Create the canvas
var canvas = document.createElement("canvas");
var playerLog = document.createElement("div")
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
document.body.appendChild(playerLog);

playerLog.style.position = 'absolute';
playerLog.style.right = 0;
playerLog.style.top = 0;
playerLog.style.width = "400px";
playerLog.style.borderStyle="solid";
playerLog.style.borderWidth = "1px";
playerLog.style.borderColor = '#000';


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

function Player () {
	this.monstersCaught = 0;
	this.points = 0;
	this.pointsLog = [];

	this.on('score', function (score) {
		var log = {
			value: score,
			time: new Date().getTime()
		};
		var html = '<div>';
		html += "<span>" + log.time + "</span><span> " + log.value + "</span>";
		html += '</div>';
		
		this.points += score;
		this.pointsLog.push(log);

		playerLog.innerHTML = html + playerLog.innerHTML;
	}.bind(this))
}
Player.prototype = new EventEmitter;
Player.prototype.constructor = Player;

var player = new Player();

var monster = new Monster({ canvas: canvas, ctx: ctx });


// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};

var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
};


var angle = function () {
	if (38 in keysDown && 37 in keysDown) {
		console.log(Math.atan2(0 - hero.y, 0 - hero.x));
	}
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if (hero.y - (hero.speed * modifier) >= 0) {
			hero.y -= hero.speed * modifier;	
		}
	}
	if (40 in keysDown) { // Player holding down
		if (hero.y + (hero.speed * modifier) <= canvas.height) {
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if (hero.x - (hero.speed * modifier) >= 0) {
			hero.x -= hero.speed * modifier;	
		}
		
	}
	if (39 in keysDown) { // Player holding right
		if (hero.x + (hero.speed * modifier) <= canvas.width) {
			hero.x += hero.speed * modifier;
		}
	}
	if (32 in keysDown) {
		
	}
	
	// Are they touching?
	if (monster.isTouching(hero, player)) {
		monster.reset(canvas);
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monster.isReady()) {
		monster.emit('render');
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + player.monstersCaught, 32, 32);
	ctx.fillText("Goblin points: " + player.points, 32, 64);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
