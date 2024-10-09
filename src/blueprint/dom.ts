export const getElemHeight = (element: HTMLElement): number =>
    Math.max(element.scrollHeight, element.clientHeight)