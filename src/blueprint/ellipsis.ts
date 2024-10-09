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

export function ellipsis(element: HTMLElement, options?: Partial<EllipsisOptions>) {
    const opts: Readonly<EllipsisOptions> = Object.assign({}, ELLIPSIS_DEFAULT_OPTIONS, options)

    const fullHTML = element.innerHTML

    if (!element.hasChildNodes()) return new EllipsisResponse(false, fullHTML)
}