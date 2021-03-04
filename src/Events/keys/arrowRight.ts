import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, startLineControl } from '../KeyEventCallbacks';

export default class ArrowRight implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'arrowRight';
  connectedBtn: HTMLDivElement;
  constructor(btnClassName: string) {
    this.connectedBtn = document.querySelector(`.button-container.feature-${btnClassName}`);
  }
  keyDown = () => {
    const {states, keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: (isInGame()) ? blockControl.right : startLineControl.up,
      once: (isInGame()) ? false : true,
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