import { yxRotateOrigin } from '../const';
import { Tetris } from '../types';

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