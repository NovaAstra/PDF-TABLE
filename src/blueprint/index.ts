import { getElemRect } from "./dom"

export enum ComponentEnum {
    COMMON = 'common',
    TABLE = 'table',
    LIST = 'list',
    GRID = 'grid'
}

export interface Position {
    element: Element,
    rect: DOMRect;
    top?: number;
    left?: number;
    width: number;
    height: number;
}

export interface ComponentPosition extends Position {
    component: ComponentEnum
    viewport: Position;
}

export interface GridPosition extends ComponentPosition {
    rows: Position[];
    header: Position;
    tbody: Position;
    footer: Position;
}

export type Paper = (GridPosition | ComponentPosition)[]

export type Papers = Paper[]


export const getPosition = <E extends Element | null = Element>(
    element: E,
    offset: [number, number] = [0, 0]
): E extends null ? false : Position => {
    if (!element) return false as any;

    const rect = getElemRect(element)

    const [top, left] = offset

    return {
        element,
        rect,
        top: rect.top - top,
        left: rect.left - left,
        width: rect.width,
        height: rect.height,
    } as any
}


export const getTables = (component: Position, viewport: Position) => {
    const theader = getPosition(component.element.querySelector('.el-table__header-wrapper'))
    const tfooter = getPosition(component.element.querySelector('.el-table__footer-wrapper'))
    const ttbody = getPosition(component.element.querySelector('.el-table__body-wrapper')!)

    const tbody = ttbody.element.querySelector('.el-table__body-wrapper .el-table__body tbody')!
    const nodes = tbody.querySelectorAll('.el-table__row')

    return {
        header: theader,
        tbody: ttbody,
        footer: tfooter
    }
}

export const getComponentPosition = (element: Element, offset: [number, number] = [0, 0], viewport: Position): ComponentPosition => {
    const position = getPosition(element, offset) as ComponentPosition
    const component = getComponent(element)

    if (component === 'grid') {

    }

    if (component === 'table') {

    }

    if (component === 'list') {

    }


    position.component = component
    position.viewport = viewport
    return position
}



export const getComponent = (parent: Element | Document = document): ComponentEnum => {
    const gadget = parent.querySelector('.gridnew_gadget_tempalte')

    if (!gadget) return ComponentEnum.COMMON

    const style = (gadget as HTMLElement).dataset.style;

    switch (style) {
        case 'Table':
            return ComponentEnum.TABLE
        case 'List':
            return ComponentEnum.LIST
        default:
            return ComponentEnum.GRID
    }
}

export const getWidgets = (parent: Element | Document = document, viewport: Position, offset: [number, number] = [0, 0]): ComponentPosition[] => {
    const elements = parent.querySelectorAll('.vue-grid-layout .vue-grid-item')

    let start = 0;
    let end = elements.length - 1;

    let positions: ComponentPosition[] = []

    while (start <= end) {

        positions[start] = getComponentPosition(elements[start], offset, viewport)
        positions[end] = getComponentPosition(elements[end], offset, viewport)

        start++;
        end--;
    }

    return positions
}

export const getViewport = (parent: Element | Document = document): Position => {
    const root = parent.querySelector('.view-item')

    if (!root)
        throw new Error('There is no content to print. Please check the current page of the report.')

    let position: Position = getPosition(root)

    return position
}

export function blueprint() {

}