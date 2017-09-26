function Menu() {
	var instance;
	var nickName;
	var playBtn;
	var skinChooser;
	var graphicsToggle;

	this.init = function() {
		instance = this;

		nickName = createInput();

		playBtn = createButton("Play!");
		playBtn.mousePressed(this.startGame);

		graphicsToggle = createButton("High graphics");
		graphicsToggle.mousePressed(this.toggleGraphics);

		this.updateLGBtn();

		skinChooser = new SkinChooser();
	}

	this.draw = function() {
		background(54);
		skinChooser.draw();

		noStroke();
		fill(0);
		textSize(18);
		text("Nickname:", width / 2 - nickName.width / 2, height / 2 - 56);
		text("Skin (Scroll to change)", width / 2 - skins[0].width / 2, height / 2 - skins[0].height / 2 + 205);

		// Get next tip
	}

	this.startGame = function() {
		var state = setState(GAME);
		state.connectToServer(skinChooser.skinid, nickName.value());
	}

	this.toggleGraphics = function() {
		lowGraphics = !lowGraphics;
		instance.updateLGBtn();
	}

	this.keyPressed = function() {
		if(keyCode == ENTER)
			this.startGame();
	}

	this.mouseWheel = function(e) {
		skinChooser.mouseWheel(e);
	};

	this.windowResized = function() {
		nickName.position(width / 2 - nickName.width / 2, height / 2 - 50);
		playBtn.position(width / 2 - playBtn.width / 2, height / 2 + 50);
		graphicsToggle.position(20,20);
		skinChooser.x = width / 2;
		skinChooser.y = height / 2 + 200
	}

	this.updateLGBtn = function() {
		if(lowGraphics) {
			graphicsToggle.html("Low graphics");
		}else{
			graphicsToggle.html("High graphics");
		}
	}

	this.setNickname = function(e) {
		if(e != "No Name")
			nickName.value(e);
	}

	this.setSkin = function(skin) {
		skinChooser.skinid = skin;
	}
}
