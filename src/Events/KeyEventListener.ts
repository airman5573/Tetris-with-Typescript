import {keyCodeWithType, keyCodes} from '../const';
import ArrowUp from './keys/arrowUp';
import ArrowRight from './keys/arrowRight';
import ArrowDown from './keys/arrowDown';
import ArrowLeft from './keys/arrowLeft';
import Space from './keys/space';
import { Tetris } from '../types';

class KeyEventListener {
  arrowUp: ArrowUp;
  arrowRight: ArrowRight;
  arrowDown: ArrowDown;
  arrowLeft: ArrowLeft;
  space: Space;
  static instance: KeyEventListener;
  constructor() {
    if (KeyEventListener.instance != null) {
      return KeyEventListener.instance;
    }
    this.arrowUp = new ArrowUp();
    this.arrowRight = new ArrowRight();
    this.arrowDown = new ArrowDown();
    this.arrowLeft = new ArrowLeft();
    this.space = new Space();
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keyup", this.keyUp);
    KeyEventListener.instance = this;
  }
  keyDown = (e:KeyboardEvent) => {
    const gs = window.tetris.states;
    // 잠겨있으면 이벤트를 받지 않는다.
    if (gs.lock === true) { return; }
    // metaKey는 윈도우 혹은 cmd를 의미한다
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    this[type].keyDown();
  }
  keyUp = (e: KeyboardEvent) => {
    const gs = window.tetris.states;
    // 잠겨있으면 이벤트를 받지 않는다.
    if (gs.lock === true) { return; }
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    this[type].keyUp();
  }
}


export default KeyEventListener