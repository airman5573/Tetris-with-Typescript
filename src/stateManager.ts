import {getRandomNextBlock, deepcopy, getClearLines, isOver, getStartMatrix, getOverlappedMatrixWithCurrentBlock, mergeBlock} from './utils';
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
    $matrix.render(deepcopy(blankMatrix)); // 빈화면으로 초기화

    // nextBlock도 초기화
    states.currentBlock = null;
    states.nextBlock = getRandomNextBlock();
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
      const states = window.tetris.states;
      states.matrix = getStartMatrix(states.startLines);
      states.currentBlock = states.nextBlock; // init에서 nextBlock에 담아놨다!
      states.nextBlock = getRandomNextBlock(); // deep copy를 안했는데 이게 문제가 될까?
      // $next.render(states.nextBlock);
      $matrix.render(); // startLine 먼저 그리자
      setTimeout(() => {
        $matrix.render(mergeBlock(states.matrix, states.currentBlock));
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
  // 여기서 matrix는 nextAround로 가기 전의 현재 matrix를 의미하는거야
  nextAround = async (matrix: Tetris.MatrixState, stop?: () => void) => {
    this.lock(); // 잠그고 작업하자
    const {states, components: {$matrix, $next, $point, $logo}, keyEventProcessor} = window.tetris;
    
    // lock걸었는데 그때 아래키를 때는 이벤트(up)을 인식 못할수도 있잖아.
    // 그래서 새로운 블록이 내려오기 전에 걸려있는 key event를 삭제하는거야
    keyEventProcessor.clearEventAll();

    // autoDown을 멈춰야 하는 경우도 있지.
    // 키보드 아래 방향키 계속 누르고 있으면 autoDown이랑 중복되서 툭툭툭 슝~ 툭툭 슝~ 하고 내려간다.
    if (typeof stop === 'function') stop();

    const clearLines = getClearLines(matrix);
    if (clearLines.length > 0) {
      $point.updatePoint(clearLines.length*50);
      matrix = await $matrix.clearLines(matrix, clearLines);
      $matrix.render(matrix);
    } else {
      // states.matrix에 getOverlappedMatrixWithCurrentBlock(matrix)로 받은 새로운 matrix를 넣지 않는다.
      $matrix.render(getOverlappedMatrixWithCurrentBlock(matrix));
    }
    
    states.matrix = matrix; // matrix를 업데이트 해줘야지!

    // 게임이 끝났는지 체크
    if (isOver()) {
      this.end();
      return
    }

    setTimeout(() => {
      this.updateCurrentBlock(states.nextBlock);
      this.updateNextBlock(getRandomNextBlock());
      $matrix.moveBlock(states.matrix, states.currentBlock); // 새로 업데이트된 currentBlock을 화면에 그려준다
      $matrix.autoDown(150); // init delay를 준다. 왜냐면 위에서 방금 moveBlock으로 한칸 내렸으니까!
      this.unlock();
    }, 100);
  }
  updateCurrentBlock = (block: Block) => {
    window.tetris.states.currentBlock = block;
  }
  updateNextBlock = (block: Block) => {
    const {$next} = window.tetris.components;
    window.tetris.states.nextBlock = block;
    $next.render(block);
  }
  lock = () => { window.tetris.states.lock = true; }
  unlock = () => { window.tetris.states.lock = false; }
}

export default StateManager;