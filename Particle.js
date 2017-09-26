function Particle(x, y, color, rot, speed, gravity, dx, dy) {
	this.x = x;
	this.y = y;
	this.rot = rot || -1;
	this.speed = speed || 0;
	this.dx = dx || random(-4, 4);
	this.dy = dy || random(-4, 4);
	this.gravity = gravity || random(0.2, 0.6);
	this.color = color;
	this.maxLifeTime = random(60 * 0.5, 60 * 1.5);
	
	var lifeTime = 0;
	
	this.draw = function() {
		fill(color);
		stroke(color);
		
		var x = this.x - camera.x;
		var y = this.y - camera.y;
		
		if(x > 0 && y > 0 && x < width && y < height)
			rect(x, y, 2, 2);
	}
	
	this.update = function() {
		lifeTime++;
		if(lifeTime >= this.maxLifeTime)
			return true;
		
		if(this.rot === -1) {
			this.x += this.dx;
			this.y += this.dy;
		}else{
			var rad = radians(this.rot);
			this.x += cos(rad) * this.speed;
			this.y += sin(rad) * this.speed;
		}
		
		if(this.dx < -this.gravity) {
			this.dx += this.gravity;
		}else if(this.dx > this.gravity) {
			this.dx -= this.gravity;
		}
		
		if(this.dy < -this.gravity) {
			this.dy += this.gravity;
		}else if(this.dy > this.gravity) {
			this.dy -= this.gravity;
		}
		
		if(this.speed > this.gravity) {
			this.speed -= this.gravity;
		}
	}
}