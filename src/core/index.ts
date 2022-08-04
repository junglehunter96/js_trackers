import { DefaultOption, Option, TrackerConfig } from "../types/index";
import { createHistoryEvent } from "../utils/pv";
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
  sendTracker<T>(data: T) {
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
          eventName,
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
  }
  private reportTracker<T>(data: T) {
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
