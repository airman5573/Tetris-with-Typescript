import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, gameControl } from '../KeyEventCallbacks';

export default class Space implements Tetris.KeyControl {
  type: Tetris.KeyType = 'space';
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