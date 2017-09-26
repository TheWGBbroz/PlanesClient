function PopupText(txt, r, g, b) {
	this.txt = txt;
	
	this.x = 50;
	this.y = height;
	this.dy = 1.5;
	this.lifeTime = 0;
	this.maxLifeTime = 60 * 5;
	this.r = r || 255;
	this.g = g || 0;
	this.b = b || 0;
	
	this.draw = function() {
		var alpha = this.maxLifeTime - this.lifeTime;
		alpha *= 5;
		alpha = map(alpha, 0, this.maxLifeTime, 0, 255);
		
		textSize(28);
		fill(this.r, this.g, this.b, alpha);
		noStroke();
		text(this.txt, this.x, this.y);
	}
	
	this.update = function() {
		this.lifeTime++;
		if(this.lifeTime > this.maxLifeTime)
			return true;
		
		var target = height * 14 / 15;
		
		if(this.y < target + this.dy) {
			this.y += this.dy;
		}
		
		if(this.y > target - this.dy) {
			this.y -= this.dy;
		}
	}
}