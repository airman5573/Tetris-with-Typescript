import { Tetris } from "../types";

class KeyEventProcessor {
  events: Tetris.KeyTimer = {}
  activeKey: Tetris.KeyType|null
  clearEvent = (keyType: Tetris.KeyType) => {
    const keys = Object.keys(this.events);
    keys.forEach((k) => {
      if (k == keyType && this.events[keyType]) {
        clearTimeout(this.events[keyType]);
        this.events[keyType] = null;
      }
    });
  }
  clearEventAll = () => {
    const keys = Object.keys(this.events);
    keys.forEach((k) => {
      clearTimeout(this.events[k]);
      this.events[k] = null;
    });
  }
  down = (e: Tetris.KeyCallback) => {
    if (window.tetris.states.lock === true) { return }
    if (this.activeKey == e.keyType) { return }
    else { this.activeKey = e.keyType; }

    // 다른 타이머들은 삭제한다
    this.clearEventAll();

    // undefined가 맞나?
    if (e.callback === undefined) {return}

    const clear = () => {
      clearTimeout(this.events[e.keyType]);
    }

    // 한번 실행한다
    e.callback(clear);
    // 한번만 실행하는거라면 루프 돌리지 말자
    if (e.once && e.once === true) { return }

    // 계속 실행한다
    let begin = e.begin || 100;
    const interval = e.interval || 100;
    const loop = () => {
      this.events[e.keyType] = setTimeout(() => {
        begin = null;
        e.callback(clear);
        loop();
      }, begin|interval);
    }
    loop();
  }
  up = (e: Tetris.KeyCallback) => {
    if (window.tetris.states.lock === true) { return }
    if (this.activeKey == e.keyType) { this.activeKey = null; }
    this.clearEvent(e.keyType);
    this.events[e.keyType] = null;
  }
}

export default KeyEventProcessor;