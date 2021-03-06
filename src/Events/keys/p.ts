import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { gameControl } from '../KeyEventCallbacks';

export default class P implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'p';

  connectedBtn: HTMLDivElement;

  constructor(btnClassName: string) {
    this.connectedBtn = document.querySelector(`.button-container.feature-${btnClassName}`);
  }

  keyDown = () => {
    const { states: { pause }, keyEventProcessor } = window.tetris;
    let callback;
    if (isInGame()) {
      if (pause) callback = gameControl.unpause;
      else callback = gameControl.pause;
    }
    keyEventProcessor.down({
      keyType: this.type,
      callback,
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
