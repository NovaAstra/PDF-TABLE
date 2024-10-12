import { isBrowser } from "./is"

export type Resolve<T> = (value: T | PromiseLike<T>) => void;
export type Reject = (reason?: any) => void;

export const defaultTimestep = (1 / 60) * 1000

export const getCurrentTime =
  typeof performance !== "undefined"
    ? () => performance.now()
    : () => Date.now()

export const onNextFrame = isBrowser
  ? (callback: FrameRequestCallback) =>
    window.requestAnimationFrame(callback)
  : (callback: FrameRequestCallback) =>
    setTimeout(() => callback(getCurrentTime()), defaultTimestep)

export class DeferredPromise<T = any> {
  public resolve!: Resolve<T>;
  public reject!: Reject;

  public promise: Promise<T>;

  public constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export const nextFrameExecute = async (task: any) => {
  const deferred = new DeferredPromise<void>();

  onNextFrame(() => {
    onNextFrame(() => {
      Promise.resolve(task()).then(deferred.resolve, deferred.reject);
    });
  });

  return deferred.promise;
};
