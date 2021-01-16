import Numbers from './numbers';

class StartLines extends Numbers {
  title: string;
  titleEl: HTMLDivElement;
  constructor() {
    super('start-lines');
  }
  updateStartLines = (sl: number) => {
    const gs = window.tetris.states;
    const startLines = gs.startLines + sl;
    if (startLines >= 10) { gs.startLines = 10; }
    else if (startLines < 0) { gs.startLines = 0; }
    else { gs.startLines = startLines; }
    this.render(gs.startLines); 
  }
  reset = () => {
    this.updateStartLines(0);
    this.render(0);
  }
}

export default StartLines;