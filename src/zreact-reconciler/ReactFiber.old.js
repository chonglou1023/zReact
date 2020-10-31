import { ConcurrentRoot, BlockingRoot } from './ReactRootTags';
import {
  NoMode,
  ConcurrentMode,
  DebugTracingMode,
  ProfileMode,
  StrictMode,
  BlockingMode,
} from './ReactTypeOfMode';
import { HostRoot } from './ReactWorkTags';
import { NoLanes } from './ReactFiberLane';
import { NoEffect } from './ReactSideEffectTags';

function FiberNode(
  tag,
  pendingProps,
  key,
  mode,
) {
  // Instance
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // Fiber
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  this.alternate = null;

}

const createFiber = function (
  tag,
  pendingProps,
  key,
  mode,
) {
  return new FiberNode(tag, pendingProps, key, mode);
};

export function createHostRootFiber(tag) {
  let mode;
  if (tag === ConcurrentRoot) {
    mode = ConcurrentMode | BlockingMode | StrictMode;
  } else if (tag === BlockingRoot) {
    mode = BlockingMode | StrictMode;
  } else {
    mode = NoMode;
  }

  return createFiber(HostRoot, null, null, mode);
}