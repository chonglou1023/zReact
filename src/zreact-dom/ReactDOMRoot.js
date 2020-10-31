
import {
  createContainer,
  updateContainer,
} from '../zreact-reconciler/ReactFiberReconciler';
import {
  BlockingRoot,
  ConcurrentRoot,
  LegacyRoot,
} from '../zreact-reconciler/ReactRootTags';

import {
  isContainerMarkedAsRoot,
  markContainerAsRoot,
  unmarkContainerAsRoot,
} from './ReactDOMComponentTree';
import {
  ELEMENT_NODE,
  COMMENT_NODE,
  DOCUMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
} from './shared/HTMLNodeType';
import {enableEagerRootListeners} from '../shared/ReactFeatureFlags';

function ReactDOMRoot(container, options) {
  this._internalRoot = createRootImpl(container, ConcurrentRoot, options);
}

function ReactDOMBlockingRoot(
  container,
  tag,
  options,
) {
  this._internalRoot = createRootImpl(container, tag, options);
}

ReactDOMRoot.prototype.render = ReactDOMBlockingRoot.prototype.render = function(
  children,
) {
  debugger
  const root = this._internalRoot;
  updateContainer(children, root, null, null);
};

ReactDOMRoot.prototype.unmount = ReactDOMBlockingRoot.prototype.unmount = function() {
  const root = this._internalRoot;
  const container = root.containerInfo;
  updateContainer(null, root, null, () => {
    unmarkContainerAsRoot(container);
  });
};

function createRootImpl(
  container,
  tag,
  options,
) {
  // Tag is either LegacyRoot or Concurrent Root
  const hydrate = options != null && options.hydrate === true;
  const hydrationCallbacks =
    (options != null && options.hydrationOptions) || null;
  const mutableSources =
    (options != null &&
      options.hydrationOptions != null &&
      options.hydrationOptions.mutableSources) ||
    null;
    
  const root = createContainer(container, tag, hydrate, hydrationCallbacks);
  markContainerAsRoot(root.current, container);
  const containerNodeType = container.nodeType;

  if (enableEagerRootListeners) {
    const rootContainerElement =
      container.nodeType === COMMENT_NODE ? container.parentNode : container;
    // listenToAllSupportedEvents(rootContainerElement);
  } else {
    if (hydrate && tag !== LegacyRoot) {
      const doc =
        containerNodeType === DOCUMENT_NODE
          ? container
          : container.ownerDocument;
      // We need to cast this because Flow doesn't work
      // with the hoisted containerNodeType. If we inline
      // it, then Flow doesn't complain. We intentionally
      // hoist it to reduce code-size.
      // eagerlyTrapReplayableEvents(container, ((doc)));
    } else if (
      containerNodeType !== DOCUMENT_FRAGMENT_NODE &&
      containerNodeType !== DOCUMENT_NODE
    ) {
      // ensureListeningTo(container, 'onMouseEnter', null);
    }
  }

  // if (mutableSources) {
  //   for (let i = 0; i < mutableSources.length; i++) {
  //     const mutableSource = mutableSources[i];
  //     registerMutableSourceForHydration(root, mutableSource);
  //   }
  // }

  return root;
}

export function createRoot(
  container,
  options,
) {
  return new ReactDOMRoot(container, options);
}

export function createBlockingRoot(
  container,
  options,
) {
  return new ReactDOMBlockingRoot(container, BlockingRoot, options);
}

export function createLegacyRoot(
  container,
  options,
) {
  return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}