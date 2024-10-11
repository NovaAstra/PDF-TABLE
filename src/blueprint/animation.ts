export const defaultTimestep = (1 / 60) * 1000

export const getCurrentTime =
  typeof performance !== "undefined"
    ? () => performance.now()
    : () => Date.now()

export const onNextFrame =
  typeof window !== "undefined"
    ? (callback: FrameRequestCallback) =>
      window.requestAnimationFrame(callback)
    : (callback: FrameRequestCallback) =>
      setTimeout(() => callback(getCurrentTime()), defaultTimestep)