import { Tetris } from '../../types';
import { blockControl, speedControl } from '../KeyEventCallbacks';

export default class ArrowDown implements Tetris.KeyControl {
  type: Tetris.KeyType = 'arrowDown';
  keyDown = () => {
    const {states, keyEventProcessor} = window.tetris;
    keyEventProcessor.down({
      begin: 60,
      interval: 80,
      keyType: this.type,
      callback: (stopDownTrigger?: () => void) => {
        // currentBlock이 있으면 블럭을 아래로 내리라는거고
        if (states.currentBlock != null ) {
          // 여기로 넘어간 stopDownTrigger는 down에서 호출되는게 아니라
          // down에서 currentBlock이 더이상 내려갈 곳이 없을때 nextRound에서 호출되는겨
          blockControl.down(stopDownTrigger);
        } 
        // block이 없으면 (게임시작전에) speed를 컨트롤 하는거지
        else {
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