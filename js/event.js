var EventEmitter = (function () {
	function EventEmitter () {
		this.listeners = {};
	}	

	EventEmitter.prototype.on = function (event, fn) {
		this.addEventListener(event, fn);
	};

	EventEmitter.prototype.emit = function (event, obj) {
		try {
			this.listeners[event](obj);	
		} catch (e) {
			if (/error/i.test(event)) {
				throw new Error('Unhandled error event');
			}
		}
	};	

	EventEmitter.prototype.addEventListener = function (event, fn) {
		this.listeners[event] = fn;
	};

	EventEmitter.prototype.removeEventListener = function (event) {
		delete this.listeners[event];
	};

	return EventEmitter;
})();