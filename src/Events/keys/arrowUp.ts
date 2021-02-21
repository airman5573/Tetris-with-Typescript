import { Tetris } from '../../types';
import { isInGame } from '../../utils';
import { blockControl, speedControl } from '../KeyEventCallbacks';
import Key from './key';

export default class ArrowUp extends Key implements Tetris.IKeyControl {
  type: Tetris.KeyType = 'arrowUp';
  btnNode: HTMLDivElement;
  constructor() {
    super('rotate');
  }
  keyDown = () => {
    const {states, keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      keyType: this.type,
      callback: (isInGame()) ? blockControl.rotate : speedControl.up,
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