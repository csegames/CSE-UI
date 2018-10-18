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
export default function<TModel, TType extends TModel & Updatable>(
  name: string,
  defaultObject: () => TType,
  propertyAccessor: () => TType | undefined,
  propertySetter: (model: TModel) => void,
) {
  propertySetter(defaultObject());
  engine.on(name, (model: TModel) => {
    // console.log(`received ${name} model | ${JSON.stringify(model)}`);
    if (!model) {
      propertySetter(defaultObject());
    } else if (!propertyAccessor().isReady) {
      propertySetter(withDefaults(model, defaultObject()));
      propertyAccessor().updateEventName = name;
      initUpdatable(propertyAccessor());
      if (name === 'selfPlayerState.update') {
        console.log(`name: ${(model as any).name}`);
        console.log(`entityID: ${(model as any).entityID}`);
        console.log(`characterID: ${(model as any).characterID}`);
        console.log(`zoneID: ${(model as any).zoneID}`);
      }

      if (name === 'loadingState.update') {
        console.log(`message: ${(model as any).message}`);
      }
      console.log(`initialized ${name} model | ${JSON.stringify(propertyAccessor())}`);
    }
    executeUpdateCallbacks(propertyAccessor());
  });
}
