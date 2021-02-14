import {keyCodeWithType, keyCodes} from '../const';
import ArrowUp from './keys/arrowUp';
import ArrowRight from './keys/arrowRight';
import ArrowDown from './keys/arrowDown';
import ArrowLeft from './keys/arrowLeft';
import Space from './keys/space';
import P from './keys/p';
import R from './keys/r';
import { Tetris } from '../types';
import { isLock } from '../utils';

class KeyEventListener {
  arrowUp: ArrowUp;
  arrowRight: ArrowRight;
  arrowDown: ArrowDown;
  arrowLeft: ArrowLeft;
  space: Space;
  p: P;
  r: R;
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
    this.p = new P();
    this.r = new R();
    KeyEventListener.instance = this;
  }
  listen = () => {
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keyup", this.keyUp);
  }
  keyDown = (e:KeyboardEvent) => {
    if (isLock(e)) { return }
    // metaKey는 윈도우 혹은 cmd를 의미한다
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    this[type].keyDown();
  }
  keyUp = (e: KeyboardEvent) => {
    if (isLock(e)) { return }
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    this[type].keyUp();
  }
}


export default KeyEventListener