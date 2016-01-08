var WebPong = {
	/**
	 * Game properties:
	*/
	p: {
		fgColor: "#ffffff",
		bgColor: "#000000",
		racketSteps: 500,
		s: {
			dividerWidth: .003,
			dividerDashSize: .01,
			racketHeight: .2,
			racketWidth: .008,
			racketX: .015
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
		/* TODO: Remove! */
		upwards: [true,false]
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
		/* Add resize handler: */
		$(window).resize(function() {
			WebPong.resize();
			WebPong.draw(); /* FIXME? */
		});
		/* Add animation: (TODO: Remove!) */
		window.setInterval(function() {
			for (var i=0; i < 2; ++i) {
				if (WebPong.r.upwards[i]) {
					WebPong.r.rackets[i] -= 2;
					if (WebPong.r.rackets[i] === 0) {
						WebPong.r.upwards[i] = !WebPong.r.upwards[i];
					};
				} else {
					WebPong.r.rackets[i] += 2;
					if (WebPong.r.rackets[i] === WebPong.p.racketSteps) {
						WebPong.r.upwards[i] = !WebPong.r.upwards[i];
					};
				};
			}
			WebPong.draw();
		}, 10);
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
		this.r.s.middleX = Math.floor(this.r.width*.5);
	},
	/**
	 * Resets the global context properties.
	*/
	reset: function() {
		this.r.ctx.fillStyle = this.p.bgColor;
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
		this.r.ctx.fillStyle = this.p.fgColor;
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
	 * Returns the y coordinate for a racket.
	 * @param pos Zero or One.
	*/
	getRacketY: function(pos) {
		return Math.floor(
			this.r.rackets[pos]*(this.r.height-this.r.s.racketHeight)/this.p.racketSteps
		);
	}
};