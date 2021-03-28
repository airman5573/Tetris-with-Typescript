import { keyCodeWithType, keyCodes } from '../const';
import ArrowUp from './keys/arrowUp';
import ArrowRight from './keys/arrowRight';
import ArrowDown from './keys/arrowDown';
import ArrowLeft from './keys/arrowLeft';
import Space from './keys/space';
import P from './keys/p';
import R from './keys/r';
import { Tetris } from '../types';
import { isLock, createKeyControl } from '../utils';

class KeyEventListener implements Tetris.IKeyEventListener {
  arrowUp: Tetris.IKeyControl;

  arrowRight: Tetris.IKeyControl;

  arrowDown: Tetris.IKeyControl;

  arrowLeft: Tetris.IKeyControl;

  space: Tetris.IKeyControl;

  p: Tetris.IKeyControl;

  r: Tetris.IKeyControl;

  buttonContainers: NodeListOf<HTMLDivElement>;

  constructor() {
    this.arrowUp = createKeyControl(ArrowUp, 'rotate');
    this.arrowRight = createKeyControl(ArrowRight, 'right');
    this.arrowDown = createKeyControl(ArrowDown, 'down');
    this.arrowLeft = createKeyControl(ArrowLeft, 'left');
    this.space = createKeyControl(Space, 'drop');
    this.p = createKeyControl(P, 'pause');
    this.r = createKeyControl(R, 'reset');
    this.buttonContainers = document.querySelectorAll('.button-container');
  }

  listen = () => {
    // keyboard event listener
    document.addEventListener('keydown', this.keyDown);
    document.addEventListener('keyup', this.keyUp);

    // button mouse click listener
    this.buttonContainers.forEach((btnContainer) => {
      btnContainer.addEventListener('mousedown', () => {
        const keyType = btnContainer.dataset.keytype as Tetris.KeyType;
        this[keyType].keyDown();
      });
      btnContainer.addEventListener('mouseup', () => {
        const keyType = btnContainer.dataset.keytype as Tetris.KeyType;
        this[keyType].keyUp();
      });
    });
  }

  keyDown = (e:KeyboardEvent) => {
    if (isLock(e)) return;
    // metaKey는 윈도우 혹은 cmd를 의미한다
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    this.activeButton(this[type].connectedBtn);
    this[type].keyDown();
  }

  keyUp = (e: KeyboardEvent) => {
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    this.inactiveButton(this[type].connectedBtn);
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    this[type].keyUp();
  }

  activeButton = (btn: HTMLDivElement) => {
    if (!btn.classList.contains('active')) btn.classList.add('active');
  }

  inactiveButton = (btn: HTMLDivElement) => {
    if (btn.classList.contains('active')) btn.classList.remove('active');
  }
}

export default KeyEventListener;
