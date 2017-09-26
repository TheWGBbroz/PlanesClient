var MENU = 0;
var GAME = 1;

var canvas;
var state;

var popups = [];

// Images
var skins;
var bulletImg;

function setup() {
	// Setup canvas
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	//smooth();
	imageMode(CENTER);
	frameRate(60);
	
	setState(MENU);
	
	// Load Images
	var skinAmount = parseInt(readFile("res/skins/amount.txt")[0]);
	skins = [];
	for(var i = 0; i < skinAmount; i++) {
		skins[i] = loadImage("res/skins/" + i + ".png");
	}
	bulletImg = loadImage("res/bullet.png");
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	if(state.windowResized)
		state.windowResized();
}

function draw() {
	state.draw();
	
	for(var i = 0; i < popups.length; i++) {
		var remove = popups[i].update();
		if(remove) {
			popups.splice(i--, 1);
			continue;
		}
		
		popups[i].draw();
	}
}

function mousePressed() {
	if(state.mousePressed)
		state.mousePressed();
}

function mouseReleased() {
	if(state.mouseReleased)
		state.mouseReleased();
}

function keyPressed() {
	if(state.keyPressed)
		state.keyPressed();
}

function keyReleased() {
	if(state.keyReleased)
		state.keyReleased();
}

function mouseWheel(event) {
	if(state.mouseWheel)
		state.mouseWheel(event.delta);
}


function setState(stateId) {
	popups = [];
	
	switch(stateId) {
		case MENU:
			state = new Menu();
			break;
		case GAME:
			state = new Game();
			break;
	}
	
	removeElements();
	
	state.init();
	if(state.keyReleased)
		state.keyReleased();
	if(state.mouseReleased)
		state.mouseReleased();
	if(state.windowResized)
		state.windowResized();
	return state;
}


// Utility functions
function normalizeDir(dir) {
	while(dir < 0)
		dir += 360;
	while(dir > 360)
		dir -= 360;
	
	return dir;
}

function getRotatedOffsets(xoff, yoff, rot) {
	var rad = radians(rot);
	
	var x = xoff * cos(rad) - yoff * sin(rad);
	var y = xoff * sin(rad) + yoff * cos(rad);
	
	return createVector(x, y);
}

function readFile(file) {
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.send(null);
	var total = rawFile.responseText;
	var lines = total.split('\n');
	
	return lines;
}

function getRandomIp() {
	var ips = readFile("res/ip_list.txt");
	return ips[floor(random(ips.length))];
}

function getPartyCode(ip) {
	var chars = "01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var party = "";
	
	setRandomSeed(hashString(ip));
	
	for(var i = 0; i < 5; i++) {
		party += chars.charAt(floor(seededRandom(chars.length)));
	}
	
	return party;
}

function getIpFromParty(party) {
	var ips = readFile("res/ip_list.txt");
	
	for(var i = 0; i < ips.length; i++) {
		if(getPartyCode(ips[i]) == party)
			return ips[i];
	}
}

function hashString(str) {
	var hash = 0;
	if(str.length == 0)
		return hash;
	
	for(var i = 0; i < str.length; i++) {
		var chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0;
	}
	
	return hash;
}

function dist(x1, y1, x2, y2) {
	var dst = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	if(dst < 0) dst = -dst;
	return dst;
}

function sgn(val) {
	if(val > 0) return 1;
	if(val < 0) return -1;
	return 0;
}

function superellipse(xx, yy, a, b, n) {
	push();
	  translate(xx + a / 2, yy + b / 2);
	  beginShape();
	  for(var angle = 0; angle < TWO_PI; angle += 0.1) {
	  	var na = 2 / n;
	  	var x = pow(abs(cos(angle)), na) * a * sgn(cos(angle));
	  	var y = pow(abs(sin(angle)), na) * b * sgn(sin(angle));
	  	
	  	vertex(x, y);
	  }
	  endShape(CLOSE);
	pop();
}


var randSeed = Math.floor(Math.random());
function setRandomSeed(seed) {
	randSeed = seed || floor(random());
}

function seededRandom(max, min) {
	max = max || 1;
	min = min || 0;
	
	randSeed = (randSeed * 9301 + 49297) % 233280;
	var rnd = randSeed / 233280;
	return rnd * (max - min) + min;
}