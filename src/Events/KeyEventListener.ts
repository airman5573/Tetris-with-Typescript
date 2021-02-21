
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
  arrowUp: Tetris.IKeyControl;
  arrowRight: Tetris.IKeyControl;
  arrowDown: Tetris.IKeyControl;
  arrowLeft: Tetris.IKeyControl;
  space: Tetris.IKeyControl;
  p: Tetris.IKeyControl;
  r: Tetris.IKeyControl;
  buttonContainers: NodeListOf<HTMLDivElement>;
  constructor() {
    this.arrowUp = new ArrowUp();
    this.arrowRight = new ArrowRight();
    this.arrowDown = new ArrowDown();
    this.arrowLeft = new ArrowLeft();
    this.space = new Space();
    this.p = new P();
    this.r = new R();
    this.buttonContainers = document.querySelectorAll('.button-container');
  }
  listen = () => {
    // keyboard event listener
    document.addEventListener("keydown", this.keyDown);
    document.addEventListener("keyup", this.keyUp);

    // button mouse click listener
    this.buttonContainers.forEach((btnContainer) => {
      btnContainer.addEventListener('mousedown', (e:MouseEvent) => {
        const keyType = btnContainer.dataset.keytype as Tetris.KeyType;
        this[keyType].keyDown();
      });
      btnContainer.addEventListener('mouseup', (e:MouseEvent) => {
        const keyType = btnContainer.dataset.keytype as Tetris.KeyType;
        this[keyType].keyUp();
      });
    })
  }
  keyDown = (e:KeyboardEvent) => {
    if (isLock(e)) { return }
    // metaKey는 윈도우 혹은 cmd를 의미한다
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    this[type].ativeButton();
    this[type].keyDown();
  }
  keyUp = (e: KeyboardEvent) => {
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    this[type].inactiveButton();
    if (isLock(e)) { return }
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    this[type].keyUp();
  }
}

export default KeyEventListener