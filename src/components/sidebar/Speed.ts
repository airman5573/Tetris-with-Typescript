import { Tetris } from '../../types';
import Numbers from './Numbers';
import { speeds } from '../../const';

class Speed extends Numbers implements Tetris.ISpeed {
  title: string;

  titleEl: HTMLDivElement;

  constructor() {
    super('speed');
  }

  reset = () => {
    window.tetris.states.speedStep = (speeds.length / 2) - 1;
    this.render(0);
  }
}

export default Speed;
