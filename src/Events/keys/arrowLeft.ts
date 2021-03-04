import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, startLineControl } from '../KeyEventCallbacks';

export default class ArrowLeft implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'arrowLeft';

  connectedBtn: HTMLDivElement;

  constructor(btnClassName: string) {
    this.connectedBtn = document.querySelector(`.button-container.feature-${btnClassName}`);
  }

  keyDown = () => {
    const { keyEventProcessor } = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: (isInGame()) ? blockControl.left : startLineControl.down,
      once: !isInGame(),
    });
  }

  keyUp = () => {
    const { keyEventProcessor } = window.tetris;
    keyEventProcessor.up({
      keyType: this.type,
      callback: null,
    });
  }
}
