import { getMaxLines, getMaxHeight, getElemHeight } from "./dom"

export const ELLIPSIS_DEFAULT_OPTIONS = {
    clamp: 'auto',
    splitOnChars: [".", "-", "–", "—", " "],
    truncationHTML: '...'
} as const

export class EllipsisResponse {
    public constructor(
        public readonly isCuted: boolean = false,
        public readonly fullHTML: string = '',
        public readonly cutedHTML: string = '',
    ) { }
}

export class EllipsisOptions {
    public clamp: string | number | 'auto' = 'auto'
    public splitOnChars: string[] = [".", "-", "–", "—", " "]
    public truncationHTML?: string

    private get regex(): RegExp {
        const specialChars = /[.*+?^${}()|[\]\\]/g;
        const escapedChars = this.splitOnChars.map(s => s.replace(specialChars, '\\$&')).join('|');
        return new RegExp(`(${escapedChars})`, 'g')
    }

    public constructor(
        public options?: Partial<EllipsisOptions>
    ) {
        this.clamp = options?.clamp || 'auto'
        this.splitOnChars = options?.splitOnChars || [".", "-", "–", "—", " "]
        this.truncationHTML = options?.truncationHTML
    }

    public getSplitText(text: string) {
        return text.split(this.regex)
    }
}

const getClampValue = (element: HTMLElement, clamp: string | number | 'auto'): number => {
    if (typeof clamp === 'number') return clamp

    const isCSSValue = clamp.indexOf && clamp.indexOf("px") > -1

    if (isCSSValue) return getMaxLines(element, parseInt(clamp, 10))

    return getMaxLines(element)
}

export function splitTextNode(
    node: HTMLElement,
    element: HTMLElement,
    height: number,
    options: EllipsisOptions
) {
    if (!node.textContent) return false

    let textContent = node.textContent

    const segments = options.getSplitText(textContent)

    let low = 0;
    let high = segments.length;

    while (low < high) {
        const middle = Math.floor((low + high) / 2);

        node.textContent = segments.slice(0, middle).join('')
        if (getElemHeight(element) <= height) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }

    node.textContent = segments.slice(0, low).join('');
    return splitTextChar(node, element, height, options)
}

export function splitTextChar(
    node: HTMLElement,
    element: HTMLElement,
    height: number,
    options: EllipsisOptions
) {
    let textContent = node.textContent!

    let low = 0;
    let high = textContent.length;

    while (low < high) {
        let middle = Math.floor((low + high) / 2);

        node.textContent = textContent.substring(0, middle);

        if (getElemHeight(element) <= height) {
            low = middle + 1;
        } else {
            high = middle
        }
    }

    node.textContent = textContent.substring(0, low - 1);

    return getElemHeight(element) <= height;
}


export function splitHtmlElement(
    node: HTMLElement,
    element: HTMLElement,
    height: number,
    options: EllipsisOptions
) {
    const childNodes = node.childNodes as unknown as HTMLElement[]

    let idx = childNodes.length - 1

    const split = (childNode: HTMLElement) => {
        switch (childNode.nodeType) {
            case 1:
                return splitHtmlElement(childNode, element, height, options)
            case 3:
                return splitTextNode(childNode, element, height, options)
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
export function ellipsis(element: HTMLElement, options?: Partial<EllipsisOptions>) {
    const opts: EllipsisOptions = new EllipsisOptions(options)

    if (!element.hasChildNodes()) return new EllipsisResponse(false)

    const fullHTML = element.innerHTML

    let clampValue = getClampValue(element, opts.clamp)

    const height = getMaxHeight(element, clampValue)

    if (getElemHeight(element) <= height) return new EllipsisResponse(false, fullHTML)

    splitHtmlElement(element, element, height, opts)
}