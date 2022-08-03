(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tracker = {}));
})(this, (function (exports) { 'use strict';

	function compact(c, b) {
	    return [c, b];
	}

	exports.compact = compact;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
