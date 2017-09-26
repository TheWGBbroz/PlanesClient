
var bulletOffsets;
var bgdis = 80;
var lowGraphics = false;
var sps = 20;
var socketThread;

var socket;
var gameSize = 6000;
var camera;
var player;
var onlinePlayers;
var bullets;
var particles;
var leaderboard;
var radar;
var upgrader;

var planeWidth = 160;
var planeHeight = 160;

var circleSize = 0;
var bgBlend = 0;
var circleR = 18;
var circleG = 191;
var circleB = 206;

function Game() {
	var instance;

	this.init = function() {
		instance = this;
		bulletOffsets = [];
		camera = createVector();
		player = new Player(this);
		onlinePlayers = [];
		bullets = [];
		particles = [];
		leaderboard = new Leaderboard();
		radar = new Radar();
		upgrader = new Upgrader();
	}

	this.draw = function() {
		if(circleSize < width + height) {
			circleSize += 60;
			fill(circleR, circleG, circleB);
			noStroke();
			ellipse(width / 2, height / 2, circleSize, circleSize);
			return;
		}

		this.drawBackground();

		player.update();
		player.draw();

		camera.x = player.x - width / 2;
		camera.y = player.y - height / 2;

		for(var i = 0; i < particles.length; i++) {
			var remove = particles[i].update();
			if(remove) {
				particles.splice(i--, 1);
				continue;
			}

			particles[i].draw();
		}

		for(var i = 0; i < bullets.length; i++) {
			var remove = bullets[i].update();
			if(remove) {
				bullets.splice(i--, 1);
				continue;
			}

			bullets[i].draw();
		}

		for(var i = 0; i < onlinePlayers.length; i++) {
			var remove = onlinePlayers[i].update();
			if(remove) {
				onlinePlayers.splice(i--,1);
				continue;
			}

			onlinePlayers[i].draw();
		}

		leaderboard.draw();

		radar.update();
		radar.draw();

		upgrader.draw();

		if(bgBlend < 255) {
			background(circleR, circleG, circleB, 255 - bgBlend);
			bgBlend += 6;
		}
	}

	this.drawBackground = function() {
		background(54);

		var rows = width / bgdis + 1;
		var cols = height / bgdis + 1;
		var xoff = camera.x % bgdis;
		var yoff = camera.y % bgdis;

		stroke(128);
		for(var i = 0; i < rows; i++)
			line(i * bgdis - xoff, 0, i * bgdis - xoff, height);
		for(var i = 0; i < cols; i++)
			line(0, i * bgdis - yoff, width, i * bgdis - yoff);

		stroke(255, 0, 230);
		strokeWeight(5);
		line(-camera.x, -camera.y, -camera.x, gameSize-camera.y);
		line(gameSize - camera.x, -camera.y, gameSize - camera.x, gameSize - camera.y);
		line(-camera.x, -camera.y, gameSize - camera.x, -camera.y);
		line(-camera.x, gameSize - camera.y, gameSize - camera.x, gameSize - camera.y);
		strokeWeight(1);
	}

	this.keyPressed = function() {
		if(keyCode == ESCAPE)
			this.toMenu();

		if(player != null)
			player.keyPressed(key);
	}

	this.keyReleased = function() {
		player.keyReleased(key);
	}

	this.mousePressed = function() {
		if(!upgrader.mousePressed())
			player.mousePressed();
	}

	this.mouseReleased = function() {
		player.mouseReleased();
	}

	this.spawnBullets = function(x, y, rot) {
		for(var i = 0; i < bulletOffsets.length; i++) {
			var off = getRotatedOffsets(bulletOffsets[i].x, bulletOffsets[i].y, rot);
			b = new Bullet(this, x + off.x, y + off.y, rot);
			this.spawnBullet(b);
		}
	}

	this.spawnBullet = function(b) {
		if(bullets.length > 400)
			bullets.splice(0, 1);

		bullets[bullets.length] = b;
	}

	this.spawnParticle = function(p) {
		if(!lowGraphics) {
			var x = p.x - camera.x;
			var y = p.y - camera.y;

			if(x > 0 && y > 0 && x < width && y < height) {
				if(particles.length > 400)
					if(random() < 0.9)
						return;
				particles[particles.length] = p;
			}
		}
	}

	this.spawnPlaneParticles = function(xx, yy, rot, hp) {
		if(!lowGraphics) {
			var x = xx - camera.x;
			var y = yy - camera.y;

			if(x > 0 && y > 0 && x < width && y < height) {
				var off = getRotatedOffsets(-85, 0, rot);
				m = map(hp, 0, 100, 80, 220);
				for(i = 0; i < 2; i++) {
					var p = new Particle(xx + off.x, yy + off.y, color(random(m - 20, m + 20), 80));
					this.spawnParticle(p);
				}
			}
		}
	}


	this.createExplosion = function(xx, yy) {
		if(!lowGraphics) {
			var x = xx - camera.x;
			var y = yy - camera.y;
			if(x > 0 && y > 0 && x < width && y < height) {
				for(var i = 0; i < 50; i++) {
					var c = color(255, 200, 0);
					p = new Particle(xx, yy, c, random(360), random(0, 10),0.08);
					this.spawnParticle(p);
				}

				for(var i = 0; i < 60; i++) {
					var c = color(255, 0, 0);
					var p = new Particle(xx, yy, c, random(360), random(0,10), 0.08);
					this.spawnParticle(p);
				}
			}
		}
	}

	this.toMenu = function() {
		var state = setState(MENU);

		if(player != null) {
			state.setNickname(player.nickname);
			state.setSkin(player.skinid);
		}

		clearInterval(socketThread);

		socket.disconnect();
		player = null;
		onlinePlayers = null;
		bullets = null;
		particles = null;
		circleSize = 0;
		bgBlend = 0;
	}

	this.connectToServer = function(skinid, nick, ip) {
		if(nick == null || nick.length <= 0)
			nick = "No Name";

		player.skinid = skinid;
		player.nickname = nick;
		socketIp = ip || getRandomIp();
		socketIp = socketIp;

		socket = io.connect(socketIp);
		//socket.set('transports', ['websocket','xhr-polling','jsonp-polling']);

		var init_data = {
			skinid: player.skinid,
			nickname: player.nickname
		};
		socket.emit("init_data", init_data);

		socket.on("disconnect", function() {
			instance.toMenu();
		});

		socket.on("id", function(data) {
			clientId = data;
		});

		socket.on("init_data", function(data) {
			bulletOffsets = data.bulletOffsets;
			bulletLifeLength = data.bulletLifeLength;
			gameSize = data.gameSize;

			player.x = data.playerX;
			player.y = data.playerY;
			player.locTxtUpdate = 0;
			player.locTxtX = data.playerX;
			player.locTxtY = data.playerY;
		});

		socket.on("upgrades_costs", function(data) {
			upgrader.upgradesCosts(data);
		});

		socket.on("plane", function(data) {
			if(data.id != clientId && data.id != -1) {
				var plane = null;
				for(var i = 0; i < onlinePlayers.length; i++) {
					if(onlinePlayers[i].id >= 0 && onlinePlayers[i].id == data.id) {
						plane = onlinePlayers[i];
						break;
					}
				}

				var isNew = plane == null;
				if(isNew) {
					plane = new NetPlane(instance, data.x, data.y, data.rotation);
					onlinePlayers[onlinePlayers.length] = plane;
				}

				plane.id = data.id;
				plane.x.target = data.x;
				plane.y.target = data.y;
				plane.rotateTarget = data.rotation;
				plane.speed = data.speed;
				plane.hp = data.hp;
				plane.shooting = data.shooting;
				plane.skinid = data.skinid;
				plane.nickname = data.nickname;
				plane.lastUpdate = Date.now();

				if(isNew) {
					plane.x.position = data.x;
					plane.y.position = data.y;
				}
			}
		});

		socket.on("bullet", function(data) {
			var b = new Bullet(instance, data.x, data.y, data.rotation);
			b.ownerId = data.ownerId;
			instance.spawnBullet(b);
		});

		socket.on("update_self", function(data) {
			player.hp = data.hp;
			if(player.hp < 0) player.hp = 0;
			player.points = data.points;
			player.totalPoints = data.totalPoints;
			player_bulletsPerRound = data.bullets_per_round;
		});

		socket.on("leaderboard", function(data) {
			leaderboard.updateLeaderboard(data);
		});

		socket.on("update_upgrades", function(data) {
			upgrader.updateValues(data);
		});

		socketThread = setInterval(this.sendServerData, 60 / sps);
	}

	this.sendServerData = function() {
		var update_data = {
			x: player.x,
			y: player.y,
			rotation: player.rotation,
			speed: player.speed,
			shooting: player.svrShooting
		};
		socket.emit("update_data",update_data);
	}
}
