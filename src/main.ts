import './style/main.scss';
import { blankMatrix, blockTypes, speeds } from './const';
import Matrix from './Components/matrix';
import { getRandomNextBlock, resize, getDecoBlocks } from './utils';
import StateManager from './stateManager';
import Logo from './Components/logo'; 
import Point from './Components/point';
import Next from './Components/next';
import StartLines from './Components/startLines';
import Speed from './Components/speed';
import KeyEventProcessor from './Events/KeyEventProcessor';
import { Tetris } from './types';

// resize
resize();
window.addEventListener('resize', resize);

// decorations
const $decoration = document.querySelector(".decoration");
const $decoBlocks = getDecoBlocks();
const $decoLeft = document.createElement("div");
$decoLeft.classList.add("left");
$decoBlocks.forEach(($block: Node[]) => {
  $block.forEach((el) => {
    // $decoLeft.appendChild(el);
    $decoLeft.append(el);
  });
});
const $decoRight = $decoLeft.cloneNode(true) as HTMLElement;
$decoRight.classList.remove("left");
$decoRight.classList.add("right");
$decoRight.style.setProperty("transform", "rotateY(180deg)");
$decoration.appendChild($decoLeft);
$decoration.appendChild($decoRight);


// tetris initialization
window.tetris = {
  states: {
    currentBlock: null, // 시작은 null로 둬야한다. 그래야, space를 눌렀을때 게임을 시작하는건지 block을 drop하는건지 알수있기 때문
    nextBlock: null,
    matrix: blankMatrix,
    blockStack: Object.keys(blockTypes) as Array<Tetris.BlockType>,
    speedStep: Math.floor(speeds.length/2)-1,
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
window.tetris.stateManager.begin();