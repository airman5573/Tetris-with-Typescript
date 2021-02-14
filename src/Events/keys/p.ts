import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { gameControl } from '../KeyEventCallbacks';

export default class P implements Tetris.KeyControl {
  type: Tetris.KeyType = 'p';
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