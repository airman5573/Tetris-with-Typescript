import { LAST_ROUND } from '../const';
import { Tetris } from '../types';
import Numbers from './Numbers';

class Point extends Numbers implements Tetris.IPoint {
  title: string;
  titleEl: HTMLDivElement;
  constructor() {
    super('point');
    this.title = LAST_ROUND;
    this.titleEl = document.querySelector(".game-screen > .sidebar .point > label");
  }
  changeTitle = (title: string) => {
    this.title = title;
    this.titleEl.innerText = this.title;
  }
  updatePoint = (point: number) => {
    const states = window.tetris.states;
    states.point += point;
    this.render(states.point);
  }
  setPoint = (point: number) => {
    const states = window.tetris.states;
    states.point = point;
    this.render(states.point);
  }
  reset = (title: string) => {
    this.changeTitle(title);
    this.setPoint(0);
  }
}

export default Point