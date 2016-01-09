var WebPong = {
	/**
	 * Game properties:
	*/
	p: {
		fgColor: "#ffffff",
		bgColor: "#000000",
		racketSteps: 500,
		ballSteps: 1000,
		framerate: 60,
		racketAnimationStep: 2,
		ballMovementStep: 5,
		s: {
			dividerWidth: .003,
			dividerDashSize: .01,
			racketHeight: .2,
			racketWidth: .008,
			racketX: .015,
			ballSize: .05
		}
	},
	/**
	 * Runtime variables:
	*/
	r: {
		/* Canvas size: */
		width: 0,
		height: 0,
		/* Drawing context: */
		ctx: null,
		/* Calculated sizes: */
		s: { },
		/* Racket positions: */
		rackets: [0,0],
		racketsUpwards: [true,false],
		/* Ball position & movement: */
		ball: [0,0],
		ballMovement: [5,1]
	},
	/**
	 * Initializes variables and creates handlers.
	*/
	init: function() {
		/* Get context: */
		var el = document.getElementById("webpong");
		if (el.getContext) {
			this.r.ctx = el.getContext("2d");
		} else {
			alert("Sorry, your browser has to support canvas for this game!");
		};
		/* Set sizes: */
		this.resize();
		/* Set racket positions: */
		this.r.rackets[0] = Math.floor(this.p.racketSteps*.5);
		this.r.rackets[1] = Math.floor(this.p.racketSteps*.5);
		/* Set ball position: */
		this.r.ball[0] = Math.floor(this.p.ballSteps*.5);
		this.r.ball[1] = Math.floor(this.p.ballSteps*.5);
		/* Add resize handler: */
		$(window).resize(function() { WebPong.resize(); });
		/* Set up main loop: */
		var animationFrame = window.requestAnimationFrame ||
		                     window.webkitRequestAnimationFrame ||
		                     window.mozRequestAnimationFrame ||
		                     window.oRequestAnimationFrame ||
		                     window.msRequestAnimationFrame || null;
		if (animationFrame !== null) {
			/* requestAnimationFrame() supported, using it. */
			var recursive = function() {
				WebPong.main();
				animationFrame(recursive);
			};
			animationFrame(recursive);
		} else {
			/* requestAnimationFrame() not supported, using setInterval(). */
			window.setInterval(this.main, Math.floor(1000/this.p.framerate));
		};
	},
	/**
	 * Recalculates sizes on window resize.
	*/
	resize: function() {
		/* Canvas size: */
		this.r.height = Math.floor($(window).height()*0.95);
		this.r.width = Math.floor($(window).width()*0.95);
		$("#webpong").attr("width", this.r.width);
		$("#webpong").attr("height", this.r.height);
		/* Other sizes: */
		this.r.s.dividerWidth = Math.floor(this.r.width*this.p.s.dividerWidth);
		this.r.s.dividerDashSize = this.r.height*this.p.s.dividerDashSize;
		this.r.s.racketHeight = Math.floor(this.r.height*this.p.s.racketHeight);
		this.r.s.racketWidth = Math.floor(this.r.width*this.p.s.racketWidth);
		this.r.s.racketX = Math.floor(this.r.width*this.p.s.racketX);
		this.r.s.ballSize = Math.floor(this.r.height*this.p.s.ballSize);
		this.r.s.middleX = Math.floor(this.r.width*.5);
	},
	/**
	 * Resets the global context properties.
	*/
	reset: function() {
		this.r.ctx.fillStyle = this.p.fgColor;
		this.r.ctx.strokeStyle = this.p.fgColor;
		this.r.ctx.shadowColor = "rgba(0, 0, 0, 0)";
		this.r.ctx.shadowBlur = 0;
		this.r.ctx.shadowOffsetX = 0;
		this.r.ctx.shadowOffsetY = 0;
		this.r.ctx.lineCap = "butt";
		this.r.ctx.lineJoin = "miter";
		this.r.ctx.lineWidth = 1;
		this.r.ctx.miterLimit = 10;
	},
	/**
	 * Main loop function.
	*/
	main: function() {
		this.triggerRacketAnimation();
		this.triggerBallMovement();
		this.draw();
	},
	/**
	 * Clears the canvas and draws everything on it.
	*/
	draw: function() {
		/* Clear: */
		this.r.ctx.fillStyle = this.p.bgColor;
		this.r.ctx.fillRect(0,0,this.r.width,this.r.height);
		/* Draw canvas border: */
		this.reset();
		this.r.ctx.lineWidth = 2;
		this.r.ctx.beginPath();
		this.r.ctx.moveTo(           0,            0);
		this.r.ctx.lineTo(this.r.width,            0);
		this.r.ctx.lineTo(this.r.width,this.r.height);
		this.r.ctx.lineTo(           0,this.r.height);
		this.r.ctx.closePath();
		this.r.ctx.stroke();
		/* Draw rackets: */
		this.drawRacket(0);
		this.drawRacket(1);
		/* Draw divider: */
		this.drawDivider();
		/* Draw ball: */
		this.drawBall();
	},
	/**
	 * Draws a racket.
	 * @param pos Zero or One.
	*/
	drawRacket: function(pos) {
		this.reset();
		if (pos === 1) {
			var racketX = this.r.width-(this.r.s.racketX+this.r.s.racketWidth);
		} else {
			var racketX = this.r.s.racketX;
		};
		this.r.ctx.fillRect(
			racketX,
			this.getRacketY(pos),
			this.r.s.racketWidth,
			this.r.s.racketHeight
		);
	},
	/**
	 * Draws the divider.
	*/
	drawDivider: function() {
		this.reset();
		this.r.ctx.lineWidth = this.r.s.dividerWidth;
		var posY = 0;
		while (posY < this.r.height) {
			this.r.ctx.beginPath();
			this.r.ctx.moveTo(this.r.s.middleX,Math.floor(posY));
			posY += this.r.s.dividerDashSize;
			this.r.ctx.lineTo(this.r.s.middleX,Math.floor(posY));
			posY += this.r.s.dividerDashSize;
			this.r.ctx.stroke();
		}
	},
	/**
	 * Draws the ball.
	*/
	drawBall: function() {
		this.reset();
		this.r.ctx.fillRect(
			this.getBallX(),
			this.getBallY(),
			this.r.s.ballSize,
			this.r.s.ballSize
		);
	},
	/**
	 * Returns the y coordinate for a racket.
	 * @param pos Zero or One.
	*/
	getRacketY: function(pos) {
		return Math.floor(
			this.r.rackets[pos]*(this.r.height-this.r.s.racketHeight)/this.p.racketSteps
		);
	},
	/**
	 * Returns the x coordinate for the ball.
	*/
	getBallX: function() {
		return Math.floor(
			this.r.ball[0]*(this.r.width-this.r.s.ballSize)/this.p.ballSteps
		);
	},
	/**
	 * Returns the y coordinate for the ball.
	*/
	getBallY: function() {
		return Math.floor(
			this.r.ball[1]*(this.r.height-this.r.s.ballSize)/this.p.ballSteps
		);
	},
	/**
	 * Triggers the racket animation between games.
	*/
	triggerRacketAnimation: function() {
		for (var i=0; i < 2; ++i) {
			if (this.r.racketsUpwards[i]) {
				this.r.rackets[i] -= this.p.racketAnimationStep;
				if (this.r.rackets[i] <= 0) {
					this.r.racketsUpwards[i] = !this.r.racketsUpwards[i];
				};
			} else {
				this.r.rackets[i] += this.p.racketAnimationStep;
				if (this.r.rackets[i] >= this.p.racketSteps) {
					this.r.racketsUpwards[i] = !this.r.racketsUpwards[i];
				};
			};
		}
	},
	/**
	 * Triggers the ball movement.
	*/
	triggerBallMovement: function() {
		for (var i=0; i < 2; ++i) {
			this.r.ball[i] += this.r.ballMovement[i];
			if ((this.r.ballMovement[i] < 0 && this.r.ball[i] <= 0) || (this.r.ballMovement[i] > 0 && this.r.ball[i] >= this.p.ballSteps)) {
				this.r.ballMovement[i] = -this.r.ballMovement[i];
			};
		}
	}
};
