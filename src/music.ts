import { Tetris } from './types';

class Music implements Tetris.IMusic {
  url = './assets/music.mp3';

  source: AudioBufferSourceNode | undefined

  soundRanges: {
    start: [0, 3.7202, 3.6224],
    clear: [0, 0, 0.7675],
    fall: [0, 1.2558, 0.3546],
    rotate: [0, 0, 0.7675]
    gameover: [0, 8.1276, 1.1437],
    move: [0, 2.9088, 0.1437]
  }

  constructor() {
    const hasWebAudioAPI = !!AudioContext && window.location.protocol.indexOf('http') !== -1;
    if (!hasWebAudioAPI) return;
    const context = new AudioContext();
    const req = new XMLHttpRequest();
    req.open('GET', this.url, true);
    req.responseType = 'arraybuffer';
    req.onload = () => {
      context.decodeAudioData(req.response, (buf) => {
        this.source = context.createBufferSource();
        this.source.buffer = buf;
        this.source.connect(context.destination);
      });
    };
    req.send();
  }

  isOn = () => {
    const { sound } = window.tetris.states;
    return sound;
  }

  start = () => {
    if (this.source === undefined || !this.isOn) return;
    this.source.start(...this.soundRanges.start);
  }

  clear = () => {
    if (this.source === undefined || !this.isOn) return;
    this.source.start(...this.soundRanges.clear);
  }

  gameover = () => {
    if (this.source === undefined || !this.isOn) return;
    this.source.start(...this.soundRanges.gameover);
  }

  fall = () => {
    if (this.source === undefined || !this.isOn) return;
    this.source.start(...this.soundRanges.fall);
  }

  move = () => {
    console.log('move!');
    if (this.source === undefined || !this.isOn) return;
    this.source.start(...this.soundRanges.move);
  }

  rotate = () => {
    if (this.source === undefined || !this.isOn) return;
    this.source.start(...this.soundRanges.rotate);
  }
}

export default Music;
