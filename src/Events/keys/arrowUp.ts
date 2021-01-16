import { Tetris } from '../../types';
import { blockControl, speedControl } from '../KeyEventCallbacks';

export default class ArrowUp implements Tetris.KeyControl {
  type: Tetris.KeyType = 'arrowUp';
  keyDown = () => {
    const [states, keyEventProcessor] = [window.tetris.states, window.tetris.keyEventProcessor];
    keyEventProcessor.down({
      keyType: this.type,
      callback: (states.currentBlock != null ) ? blockControl.rotate : speedControl.up,
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