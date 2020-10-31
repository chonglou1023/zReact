import { HostRoot } from './zreact-reconciler/ReactWorkTags';
import { scheduleRoot } from './schedule';

function render(element, container) {
    // 构造根fiber
    const rootFiber = {
        tag: HostRoot,
        stateNode: container,
        props: {
            children: [element]
        }
    }
    // 每次渲染都调度根fiber
    scheduleRoot(rootFiber)
}

export default {
    render
}