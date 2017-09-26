function Upgrader() {
	var upgradesAmount = 4;
	var xoff = 10;
	var yoff = 80;
	var txtxoff = 6;
	var txtyoff = 20;
	var txtspace = 25;
	var x = 0;
	var y = 0;
	var w = 150;
	var h = upgradesAmount * txtspace + 6;
	var valxoff = w - 30;

	var values = [];
	var costs = [];

	this.draw = function() {
		x = xoff;
		y = height - h - yoff;

		noStroke();
		fill(255, 200);
		//rect(x, y, w, h);
		superellipse(x + 70 / 2, y + 40 / 2, w - 70, h - 40, 16);

		fill(0, 200);
		textSize(14);
		var i = 0;
		text("HP Per Second"    , x + txtxoff, y + txtyoff + i++ * txtspace);
		text("Max HP"           , x + txtxoff, y + txtyoff + i++ * txtspace);
		text("Bullet Damage"    , x + txtxoff, y + txtyoff + i++ * txtspace);
		text("Bullets per round", x + txtxoff, y + txtyoff + i++ * txtspace);

		fill(0,200);
		textSize(14);

		for(var j = 0; j < upgradesAmount; j++) {
			if(values[j] == null)
				continue;
			text(values[j] + "x", x + valxoff, y + txtyoff + j * txtspace);
		}

		// Mouse hover costs
		var upgradeid = -1;
		var tx = x;
		var tw = w;
		var th = txtspace;
		for(var i = 0; i < upgradesAmount ; i++) {
			var ty = y + txtyoff + (i - 1) * txtspace + 5;
			if(mouseX > tx && mouseY > ty && mouseX < tx + tw && mouseY < ty + th) {
				upgradeid = i;
				break
			}
		}

		if(upgradeid != -1 && costs[upgradeid] != null) {
			fill(255);
			noStroke();
			superellipse(mouseX + 10, mouseY - 10, 35, 10, 16);
			fill(0);
			text("Cost: " + costs[upgradeid], mouseX - 2, mouseY);
		}
	}

	this.mousePressed = function() {
		if(mouseX > x && mouseY > y && mouseX < x + w && mouseY < y + h) {
			var upgradeid = -1;
			var tx = x;
			var tw = w;
			var th = txtspace;
			for(var i = 0; i < upgradesAmount ; i++) {
				var ty = y + txtyoff + (i - 1) * txtspace + 5;
				if(mouseX > tx && mouseY > ty && mouseX < tx + tw && mouseY < ty + th) {
					upgradeid = i;
					break
				}
			}

			if(upgradeid != -1) {
				socket.emit("upgrade_request", upgradeid);
			}

			return true;
		}
	}

	this.updateValues = function(e) {
		values[0] = e.hp_per_sec;
		values[1] = e.hp_max_add;
		values[2] = e.bullet_damage;
		values[3] = e.bullets_per_round
	}

	this.upgradesCosts = function(data) {
		costs[0] = data.hp_per_sec;
		costs[1] = data.hp_max_add;
		costs[2] = data.bullet_damage;
		costs[3] = data.bullets_per_round;
	}
}
