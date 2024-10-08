import { extractTag, extractTagName, isEndTag, isVoidTag } from "./dom"

export function fission(html: string, start: number) {
    const length = html.length
    if (start >= html.length) return ''

    let i = 0;
    let charCount = 0;
    const tagStack: string[] = [];

    while (i < length && charCount < start) {
        const char = html.charAt(i);
        const charCode = html.charCodeAt(i);

        if (char === '<') {
            const tag = extractTag(html, i);
            i += tag.length;

            if (!isEndTag(tag)) {
                const tagName = extractTagName(tag);
                if (!isVoidTag(tagName)) {
                    tagStack.push(tagName);
                }
            } else {
                tagStack.pop();
            }
        } else {
            if (charCode >= 0xD800 && charCode <= 0xDBFF && i + 1 < length) {
                ++i;
            }

            ++charCount;
            ++i;
        }
    }

    let result = html.slice(i);

    for (let j = tagStack.length - 1; j >= 0; --j) {
        result = `<${tagStack[j]}>` + result;
    }

    return result;
}