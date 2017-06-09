/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-04 19:19:00
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-08 21:12:45
 */

const QUERY_VOX_STATUS = `
  voxStatus {
    voxState
    jobType
    jobState
    startTime
    totalCraftingTime
    givenName
    itemCount
    recipeID
    endQuality
    usedRepairPoints
    ingredients {
      name
      id
      shardID
      stats {
        item {
          quality
          mass
          unitCount
        }
      }
      staticDefinition {
        id
        name
        iconUrl
        description
      }
    }
    template {
      id
    }
  }
`;

const QUERY_POSSIBLE_INGREDIENTS = `
  possibleIngredients {
    givenName
    id
    shardID
    staticDefinition {
      id
      name
      iconUrl
      description
    }
    stats {
      item {
        quality
        mass
        unitCount
      }
    }
  }
`;

const QUERY_PURIFY_RECIPES = `
  purifyRecipes {
    id
    outputItem {
      name
      iconUrl
      description
    }
  }
`;

const QUERY_GRIND_RECIPES = `
  grindRecipes {
    id
    outputItem {
      name
      iconUrl
      description
    }
  }
`;

const QUERY_REFINE_RECIPES = `
  refineRecipes {
    id
    outputItem {
      name
      iconUrl
      description
    }
  }
`;

const QUERY_SHAPE_RECIPES = `
  shapeRecipes {
    id
    outputItem {
      name
      iconUrl
      description
    }
  }
`;

const QUERY_BLOCK_RECIPES = `
  blockRecipes {
    id
    outputItem {
      name
      iconUrl
      description
    }
  }
`;

const QUERY_TEMPLATES = `
  templates {
    id
    name
    iconUrl
    description
  }
`;

export const QUERIES = {
  QUERY_VOX_STATUS,
  QUERY_POSSIBLE_INGREDIENTS,
  QUERY_TEMPLATES,
  QUERY_PURIFY_RECIPES,
  QUERY_GRIND_RECIPES,
  QUERY_REFINE_RECIPES,
  QUERY_SHAPE_RECIPES,
  QUERY_BLOCK_RECIPES,
};
