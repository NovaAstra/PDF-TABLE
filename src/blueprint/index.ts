export interface BasePosition {
    width: number;
    height: number;
}

export interface CellPosition extends BasePosition {
    rowIndex: number;
    colIndex: number;
}

export interface RowPosition extends BasePosition {
    rowIndex: number;
}

export interface HeaderPosition extends BasePosition { }

export interface FooterPosition extends BasePosition { }

export interface WidgetPosition extends BasePosition {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface LayoutPosition extends BasePosition { }

export function blueprint() {
    
}