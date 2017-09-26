function Bullet(gameInstance, x, y, rotation) {
	// Static values
	var speed = 28;
	var maxLifeTime = 60 * 4;
	//
	
	this.x = x;
	this.y = y;
	this.rotation = normalizeDir(rotation);
	this.ownerId = clientId;
	
	var lifeTime = 0;
	var game = gameInstance;
	
	this.draw = function() {
		var x = this.x - camera.x;
		var y = this.y - camera.y;
		if(!(x > 0 && y > 0 && x < width && y < height))
			return;
		
		// Draw bullet
		push();
		  translate(this.x - camera.x, this.y - camera.y);
		  rotate(radians(this.rotation));
		  image(bulletImg, 0, 0);
		pop();
	}
	
	this.update = function() {
		// Check if should remove
		lifeTime++;
		if(lifeTime > maxLifeTime)
			return true;
		
		// Calculate new position
		var rad = radians(this.rotation);
		var xa = cos(rad) * speed;
		var ya = sin(rad) * speed;
		
		this.x += xa;
		this.y += ya;
		
		if(this.x < 0 || this.y < 0 || this.x > gameSize || this.y > gameSize)
			return true;
		
		var w = planeWidth / 2;
		var h = planeHeight / 2;
		
		if(this.ownerId != clientId) {
			if(this.x > player.x - w && this.y > player.y - h && this.x < player.x + w && this.y < player.y + h)
				return true;
		}
		
		for(var i = 0; i < onlinePlayers.length; i++) {
			if(onlinePlayers[i].id == this.ownerId)
				continue;
			
			var x = onlinePlayers[i].x.position;
			var y = onlinePlayers[i].y.position;
			
			if(this.x > x - w && this.y > y - h && this.x < x + w && this.y < y + h)
				return true;
		}
	}
}