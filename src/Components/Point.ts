import { LAST_ROUND } from '../const';
import Numbers from './numbers';

class Point extends Numbers {
  title: string;
  titleEl: HTMLDivElement;
  constructor() {
    super('point');
    this.title = LAST_ROUND;
    this.titleEl = document.querySelector(".game-screen > .sidebar .point > label");
  }
  changeTitle = (_title: string) => {
    this.title = _title;
    this.titleEl.innerText = this.title;
  }
  updatePoint = (_point: number) => {
    const states = window.tetris.states;
    states.point += _point;
    this.render(states.point);
  }
  setPoint = (_point: number) => {
    const states = window.tetris.states;
    states.point = _point;
    this.render(states.point);
  }
  reset = (title: string) => {
    this.changeTitle(title);
    this.setPoint(0);
  }
}

export default Point