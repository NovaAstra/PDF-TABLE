export const TAGS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'wbr'];

export const getElemHeight = (element: HTMLElement): number =>
    Math.max(element.scrollHeight, element.clientHeight) - 4

export const getElemRect = (element: HTMLElement) => element.getBoundingClientRect()

export const computeStyle = (element: HTMLElement, prop: string): string =>
    window.getComputedStyle(element).getPropertyValue(prop)

export const getLineHeight = (element: HTMLElement): number => {
    let lh: any = computeStyle(element, "line-height")

    if (lh === "normal") {
        lh = parseFloat(parseFloat(computeStyle(element, "font-size")).toFixed(0)) * 1.1
    }
    return parseFloat(parseFloat(lh).toFixed(0))
}

export const getMaxHeight = (element: HTMLElement, clmp: number) => getLineHeight(element) * clmp

export const getMaxLines = (element: HTMLElement, height?: number) => {
    const availHeight = height || element.clientHeight
    const lineHeight = getLineHeight(element)

    return Math.max(Math.floor(availHeight / lineHeight), 0)
}

export const extractTag = (character: string, start: number): string => {
    const endIdx = character.indexOf('>', start);
    return character.slice(start, endIdx + 1);
}

export const isEndTag = (tag: string): boolean => tag[1] === '/'

export const extractTagName = (tag: string): string => {

        let tagNameEndIdx = tag.indexOf('/');

        if (tagNameEndIdx === -1) {
            tagNameEndIdx = tag.length - 1;
        }

    return tag.slice(1, tagNameEndIdx);
}

export const isVoidTag = (tagName: string) => {
    for (let i = TAGS.length - 1; i >= 0; --i) {
        if (tagName === TAGS[i]) {
            return true;
        }
    }

    return false;
}

export const toArray = (nodeList: any): HTMLElement[] => nodeList instanceof NodeList ?
    Array.from(nodeList) : nodeList instanceof Array ? nodeList : []

export const querySelector = (selectors: string, el: Node = document,) =>
    (el as Element).querySelector(selectors) as HTMLElement

export const querySelectorAll = (selectors: string, el: Node = document,) =>
    (el as Element).querySelectorAll(selectors) as unknown as HTMLElement[]