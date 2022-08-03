import { DefaultOptons, Options, TrackerConfig } from '../types/index'


class tracker {
	options: Options
	constructor(options: Options) {
		this.options = Object.assign(this.initDefaultOptions, options)
	}

	private initDefaultOptions() {
		return <DefaultOptons>{
			historyTracker: false,
			hashTracker: false,
			domTracker: false,
			sdkVersion: TrackerConfig.version,
			jsError: false
		}
	}
}