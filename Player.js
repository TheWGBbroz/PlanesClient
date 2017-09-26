function Player(gameInstance) {
	// Static values
	var maxSpeed = 14;
	var normalSpeed = 11;
	var minSpeed = 9;
	var speedRate = 0.25;
	var rotSpeed = 4;
	
	var shotWait = 60 / 20;
	var reloadInterval = 60 * 3;
	var bulletsPerRound	= 150;
	
	var state_normal = 0;
	var state_boost = 1;
	var state_slow = 2;
	//
	
	
	this.x = -1;
	this.y = -1;
	this.rotation = 0;
	this.speed = normalSpeed;
	this.hp = 100;
	this.nickname = "";
	this.points = 0;
	this.totalPoints = 0;
	this.skinid = 0;
	var speedState = state_normal;
	
	var game = gameInstance;
	
	this.svrShooting = false;
	var shooting = false;
	var lastShot = 0;
	var ammoLeft = bulletsPerRound;
	var reloadTime = 0;
	
	this.locTxtUpdate = 0;
	this.locTxtX = 0;
	this.locTxtY = 0;
	
	this.draw = function() {
		if(this.x == -1 || this.y == -1)
			return;
		
		// Draw plane
		var img = skins[this.skinid];
		if(img == null)
			img = skins[0];
		
		push();
		  translate(width / 2, height / 2);
		  
		  rotate(radians(this.rotation));
		  image(img, 0, 0);
		pop();
		
		// Update text position if needed
		this.locTxtUpdate++;
		this.locTxtUpdate %= 60 * 2;
		if(this.locTxtUpdate == 0) {
			this.locTxtX = floor(this.x);
			this.locTxtY = floor(this.y);
		}
		// Draw position
		noStroke();
		fill(160);
		text("X: " + this.locTxtX + ", Y: " + this.locTxtY, 10, 25);
		
		// Draw ammo / reloading
		if(reloadTime == 0) { // Not reloading
			text("Ammo: " + ammoLeft, 10, 45);
		}else{
			fill(255, 0, 0);
			text("RELOADING", 10, 45);
		}
		
		// Draw HP
		fill(160);
		text("HP: " + floor(this.hp), 10, 65);
		
		// Draw points
		text("Total Points: " + floor(this.totalPoints), 10, height - 25);
		text("Points: " + floor(this.points), 10, height - 45);
	}
	
	this.update = function() {
		if(this.x == -1 || this.y == -1)
			return;
		
		// Calculate new rotation
		var tarRot = degrees(atan2(mouseY - height / 2, mouseX - width / 2));
		var diff = tarRot - this.rotation;
		diff = normalizeDir(diff);
		
		// Smoothly rotate plane
		if(!(diff < rotSpeed || diff > 360 - rotSpeed)) {
			if(diff > 180)
				this.rotation -= rotSpeed;
			else if(diff < 180)
				this.rotation += rotSpeed;
		}
		this.rotation = normalizeDir(this.rotation);
		
		// In/decrease speed value
		if(speedState == state_boost) {
			this.speed += speedRate;
			if(this.speed > maxSpeed)
				this.speed = maxSpeed;
		}else if(speedState == state_slow) {
			this.speed -= speedRate;
			if(this.speed < minSpeed)
				this.speed = minSpeed;
		}else{
			if(this.speed > normalSpeed) {
				this.speed -= speedRate;
			}else if(this.speed < normalSpeed) {
				this.speed += speedRate;
			}
		}
		
		// Calculate new position;
		var rad = radians(this.rotation);
		var nx = this.x + cos(rad) * this.speed;
		var ny = this.y + sin(rad) * this.speed;
		
		// Keep plane in borders
		var xoff = planeWidth / 2;
		var yoff = planeHeight / 2;
		if(nx - xoff > 0 && nx + xoff < gameSize)
			this.x = nx;
		if(ny - yoff > 0 && ny + yoff < gameSize)
			this.y = ny;
		
		// Count down reloading
		if(reloadTime > 0)
			reloadTime--;
		
		// Count down last shots
		if(lastShot > 0)
			lastShot--;
		
		// Auto reload
		if(ammoLeft <= 0) {
			ammoLeft = bulletsPerRound;
			reloadTime = reloadInterval;
		}
		
		// Shoot bullets
		if(shooting && lastShot == 0 && reloadTime == 0) {
			lastShot = shotWait;
			ammoLeft -= bulletOffsets.length;
			game.spawnBullets(this.x, this.y, this.rotation);
		}
		
		this.svrShooting = shooting && reloadTime == 0;
		
		// Spawn smoke particles
		game.spawnPlaneParticles(this.x, this.y, this.rotation, this.hp);
	}
	
	this.mousePressed = function() {
		// Shoot bullets
		if(lastShot == 0 && reloadTime == 0) {
			shooting = true;
		}
	}
	
	this.mouseReleased = function() {
		shooting = false;
	}
	
	this.keyPressed = function(key) {
		// Slow down / go faster
		if(key == 'W') {
			speedState = state_boost;
		}else if(key == 'S') {
			speedState = state_slow;
		}
		
		// Manual reload
		if(key == 'R' && ammoLeft != bulletsPerRound) {
			ammoLeft = bulletsPerRound;
			reloadTime = reloadInterval;
		}
	}
	
	this.keyReleased = function(key) {
		// Stop slowing down / going faster
		if(key == 'W' || key == 'S')
			speedState = state_normal;
	}
}