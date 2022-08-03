(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tracker = {}));
})(this, (function (exports) { 'use strict';

	//版本
	var TrackerConfig;
	(function (TrackerConfig) {
	    TrackerConfig["version"] = "1.0.0";
	})(TrackerConfig || (TrackerConfig = {}));

	const createHistoryEvent = (type) => {
	    const origin = history[type];
	    return function () {
	        const res = origin.apply(this, arguments);
	        var e = new Event(type);
	        window.dispatchEvent(e);
	        return res;
	    };
	};

	class tracker {
	    constructor(options) {
	        console.log('init....construtor');
	        this.data = Object.assign(this.initDefaultOptions, options);
	        this.installTracker();
	    }
	    initDefaultOptions() {
	        // hack  history pushState 和 replaceState 两者不触发Event
	        window.history['pushState'] = createHistoryEvent('pushState');
	        window.history['replaceState'] = createHistoryEvent('replaceState');
	        return {
	            historyTracker: false,
	            hashTracker: false,
	            domTracker: false,
	            sdkVersion: TrackerConfig.version,
	            jsError: false
	        };
	    }
	    // 捕获Event dosmt
	    captureEvents(eventList, targetKey, data) {
	        eventList.forEach(eventName => {
	            console.log('%c [ eventName ]-28', 'font-size:13px; background:pink; color:#bf2c9f;', eventName);
	            window.addEventListener(eventName, () => {
	                console.log('监听到了');
	            });
	        });
	    }
	    // 初始化tracker
	    installTracker() {
	        console.log('installTracker');
	        if (this.data.historyTracker) {
	            console.log(this.data.historyTracker);
	            this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv');
	        }
	    }
	}

	exports.tracker = tracker;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
