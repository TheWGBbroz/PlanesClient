function Radar() {
	var size = 150;
	var scl = 2;
	var pulse = -1;
	var pulseTimer = 0;

	this.draw = function() {
		stroke(0, 120);
		fill(50, 180, 50, 120);
		var r = width - 10 - size / 2;
		var n = height - 10 - size / 2;

		ellipse(r, n, size, size);
		stroke(0, 120);

		fill(0, 120);
		line(r - size / 2, n, r + size / 2, n);
		line(r, n - size / 2, r, n + size / 2);
		noStroke();

		for(var i = 0; i < onlinePlayers.length; i++) {
			var o = dist(onlinePlayers[i].x.position, onlinePlayers[i].y.position, player.x, player.y);
			o *= scl;
			o /= size;
			if(!(o > size / 2)) {
				var xdst = onlinePlayers[i].x.position - player.x
				var ydst = onlinePlayers[i].y.position - player.y;
				xdst *= scl;
				ydst *= scl;
				xdst /= size;
				ydst /= size;
				var x = r + xdst;
				var y = n + ydst;
				rect(x - 1, y - 1, 2, 2);
			}
		}

		if(pulse > 0) {
			noFill();
			stroke(0, map(pulse, 0, size, 220, 50));
			ellipse(r, n, pulse, pulse);
		}
	}

	this.update = function() {
		pulseTimer++;
		pulseTimer %= 60 * 3;
		if(pulseTimer == 0) {
			pulse = 1;
		}

		if(pulse > 0) pulse +=2;
		if(pulse > size) pulse = -1;
	}
}
