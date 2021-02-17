import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { gameControl } from '../KeyEventCallbacks';
import Key from './key';

export default class R extends Key implements Tetris.KeyControl {
  type: Tetris.KeyType = 'r';
  constructor() {
    super('reset');
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