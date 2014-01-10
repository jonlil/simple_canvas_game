var Monster = (function () {

	function Options (opts) {
		this.size = {
			width: 0,
			height: 0
		};
		this.position = {
			x: 0,
			y: 0
		};
		this.image = {
			loaded: false,
			src: opts.image || "images/monster.png"
		};
		this.name = '';
		this.type = '';

		return this;
	}

	function Monster (options) {
		var self = this;

		this.react = (function (opts) {
			return {
				spawned: null
			}
		}).bind(this)(options);

		(function (opts) {
			Options.bind(this, opts)();
			this.points = {
				base: 5,
				multiplier: 2
			};
			this.timers = {
				spawnTime: 2000
			};

			return this;
		}).bind(this)(options);

		this._canvas = options.canvas;
		this._ctx = options.ctx;
		this._image = new Image();

		this.attachEvents();
		this.place(this._canvas);
		this.setImage(this.image.src);
	}

	Monster.prototype = new EventEmitter;
	Monster.prototype.constructor = Monster;

	Monster.prototype.isReady = function () {
		return this.imageReady;
	};

	Monster.prototype.render = function () {
		this._ctx.drawImage(this._image, this.position.x, this.position.y);
	};

	Monster.prototype.place = function () {
		// Throw the monster somewhere on the screen randomly
		this.position.x = this.size.width + (Math.random() * (this._canvas.width - (this.size.width * 2)));
		this.position.y = this.size.height + (Math.random() * (this._canvas.height - (this.size.height * 2)));
		this.react.spawned = new Date().getTime();
	};

	Monster.prototype.reset = function () {
		this.position = { x: -60, y: -60 }; // outside the map
		setTimeout(this.place.bind(this, this._canvas), this.timers.spawnTime);
	};

	Monster.prototype.isCaught = function (player) {
		player.monstersCaught++;
		var score = Math.round(this.points.base / ((new Date().getTime() - this.react.spawned) / 1000));

		player.emit('score', score);
		this.emit('reset');
	};

	Monster.prototype.attachEvents = function () {
		this.on('caught', this.isCaught.bind(this));
		this.on('render', this.render.bind(this));
		this.on('image.change', this.setImage.bind(this));
		this._image.onload = function () {
			this.imageReady = true;
			this.emit('render');
		}.bind(this);
		this.on('change', function () {
			// future method for sync with backend etc

		});
	};

	Monster.prototype.setImage = function (image) {
		this.imageReady = false;
		this._image.src = this.image = image;
	};

	Monster.prototype.isTouching = function (hero, player) {
		if (hero.x <= (this.position.x + 32)
			&& this.position.x <= (hero.x + 32)
			&& hero.y <= (this.position.y + 32)
			&& this.position.y <= (hero.y + 32)) {
			this.emit('caught', player);
			return true;
		} else {
			return false;
		}
	} 

	return Monster;
})();