import Block from './Components/Block';
import Matrix from './Components/Matrix';
import StateManager from './stateManager';

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
    timeStamp: number;
    yx: YX;
  }
  export type Store = {
    states: {
      currentBlock: Block | null,
      nextBlock: Block | null,
      matrix: MatrixState,
      speed: number,
      lock: boolean,
      startLines: number,
      point: number
    },
    components: {
      matrix: Matrix,
    },
    stateManager: StateManager,
  }
  export interface KeyControl {}
  export type KeyCallback = {}
  export interface KeyTimer {}
  export type KeyType = 'arrowUp' | 'arrowRight' | 'arrowDown' | 'arrowLeft' | 'space' | 'p' | 'r';
}

declare global {
  interface Window {
    tetris: Tetris.Store
  }
}