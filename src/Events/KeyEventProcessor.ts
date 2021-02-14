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
    if (this.activeKey === e.keyType) { return }
    else { this.activeKey = e.keyType; }

    // 다른 타이머들은 삭제해준다. 왜냐하면, 두 키를 동시에 누르는걸 허용하지 않기 때문이다. 동시에 누를 필요가 없다.
    this.clearEventAll();

    // 할일이 없는데 더 진행할 필요가 없지
    if (e.callback === undefined) { return }

    // 이 clear가 왜 필요하냐면
    // 누른다 -> down이 실행되고 -> autoDown을 돌린다 -> 한칸 내려가는게 끝나면 -> autoDown멈추지마
    const clear = () => {
      this.clearEvent(e.keyType);
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
        // 이 순서가 정말 중요하다.
        // loop를 한다음에 e.callback을 해줘야한다.
        // callback을 먼저해서 nextAround까지 가서 clear가 호출되서 timer가 없어졌다 한들..
        // loop가 그 다음에 바로 호출되기 때문에 의미가 없다.... 또 그안에서 callback이 호출 -> nextAround -> clear...하지만 재귀적으로
        // 뒤에 loop가 바로 호출되기 때문에 clear는 무용지물이 된다.
        // 그래서 loop() -> e.callback(clear)가 되야한다.
        loop();
        e.callback(clear);
      }, begin|interval);
    }
    loop();
  }
  up = (e: Tetris.KeyCallback) => {
    if (this.activeKey == e.keyType) { this.activeKey = null; }
    this.clearEvent(e.keyType);
    this.events[e.keyType] = null;
  }
}

export default KeyEventProcessor;