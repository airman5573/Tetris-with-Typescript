import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, speedControl } from '../KeyEventCallbacks';

export default class ArrowUp implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'arrowUp';

  connectedBtn: HTMLDivElement;

  constructor(btnClassName: string) {
    this.connectedBtn = document.querySelector(`.button-container.feature-${btnClassName}`);
  }

  keyDown = () => {
    const { keyEventProcessor } = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: (isInGame()) ? blockControl.rotate : speedControl.up,
      once: true,
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
