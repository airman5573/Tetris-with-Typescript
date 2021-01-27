import Block from './Components/block';
import { blockTypes, yxStartPosition, blockShapes, width, height, blankLine } from './const';
import { Tetris } from './types';

/* 화면 크기가 바뀔때마다 게임판의 크기도 조정한다 */
const resize = () => {
  const containerEl: HTMLDivElement = document.querySelector("#page > .container");
  const css = getResizedCss();
  Object.keys(css).forEach((property: string) => {
    containerEl.style.setProperty(property, css[property])  
  });
}

// 이게 난해한 부분이여
// desktop과 mobile둘다 따로 고려해줘야함.
const getResizedCss = () => {
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.clientHeight;
  const ratio = h/w;
  let css: any = {}
  let filling = 0

  // 세로 : 가로 = 3 : 2가 기준인데, 세로 : 가로 = 3 : 4 이런식으로 가로길이가 기준보다 더 커질때
  if (ratio < 1.5) {
    // 높이가 960px보다 더 늘거나 줄어든 만큼, 가로길이도 변화시켜야 하기 때문에
    // scale = h / height로 해준다.
    let scale = h/height;
    css = { transform: `scale(${scale})` }
  }
  // 세로 : 가로 = 3 : 2가 기준인데, 세로 : 가로 = 4 : 2 이런식으로 세로길이가 더 길때
  else {
    // 가로가 늘거나 준만큼, 세로도 변화시켜야 하기 때문에
    // scale = w / width
    let scale = w/width;
    // 하지만! 정말 이대로 scale을 줄여버린다면? 세로가 꽉 안찰꺼야.
    // 난쟁이 똥짜루가 되어있겠지.
    // 그래서 filling이 필요한거야.
    // 우리가 체워야할 빈공간의 높이는 h - (height * scale)이야 맞지? 이만큼의 빈공간을 체워야해.
    // 그런데, 왜 scale로 한번더 나눠줬을까? 왜냐하면!!! 우리가 지금 구하는 filling은 결국 나중에 scale만큼 곱해질 것이기 때문이야.
    // 예를들어서 지금 filling이 10이고 scale이 2라면, 실제 적용되는 filling은 10/2가 되는거야. scale은 가로 세로길이만 줄이는게 아니라,
    // 모든걸 줄이거든. 그래서 filling에 나중에 scale이 곱해질것을 아니까, 미리 scale로 나눠주는거야.
    // 마지막으로, filling은 padding-top, padding-bottom, margin-top 이 세부분에 적용될꺼니까 3등분 해줘야해.
    // 이러한 이유로 아래와 같은 식이 나온거야
    filling = (h - (height*scale)) / scale / 3;
    css = {
      transform: `scale(${scale})`,
      paddingTop: Math.floor(filling),
      paddingBottom: Math.floor(filling),
      // 이놈은 뭘까?
      // margin-top에 음수가 들어가는걸 보니 block이 위로 -480 - (filling*(3/2))만큼 올라가겠네.
      // 왜 위로 저만큼 올리는걸까? 왜 -480은 고정으로 올려주는걸까?
      // 자 설명해볼께
      // 1. 가로 640px, 세로 960px은 정해져 있는거야. 맞지?
      // 2. 화면의 정중앙에 놓을려면, position: absolute, left: 50%, top: 50%, margin-top: -480px, margin-right: -320px 이렇게 줘야해
      // 3. scale은 margin, padding, width, height를 다 적용시키고 나서 맨 마지막에 적용되는 property야
      // 4. 우선은 스케일을 신경쓰지 말고, 세로길이가 960px이니까 margin-top에 -480을 주는게 맞아. 이미 들어가있는데 왜 또 주냐고?
      //    filling을 줘야하니까 marginTop을 업데이트 해야하는데 -480도 당연히 적용시켜줘야지. -480이 막 문신처럼 박혀있는게 아니야.
      // 5. OK 왜 -480을 고정시켰는지 알겠어
      // 6. filling에 3을 곱하고 왜 반으로 나눴을까?
      //    자, 4번과 비슷한 이야기인데, 높이가 960px인 box를 중앙으로 움직이는 과정속에 margin-top: -480을 주는건 이해 했지?
      //    우리가 (h - (height*scale)) / scale 만큼의 빈공간을 체워야 하고, 이거는 filling * 3이잖아 맞지?
      //    그니까, filling을 3곳에 주기 위해서 저거를 3으로 나눈거잖아. 그러니까 어쨋건 filling*3만큼 높이가 늘어나는거잖아.
      //    그래서 그 늘어난 만큼을 위로 올려줘야 중앙에 위치하겠지. 아니아니, 그 늘어난 만큼의 반을 위로 올려줘야 중앙에 위치하겠지.
      marginTop: Math.floor(-(height/2) - ((filling*3)/2))
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