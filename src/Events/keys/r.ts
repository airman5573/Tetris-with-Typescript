import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { gameControl } from '../KeyEventCallbacks';
import Key from './key';

export default class R implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'r';
  connectedBtn: HTMLDivElement;
  constructor(btnClassName: string) {
    this.connectedBtn = document.querySelector(`.button-container.feature-${btnClassName}`);
  }
  keyDown = () => {
    const {keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: gameControl.reset,
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