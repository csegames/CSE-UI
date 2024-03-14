/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as graphql from '../graphql/schema';

export const RequirementDescriptionMethods = {
  IsOfType: (item: graphql.ItemDefRef, itemType: graphql.ItemType) => {
    return item.itemType === itemType;
  },

  HasTag: (item: graphql.ItemDefRef, tag: string) => {
    if (!item || !item.tags) return false;

    return item.tags.indexOf(tag) !== -1;
  },

  MeetsRequirementDescription: (requirement: graphql.ItemRequirementDefRef, item: graphql.ItemDefRef) => {
    // @ts-ignore: no-unused-locals
    const Ctx = {
      IsOfType: (itemType: graphql.ItemType) => RequirementDescriptionMethods.IsOfType(item, itemType),
      HasTag: (tag: string) => RequirementDescriptionMethods.HasTag(item, tag)
    };

    let meetsReq = false;
    try {
      // tslint:disable-next-line
      meetsReq = eval(requirement.condition);
    } catch (e) {
      console.error('Tried to eval requirement and failed', e);
    }

    return meetsReq;
  }
};
