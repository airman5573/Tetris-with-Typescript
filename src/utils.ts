import Block from './Components/block';
import { blockTypes, yxStartPosition, blockShapes, width, height, blankLine } from './const';
import { Tetris } from './types';

/* 화면 크기가 바뀔때마다 게임판의 크기도 조정한다 */
const resize = () => {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  const ratio = h/w;
  let css: any = {}
  let filling = 0
  /** 세로가 가로보다 더 짧으면 세로길이를 기준으로 scale을 정하고*/
  if (ratio < 1.5) {
    // 세로가 height랑 같은 상황에서 w가 1.5비율보다 더 길어진거면 상관이 없는데,
    // 이런 상황에서 세로길이가 height보다 더 크다면, 세로길이를 h/height만큼 스케일을 늘려줘야하고
    // 2:3 비율을 유지해 줘야하니까 width도 h/height만큼 늘려줘야한다.
    let scale = h/height;
    css = { transform: `scale(${scale})` }
  }
  /** 가로가 세로보다 짧으면 가로를 기준으로 scale을 정한다 */
  else {
    let scale = w/width;
    filling = (h - (height*scale)) / scale / 3;
    css = {
      transform: `scale(${scale})`,
      paddingTop: Math.floor(filling),
      paddingBottom: Math.floor(filling),
      marginTop: Math.floor(-480 - (filling*(3/2)))
    }
  }
  return [filling, css]
}
const getStartMatrix = (startLines: number) => {
  const getLine = (min: number, max: number) => {
    const blackBlockCount: number = Math.floor(((max - min) + 1) * Math.random()) + min;
    const line = [];
    for (let i = 0; i < blackBlockCount; i++) {
      line.push(1); // 1은 검은색 블럭을 의미한다. 즉, count만큼 검은 블럭을 넣겠다는 의미.
    }
    const emptyBlockCount = 10 - blackBlockCount;
    for (let i = 0; i < emptyBlockCount; i++) {
      const index = Math.floor((line.length + 1) * Math.random()); // 이러면 1이 좀 뭉쳐있긴 하겠네
      line.splice(index, 0, 0);
    }
    return line;
  }
  const startMatrix = []
  for (let i = 0; i < startLines; i++) {
    if (i <= 2) { // 0-2
      startMatrix.push(getLine(5, 8));
    } else if (i <= 6) { // 3-6
      startMatrix.push(getLine(4, 9));
    } else { // 7-9
      startMatrix.push(getLine(3, 9));
    }
  }
  for (let i = 0, len = 20 - startLines; i < len; i++) {
    startMatrix.unshift([...blankLine]);
  }
  return startMatrix;
}
const getClearLines = (): number[] => {
  const gs = window.tetris.states;
  const clearLines: number[] = [];
  gs.matrix.forEach((line, i) => {
    if (line.every(n => !!n)) { clearLines.push(i); }
  });
  return clearLines;
}
const isOver = (): boolean => {
  const gs = window.tetris.states;
  return gs.matrix[0].some((blockState)=> { return !!blockState })
}
const deepCopy = (matrix: Tetris.MatrixState): Tetris.MatrixState => {
  const newMatrix: Tetris.MatrixState = [];
  matrix.forEach((line: Tetris.Line) => { newMatrix.push([...line]); });
  return newMatrix;
}
const getNextBlock = (): Block => {
  const typeArr = Object.keys(blockTypes);
  const randomIndex = Math.floor(Math.random() * typeArr.length);
  const randomType = typeArr[randomIndex] as Tetris.BlockType;
  return new Block({
    type: randomType,
    shape: blockShapes[randomType],
    rotateIndex: 0,
    timeStamp: Date.now(),
    yx: yxStartPosition[randomType]
  });
}
const tryMove = (matrix: Tetris.MatrixState, nextBlock: Block): boolean => {
  const yx = nextBlock.yx;
  const shape = nextBlock.shape;
  const width = shape[0].length;
  return shape.every((line, i) => (
    line.every((blockState, j) => {
      if (yx[1] < 0) { return false; } // left
      if (yx[1] + width > 10) { return false; } // right
      if (yx[0] + i < 0) { return true; } // top 위로 넘어가는건 ㄱㅊ아
      if (yx[0] + i >= 20) { return false; } // bottom
      if (blockState === 1) {
        const y = yx[0] + i;
        const x = yx[1] + j;
        if (matrix[y][x] == 1) { return false; }
      }
      return true;
    })
  ));
}
const getDecoBlock = () => {
  const doc = document.createElement;
  let [$b, $clear, $empty, $gap] = [doc("b"), doc("div.clear"), doc("empty"), doc("gap")];
  const rotate = (shape: Array<number[]>) => {
    let verticalRotatedShape: Array<number[]> = [];
    shape.forEach((line, row) => {
      line.forEach((blockState, col) => {
        const rowIndex = line.length - col - 1;
        if (verticalRotatedShape[rowIndex] == undefined) {
          verticalRotatedShape[rowIndex] = [];
        }
        verticalRotatedShape[rowIndex].push(blockState);
      });
    });
    return verticalRotatedShape;
  }

  const $blocks = [];
  for (let shape of Object.values(blockShapes)) {
    shape = rotate(shape); // 기본이 가로로 누워있기 때문에 세로로 한번 돌려준다
    const $block = [$gap];
    shape.forEach((line: number[]) => {
      line.forEach((blockState: number) => {
        $block.push(blockState == 1 ? $b : $empty);
      });
      $block.push($clear);
    });
    $blocks.push($block);
  }
  return $blocks;
}

export {getStartMatrix, getClearLines, isOver, deepCopy, getNextBlock, tryMove, resize, getDecoBlock}