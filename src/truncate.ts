import { toArray, getElemHeight, querySelector, getElemRect, querySelectorAll } from "./dom"
import { ellipsis } from "./ellipsis"

export interface TableAttrs {
    top: number;
    bottom: number;
    height: number;
    rows: HTMLElement[]
}

export interface Viewport {
    width: number;
    height: number;
}

export function truncate() {
    const layout = querySelector(".view-item")
    const layoutRect = getElemRect(layout)

    const createNeatLayout = createLayout(layoutRect)

    const items = toArray(querySelectorAll('.vue-grid-item', layout))

    const papers = []

    while (items.length) {
        const item = items.shift()!;
        const itemRect = getElemRect(item)

        const createNeatTable = createTableWidget(item)

        const table = getTable(item)

        if (table) {
            const bodyHeight = getElemHeight(querySelector('.el-table__body', table))
            const headerHeight = getElemHeight(querySelector('.el-table__header', table))

            if (bodyHeight + headerHeight <= itemRect.height) {

            } else {
                const rows = querySelectorAll('.el-table__body tbody .el-table__row', table)

                const getCells = (row: HTMLElement) => {
                    return querySelectorAll('.el-table__cell', row)
                }

                const setRow = (row: HTMLElement) => {
                    const tbody = querySelector('.el-table__body tbody', table)

                    tbody.appendChild(row)
                }

                const tables = splitRows(rows, getCells, setRow, headerHeight, layoutRect.height, itemRect.top - layoutRect.top)


                for (const t of tables) {
                    const widget = createNeatTable(t.rows)
                    widget.style.top = t.top + 'px'
                    widget.style.height = t.height + 'px'

                    const paper = createNeatLayout(widget)

                    document.body.appendChild(paper)
                }
            }
        }
    }
}

export function getTable(item: HTMLElement) {
    return querySelector('.gridnew_gadget_tempalte', item)
}

export function createLayout(viewport: Viewport) {
    const div = document.createElement('div')
    div.classList.add('view-item')
    div.style.cssText = `width: ${viewport.width}px; height: ${viewport.height}px;`
    const div2 = document.createElement('div')
    div2.classList.add('vue-grid-layout')
    div2.style.cssText = `height: ${viewport.height}px;`
    div.appendChild(div2)

    return (item: HTMLElement) => {
        const clone = div.cloneNode(true) as HTMLElement
        querySelector('.vue-grid-layout', clone).appendChild(item)

        return clone
    }
}

export function createTableWidget(item: HTMLElement) {
    const widget = item.cloneNode(true)
    const tbody = querySelector('.el-table__body tbody', widget)
    querySelector('.el-table', widget).style.height = 'auto'
    querySelector('.el-table__inner-wrapper', widget).style.height = 'auto'
    tbody.innerHTML = ''

    return (rows: HTMLElement[]): HTMLElement => {
        const clone = widget.cloneNode(true) as HTMLElement
        querySelector('.el-table__body tbody', clone).append(...rows)

        return clone
    }
}

export function splitCells<T>(
    nodeList: T,
    offset: number,
    createRow: (html: string) => HTMLElement
) {
    const cells: HTMLElement[] = toArray(nodeList)

    let htmls: string[] = ['', '']

    const getCell = (html: string, cell: HTMLElement) => {
        const clone = cell.cloneNode(true) as HTMLElement
        clone.innerHTML = html
        return clone.outerHTML
    }

    let count = 0
    for (const cell of cells) {
        const { cutedHTML, remainingHTML, fullHTML, isCuted } = ellipsis(cell, offset + 'px')

        if (isCuted) {
            htmls[0] += getCell(cutedHTML, cell)
            htmls[1] += getCell(remainingHTML, cell)
        } else {
            count += 1
            htmls[0] += getCell(fullHTML, cell)
            htmls[1] += getCell('', cell)
        }
    }

    return [createRow(htmls[0]), createRow(htmls[1])]
}

export function splitRows<T extends HTMLElement>(
    nodeList: any,
    getCells: (row: T) => HTMLElement[],
    setRow: (row: HTMLElement) => void,
    size: number = 0,
    viewport: number = 1122.520,
    top: number = 0,
): TableAttrs[] {
    const rows = toArray(nodeList) as T[]

    let tables: TableAttrs[] = [];

    const fill = (table: TableAttrs) => {
        if (rows.length === 0) {
            if (table.rows.length > 0) {
                tables.push(table)
            }
            return
        }

        while (rows.length) {
            const row = rows.shift()!

            const height = getElemHeight(row)

            const offset = viewport - table.height - table.top - 10

            if (height <= offset && offset > 0) {
                table.height += height
                table.rows.push(row)

                if (rows.length === 0) {
                    tables.push(table)
                    return
                }
                continue;
            }

            const cloneRow = row.cloneNode(true) as HTMLElement
            cloneRow.innerHTML = ''

            const createRow = (html: string) => {
                const clone = cloneRow.cloneNode(true) as HTMLElement
                clone.innerHTML = html
                return clone
            }

            const [r1, r2] = splitCells(getCells(row), offset, createRow)


            table.rows.push(r1)
            table.height += offset
            tables.push(table)

            setRow(r2)
            rows.unshift(r2 as T)


            fill({ top: 0, bottom: 0, height: size, rows: [] })
            return
        }
    }

    fill({ top, bottom: 0, height: size, rows: [] })

    return tables
}