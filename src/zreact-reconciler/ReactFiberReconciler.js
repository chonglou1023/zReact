

import { enableNewReconciler } from '../shared/ReactFeatureFlags';

// The entry file imports either the old or new version of the reconciler.
// During build and testing, this indirection is always shimmed with the actual
// modules, otherwise both reconcilers would be initialized. So this is really
// only here for Flow purposes.

import {
  createContainer as createContainer_old,
  updateContainer as updateContainer_old,
  getPublicRootInstance as getPublicRootInstance_old,
  unbatchedUpdates as unbatchedUpdates_old,
} from './ReactFiberReconciler.old';


export const createContainer = enableNewReconciler
  ? null
  : createContainer_old;
export const updateContainer = enableNewReconciler
  ? null
  : updateContainer_old;
export const getPublicRootInstance = enableNewReconciler
  ? null
  : getPublicRootInstance_old;
  export const unbatchedUpdates = enableNewReconciler
  ? null
  : unbatchedUpdates_old;
