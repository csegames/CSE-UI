/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Updatable, initUpdatable } from './Updatable';
import { toDefault, withDefaults } from '../utils/withDefaults';
import { engine } from '../engine';
import { BaseGameInterface } from '../BaseGameInterface';

/**
 * Hook a model up to the game engine events & configure the Updatable.
 * @param name Name of the event called by the game engine to update this model
 * @param defaultObject Constructor or fetch function for default values
 * @param propertyAccessor Function to access the UI reference handle to this model
 * @param propertySetter Function to set the UI reference handle to this model
 */
export function engineInit<TModel, TType extends TModel & Updatable>(
  game: BaseGameInterface,
  name: string,
  defaultObject: () => TType,
  propertyAccessor: () => TType | undefined,
  propertySetter: (model: TModel) => void
) {
  if (propertyAccessor()) {
    propertySetter(toDefault(propertyAccessor(), defaultObject()));
  } else {
    propertySetter(defaultObject());
  }
  engine.on(name, (model: TModel) => {
    if (game.debug) {
      console.groupCollapsed(`Client > ${name}`);
      try {
        console.log(JSON.stringify(model));
      } catch {}
      console.groupEnd();
    }

    if (!model) {
      if (propertyAccessor()) {
        propertySetter(defaultObject());
      }
    } else if (!propertyAccessor().isReady) {
      propertySetter(withDefaults<TModel>(model, defaultObject(), false));
      propertyAccessor().updateEventName = name;
      initUpdatable(propertyAccessor());
    } else {
      propertySetter(withDefaults<TModel>(model, defaultObject(), false));
      propertyAccessor().updateEventName = name;
    }

    game.trigger(name, propertyAccessor());
  });
}
