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
  export type KeyType = 'arrowUp' | 'arrowRight' | 'arrowDown' | 'arrowLeft' | 'space' | 'p' | 'r';
  export type KeyTimer = { [key in KeyType]?: NodeJS.Timeout }
  export type KeyCallback = {
    begin: number,
    interval: number,
    keyType: KeyType,
    once: boolean,
    callback(stopDownTrigger?: () => void): void
  }
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

  /**
   * https://www.typescriptlang.org/docs/handbook/interfaces.html
   * 위 사이트를 참고해서 만들었다
   */
  export interface KeyControlConstructor {
    new (btnClassName: string): IKeyControl
  }

  export interface IKeyControl {
    type: KeyType
    connectedBtn: HTMLDivElement
    keyDown(): void
    keyUp(): void
  }

  export interface IKeyEventListener {
    arrowUp: IKeyControl
    arrowRight: IKeyControl
    arrowDown: IKeyControl
    arrowLeft: IKeyControl
    space: IKeyControl
    p: IKeyControl
    r: IKeyControl
    buttonContainers: NodeListOf<HTMLDivElement>
    listen(): void
    keyDown(e:KeyboardEvent): void
    keyUp(e: KeyboardEvent): void
  }

  export interface IKeyEventProcessor {
    events: KeyTimer,
    activeKey: KeyType | null,
    clearEvent(keyType: KeyType): void,
    clearEventAll(): void,
    down(e: KeyCallback): void,
    up(e: KeyCallback): void
  }

  export interface IStateManager {
    init(callback?: () => void): void,
    run(): void,
    end(callback?: () => void): void,
    pause(): void,
    unpause(): void,
    reset(): void,
    lock(): void,
    unlock(): void,
    nextAround(stopDownTrigger?: () => void): void,
    updateCurrentBlock(block: IBlock, timestamp?: number): void,
    updateNextBlock(block: IBlock): void,
    nextBlockToCurrentBlock(): void
  }
}

type Tetris = {
  states: {
    currentBlock: Tetris.IBlock | null
    nextBlock: Tetris.IBlock | null,
    matrix: Tetris.MatrixState,
    blockStack: Array<Tetris.BlockType>,
    speedStep: number,
    lock: boolean,
    pause: boolean,
    reset: boolean,
    startLines: number,
    point: number
  },
  components: {
    $matrix: Tetris.IMatrix,
    $logo: Tetris.ILogo,
    $point: Tetris.IPoint,
    $next: Tetris.INext,
    $startLines: Tetris.IStartLines,
    $speed: Tetris.ISpeed,
    $sound: Tetris.ISound,
    $pause: Tetris.IPause,
    $clock: Tetris.IClock
  },
  stateManager: Tetris.IStateManager,
  keyEventProcessor: Tetris.Key()
}

declare global {
  interface Window {
    tetris: Tetris;
  }
}
