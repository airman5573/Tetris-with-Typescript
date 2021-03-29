import { keyCodeWithType, keyCodes } from '../const';
import { Tetris } from '../types';
import { isLock } from '../utils';
import callbacks from './callbacks';

class KeyEventListener implements Tetris.IKeyEventListener {
  buttonContainers: NodeListOf<HTMLDivElement>;

  constructor() {
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
        callbacks[keyType].down();
      });
      btnContainer.addEventListener('mouseup', () => {
        const keyType = btnContainer.dataset.keytype as Tetris.KeyType;
        callbacks[keyType].up();
      });
    });
  }

  keyDown = (e:KeyboardEvent) => {
    if (isLock(e)) return;
    // metaKey는 윈도우 혹은 cmd를 의미한다
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    callbacks[type].down();
  }

  keyUp = (e: KeyboardEvent) => {
    const type: Tetris.KeyType = keyCodeWithType[e.keyCode];
    if (e.metaKey === true || keyCodes.indexOf(e.keyCode) === -1) { return; }
    callbacks[type].up();
  }
}

export default KeyEventListener;
