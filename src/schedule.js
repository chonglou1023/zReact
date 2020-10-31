// import { reconcilerChildren } from './reconciler';
import { HostRoot, HostComponent, HostText } from './zreact-reconciler/ReactWorkTags';
import { setProps } from './utils';
import { TEXT_NODE } from './zreact-dom/shared/HTMLNodeType';
import { Deletion, Placement, Update } from './zreact-reconciler/ReactSideEffectTags';

let workInProgressRoot = null;// 当前正在渲染的fiber tree的根
let nextUnitOfWork = null;// 下一个工作单元
let currentRoot = null;// 当前页面上渲染的fiber tree的根
let deletions = [];// 本次更新待删除的fiber节点列表，删除不放入effect list
//-----------------------调度开始------------------------
export function scheduleRoot(rootFiber) {
    if (currentRoot && currentRoot.alternate) {// 第二次及之后的更新
        workInProgressRoot = currentRoot.alternate;// 复用上次渲染的fiber tree
        workInProgressRoot.props = rootFiber.props;// 使用新的rootFiber的props
        workInProgressRoot.alternate = currentRoot;// 增加本次渲染fiber tree的引用
    } else if (currentRoot) {// 第一次更新
        workInProgressRoot = rootFiber;
        workInProgressRoot.alternate = currentRoot;// 增加第一次渲染生成的fiber tree的引用
    } else {// 第一次渲染
        workInProgressRoot = rootFiber;// 保持根的引用
    }
    nextUnitOfWork = workInProgressRoot;// 每次从根节点遍历
    requestIdleCallback(workLoop, { timeout: 500 });
}
// 循环执行工作流
function workLoop(deadline) {
    let shouldYield = false;// 时间片用完，应当让出控制权
    while (nextUnitOfWork && !shouldYield) {// 有下一个工作且没有让出控制权
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);// 执行下一个工作单元，一个工作单元就是一个fiber
        if (deadline.timeRemaining() < 1) {// 时间片用光
            shouldYield = true;
        }
    }
    if (!nextUnitOfWork) {// 所有工作完成，进入提交阶段
        console.log('render finished');
        commitRoot();
    }
    // 浏览器有空闲就执行工作流
    requestIdleCallback(workLoop, { timeout: 500 });
}
//------------------------render阶段---------------------------------
/**
 * 执行一个工作单元
 * 1、开始工作->当前fiber
 * 2、结束工作->当前fiber没有child时结束自身工作
 * @param {*} currentFiber 
 */
function performUnitOfWork(currentFiber) {
    // 开始工作的顺序是深度优先遍历过程
    beginWork(currentFiber);
    // 深度优先，当前fiber有child，则返回child
    if (currentFiber.child) {
        return currentFiber.child;
    }
    // 当前fiber没有child
    while (currentFiber) {
        // 结束当前fiber
        completeUnitOfWork(currentFiber);
        // 当前fiber有sibling，则返回sibling
        if (currentFiber.sibling) {
            return currentFiber.sibling;
        }
        // 当前fiber没有sibling，说明当前fiber的父fiber已经遍历结束，指针回到父fiber
        currentFiber = currentFiber.return;
    }
}
//------------------------render阶段1-构造fiber链表---------------------------------
/**
 * 1、生成当前fiber节点的DOM元素
 * 2、创建子fiber
 * @param {*} currentFiber 
 */
function beginWork(currentFiber) {
    if (currentFiber.tag === HostRoot) {// 根fiber
        updateHostRoot(currentFiber);
    } else if (currentFiber.tag === HostText) {// 文本fiber
        updateHostText(currentFiber);
    } else if (currentFiber.tag === HostComponent) {// 原生DOM元素fiber
        updateHostComp(currentFiber);
    }
}
// 创建更新根fiber
function updateHostRoot(currentFiber) {
    // 根fiber没有实例，直接调和子fiber
    let newChildren = currentFiber.props.children;
    reconcilerChildren(currentFiber, newChildren);
}
// 创建更新文本节点
function updateHostText(currentFiber) {
    if (!currentFiber.stateNode) {
        currentFiber.stateNode = document.createTextNode(currentFiber.props.text);
    }
}
// 创建更新原生节点
function updateHostComp(currentFiber) {
    if (!currentFiber.stateNode) {
        let dom = document.createElement(currentFiber.type);
        setProps(dom, {}, currentFiber.props);
        currentFiber.stateNode = dom;
    }
    reconcilerChildren(currentFiber, currentFiber.props.children);
}
/**
 * 调和虚拟DOM生成fiber链表
 * @param {*} currentFiber 当前fiber
 * @param {*} newChildren 子节点虚拟DOM数组
 */
function reconcilerChildren(currentFiber, newChildren) {
    let newChildIndex = 0;
    let prevSibling;
    // 当前fiber对应的老fiber tree上的引用fiber的子fiber
    let oldFiber = currentFiber.alternate && currentFiber.alternate.child;
    // 循环子元素虚拟DOM，为每个子元素生成一个fiber
    while (newChildIndex < newChildren.length || oldFiber) {
        let newChild = newChildren[newChildIndex];
        let tag;
        let newFiber;
        // 老fiber与新的虚拟DOM元素类型相同
        let sameType = oldFiber && newChild && oldFiber.type === newChild.type;
        if (newChild && newChild.type === TEXT_NODE) {
            tag = HostText;// 文本节点
        } else if (newChild && typeof newChild.type === 'string') {
            tag = HostComponent;// 原生DOM节点
        }
        if (sameType) {
            // 类型相同时，复用老fiber结构
            newFiber = {
                type: newChild.type,// DOM节点类型或组件实例类型
                tag,// fiber类型
                props: newChild.props,// 节点属性
                stateNode: oldFiber.stateNode,// 复用老的DOM元素
                return: currentFiber,// 父fiber引用
                effectTag: Update,// 更新
                nextEffect: null,// 副作用链表
                alternate: oldFiber,// 增加老fiber引用
            }
        } else {
            // 类型不同时，舍弃老fiber，创建新fiber
            if (newChild) {
                newFiber = {
                    type: newChild.type,// DOM节点类型或组件实例类型
                    tag,// fiber类型
                    props: newChild.props,// 节点属性
                    stateNode: null,// 真实DOM节点或组件实例
                    return: currentFiber,// 父fiber引用
                    effectTag: Placement,// 副作用类型
                    nextEffect: null,// 副作用链表
                }
            }
            // 老fiber加入删除数组
            if (oldFiber) {
                oldFiber.effectTag = Deletion;
                deletions.push(oldFiber)
            }
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling;// 新老节点逐个对比，指针同步移动
        }
        if (newFiber) {
            if (newChildIndex === 0) {
                // 第一个子节点作为child
                currentFiber.child = newFiber;
            } else {
                // 剩余子节点作为sibling
                prevSibling.sibling = newFiber;
            }
            prevSibling = newFiber;// 将子节点串成链表的中间变量
        }
        newChildIndex++;
    }
}
//------------------------render阶段2-构造副作用链表---------------------------------
// 完成当前fiber，收集副作用，形成链表
function completeUnitOfWork(currentFiber) {
    let returnFiber = currentFiber.return;
    if (returnFiber) {
        let effectTag = currentFiber.effectTag;
        // 当前fiber有副作用，需要将当前fiber挂载到父fiber的副作用链表上
        if (effectTag) {
            // 当前fiber上有子fiber的副作用，则将子fiber的副作用接到父fiber的副作用链表上
            if (currentFiber.lastEffect) {
                if (returnFiber.lastEffect) {
                    returnFiber.lastEffect.nextEffect = currentFiber.firstEffect
                } else {
                    returnFiber.firstEffect = currentFiber.firstEffect;
                }
                returnFiber.lastEffect = currentFiber.lastEffect;
            }

            // 将当前fiber的副作用接到父fiber的副作用链表上
            if (returnFiber.lastEffect) {
                // 父fiber已有副作用链表，则当前副作用继续往后挂
                returnFiber.lastEffect.nextEffect = currentFiber;
            } else {
                // 否则初始化父fiber的副作用链表
                returnFiber.firstEffect = currentFiber;
            }
            // 副作用链表尾指针后移
            returnFiber.lastEffect = currentFiber;
        }
    }
}

//--------------------------commit阶段--------------------------
// 提交渲染流程，不可打断
function commitRoot() {
    // 更新链表挂在fiber tree的根上，如果没有根，则不能渲染
    if (!workInProgressRoot) {
        return;
    }
    deletions.forEach(commitWork);// 执行effect list前，先把需要删除的fiber删掉
    let currentFiber = workInProgressRoot.firstEffect;
    // 从第一个更新fiber开始
    while (currentFiber) {
        // 挂载DOM元素
        commitWork(currentFiber);
        currentFiber = currentFiber.nextEffect;
    }
    deletions.length = 0;// 清空删除列表
    currentRoot = workInProgressRoot;// 渲染完成后指针指向currentRoot
    workInProgressRoot = null;
}
// 渲染当前fiber节点的DOM元素
function commitWork(currentFiber) {
    if (!currentFiber) {
        return;
    }
    let returnFiber = currentFiber.return;
    let returnDOM = returnFiber.stateNode;
    let effectTag = currentFiber.effectTag;
    if (effectTag === Placement) {
        // 将当前fiber的DOM元素挂载到父fiber的DOM节点上
        returnDOM.appendChild(currentFiber.stateNode);
    } else if (effectTag === Deletion) {
        // 将当前fiber的DOM元素从父fiber的DOM节点上移除
        returnDOM.removeChild(currentFiber.stateNode);
    } else if (effectTag === Update) {
        if (currentFiber.type === TEXT_NODE) {
            // 新老文本fiber的text值不同时更新
            if (currentFiber.alternate.props.text !== currentFiber.props.text) {
                // 更新文本节点，直接修改textContent的值
                currentFiber.stateNode.textContent = currentFiber.props.text;
            }
        } else {
            // 更新原生DOM节点的属性
            setProps(currentFiber.stateNode, currentFiber.alternate.props, currentFiber.props)
        }
    }
    currentFiber.effectTag = null;
}