/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { WorldSpaceFunctions, impl as wsf } from '../_baseGame/clientFunctions/WorldSpaceFunctions';
import { WorldSpaceFunctionExtensions, impl as wsfe } from './clientFunctions/WorldSpaceFunctionExtensions';

// TODO: append other function bindings
export type WorldSpaceClientAPI = WorldSpaceFunctions & WorldSpaceFunctionExtensions;

// exposure of implementation
export const clientAPI: WorldSpaceClientAPI = {
  // WorldSpace
  bindProgressBarListener: wsf.bindProgressBarListener.bind(wsf),
  bindWorldUIRemovedListener: wsf.bindWorldUIRemovedListener.bind(wsf),
  bindWorldUIUpdatedListener: wsf.bindWorldUIUpdatedListener.bind(wsf),
  // WorldSpaceExtensions
  bindDamageTextListener: wsfe.bindDamageTextListener.bind(wsfe),
  bindHealthBarListener: wsfe.bindHealthBarListener.bind(wsfe),
  bindInteractableListener: wsfe.bindInteractableListener.bind(wsfe),
  bindInteractionBarListener: wsfe.bindInteractionBarListener.bind(wsfe),
  bindObjectiveListener: wsfe.bindObjectiveListener.bind(wsfe),
  bindWorldUIPositionMapUpdatedListener: wsfe.bindWorldUIPositionMapUpdatedListener.bind(wsfe)
};
