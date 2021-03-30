import { Tetris } from '../../types';
import Numbers from './Numbers';

class StartLines extends Numbers implements Tetris.IStartLines {
  title: string;

  titleEl: HTMLDivElement;

  constructor() {
    super('start-lines');
  }

  up = () => {
    const { states } = window.tetris;
    states.startLines = Math.max(0, Math.min(states.startLines + 1, 9));
    this.render(states.startLines);
  }

  down = () => {
    const { states } = window.tetris;
    states.startLines = Math.max(0, Math.min(states.startLines - 1, 9));
    this.render(states.startLines);
  }

  reset = () => {
    window.tetris.states.startLines = 0;
    this.render(0);
  }
}

export default StartLines;
