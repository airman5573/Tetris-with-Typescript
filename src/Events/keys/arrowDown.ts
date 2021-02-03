import { Tetris } from '../../types';
import { blockControl, speedControl } from '../KeyEventCallbacks';

export default class ArrowDown implements Tetris.KeyControl {
  type: Tetris.KeyType = 'arrowDown';
  keyDown = () => {
    const {states, keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      begin: 60,
      interval: 60,
      keyType: this.type,
      callback: (stop) => {
        if (states.currentBlock != null ) {
          blockControl.down(stop);
        } else {
          speedControl.down();
        }
      },
      once: (states.currentBlock != null ) ? false : true,
    });
  }
  keyUp = () => {
    const {states, keyEventProcessor} = window.tetris;
    if (states.lock === true) {return}
    keyEventProcessor.up({
      keyType: this.type,
      callback: null
    });
  }
}