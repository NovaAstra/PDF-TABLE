import { getMaxLines, getMaxHeight, getElemHeight, getElemRect } from "./dom"
import { fission } from "./fission"

const TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX: RegExp = /[ .,;!?'‘’“”\-–—]+$/

const SPLIT_ON_CHARS_REGEX: RegExp = /([.\-–— ])/

export class EllipsisResponse {
    public constructor(
        public readonly isCuted: boolean = false,
        public readonly fullHTML: string = '',
        public readonly cutedHTML: string = '',
        public readonly remainingHTML: string = '',
    ) { }
}

export function ellipsis(element: HTMLElement, clamp: string | "auto" = 'auto'): EllipsisResponse {
    if (!element.childNodes.length) return new EllipsisResponse(false)

    const rect = getElemRect(element)

    const rootElement = element.cloneNode(true) as HTMLElement
    rootElement.style.cssText +=
        `position:absolute;left:-9999px;z-index:-99;width:${rect.width}px;overflow:hidden;overflow-wrap:break-word;word-wrap:break-word;`
    element.parentNode?.appendChild(rootElement)

    const fullHTML = rootElement.innerHTML
    const isCSSValue = clamp.indexOf && (clamp.indexOf("px") > -1 || clamp.indexOf("em") > -1)

    if (clamp === 'auto') {
        clamp = getMaxLines(rootElement).toString()
    } else if (isCSSValue) {
        clamp = getMaxLines(rootElement, parseInt(clamp, 10)).toString()
    }

    const height = getMaxHeight(rootElement, Number(clamp))


    if (getElemHeight(rootElement) <= height)
        return new EllipsisResponse(false, fullHTML)

    const isCuted = splitHtmlElement(rootElement, rootElement, height)

    const cutedHTML = rootElement.innerHTML
    const remainingHTML = fission(fullHTML, rootElement.innerText.length - 3)

    element.parentNode?.removeChild(rootElement)

    return new EllipsisResponse(isCuted, fullHTML, cutedHTML, remainingHTML)
}

export function splitHtmlElement(
    element: HTMLElement,
    rootElement: HTMLElement,
    maximumHeight: number,
    truncationChar: string = '...'
) {
    const childNodes = element.childNodes as unknown as HTMLElement[]

    let i = childNodes.length - 1
    while (i > -1) {
        const childNode = childNodes[i--]

        const isTruncated =
            (childNode.nodeType === 1 && splitHtmlElement(childNode, rootElement, maximumHeight, truncationChar)) ||
            (childNode.nodeType === 3 && splitTextNode(childNode, rootElement, maximumHeight, truncationChar));

        if (isTruncated) return true

        element.removeChild(childNode)
    }

    return false
}

export function splitTextNode(
    textNode: Node,
    rootElement: HTMLElement,
    maximumHeight: number,
    truncationChar: string = '...'
) {

    let textContent = textNode.textContent
    if (!textContent) return false

    const segments = textContent.split(SPLIT_ON_CHARS_REGEX)


    let low = 0;
    let high = segments.length;

    while (low < high) {
        const middle = Math.floor((low + high) / 2);

        const truncatedText = segments.slice(0, middle).join('');
        textNode.textContent = truncatedText;

        if (getElemHeight(rootElement) <= maximumHeight) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }

    textNode.textContent = segments.slice(0, low).join('');

    return splitTextCharacter(
        textNode,
        rootElement,
        maximumHeight,
        truncationChar
    )
}

export function splitTextCharacter(
    textNode: Node,
    rootElement: HTMLElement,
    maximumHeight: number,
    truncationChar: string = '...'
) {
    let textContent = textNode.textContent!;

    let low = 0;
    let high = textContent.length;

    while (low < high) {
        let middle = Math.floor((low + high) / 2);

        let truncatedContent = textContent.substring(0, middle).replace(TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '');
        textNode.textContent = truncatedContent + truncationChar;

        if (getElemHeight(rootElement) <= maximumHeight) {
            low = middle + 1;
        } else {
            high = middle
        }
    }

    textNode.textContent = textContent.substring(0, low - 1).replace(TRAILING_WHITESPACE_AND_PUNCTUATION_REGEX, '') + truncationChar;

    return getElemHeight(rootElement) <= maximumHeight;
}
