/**
 * @requestUrl 接口地址
 * @historyTracker history上报
 * @hashTracker hash上报
 * @domTracker 携带Tracker-key 点击事件上报
 * @sdkVersionsdk版本
 * @extra透传字段
 * @jsError js 和 promise 报错异常上报
 */
interface DefaultOption {
    uuid: string | undefined;
    requestUrl: string | undefined;
    historyTracker: boolean;
    hashTracker: boolean;
    domTracker: boolean;
    sdkVersion: string | number;
    extra: Record<string, any> | undefined;
    jsError: boolean;
}
interface Option extends Partial<DefaultOption> {
    requestUrl: string;
}
declare type reportTrackerData = {
    [key: string]: any;
    event: string;
    targetKey: string;
};

declare class tracker {
    data: Option;
    constructor(options: Option);
    private initDefaultOption;
    sendTracker(data: reportTrackerData): void;
    private captureEvents;
    private installTracker;
    private reportJSErrorTracker;
    private reportDomTracker;
    private reportTracker;
    setuuid<T extends DefaultOption["uuid"]>(uuid: T): void;
    setExtra<T extends DefaultOption["extra"]>(extra: T): void;
}

export { tracker };
