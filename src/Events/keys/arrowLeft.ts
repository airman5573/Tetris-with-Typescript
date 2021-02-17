import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, startLineControl } from '../KeyEventCallbacks';
import Key from './key';

export default class ArrowLeft extends Key implements Tetris.KeyControl {
  type: Tetris.KeyType = 'arrowLeft';
  btnNode: HTMLDivElement;
  constructor() {
    super('left');
  }
  keyDown = () => {
    const {states, keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: (isInGame()) ? blockControl.left : startLineControl.down,
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