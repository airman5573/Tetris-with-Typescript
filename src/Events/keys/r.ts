import { Tetris } from '../../types';
import { gameControl } from '../KeyEventCallbacks';

export default class R implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'r';

  connectedBtn: HTMLDivElement;

  constructor(btnClassName: string) {
    this.connectedBtn = document.querySelector(`.button-container.feature-${btnClassName}`);
  }

  keyDown = () => {
    const { keyEventProcessor } = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: gameControl.reset,
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
