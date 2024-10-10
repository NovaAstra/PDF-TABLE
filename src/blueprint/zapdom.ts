export interface ZapdomOptions {
    concurrency: number;
}


export const ZAPDOM_DEFAULT_OPTIONS = {
    concurrency: 3,
} as const

export class ZapStore {
    public set() { }

    public get() { }

    public remove() { }

    public clean() { }
}


export class Zapdom {
    protected store: ZapStore = new ZapStore()

    protected options: ZapdomOptions

    protected tasks = []

    public constructor(options?: Partial<ZapdomOptions>) {
        this.options = Object.assign({}, ZAPDOM_DEFAULT_OPTIONS, options)
    }

    public start() { }
}

export function zapdom() {

}