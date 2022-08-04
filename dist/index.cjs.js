'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

//版本
var TrackerConfig;
(function (TrackerConfig) {
    TrackerConfig["version"] = "1.0.0";
})(TrackerConfig || (TrackerConfig = {}));

// 重写historyEvent 以便全局能监控到
const createHistoryEvent = (type) => {
    let origin = history[type];
    return function (...args) {
        const res = origin.apply(this, args);
        const e = new Event(type);
        window.dispatchEvent(e);
        return res;
    };
};

const MouseEventList = [
    "click",
    "dblclick",
    "contextmenu",
];
class tracker {
    constructor(options) {
        this.data = Object.assign(this.initDefaultOption(), options);
        this.installTracker();
    }
    initDefaultOption() {
        // hack  history pushState 和 replaceState 两者不触发Event
        window.history["pushState"] = createHistoryEvent("pushState");
        window.history["replaceState"] = createHistoryEvent("replaceState");
        return {
            historyTracker: false,
            hashTracker: false,
            domTracker: false,
            sdkVersion: TrackerConfig.version,
            jsError: false,
        };
    }
    sendTracker(data) {
        this.reportTracker(data);
    }
    // 捕获Event dosmt
    captureEvents(eventList, targetKey, data) {
        eventList.forEach((eventName) => {
            window.addEventListener(eventName, () => {
                this.reportTracker({
                    event: eventName,
                    targetKey,
                    data,
                });
            });
        });
    }
    // 初始化tracker
    installTracker() {
        if (this.data.historyTracker) {
            this.captureEvents(["pushState", "replaceState", "popstate"], "history-pv");
        }
        if (this.data.hashTracker) {
            this.captureEvents(["hashChange"], "hash-pv");
        }
        if (this.data.domTracker) {
            this.reportDomTracker();
        }
        if (this.data.jsError) {
            this.reportJSErrorTracker();
        }
    }
    reportJSErrorTracker() {
        window.addEventListener('error', (target) => {
            this.reportTracker({
                event: 'jsError',
                targetKey: 'js-error',
                message: target.message,
                filename: target.filename,
            });
        });
        window.addEventListener('unhandledrejection', (event) => {
            this.reportTracker({
                event: 'jsError',
                targetKey: 'Promise-rejection-event',
                reason: event.reason,
            });
        });
    }
    reportDomTracker() {
        MouseEventList.forEach((eventName) => {
            window.addEventListener(eventName, (mouseEvent) => {
                let element = mouseEvent.target;
                if (element.getAttribute('target-key')) {
                    this.reportTracker({
                        event: eventName,
                        targetKey: element.getAttribute('target-key'),
                    });
                }
            });
        });
    }
    reportTracker(data) {
        const params = Object.assign(this.data, data, {
            time: new Date().getTime(),
        });
        let headers = {
            type: "application/x-www-form-urlencoded",
        };
        let blob = new Blob([JSON.stringify(params)], headers);
        navigator.sendBeacon(this.data.requestUrl, blob);
    }
    setuuid(uuid) {
        this.data.uuid = uuid;
    }
    setExtra(extra) {
        this.data.extra = extra;
    }
}

exports.tracker = tracker;
