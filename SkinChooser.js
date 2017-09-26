function SkinChooser(x, y) {
	this.x = x || 0;
	this.y = y || 0;
	this.skinid = 0;
	
	this.draw = function() {
		var img = skins[this.skinid];
		if(img == null)
			img = skins[0];
		push();
		  translate(this.x,this.y);
		  rotate(radians(270));
		  image(img,0,0);
		pop()
	}
	
	this.mouseWheel = function(delta) {
		if(delta < 0)
			this.skinid++;
		else if(delta > 0)
			this.skinid--;
		
		if(this.skinid < 0)
			this.skinid = 0;
		if(this.skinid > skins.length - 1)
			this.skinid = skins.length - 1;
	}
}