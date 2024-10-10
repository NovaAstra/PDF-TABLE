import { getMaxLines, getMaxHeight, getElemHeight } from "./dom"

export interface EllipsisOptions {
    clamp: string | number | 'auto';
    splitOnChars: string[];
    truncationChar: string;
    truncationHTML?: string;
}

export const ELLIPSIS_DEFAULT_OPTIONS = {
    clamp: 'auto',
    splitOnChars: [".", "-", "–", "—", " "],
    truncationChar: '...'
} as const

export class EllipsisResponse {
    public constructor(
        public readonly isCuted: boolean = false,
        public readonly fullHTML: string = '',
        public readonly cutedHTML: string = '',
    ) { }
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
) {
    if (!node.textContent) return false

    let textContent = node.textContent

    console.log(textContent)

    const segments = textContent.split(/([.\-–— ])/)

    let low = 0;
    let high = segments.length;

    while (low < high) {
        const middle = Math.floor((low + high) / 2);

        node.textContent = segments.slice(0, middle).join('');
        if (getElemHeight(element) <= height) {
            low = middle + 1;
        } else {
            high = middle;
        }

    }

    node.textContent = segments.slice(0, low - 1).join('');
    return getElemHeight(element) <= height;
}

export function splitHtmlElement(
    node: HTMLElement,
    element: HTMLElement,
    height: number
) {
    const childNodes = node.childNodes as unknown as HTMLElement[]

    let idx = childNodes.length - 1

    const split = (childNode: HTMLElement) => {
        switch (childNode.nodeType) {
            case 1:
                return splitHtmlElement(childNode, element, height)
            case 3:
                return splitTextNode(childNode, element, height)
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
 *    - `truncationChar` {string} [default: '...'] - The character to use when truncating the text.
 *    - `truncationHTML` {string} [optional] - Optional HTML content to insert after the truncated text, replacing the default ellipsis.
 *
 * @returns {void} This function does not return a value.
 */
export function ellipsis(element: HTMLElement, options?: Partial<EllipsisOptions>) {
    const opts: Readonly<EllipsisOptions> = Object.assign({}, ELLIPSIS_DEFAULT_OPTIONS, options)

    if (!element.hasChildNodes()) return new EllipsisResponse(false)

    const fullHTML = element.innerHTML

    let clampValue = getClampValue(element, opts.clamp)

    const height = getMaxHeight(element, clampValue)

    if (getElemHeight(element) <= height) return new EllipsisResponse(false, fullHTML)

    splitHtmlElement(element, element, height)
}