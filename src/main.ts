import './style/main.scss';
import { blockTypes, blankMatrix, speeds } from './const';
import Matrix from './components/Matrix';
import { resize, getDecoBlocks } from './utils';
import StateManager from './stateManager';
import Logo from './components/Logo';
import Point from './components/sidebar/Point';
import Next from './components/sidebar/Next';
import StartLines from './components/sidebar/StartLines';
import Speed from './components/sidebar/Speed';
import KeyEventProcessor from './event/processor';
import KeyEventListener from './event/listener';
import { Tetris } from './types';
import Sound from './components/sidebar/Sound';
import Pause from './components/sidebar/Pause';
import Clock from './components/sidebar/Clock';

// resize
resize();
window.addEventListener('resize', resize);

// decorations
const $decoration = document.querySelector('.decoration');
const $decoBlocks = getDecoBlocks();
const $decoLeft = document.createElement('div');
$decoLeft.classList.add('left');
$decoBlocks.forEach(($block: Node[]) => {
  $block.forEach((el) => {
    // $decoLeft.appendChild(el);
    $decoLeft.append(el);
  });
});
const $decoRight = $decoLeft.cloneNode(true) as HTMLElement;
$decoRight.classList.remove('left');
$decoRight.classList.add('right');
$decoRight.style.setProperty('transform', 'rotateY(180deg)');
$decoration.appendChild($decoLeft);
$decoration.appendChild($decoRight);

// tetris initialization
window.tetris = {
  states: {
    currentBlock: null, // 시작은 null로 둬야한다. 그래야, space를 눌렀을때 게임을 시작하는건지 block을 drop하는건지 알수있기 때문
    nextBlock: null,
    matrix: blankMatrix,
    blockStack: Object.keys(blockTypes) as Array<Tetris.BlockType>,
    speedStep: Math.floor(speeds.length / 2) - 1,
    lock: false,
    pause: false,
    reset: false,
    startLines: 0,
    point: 0,
  },
  components: {
    $matrix: new Matrix(),
    $logo: new Logo(),
    $point: new Point(),
    $next: new Next(),
    $startLines: new StartLines(),
    $speed: new Speed(),
    $sound: new Sound(),
    $pause: new Pause(),
    $clock: new Clock(),
    $buttons: {
      arrowUp: document.querySelector('div.button-container[data-keytype="arrowUp"]'),
      arrowRight: document.querySelector('div.button-container[data-keytype="arrowRight"]'),
      arrowDown: document.querySelector('div.button-container[data-keytype="arrowDown"]'),
      arrowLeft: document.querySelector('div.button-container[data-keytype="arrowLeft"]'),
      space: document.querySelector('div.button-container[data-keytype="space"]'),
      p: document.querySelector('div.button-container[data-keytype="p"]'),
      r: document.querySelector('div.button-container[data-keytype="r"]'),
      s: document.querySelector('div.button-container[data-keytype="s"]'),
    },
  },
  stateManager: new StateManager(),
  keyEventProcessor: new KeyEventProcessor(),
};

(new KeyEventListener()).listen(); // 이제 spacebar를 누르면 게임이 시작된다.

window.tetris.stateManager.ready();
