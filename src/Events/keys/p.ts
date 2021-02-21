import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { gameControl } from '../KeyEventCallbacks';
import Key from './key';

export default class P implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'p';
  connectedBtn: HTMLDivElement;
  constructor(btnClassName: string) {
    this.connectedBtn = document.querySelector(`.button-container.feature-${btnClassName}`);
  }
  keyDown = () => {
    const {states: {pause}, keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: (isInGame()) ? (pause ? gameControl.unpause : gameControl.pause) : undefined,
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