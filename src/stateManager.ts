import {getNextBlock, deepCopy, getClearLines, isOver, getStartMatrix} from './utils';
import {blankMatrix, LAST_ROUND, POINT} from './const';

class StateManager {
  ready = (callback?: () => void) => {
    this.lock();
    const tetris = window.tetris;
    const matrix = tetris.components.matrix;
    clearTimeout(matrix.timer);
    matrix.render(deepCopy(blankMatrix));
  }
  lock = () => { window.tetris.states.lock = true; }
  unlock = () => { window.tetris.states.lock = false; }
}

export default StateManager;