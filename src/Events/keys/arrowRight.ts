import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, startLineControl } from '../KeyEventCallbacks';
import Key from './key';

export default class ArrowRight extends Key implements Tetris.KeyControl {
  type: Tetris.KeyType = 'arrowRight';
  btnNode: HTMLDivElement;
  constructor() {
    super('right');
  }
  keyDown = () => {
    const {states, keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: (isInGame()) ? blockControl.right : startLineControl.up,
      once: (isInGame()) ? false : true,
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