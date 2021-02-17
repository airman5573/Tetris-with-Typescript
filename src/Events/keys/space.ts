import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, gameControl } from '../KeyEventCallbacks';
import Key from './key';

export default class Space extends Key implements Tetris.KeyControl {
  type: Tetris.KeyType = 'space';
  constructor() {
    super('drop');
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