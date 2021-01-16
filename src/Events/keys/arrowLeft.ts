import { Tetris } from '../../types';
import { blockControl, startLineControl } from '../KeyEventCallbacks';

export default class ArrowLeft implements Tetris.KeyControl {
  type: Tetris.KeyType = 'arrowLeft';
  keyDown = () => {
    const [states, keyEventProcessor] = [window.tetris.states, window.tetris.keyEventProcessor];
    keyEventProcessor.down({
      keyType: this.type,
      callback: (states.currentBlock != null ) ? blockControl.left : startLineControl.down,
      once: (states.currentBlock != null ) ? false : true,
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