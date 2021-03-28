import {
  getRandomNextBlock, deepcopy, getClearLines,
  isOver, getStartMatrix, getOverlappedMatrixWithCurrentBlock, mergeBlock,
} from './utils';
import {
  blankMatrix, LAST_ROUND, POINT, speeds,
} from './const';
import Block from './Components/Block';

class StateManager {
  /**
   * 게임을 시작할때 호출한다
   *
   * callback함수를 인자값으로 받는 이유는 reset을 잘 처리하기 위해서이다.
   * reset하는 과정속에 init이 있는데, 어쨋든 init은 reset의 한 과정일 뿐이니까 init에 callback을 넣어서
   * reset을 마무리 해야한다. 그렇지 않으면 init하는 도중에 (플레이어가 의도적으로) reset을 할수 있게된다.
   */
  init = (callback?: () => void) => {
    /**
     * 작업 시작하기 전에 화면을 잠궈준다
     */
    this.lock();

    const {
      states, components: {
        $matrix, $point, $logo, $startLines, $speed, $clock,
      },
    } = window.tetris;

    $matrix.render(deepcopy(blankMatrix));

    this.updateNextBlock(getRandomNextBlock());

    const lastPoint = Number(localStorage.getItem('last-point'));
    if (lastPoint > 0) {
      $point.changeTitle(LAST_ROUND);
      $point.render(lastPoint); // 그리기만 하고 point에 실제로 숫자값을 넣지는 말자(당연)
    }

    $logo.show();
    $logo.animate();

    $startLines.render(states.startLines);

    $speed.render(speeds[states.speedStep - 1]);

    $clock.work(1);

    this.unlock();

    if (callback) { callback(); }
  }

  /**
   * space를 누르면 게임을 시작한다(run호출)
   */
  run = () => {
    /**
     * 바로 게임을 시작하지 않고 600ms(300+300)후에 autoDown을 호출하면서 시작할것이기 때문에
     * 준비가 되기 전까지 lock을 걸어놓자
     */
    this.lock();
    const { components: { $matrix, $point, $logo } } = window.tetris;

    /**
     * 로고를 이제 안보이게 해야지
     */
    $logo.hide();

    /**
     * 포인트도 새로 입력받을 준비 해야지, 과거는 잊자구
     */
    $point.reset(POINT);

    /**
     * 300ms후에 실행하는 이유는, 약간의 텀을 줘야 게임 같잖아
     * 다음 진도로 넘어갈때마다 약간씩 뚝뚝 끊기는 맛이 좋다
     */
    setTimeout(() => {
      /**
       * 게임 시작전에 입력받은 startLines를 먼저 그려주는데
       * 단순히 그리는게 아니라, tetris.states.matrix에 넣어준다
       * fixed된 block들이니까 states에 넣어주는게 맞다
       */
      const { states } = window.tetris;
      states.matrix = getStartMatrix(states.startLines);
      $matrix.render(states.matrix);

      /**
       * matrix를 그리고 나서 바로 툭하고 블럭이 내려오면 좀 급한느낌이 들기때문에 텀을둔다.
       */
      setTimeout(() => {
        /**
         * init에서 설정해놨던 nextBlock을 currentBlock으로 옮긴다
         */
        this.nextBlockToCurrentBlock();

        /**
         * nextBlock에는 새로운 block을 넣는다
         * 이때 들어가는 block은 6개중에서 랜덤이 아니라 아직 안쓴 블럭중에서 랜덤으로 뽑는다
         * 한텀에 6개를 다 써야하는게 테트리스의 규칙이기 때문이다
         */
        this.updateNextBlock(getRandomNextBlock());

        /**
         * states.matrix에 현재 블럭을 넣어서 화면에 그린다.
         * 이때 mergeBlock이라는것은 matrix에 currentBlock을 넣는게 아니라,
         * matrix를 복사해서 새로운 matrix를 만들고, 거기에 currentBlock을 넣은다음에
         * 그 새로운 matrix를 return하는것이기 떄문에, global matrix인 states.matrix에는 영향을 주지 않는다
         */
        $matrix.render(mergeBlock(states.matrix, states.currentBlock));

        /**
         * 이제 화면에 그렸으니까 한칸씩 뚝뚝 떨어지게 만든다.
         * 300은 초기 딜레이인데, 화면에 currentBlock을 그리자 마자 바로 뚝 떨어지면 좀 이상하니까
         * 약간의 delay를 주는거다
         */
        $matrix.autoDown(300);

        /**
         * 지금부터는 key event를 받아야 하니까 lock을 풀어준다
         */
        this.unlock();
      }, 300);
    }, 300);
  }

  /**
   * 블럭이 화면 위쪽으로 벗어나서 게임이 끝나야 할때 호출된다
   *
   * @param callback
   * end이후에 init으로 다시 게임을 준비해야할 필요가 있기때문에 callback을 넣어준다
   */
  end = (callback?: () => void) => {
    /**
     * 여기도 간섭이 발생하면 안되니까 lock을 걸어놓는다
     */
    this.lock();
    const { states: { point }, keyEventProcessor, components: { $matrix } } = window.tetris;

    /**
     * 이전에 키를 막 눌러놓은게 있을 수 있으니까 모든 loop를 제거해준다
     */
    keyEventProcessor.clearEventAll();

    localStorage.setItem('last-point', `${point}`);
    $matrix.reset(() => {
      /**
       * reset animation까지 끝났으니까 lock을 풀어준다
       */
      this.unlock();
      callback();
    });
  }

  pause = () => {
    this.lock();
    const { states, components: { $matrix, $pause } } = window.tetris;
    states.pause = true;
    clearTimeout($matrix.timer);
    $pause.blink(1);
  }

  unpause = () => {
    this.unlock();
    const { states, components: { $matrix, $pause } } = window.tetris;
    states.pause = false;
    $matrix.autoDown();
    $pause.off();
  }

  /**
   * 모든 설정을 reset하는거야
   */
  reset = () => {
    const {
      states, components: {
        $matrix, $pause, $logo, $point, $clock, $startLines, $next,
      },
    } = window.tetris;

    /**
     * reset을 여러번 연속으로 빠르게 누를 수 있잖아(이러면 에러남)
     * 그래서 reset을 하고 있는 중인지 검사하는거야
     */
    if (states.reset === true) return;
    states.reset = true;

    /**
     * reset하는동안 암것도 못하게 잠궈놓자
     */
    this.lock();

    /**
     * currentBlock을 먼저 비운다
     */
    states.currentBlock = null;

    /**
     * autoDown을 멈춘다
     */
    clearTimeout($matrix.timer);

    /**
     * 일시정지도 해제해야 일시정지하고 -> reset눌렀을때 일시정지 그 깜빡이는 아이콘이 안보이게된다
     */
    states.pause = false;
    $pause.off();

    $logo.hide();

    states.point = 0;
    localStorage.setItem('last-point', '0');
    $point.reset(POINT);

    /**
     * 시계도 리셋해야 그 숫자 사이에 있는 깜빡이는 :(콜론) 이것도 꺼진다
     * 물론 다시 init할때 켜진다. 지금 안끄면 timer가 중복되기 때문에 지금 꺼주는거다
     */
    $clock.reset();

    $startLines.reset();

    $next.reset();

    $matrix.reset(() => {
      /**
       * reset animation하고 나서 잠깐 텀을 두고 다시 시작한다
       */
      setTimeout(() => {
        this.init(() => {
          states.reset = false;
          this.unlock();
        });
      }, 300);
    });
  }

  lock = () => { window.tetris.states.lock = true; }

  unlock = () => { window.tetris.states.lock = false; }

  /**
   * 블럭이 땅에 닿았을때 하늘에서 새로운 블럭이 내려오도록 하는 역할을한다
   * (1)audoDown으로 내려오다가 닿거나, (2)키보드를 아래로 내려서 닿거나, (3)space를 눌러서 drop시켜가지고
   * 블럭이 땅에 닿는다. 이 3가지 경우에 nextAround가 호출된다
   *
   * @param stopDownTrigger
   * 아래키를 누르면 loop가 하나 돈다. 땅에 닿았을때는 이 loop을 제거해 줘야
   * 다음 위에서 내려오는 block에 영향을 주지 않는다
   * 예를들어서, 아래키를 누르고 -> loop가 돌고 -> 블럭이 내려온다 -> 바닥에 부딪힌다 -> nextAround가 호출된다
   * -> lock이 걸린다 -> 아래키를 땐다(하지만 lock이 걸려있기 때문에 loop는 안사라진다) -> loop가 다음 블럭에도 영향을 끼친다
   */
  nextAround = async (stopDownTrigger?: () => void) => {
    this.lock();
    const { states, components: { $matrix, $point } } = window.tetris;

    /**
     * 깔끔하게 새출발한다는 느낌으로, 이전의 timer는 전부 삭제해준다
     */
    // clearTimeout($matrix.timer);
    // keyEventProcessor.clearEventAll();

    /**
     * 현재 땅에 닿은 블럭이랑 states.matrix랑 합쳐서 새로운 matrix를 만든다.
     */
    let matrix = mergeBlock(states.matrix, states.currentBlock);

    if (stopDownTrigger !== undefined) stopDownTrigger();

    /**
     * 블럭이 땅에 닿고, 지워야할 블럭이 있다면 지워준다
     * 몇줄 완성한 경우겠지
     */
    const clearLines = getClearLines(matrix);
    if (clearLines.length > 0) {
      /**
       * 꽉 채운 줄수만큼 포인트를 지급한다
       */
      $point.updatePoint(clearLines.length * 50);

      /**
       * line을 지운 matrix를 만든다
       */
      matrix = await $matrix.clearLines(matrix, clearLines);

      /**
       * 화면에 그려준다. 아직 states.matrix를 업데이트 하지는 않는다
       */
      $matrix.render(matrix);
    } else {
      /**
       * 꽉채운 라인이 없으면 그냥 바닥에 닿으면 되는데, 이때 빨간색으로 잠깐 깜빡거리는 이펙트를 주기 위해서
       * matrix랑 currentBlock이랑 겹쳐지는 부분의 (matrix안의) 숫자값을 1이 아닌 2로 만든다. 그러면 render함수 에서 blockState가 2인 경우에는
       * 빨간 블럭을 그리기 때문이다.
       * matrix랑 currentBlock이랑 겹쳐지는 이유는 위에서 merge했기 때문이다
       * 그러면 'merge한다음에 겹쳐지는 부분에 2를 넣지 말고, 그냥 처음부터 matrix에 currentBlock부분을 그냥 2로 하면 되는거 아닌가?' 라고
       * 생각할 수 있다. 하지만, (1)꽉채운 라인을 제거해야 할때 matrix에 currentBlock을 어차피 넣어야 하고,
       * (2) 위에서 matrix에 currentBlock을 넣을때 1대신 2을 넣으면 이따가 또 그부분만 다시 2 -> 1로 바꿔줘야 하기 때문에
       * 코드가 불필요하게 길어진다. 그래서 그냥 1을 박아놓고, 겹쳐지는 부분에 2를 넣는게 더 깔끔하다. 물론 getOverlappedMatrixWithCurrentBlock
       * 의 반대가 되는 함수를 만들면 되긴 하겠지만,,,지금 이 방식이 좀 더 깔끔하다고 느껴진다
       */
      $matrix.render(getOverlappedMatrixWithCurrentBlock(matrix));
    }

    /**
     * 이제 matrix를 업데이트하는데
     * 1. clearLine이 있다면 라인을 지운 matrix가 될것이고
     * 2. 없다면, 그냥 nextAround를 호출하기 전에 currentBlock을 matrix에 고정시킨 그 matrix가 될것이다.
     */
    states.matrix = matrix;

    /**
     * 게임이 끝났는지 체크하는 부분을 clearLines를 체크하는 부분보다 뒤에 넣은 이유는
     * 딱 게임이 끝나는줄 알았지만! 딱 블럭이 딱 맞아가지고 딱 라인이 지워지면서 화면 위로 안높아질 수 있기 때문이다.
     */
    if (isOver()) {
      /**
       * 만약에 게임이 끝났다면, end를 통해 matrix를 촤라락 촤라락 애니메이션 주고
       * 그 작업이 끝나면 init으로 새로 게임을 시작해준다
       */
      this.end(this.init);

      /**
       * 게임이 끝났으니까 return시켜서 nextAround 코드 진행을 막는다
       * 여기서 안막으면 autoDown이 실행되버림
       */
      return;
    }

    /**
     * clearLine을 하던지 블럭을 깜빡이던지 하고 나서 잠깐 텀을 두고
     * 새로운 블럭을 소환한다
     */
    setTimeout(() => {
      /**
       * nextBlock을 currentBlock에 넣는다
       */
      this.nextBlockToCurrentBlock();

      /**
       * 그리고 nextBlock에는 새로운 랜덤한 block을 넣는다.
       */
      this.updateNextBlock(getRandomNextBlock());

      /**
       * 새로 업데이트된 currentBlock을 화면에 그려준다
       */
      $matrix.moveBlock(states.matrix, states.currentBlock);

      /**
       * startDelay를 따로 지정해 주지 않고, 그냥 게임 speed에 맞게 블럭이 내려온다
       * 어쨋든 currentBlock을 화면에 그리고 나서 약간의 시간이 지나고 block이 내려온다는게 중요하다.
       */
      $matrix.autoDown();

      /**
       * lock을 풀어주고, 이벤트를 받을 수 있게 한다.
       */
      this.unlock();
    }, 120);
  }

  /**
   * currentBlock을 입력받은 block으로 지정한다
   *
   * @param block
   *
   * @param timestamp
   * 좌우로 블럭을 이동할때 살짝 delay를 준다. 그러니까 아래로 가만히 내려갈때는 매 speed초마다 뚝뚝 내려가는데
   * 좌우로 움직일때는 그 블럭의 생성 시점을 바탕으로 약간의 딜레이를 준다. 이때 그 블럭의 생성시점을 기록해놔야 하기 때문에
   * timestamp를 쓰는것이고, 새로운 블럭을 currentBlock으로 대체하는데 이게 아래로 내려가는게 아니라 좌우로 움직이는거라면
   * 이전 블럭의 timestamp를 넘겨줘야한다. 안그러면 자칫하다가는 좌우로 키보드를 계속 눌러서 빠르게 왔다리갔다리 하면
   * 블럭이 영원히 안내려오게 만들수도 있기 때문이다. 이거는 사실 좌우로 움직일때 어떻게 timestamp를 활용해서 delay를 주는지
   * 봐야 이해가 가는 부분이니, 그 부분을 살펴보도록 한다
   */
  updateCurrentBlock = (block: Block, timestamp?: number) => {
    if (timestamp !== undefined) { block.timestamp = timestamp; }
    window.tetris.states.currentBlock = block;
  }

  /**
   * 넘겨받은 block을 nextBlock으로 지정한다
   * @param block
   */
  updateNextBlock = (block: Block) => {
    const { $next } = window.tetris.components;
    window.tetris.states.nextBlock = block;
    $next.render(block);
  }

  /**
   * states.nextBlock을 currentBlock으로 지정한다
   * 여기서 주의해야할점은 timestamp를 새로 업데이트 해줘야 한다는것이다
   * 그렇지 않으면 아~~까전에 만든 nextBlock의 timestamp가 너무 예전걸로 되어있기 떄문에
   * delay를 주는 로직에 의해서 키보드를 좌우로 움직였을때 nextBlock이 안떨어지는 문제가 발생활수도있다
   */
  nextBlockToCurrentBlock = () => {
    const { states } = window.tetris;
    const { nextBlock } = states;
    nextBlock.timestamp = Date.now();
    states.currentBlock = nextBlock;
  }
}

export default StateManager;
