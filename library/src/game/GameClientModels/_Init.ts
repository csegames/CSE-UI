/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, initUpdatable, executeUpdateCallbacks } from './_Updatable';

/**
 * Hook a model up to the game engine events & configure the Updatable.
 * @param name Name of the event called by the game engine to update this model
 * @param init Function to initialize the object with default values, called when this method is first executed
 *             any whenever the client sends an invalid reference or null object to the update method.
 * @param propertyAccessor Function to access the UI reference handle to this model
 * @param propertySetter Function to set the UI reference handle to this model
 * @param onUpdated Function to handle registrations of update callbacks
 */
export default function<TModel, TType extends Updatable>(
  name: string,
  initAsDefault: () => void,
  propertyAccessor: () => TType | undefined,
  propertySetter: (model: TModel) => void,
) {
  initAsDefault();
  engine.on(name, (model: TModel) => {
    if (!model) {
      initAsDefault();
    } else if (!propertyAccessor().isReady) {
      propertySetter(model);
      propertyAccessor()._name = name;
      initUpdatable(propertyAccessor());
    }
    executeUpdateCallbacks(propertyAccessor());
  });
}
