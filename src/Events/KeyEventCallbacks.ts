import { tryMove } from '../utils';
import { Tetris } from '../types';

const tetris = window.tetris;
const [gs, components, stateManager] = [tetris.states, tetris.components, tetris.stateManager];
const [$matrix, $speed, $startLines] = [components.$matrix, components.$speed, components.$startLines];

const blockControl = {
  rotate: () => { // 위키를 누르면 블럭이 회전한다
    if (gs.lock === true) {return}
    if (gs.currentBlock == null) {return}
    const nextBlock = gs.currentBlock.rotate();
    if (tryMove(gs.matrix, nextBlock)) {
      const nextMatrix = $matrix.addBlock(gs.matrix, nextBlock);
      $matrix.render(nextMatrix);
      gs.currentBlock = nextBlock;
    }
  },
  down: () => {
    if (gs.currentBlock == null) { return }
    const nextBlock = gs.currentBlock.fall();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    if (tryMove(gs.matrix, nextBlock)) {
      const nextMatrix = $matrix.addBlock(gs.matrix, nextBlock);
      $matrix.render(nextMatrix);
      gs.currentBlock = nextBlock;
    }
  },
  right: () => {
    if (gs.lock === true) {return}
    if (gs.currentBlock == null) {return}
    const nextBlock = gs.currentBlock.right();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    if (tryMove(gs.matrix, nextBlock)) {
      const nextMatrix = $matrix.addBlock(gs.matrix, nextBlock);
      $matrix.render(nextMatrix);
      gs.currentBlock = nextBlock;
    }
  },
  left: () => {
    if (gs.lock === true) {return}
    if (gs.currentBlock == null) {return}
    const nextBlock = gs.currentBlock.left();
    // 갈수있으면 가고, 못가면 어쩔 수 없고
    if (tryMove(gs.matrix, nextBlock)) {
      const nextMatrix = $matrix.addBlock(gs.matrix, nextBlock);
      $matrix.render(nextMatrix);
      gs.currentBlock = nextBlock;
    }
  },
  drop: () => {
    if (gs.lock === true) {return}
    if (gs.currentBlock == null) {return}
    let bottom = gs.currentBlock;
    for(var n = 1; n < 20; n++) {
      bottom = gs.currentBlock.fall(n);
      if (tryMove(gs.matrix, bottom) == false) {
        bottom = gs.currentBlock.fall(n-1);
        break
      }
    }
    gs.currentBlock = bottom;
    gs.matrix = $matrix.addBlock(gs.matrix, gs.currentBlock);
    $matrix.render(gs.matrix);
    stateManager.nextAround();
  }
};

const speedControl = {
  up: () => { $speed.updateSpeed(-100); },
  down: () => { $speed.updateSpeed(100); }
};

const startLineControl = {
  up: () => { $startLines.updateStartLines(-1); },
  down: () => { $startLines.updateStartLines(1); }
};

const gameControl = {
  start: () => { stateManager.start(); }
}

export {blockControl, speedControl, startLineControl, gameControl}