function Leaderboard() {
	var xoff = 4;
	var txtoff = 22;
	var scoreoff = 140;
	var w = 200;
	var h = 11 * txtoff - 8;
	var players = [];
	
	this.draw = function() {
		noStroke();
		fill(40, 200);
		rect(width - w - xoff, xoff, w, h);
		textSize(14);
		fill(180);
		
		for(var i = 0; i < 10; i++) {
			if(players[i] != null) {
				text("#" + (i + 1) + " " + players[i].name, width - w + xoff, txtoff + xoff + i * txtoff);
				text(players[i].points, width - w + xoff + scoreoff, txtoff + xoff + i * txtoff);
			}
		}
	}
	
	this.updateLeaderboard = function(data) {
		for(var i = 0; i < 10; i++) {
			if(data[i] == null || data[i].name == null || data[i].points == null || data[i].points < 0)
				continue;
			
			var n = data[i].name;
			
			if(n.length <= 0)
				n = "No Name";
			n = n.substring(0, 12);
			players[i] = {
				name:   n,
				points: data[i].points
			}
		}
	}
}