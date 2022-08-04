import { DefaultOption, Option, TrackerConfig, reportTrackerData } from "../types/index";
import { createHistoryEvent } from "../utils/pv";
const MouseEventList: string[] = [
	"click",
	"dblclick",
	"contextmenu",

];
export class tracker {
	data: Option;
	constructor(options: Option) {
		this.data = Object.assign(this.initDefaultOption(), options);
		this.installTracker();
	}

	private initDefaultOption() {
		// hack  history pushState 和 replaceState 两者不触发Event
		window.history["pushState"] = createHistoryEvent("pushState");
		window.history["replaceState"] = createHistoryEvent("replaceState");
		return <DefaultOption>{
			historyTracker: false,
			hashTracker: false,
			domTracker: false,
			sdkVersion: TrackerConfig.version,
			jsError: false,
		};
	}

	sendTracker(data: reportTrackerData) {
		this.reportTracker(data);
	}
	// 捕获Event dosmt
	private captureEvents<T>(
		eventList: string[],
		targetKey: string,
		data?: T
	): void {
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
	private installTracker() {
		if (this.data.historyTracker) {
			this.captureEvents(
				["pushState", "replaceState", "popstate"],
				"history-pv"
			);
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
	private reportJSErrorTracker() {

		window.addEventListener('error', (target) => {

			this.reportTracker({
				event: 'jsError',
				targetKey: 'js-error',
				message: target.message,
				filename: target.filename,
			})
		})
		window.addEventListener('unhandledrejection', (event) => {

			this.reportTracker({
				event: 'jsError',
				targetKey: 'Promise-rejection-event',
				reason: event.reason,
			})
		});
	}
	private reportDomTracker() {
		MouseEventList.forEach((eventName) => {
			window.addEventListener(eventName, (mouseEvent: Event) => {

				let element = mouseEvent.target as HTMLElement;
				if (element.getAttribute('target-key')) {
					this.reportTracker({
						event: eventName,
						targetKey: element.getAttribute('target-key') as string,
					})
				}
			});
		});
	}
	private reportTracker(data: reportTrackerData) {
		const params = Object.assign(this.data, data, {
			time: new Date().getTime(),
		});

		let headers = {
			type: "application/x-www-form-urlencoded",
		};

		let blob = new Blob([JSON.stringify(params)], headers);

		navigator.sendBeacon(this.data.requestUrl, blob);
	}
	setuuid<T extends DefaultOption["uuid"]>(uuid: T) {
		this.data.uuid = uuid;
	}
	setExtra<T extends DefaultOption["extra"]>(extra: T) {
		this.data.extra = extra;
	}
}
