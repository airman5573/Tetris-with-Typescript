import Block from './Components/Block';
import Matrix from './Components/Matrix';
import Next from './Components/Next';
import Point from './Components/Point';
import Logo from './Components/Logo';
import StartLines from './Components/StartLines';
import Speed from './Components/Speed';
import Sound from './Components/Sound';
import Pause from './Components/Pause';
import Clock from './Components/Clock';
import StateManager from './stateManager';
import KeyEventListener from './Events/KeyEventListener';
import KeyEventProcessor from './Events/KeyEventProcessor';

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
  export interface BlockOption {
    type: BlockType;
    shape: Shape,
    rotateIndex: number;
    timestamp: number;
    yx: YX;
  }
  export type Store = {
    states: {
      currentBlock: Block | null,
      nextBlock: Block | null,
      matrix: MatrixState,
      blockStack: Array<BlockType>,
      speedStep: number,
      lock: boolean,
      pause: boolean,
      reset: boolean,
      startLines: number,
      point: number
    },
    components: {
      $matrix: Matrix,
      $next: Next,
      $point: Point,
      $logo: Logo,
      $startLines: StartLines,
      $speed: Speed,
      $sound: Sound,
      $pause: Pause,
      $clock: Clock
    },
    stateManager: StateManager,
    keyEventProcessor: KeyEventProcessor
  }
  export interface KeyControl {
    keyDown: (type: KeyType) => void,
    keyUp: (type: KeyType) => void
  }
  export type KeyCallback = {
    begin?: number,
    interval?: number,
    keyType: KeyType,
    callback?: (callback: ()=>void) => void,
    once?: boolean
  }
  export interface KeyTimer {
    [keyType: string]: NodeJS.Timeout,
  }
  export type KeyType = 'arrowUp' | 'arrowRight' | 'arrowDown' | 'arrowLeft' | 'space' | 'p' | 'r';
  export type BlockColor = 0 | 1 | 2;
}

declare global {
  interface Window {
    tetris: Tetris.Store
  }
}
