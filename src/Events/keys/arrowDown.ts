import { Tetris } from '../../types';
import { blockControl, speedControl } from '../KeyEventCallbacks';

export default class ArrowDown implements Tetris.KeyControl {
  type: Tetris.KeyType = 'arrowDown';
  keyDown = () => {
    const [states, keyEventProcessor] = [window.tetris.states, window.tetris.keyEventProcessor];
    keyEventProcessor.down({
      keyType: this.type,
      callback: (states.currentBlock != null ) ? blockControl.down : speedControl.down,
      once: (states.currentBlock != null ) ? false : true,
    });
  }
  keyUp = () => {
    const [states, keyEventProcessor] = [window.tetris.states, window.tetris.keyEventProcessor];
    if (states.lock === true) {return}
    keyEventProcessor.up({
      keyType: this.type,
      callback: null
    });
  }
}