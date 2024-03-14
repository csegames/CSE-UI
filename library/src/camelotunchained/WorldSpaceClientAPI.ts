import { WorldSpaceFunctions, impl as wsf } from '../_baseGame/clientFunctions/WorldSpaceFunctions';

// TODO: append other function bindings
export type WorldSpaceClientAPI = WorldSpaceFunctions;

// exposure of implementation
export const clientAPI: WorldSpaceClientAPI = {
  bindProgressBarListener: wsf.bindProgressBarListener.bind(wsf),
  bindWorldUIRemovedListener: wsf.bindWorldUIRemovedListener.bind(wsf),
  bindWorldUIUpdatedListener: wsf.bindWorldUIUpdatedListener.bind(wsf)
};
