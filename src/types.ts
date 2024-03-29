import PQueue from 'p-queue';

export namespace Tetris {
  export type BlockType = 'I' | 'L' | 'J' | 'Z' | 'S' | 'O' | 'T'
  export type Shape = Array<Array<number>>
  export type Dyx = Array<Array<number>>
  export type BlockShapes = { [key in BlockType]: Shape }
  export type YXRotateOrigin = { [key in BlockType]: Dyx }
  export type FillLine = number[]
  export type Line = number[]
  export type MatrixState = Line[]
  export type YX = [number, number]
  export type GRAY = 0;
  export type BLACK = 1;
  export type RED = 2;
  export type BlockColor = GRAY | BLACK | RED;
  export type KeyType = 'arrowUp' | 'arrowRight' | 'arrowDown' | 'arrowLeft' | 'space' | 'p' | 'r' | 's';
  export type KeyEventTimer = { [kt in KeyType]?: NodeJS.Timeout }
  export type KeyEventCallback = {
    begin?: number,
    interval?: number,
    keyType: KeyType,
    once?: boolean,
    callback?(stopDownTrigger?: () => void): void
  }
  export type MusicControl = 'start' | 'killStart' | 'clear' | 'fall' | 'gameover' | 'rotate' | 'move';
  export type Sounds = 'start' | 'clear' | 'fall' | 'gameover' | 'rotate' | 'move';
  export interface IBlockOption {
    type: BlockType;
    shape: Shape,
    rotateIndex: number;
    timestamp: number;
    yx: YX;
  }
  export interface IBlock extends IBlockOption {
    updateColor(matrix: MatrixState, $matrix: IMatrix, color: number): void
    rotate(): IBlock
    fall(n?: number): IBlock
    right(): IBlock
    left(): IBlock
  }

  export interface IMatrix {
    matrixNode: HTMLDivElement
    timer: NodeJS.Timeout
    queue: PQueue
    width: number
    animateColor: BlockColor
    init(): void
    autoDown(startDelay?: number): void
    moveBlock(matrix: MatrixState, block: IBlock): void
    clearLines(matrix: MatrixState, lines: number[]): Promise<MatrixState>
    blinkLines(matrix: MatrixState, lines: number[]): Promise<void>
    changeLineColor(matrix: MatrixState, lines: number[], color: BlockColor, sec: number): Promise<void>
    setLine(matrix: MatrixState, lines: number[], color: BlockColor): MatrixState
    reset(): Promise<void>
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
    queue: PQueue
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
    on(): void
    off(): void
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
    keyType: KeyType
    down(): void
    up(): void
  }

  export interface IKeyEventListener {
    buttonContainers: NodeListOf<HTMLDivElement>
    listen(): void
    keyDown(e: KeyboardEvent): void
    keyUp(e: KeyboardEvent): void
  }

  export interface IKeyEventProcessor {
    timers: KeyEventTimer,
    activeKey: KeyType | null,
    clearEvent(keyType: KeyType): void,
    clearEventAll(): void,
    down(e: KeyEventCallback): void,
    up(e: KeyEventCallback): void
  }

  export interface IStateManager {
    ready(): Promise<void>,
    start(): void,
    end(): Promise<void>,
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

  export interface IMusic {
    url: string
    source: AudioBufferSourceNode | undefined
    soundRanges: { [key in Sounds]: Array<number> }
    isOn(): boolean
    start(): void
    clear(): void
    fall(): void
    gameover(): void
    rotate(): void
    move(): void
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
    sound: boolean,
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
    $clock: Tetris.IClock,
    $buttons: {[k in Tetris.KeyType]: HTMLDivElement}
  },
  music: Tetris.IMusic,
  stateManager: Tetris.IStateManager,
  keyEventProcessor: Tetris.IKeyEventProcessor
}

declare global {
  interface Window {
    tetris: Tetris;
  }
}
