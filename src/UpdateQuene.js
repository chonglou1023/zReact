// 一个更新单元的结构
export class Update {
    constructor(payload) {
        this.payload = payload;
    }
}
// 更新队列是一个链表结构
export class UpdateQuene {
    constructor() {
        this.firstUpdate = null;
        this.lastUpdate = null;
    }
    // 一个新的更新入队
    enqueneUpdate(update) {
        if (this.lastUpdate) {
            this.lastUpdate.nextUpdate = update;
        } else {
            this.firstUpdate = update;
        }
        this.lastUpdate = update;
    }
    // 将老的state经过更新队列处理一遍返回新的state
    forceUpdate(state) {
        let currentUpdate = this.firstUpdate;
        while (currentUpdate) {
            let nextState = typeof currentUpdate.payload === 'function' ? currentUpdate.payload(state) : currentUpdate.payload;
            state = { ...state, ...nextState };
            currentUpdate = currentUpdate.nextUpdate;
        }
        this.firstUpdate = this.lastUpdate = null;
        return state;
    }
}