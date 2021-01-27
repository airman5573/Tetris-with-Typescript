import './style.scss';
import { blankMatrix } from './const';
import Matrix from './Components/matrix';
import { getNextBlock, resize, getDecoBlock } from './utils';
import StateManager from './stateManager';
import Logo from './Components/logo'; 
import Point from './Components/point';
import Next from './Components/next';
import StartLines from './Components/startLines';
import Speed from './Components/speed';
import KeyEventProcessor from './Events/KeyEventProcessor';

// resize
resize();
window.addEventListener('resize', () => {
});

// decorations
const $decoBlocks = getDecoBlock();
const $decoLeft = document.querySelector(".decoration > .left");
$decoBlocks.forEach(($b: HTMLElement[]) => {
  $b.forEach((el) => {
    $decoLeft.appendChild(el);
  });
});

// tetris initialization
window.tetris = {
  states: {
    currentBlock: null, // 시작은 null로 둬야한다. 그래야, space를 눌렀을때 게임을 시작하는건지 block을 drop하는건지 알수있기 때문
    nextBlock: getNextBlock(),
    matrix: blankMatrix,
    speed: 500,
    lock: false,
    startLines: 0,
    point: 0
  },
  components: {
    $matrix: new Matrix(),
    $logo: new Logo(),
    $point: new Point(),
    $next: new Next(),
    $startLines: new StartLines(),
    $speed: new Speed()
  },
  stateManager: new StateManager(),
  keyEventProcessor: new KeyEventProcessor()
}
window.tetris.stateManager.ready();