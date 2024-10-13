import { getMaxLines, getMaxHeight, getElemHeight } from "./dom"

const TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX: RegExp = /[ .,;!?'‘’“”\-–—]+$/

export const ELLIPSIS_DEFAULT_OPTIONS = {
    clamp: 'auto',
    splitOnChars: [".", "-", "–", "—", " "],
    truncationText: '...'
} as const

export class EllipsisResponse {
    public constructor(
        public readonly isCuted: boolean = false,
        public readonly fullHTML: string = '',
        public readonly cutedHTML: string = '',
        public readonly remainHTML: string = '',
    ) { }
}

export class EllipsisOptions {
    public clamp: string | number | 'auto' = 'auto'
    public splitOnChars: string[] | RegExp = [".", "-", "–", "—", " "]
    public truncationText: string = '...'
    public truncationHTML?: (index: number, segments: string[], node: HTMLElement, element: HTMLElement) => string | HTMLElement

    private get regex(): RegExp {
        if (this.splitOnChars instanceof RegExp) return this.splitOnChars

        const specialChars = /[.*+?^${}()|[\]\\]/g;
        const escapedChars = this.splitOnChars.map(s => s.replace(specialChars, '\\$&')).join('|');
        return new RegExp(`(${escapedChars})`, 'g')
    }

    public constructor(
        public element: HTMLElement,
        public options?: Partial<EllipsisOptions>
    ) {
        Object.assign(this, ELLIPSIS_DEFAULT_OPTIONS, options);
    }

    public getSplitText(text: string): string[] {
        return text.split(this.regex)
    }

    public getTruncationHTML(
        index: number,
        segments: string[],
        node: HTMLElement,
        element: HTMLElement
    ): HTMLElement {
        const span = document.createElement('span')

        let innerHTML: string = ''
        if (this.truncationText) {
            innerHTML += this.truncationText
        }

        if (this.truncationHTML) {
            const dom = this.truncationHTML(index, segments, node, element)

            if (typeof dom === 'string') innerHTML += dom
            else innerHTML += dom.outerHTML
        }

        span.innerHTML = innerHTML

        return span
    }
}

const getClampValue = (element: HTMLElement, clamp: string | number | 'auto'): number => {
    if (typeof clamp === 'number') return clamp

    const isCSSValue = clamp.indexOf && clamp.indexOf("px") > -1

    if (isCSSValue) return getMaxLines(element, parseInt(clamp, 10))

    return getMaxLines(element)
}

export function splitTextNode(
    textNode: HTMLElement,
    element: HTMLElement,
    height: number,
    deep: number = 0,
    options: EllipsisOptions,
    shallowNode: HTMLElement
) {
    if (!textNode.textContent) return false

    let textContent = textNode.textContent

    const segments = options.getSplitText(textContent)

    let low = 0;
    let high = segments.length;
    let truncationNode: HTMLElement = options.getTruncationHTML(low, segments, textNode, element)

    while (low < high) {
        const middle = Math.floor((low + high) / 2);

        truncationNode = options.getTruncationHTML(low, segments, textNode, element)
        element.appendChild(truncationNode)

        textNode.textContent = segments.slice(0, middle).join('')

        if (getElemHeight(element) <= height) {
            low = middle + 1;
        } else {
            high = middle;
        }

        element.removeChild(truncationNode)
    }

    textNode.textContent = segments.slice(0, Math.max(low, 1)).join('');

    return splitTextChar(textNode, element, height, deep, options, shallowNode, truncationNode!)
}

export function splitTextChar(
    textNode: HTMLElement,
    element: HTMLElement,
    height: number,
    _deep: number = 0,
    _options: EllipsisOptions,
    shallowNode: HTMLElement,
    truncationNode: HTMLElement
) {

    let textContent = textNode.textContent!

    let low = 0;
    let high = textContent.length;

    while (low < high) {
        let middle = Math.floor((low + high) / 2);

        element.appendChild(truncationNode)
        textNode.textContent = textContent.substring(0, middle).replace(TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '');

        if (getElemHeight(element) <= height) {
            low = middle + 1;
        } else {
            high = middle
        }

        element.removeChild(truncationNode)
    }

    textNode.textContent = textContent.substring(0, low - 1).replace(TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '');

    const truncated = getElemHeight(element) <= height;

    if (truncated) {
        shallowNode.textContent = textContent.substring(low - 1)
        element.appendChild(truncationNode)
    }

    return truncated
}


export function splitHtmlElement(
    node: HTMLElement,
    element: HTMLElement,
    height: number,
    deep: number = 0,
    options: EllipsisOptions,
    shallowNode: HTMLElement
) {
    const childNodes = node.childNodes as unknown as HTMLElement[]

    let idx = childNodes.length - 1

    const split = (childNode: HTMLElement) => {
        const cloneNode = childNode.cloneNode(false) as HTMLElement
        const firstChild = shallowNode.firstChild
        shallowNode.insertBefore(cloneNode, firstChild);

        switch (childNode.nodeType) {
            case 1:
                return splitHtmlElement(childNode, element, height, deep + 1, options, cloneNode)
            case 3:
                return splitTextNode(childNode, element, height, deep, options, cloneNode)
            default:
                return false
        }
    }

    while (idx > -1) {
        const childNode = childNodes[idx--]

        const truncated = split(childNode)

        if (truncated) return true

        node.removeChild(childNode)
    }

    return false
}

/**
 * @name ellipsis
 * @function
 * 
 * Truncates the text content of an HTML element with ellipsis (`...`) if it exceeds a certain length.
 * 
 * This function accepts an HTML element and an optional configuration object to control the ellipsis behavior.
 * If no configuration is provided, default options will be used.
 *
 * @param {HTMLElement} element - The HTML element whose content will be truncated.
 * @param {Partial<EllipsisOptions>} [options] - Optional configuration for truncation.
 *    - `clamp` {string | number} [default: 'auto'] - Defines how the text is truncated:
 *       * `'auto'`: Automatically detects when to truncate based on the element's height.
 *       * `number`: Specifies the maximum number of lines allowed before truncation.
 *       * `string`: A pixel value (e.g., `'100px'`) defining the maximum height for the text before truncation.
 *    - `splitOnChars` {string[]} [default: [".", "-", "–", "—", " "]] - An array of characters to split on for truncation.
 *    - `truncationHTML` {string} [optional] - Optional HTML content to insert after the truncated text, replacing the default ellipsis.
 *
 * @returns {void} This function does not return a value.
 */
export function ellipsis(element: HTMLElement, options?: Partial<EllipsisOptions>): EllipsisResponse {
    const opts: EllipsisOptions = new EllipsisOptions(element, options)

    if (!element.hasChildNodes()) return new EllipsisResponse(false)

    const fullHTML = element.innerHTML

    let clampValue = getClampValue(element, opts.clamp)

    const height = getMaxHeight(element, clampValue)

    if (getElemHeight(element) <= height) return new EllipsisResponse(false, fullHTML)

    const shallowNode = element.cloneNode(false) as HTMLElement

    const isCuted = splitHtmlElement(element, element, height, 0, opts, shallowNode)
    const cutedHTML = element.innerHTML
    const remainHTML = shallowNode.innerHTML

    return new EllipsisResponse(isCuted, fullHTML, cutedHTML, remainHTML)
}