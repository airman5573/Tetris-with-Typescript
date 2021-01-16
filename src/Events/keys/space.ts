import { Tetris } from '../../types';
import { blockControl, gameControl } from '../KeyEventCallbacks';

export default class Space implements Tetris.KeyControl {
  type: Tetris.KeyType = 'space';
  keyDown = () => {
    const [states, keyEventProcessor] = [window.tetris.states, window.tetris.keyEventProcessor];
    keyEventProcessor.down({
      keyType: this.type,
      callback: (states.currentBlock != null ) ? blockControl.drop : gameControl.start,
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