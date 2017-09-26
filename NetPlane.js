function NetPlane(gameInstance, x, y, rotation) {
	// Static values
	var rotSpeed = 4;
	
	var shotWait = 60 / 20;
	//
	
	this.id = -1;
	this.x = new SmoothMovement(x);
	this.y = new SmoothMovement(y);
	this.rotateTarget = rotation;
	this.rotation = rotation;
	this.speed = 0;
	this.hp = 100;
	this.shooting = false;
	this.skinid = 0;
	this.nickname = "";
	
	this.lastUpdate = Date.now();
	
	var game = gameInstance;
	
	var lastShot = 0;
	
	this.draw = function() {
		var img = skins[this.skinid];
		if(img == null)
			img = skins[0];
		
		var x = this.x.position - camera.x;
		var y = this.y.position - camera.y;
		if(!(x > -img.width / 2 && y > -img.height / 2 && x < width + img.width / 2 && y < height + img.height / 2))
			return;
		
		// Draw plane
		push();
		  translate(this.x.position - camera.x, this.y.position - camera.y);
		  
		  rotate(radians(this.rotation));
		  image(img, 0, 0);
		pop();
		
		noStroke();
		fill(0);
		text(this.nickname, this.x.position - camera.x, this.y.position - camera.y - 70);
	}
	
	this.update = function() {
		// Check if other client timed-out
		if(Date.now() - this.lastUpdate > 1000 || floor(this.hp) <= 0) {
			game.createExplosion(this.x.position, this.y.position);
			
			return true;
		}
		
		this.x.update();
		this.y.update();
		
		// Calculate new rotation
		//this.rotateTarget = degrees(atan2(this.y.target - this.y.position, this.x.target - this.x.position));
		var diff = this.rotateTarget - this.rotation;
		diff = normalizeDir(diff);
		
		// Smoothly rotate plane
		if(!(diff < rotSpeed || diff > 360 - rotSpeed)) {
			if(diff > 180)
				this.rotation -= rotSpeed;
			else if(diff < 180)
				this.rotation += rotSpeed;
		}
		this.rotation = normalizeDir(this.rotation);
		
		// Count down last shots
		if(lastShot > 0)
			lastShot--;
		
		// Shoot bullets
		if(this.shooting && lastShot == 0) {
			lastShot = shotWait;
			game.spawnBullets(this.x.position, this.y.position, this.rotation);
		}
		
		// Spawn smoke particles
		var x = this.x.position - camera.x;
		var y = this.y.position - camera.y;
		var off = 1500;
		if(x > -off && y > -off && x < width + off && y < height + off)
			game.spawnPlaneParticles(this.x.position, this.y.position, this.rotation, this.hp);
	}
}