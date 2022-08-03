// 重写historyEvent 以便全局能监控到
export const createHistoryEvent = <T extends keyof History>(type: T) => {
	let origin = history[type]

	return function (...args: Array<any>) {
		const res = origin.apply(this, args);

		const e = new Event(type)
		window.dispatchEvent(e)
		return res
	}
}