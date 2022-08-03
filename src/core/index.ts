import { DefaultOptons, Options, TrackerConfig } from '../types/index'
import { createHistoryEvent } from '../utils/pv'
export class tracker {
	data: Options
	constructor(options: Options) {
		console.log('init....construtor')
		this.data = Object.assign(this.initDefaultOptions, options)
		this.installTracker();
	}

	private initDefaultOptions() {
		// hack  history pushState 和 replaceState 两者不触发Event
		window.history['pushState'] = createHistoryEvent('pushState')
		window.history['replaceState'] = createHistoryEvent('replaceState')
		return <DefaultOptons>{
			historyTracker: false,
			hashTracker: false,
			domTracker: false,
			sdkVersion: TrackerConfig.version,
			jsError: false
		}
	}
	// 捕获Event dosmt
	private captureEvents<T>(
		eventList: string[], targetKey: string, data?: T
	): void {
		eventList.forEach(eventName => {
			console.log('%c [ eventName ]-28', 'font-size:13px; background:pink; color:#bf2c9f;', eventName)
			window.addEventListener(eventName, () => {
				console.log('监听到了')
			})
		})
	}
	// 初始化tracker
	private installTracker() {
		console.log('installTracker')
		if (this.data.historyTracker) {
			console.log(this.data.historyTracker)
			this.captureEvents(['pushState', 'replaceState', 'popstate'], 'history-pv')
		}
	}
}