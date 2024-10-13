export const getElemHeight = (element: HTMLElement): number =>
    Math.max(element.scrollHeight, element.clientHeight) - 4

export const computeStyle = (element: HTMLElement, prop: string): string =>
    window.getComputedStyle(element).getPropertyValue(prop)

export const getLineHeight = (element: HTMLElement): number => {
    let lh: any = computeStyle(element, "line-height")

    if (lh === "normal") {
        lh = parseFloat(parseFloat(computeStyle(element, "font-size")).toFixed(0)) * 1.1
    }

    return parseFloat(parseFloat(lh).toFixed(0))
}

export const getMaxLines = (element: HTMLElement, height?: number): number => {
    const availHeight = height || element.clientHeight
    const lineHeight = getLineHeight(element)

    return Math.max(Math.floor(availHeight / lineHeight), 0)
}

export const getMaxHeight = (element: HTMLElement, clamp: number): number =>
    Math.max(getLineHeight(element) * clamp, parseFloat(computeStyle(element, "height")))