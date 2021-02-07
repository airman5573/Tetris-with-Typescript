import { blockColors, yxRotateOrigin } from '../const';
import { Tetris } from '../types';
import { deepCopy, getNextBlock } from '../utils';
import Matrix from './Matrix';

class Block implements Tetris.BlockOption {
  type: Tetris.BlockType;
  shape: Tetris.Shape;
  rotateIndex: number;
  timeStamp: number;
  yx: Tetris.YX;
  constructor(options: Tetris.BlockOption) {
    this.type = options.type;
    this.shape = options.shape;
    this.rotateIndex = options.rotateIndex;
    this.timeStamp = options.timeStamp;
    this.yx = options.yx;
  }
  updateColor = (matrix: Tetris.MatrixState, $matrix: Matrix, color: number) => {
    const [y, x] = this.yx; // sY = startY, sX = startX
    this.shape.forEach((line, i) => {
      line.forEach((blockState, j) => {
        if (blockState == 0) { return }
        if (y+i >= matrix.length || x+j >= matrix[0].length) { return }
        if (y+i < 0 || x+j < 0) { return }
        const el = $matrix.matrixNode.childNodes[y+i].childNodes[x+j] as HTMLElement;
        el.className = (color == blockColors.BLACK ? 'b black' : (color == blockColors.RED ? 'b red' : ''));
      });
    });
  }
  blink = (_matrix: Tetris.MatrixState, $matrix: Matrix, callback: ()=>void) => {
    const matrix = deepCopy(_matrix);
    this.updateColor(matrix, $matrix, blockColors.RED);
    setTimeout(() => {
      this.updateColor(matrix, $matrix, blockColors.BLACK);
      callback();
    }, 50);
  }
  rotate = () => {
    const shape = this.shape;
    let nextShape: Array<number[]> = [];
    shape.forEach((line, row) => {
      line.forEach((blockState, col) => {
        const rowIndex = line.length - col - 1;
        if (nextShape[rowIndex] == undefined) {
          nextShape[rowIndex] = []; // javascript는 이런것도 되네;; 뭐랄까 좋으면서도 불안하구먼
        }
        nextShape[rowIndex].push(blockState);
      });
    });
    const nextYX: [number, number] = [
      this.yx[0] + yxRotateOrigin[this.type][this.rotateIndex][0],
      this.yx[1] + yxRotateOrigin[this.type][this.rotateIndex][1]
    ];
    const nextRotateIndex = this.rotateIndex + 1 >= yxRotateOrigin[this.type].length ? 0 : this.rotateIndex + 1;
    return new Block({
      type: this.type,
      shape: nextShape,
      yx: nextYX,
      rotateIndex: nextRotateIndex,
      timeStamp: Date.now()
    });
  }
  fall = (n = 1): Block => {
    return new Block({
      type: this.type,
      shape: this.shape,
      yx: [this.yx[0] + n, this.yx[1]],
      rotateIndex: this.rotateIndex,
      timeStamp: Date.now()
    });
  }
  right = () => {
    return new Block({
      type: this.type,
      shape: this.shape,
      yx: [this.yx[0], this.yx[1]+1],
      rotateIndex: this.rotateIndex,
      timeStamp: Date.now()
    });
  }
  left = () => {
    return new Block({
      type: this.type,
      shape: this.shape,
      yx: [this.yx[0], this.yx[1]-1],
      rotateIndex: this.rotateIndex,
      timeStamp: Date.now()
    });
  }
}

export default Block;