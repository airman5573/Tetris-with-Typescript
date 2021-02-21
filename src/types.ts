export namespace Tetris {
  export type Shape = Array<Array<number>>
  export type Dyx = Array<Array<number>>
  export type BlockShapes = { I: Shape, L: Shape, J: Shape, Z: Shape, S: Shape, O: Shape, T: Shape }
  export type YXRotateOrigin = { I: Dyx, L: Dyx, J: Dyx, Z: Dyx, S: Dyx, O: Dyx, T: Dyx }
  export type FillLine = number[]
  export type Line = number[]
  export type MatrixState = Line[]
  export type BlockType = 'I' | 'L' | 'J' | 'Z' | 'S' | 'O' | 'T'
  export type YX = [number, number]
  export type GRAY = 0;
  export type BLACK = 1;
  export type RED = 2;
  export type BlockColor = GRAY | BLACK | RED;

  export interface IBlockOption {
    type: BlockType;
    shape: Shape,
    rotateIndex: number;
    timestamp: number;
    yx: YX;
  }
  export interface IBlock extends IBlockOption {
    updateColor(matrix: MatrixState, $matrix: IMatrix, color: number): void
    rotate(): void
    fall(n: number): IBlock
    right(): void
    left(): void
  }

  export interface IMatrix {
    matrixNode: HTMLDivElement
    timer: NodeJS.Timeout
    width: number
    animateColor: BlockColor
    init(): void
    autoDown(startDelay?: number): void
    moveBlock(matrix: MatrixState, block: IBlock): void
    clearLines(matrix: MatrixState, lines: number[]): MatrixState
    animateLines(matrix: MatrixState, lines: number[]): Promise<void>
    changeLineColor(matrix: MatrixState, lines: number[], color: BlockColor, sec: number): Promise<void>
    setLine(matrix: MatrixState, lines: number[], color: BlockColor): MatrixState
    reset(callback?: () => void): void
    render(matrix: MatrixState): void
  }

  export interface IClock {
    node: HTMLDivElement
    ledNumbers: NodeListOf<HTMLSpanElement>
    clockTimer: NodeJS.Timeout
    ledColon: HTMLSpanElement
    reset(): void
    work(colonOnOff: number): void
    render(colonOnOff: number): void
  }

  export interface ILogo {
    logo: HTMLDivElement
    dragon: HTMLDivElement
    timer: NodeJS.Timeout
    basicClassName: string
    show(): void
    hide(): void
    eye(timeout: number): Promise<void>
    run(timeout: number): Promise<void>
    dragonBGmove(className: string, timeout: number): Promise<void>
    animate(): void
  }

  export interface INext {
    blocks: Array<NodeListOf<Element>>
    render(nextBlock: IBlock): void
    reset(): void
  }

  export interface INumbers {
    node: HTMLDivElement
    render(num: number): void
  }

  export interface IPause {
    node: HTMLDivElement
    timer: NodeJS.Timeout
    blink(onoff: number): void
    off(): void
    render(onoff: number): void
  }

  export interface IPoint extends INumbers {
    title: string;
    titleEl: HTMLDivElement;
    changeTitle(title: string): void
    updatePoint(point: number): void
    setPoint(point: number): void
    reset(title: string): void
  }

  export interface ISound {
    node: HTMLDivElement
    render(num: number): void
  }

  export interface ISpeed extends INumbers {
    title: string
    titleEl: HTMLDivElement
    reset(): void
  }

  export interface IStartLines extends INumbers {
    title: string;
    titleEl: HTMLDivElement;
    up(): void
    down(): void
    reset(): void
  }
  export interface IKeyControl {
    type: KeyType
    btnNode: HTMLDivElement
    keyDown(): void
    keyUp(): void
  }
  export interface IArrowUp {}
  export interface IArrowRight {}
  export interface IArrowDown {}
  export interface IArrowLeft {}
  export interface ISpace {}
  export interface IP {}
  export interface IR {}

  export interface IKeyEventListener {
    arrowUp: ArrowUp
    arrowRight: ArrowRight
    arrowDown: ArrowDown
    arrowLeft: ArrowLeft
    space: Space
    p: P
    r: R
    buttonContainers: NodeListOf<HTMLDivElement>
  }
}