import {getNextBlock, deepCopy, getClearLines, isOver, getStartMatrix} from './utils';
import {blankMatrix, blockColors, LAST_ROUND, POINT} from './const';
import KeyEventListener from './Events/KeyEventListener';
import { Tetris } from './types';
import Block from './Components/Block';


class StateManager {
  begin = () => {
    (new KeyEventListener()).listen(); // 이제 spacebar를 누르면 게임이 시작된다.
    this.init();
  }
  init = (callback?: () => void) => {
    this.lock();
    const {states, components: {$matrix, $next, $point, $logo, $startLines, $speed}} = window.tetris;
    clearTimeout($matrix.timer); // 더이상 autodown이 일어나지 않도록
    $matrix.render(deepCopy(blankMatrix)); // 빈화면으로 초기화

    // nextBlock도 초기화
    states.currentBlock = null;
    states.nextBlock = getNextBlock();
    $next.reset(); // next를 지우고

    // Point도 초기화
    const lastPoint = Number(localStorage.getItem('last-point'));
    if (lastPoint > 0) {
      $point.changeTitle(LAST_ROUND);
      $point.render(lastPoint); // 그리기만 하고 point에 실제로 숫자값을 넣지는 말자(당연)
    }

    // 로고등장
    // $logo.show();
    // $logo.animate();
    // $startLines.render(states.startLines);
    // $speed.render(states.speed);
    this.unlock();
    if (callback) {callback()}
  }
  run = () => {
    const {states, components: {$matrix, $next, $point, $logo}} = window.tetris;
    $logo.hide();
    // $point.reset(POINT); // 포인트 리셋해야지
    setTimeout(() => {
      const gs = window.tetris.states;
      states.matrix = getStartMatrix(gs.startLines);
      gs.currentBlock = gs.nextBlock; // init에서 nextBlock에 담아놨다!
      gs.nextBlock = getNextBlock(); // deep copy를 안했는데 이게 문제가 될까?
      // $next.render(gs.nextBlock);
      $matrix.render(); // startLine 먼저 그리자
      setTimeout(() => {
        $matrix.render($matrix.mergeBlock(gs.matrix, gs.currentBlock));
        setTimeout(() => {
          $matrix.autoDown();
        }, 500);
      }, 500);
    }, 300);
  }
  end = () => {
    this.lock();
    const {states: {point}, keyEventProcessor, components: {$matrix}} = window.tetris;
    keyEventProcessor.clearEventAll(); // 이전에 막 화살표를 누른게 있을수도 있으니까 지워준다.
    localStorage.setItem('last-point', `${point}`);
    $matrix.reset(() => {
      setTimeout(() => {
        this.init(this.unlock);
      }, 500);
    });
  }
  nextAround = (matrix: Tetris.MatrixState, stop?: () => void) => {
    this.lock(); // 잠그고 작업하자
    const {states, components: {$matrix, $next, $point, $logo}} = window.tetris;
    // 혹시 모르니까 타이머를 꺼주자.
    clearTimeout($matrix.timer);

    $matrix.render(matrix);

    const lines = getClearLines();
    if (lines.length > 0) {
      $matrix.clearLines(lines, (point:number) => {
        $point.updatePoint(point); // clear한다음에 점수도 주자
      });
      return
    }
    if (isOver()) {
      this.end();
      return
    }
    setTimeout(() => {
      states.currentBlock = states.nextBlock;
      states.nextBlock = getNextBlock(); // deep copy를 안했는데 이게 문제가 될까?
      $next.render(states.nextBlock);
      $matrix.render($matrix.mergeBlock(states.matrix, states.currentBlock, blockColors.BLACK));
      $matrix.autoDown();
    }, 100);
  }
  updateCurrentBlock = (currentBlock: Block) => {
    window.tetris.states.currentBlock = currentBlock;
  }
  lock = () => { window.tetris.states.lock = true; }
  unlock = () => { window.tetris.states.lock = false; }
}

export default StateManager;