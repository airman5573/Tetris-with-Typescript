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
import Music from './music';

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
    blockStack: blockTypes as Array<Tetris.BlockType>,
    speedStep: Math.floor(speeds.length / 2) - 1,
    lock: false,
    pause: false,
    sound: false,
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
  music: new Music(),
  stateManager: new StateManager(),
  keyEventProcessor: new KeyEventProcessor(),
};

window.tetris.stateManager.ready().then(() => {
  // key event listen
  (new KeyEventListener()).listen(); // 이제 spacebar를 누르면 게임이 시작된다.

  /**
   * visibility change listen
   * 다른 탭을 누르면 게임이 멈추도록, 사용자가 현재 게임이 돌아가는 탭을 보고있는지 체크한다.
   */
  document.addEventListener('visibilitychange', () => {
    const { stateManager } = window.tetris;
    if (document.hidden) stateManager.pause();
    else stateManager.unpause();
  });
});
