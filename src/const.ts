import { Tetris } from "./types";

const width: number = 640;
const height: number = 960; 
const blockShapes: Tetris.BlockShapes = {
  I: [
    [1, 1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
};
enum blockTypes { I = 'I', L = 'L', J = 'J', Z = 'Z', S = 'S', O = 'O', T = 'T' }
const yxRotateOrigin: Tetris.YXRotateOrigin = {
  I: [
    [-1, 1],
    [1, -1]
  ],
  L: [
    [0, 0]
  ],
  J: [
    [0, 0]
  ],
  Z: [
    [0, 0]
  ],
  S: [
    [0, 0]
  ],
  O: [
    [0, 0]
  ],
  T: [
    [0, 0],
    [1, 0],
    [-1, 1],
    [0, -1]
  ],
};
const yxStartPosition: {[key: string]: Tetris.YX} = {
  I: [0, 3],
  L: [-1, 4],
  J: [-1, 4],
  Z: [-1, 4],
  S: [-1, 4],
  O: [-1, 4],
  T: [-1, 4],
}
const speeds: number[] = [800, 650, 500, 370, 250, 160];
const delays: number[] = [60, 50, 40, 40, 40, 30];
const fullLine: Tetris.FillLine = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const blankLine: Tetris.Line = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const blankMatrix: Tetris.MatrixState = (() => {
  const matrix: Tetris.MatrixState = [];
  for (let i = 0; i < 20; i++) { matrix.push([...blankLine]); }
  return matrix;
})();
const clearPoints: number[] = [100, 300, 700, 1500];
const LocalStorageKey: string = 'TETRIS_WITH_TYPESCRIPT';
const maxPoint: number = 999999;
const eachLines: number = 20;
const keyCodeWithType: {[key: number]: Tetris.KeyType;} = {
  37: 'arrowLeft', 38: 'arrowUp', 39: 'arrowRight', 40: 'arrowDown',
  32: 'space', 80: 'p', 82: 'r'
}
const keyCodes = Object.keys(keyCodeWithType).map(e => parseInt(e, 10));
const LAST_ROUND = 'Last Round';
const POINT = 'Point';
const blockColors = { GRAY: 0, BLACK: 1, RED: 2 }

export {
  width, height, LAST_ROUND, POINT,
  blockShapes, yxRotateOrigin, blockTypes, speeds, yxStartPosition,
  delays, fullLine, blankLine, blankMatrix, clearPoints,
  LocalStorageKey, maxPoint, eachLines, keyCodeWithType, keyCodes,
  blockColors
}