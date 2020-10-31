import { createFiberRoot } from './ReactFiberRoot.old';

export function createContainer(
  containerInfo,
  tag,
  hydrate,
  hydrationCallbacks,
) {
  return createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
}

export function updateContainer(
  element,
  container,
  parentComponent,
  callback,
) {
  // const current = container.current;
  // const eventTime = requestEventTime();

  // const lane = requestUpdateLane(current);

  // if (enableSchedulingProfiler) {
  //   markRenderScheduled(lane);
  // }

  // const context = getContextForSubtree(parentComponent);
  // if (container.context === null) {
  //   container.context = context;
  // } else {
  //   container.pendingContext = context;
  // }


  // const update = createUpdate(eventTime, lane);
  // // Caution: React DevTools currently depends on this property
  // // being called "element".
  // update.payload = { element };

  // callback = callback === undefined ? null : callback;
  // if (callback !== null) {

  //   update.callback = callback;
  // }

  // enqueueUpdate(current, update);
  // scheduleUpdateOnFiber(current, lane, eventTime);

  // return lane;
}
const unbatchedUpdates=()=>{}
export {
  unbatchedUpdates
};

export function getPublicRootInstance(
  container,
) {
  const containerFiber = container.current;
  if (!containerFiber.child) {
    return null;
  }
  return containerFiber.child.stateNode;
}