import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, gameControl } from '../KeyEventCallbacks';

export default class Space implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'space';
  connectedBtn: HTMLDivElement;
  constructor(btnClassName: string) {
    this.connectedBtn = document.querySelector(`.button-container.feature-${btnClassName}`);
  }
  keyDown = () => {
    const {keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: (isInGame()) ? blockControl.drop : gameControl.start,
      once: true
    });
  }
  keyUp = () => {
    const keyEventProcessor = window.tetris.keyEventProcessor;
    keyEventProcessor.up({
      keyType: this.type,
      callback: null
    });
  }
}