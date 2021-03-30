import { Tetris } from '../../types';

class Clock implements Tetris.IClock {
  node: HTMLDivElement;

  ledNumbers: NodeListOf<HTMLSpanElement>;

  clockTimer: NodeJS.Timeout;

  ledColon: HTMLSpanElement;

  constructor() {
    this.node = document.querySelector('.game-screen > .sidebar .clock');
    this.ledNumbers = document.querySelectorAll('.game-screen > .sidebar .clock .led-number');
    this.ledColon = document.querySelector('.game-screen > .sidebar .clock .led-colon');
  }

  reset = () => {
    clearTimeout(this.clockTimer);
    this.work(1);
  }

  work = (colonOnOff: number) => {
    this.clockTimer = setTimeout(() => {
      this.render(colonOnOff);
      this.work(colonOnOff * -1);
    }, 1000);
  }

  render = (colonOnOff: number) => {
    // 시계
    const today = new Date();
    const hours = `0${today.getHours()}`.slice(-2);
    const minutes = `0${today.getMinutes()}`.slice(-2);
    if (hours[0] === '0') this.ledNumbers[0].className = 'bg led-number ln-empty';
    else { this.ledNumbers[0].className = `bg led-number ln-${hours[0]}`; }
    this.ledNumbers[1].className = `bg led-number ln-${hours[1]}`;
    this.ledNumbers[2].className = `bg led-number ln-${minutes[0]}`;
    this.ledNumbers[3].className = `bg led-number ln-${minutes[1]}`;

    // colon led
    this.ledColon.className = `bg led-colon ${colonOnOff === 1 ? 'on' : ''}`;
  }
}

export default Clock;
