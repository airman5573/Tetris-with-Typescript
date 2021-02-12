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
  nextAround = async (matrix: Tetris.MatrixState, stopDownTrigger?: () => void) => {
    console.log('nextAround');
    this.lock(); // 잠그고 작업하자
    const {states, components: {$matrix, $next, $point, $logo}, keyEventProcessor} = window.tetris;

    // 아래에서 autoDown을 실행하면 내부적으로 clearTimeout을 하지만,
    // 아래 autoDown이 100ms이따가 호출되기 때문에 그전에 그냥 지워주자. 새로운 블록이 생겨서 내려오기 전에 autoDown이 실행될 수 도 있으니까
    // 블럭이 바닥에 닿고 그 다음에 안정적으로 새로운 블럭이 따악 나오려면 autoDown을 이 시점에 지워주는게 낫다.
    clearTimeout($matrix.timer);
    
    // stopDownTrigger가 필요한 이유
    // 아래키를누른다 -> 내려온다 -> 바닥에 부딪힌다 -> 아래키를 땐다 ->
    // lock이 걸려있는 상태니까 땐거를 인식 못한다 -> 다음 블럭도 계속 event loop가 걸려있는 상태라서 계속 내려온다.
    // 그래서 autoDown안에서 nextAround를 할때는 stopDownTrigger가 필요하진 않지만,
    // 아래키를 눌러서 event loop가 도는 경우에는 그 이벤트를 멈춰야한다.
    if (typeof stopDownTrigger === 'function') {
      stopDownTrigger();
    }

    // 블럭이 땅에 닿고, 지워야할 라인이 있다면
    const clearLines = getClearLines(matrix);
    if (clearLines.length > 0) {

      // 포인트를 업데이트하고
      $point.updatePoint(clearLines.length*50);

      // 라인을 지운 matrix를 가져오고
      matrix = await $matrix.clearLines(matrix, clearLines);

      // 화면에 그려준다.
      // 다만 아직 states.matrix는 업데이트 하지 않은 상태이다.
      $matrix.render(matrix);
    } else {
      // states.matrix에 getOverlappedMatrixWithCurrentBlock(matrix)로 받은 새로운 matrix를 넣지 않는다.
      // 왜냐하면 currentBlock과 overlap된 matrix는 0과 1이 아니라 2도 들어가 있기 때문이다. 이거는 그릴때만 필요하고
      // 실제 states.matrix는 0과 1로만 이루어져야한다.
      $matrix.render(getOverlappedMatrixWithCurrentBlock(matrix));
    }
    
    // 이제 matrix를 업데이트하는데
    // 1. clearLine이 있다면 라인을 지운 matrix가 될것이고
    // 2. 없다면, 그냥 nextAround를 호출하기 전에 currentBlock을 matrix에 고정시킨 그 matrix가 될것이다.
    states.matrix = matrix;

    // 게임이 끝났는지 체크하는 부분을 clearLines를 체크하는 부분보다 뒤에 넣은 이유는
    // 딱 게임이 끝나는줄 알았지만! 딱 블럭이 딱 맞아가지고 딱 라인이 지워지면서 화면 위로 안높아질 수 있기 때문이다.
    if (isOver()) {
      this.end();
      return
    }

    setTimeout(() => {
      // 다음 nextBlock을 이제 currentBlock으로 지정한다.
      this.updateCurrentBlock(states.nextBlock);

      // 그리고 nextBlock에는 새로운 랜덤한 block을 넣는다.
      this.updateNextBlock(getRandomNextBlock());

      // 새로 업데이트된 currentBlock을 화면에 그려준다
      $matrix.moveBlock(states.matrix, states.currentBlock);

      $matrix.autoDown();

      // lock을 풀어주고, 이벤트를 받을 수 있게 한다.
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