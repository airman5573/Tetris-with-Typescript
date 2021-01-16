import { Tetris } from '../../types';
import { blockControl, startLineControl } from '../KeyEventCallbacks';

export default class ArrowRight implements Tetris.KeyControl {
  constructor() {}
  type: Tetris.KeyType = 'arrowRight';
  keyDown = () => {
    const [states, keyEventProcessor] = [window.tetris.states, window.tetris.keyEventProcessor];
    keyEventProcessor.down({
      keyType: this.type,
      callback: (states.currentBlock != null ) ? blockControl.left : startLineControl.up,
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