/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-04 19:19:00
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-15 13:04:06
 */

const FIELD_LISTS = {
  ITEM: [
    'givenName', 'name', 'id', 'shardID',
  ],
  RECIPE: [ 'id' ],
  ITEM_DEF_REF: [
    'id', 'iconUrl', 'name', 'description', 'isVox', 'itemType',
  ],
  STATIC: [
    'id', 'iconUrl', 'name', 'description', 'isVox', 'itemType',
  ],
  STATS_ITEM: [
    'quality', 'mass', 'encumbrance', 'unitCount',
    'agilityRequirement', 'dexterityRequirement', 'strengthRequirement',
  ],
  STATS_DURABILITY: [
    'maxRepairPoints', 'maxDurability', 'fractureThreshold', 'fractureChance',
    'currentRepairPoints', 'currentDurability',
  ],
  VOX_STATUS: [
    'voxState', 'jobType', 'jobState', 'startTime', 'totalCraftingTime', 'timeRemaining',
    'givenName', 'itemCount', 'recipeID', 'endQuality', 'usedRepairPoints',
  ],
};

const TYPES: any = {
  possibleIngredients: FIELD_LISTS.ITEM,
  staticDefinition: FIELD_LISTS.STATIC,
  'stats.item': FIELD_LISTS.STATS_ITEM,
  'stats.durability': FIELD_LISTS.STATS_DURABILITY,
  ingredientItem: FIELD_LISTS.ITEM_DEF_REF,
  'voxStatus.ingredients': FIELD_LISTS.ITEM,
  ingredients: FIELD_LISTS.ITEM_DEF_REF,
  template: FIELD_LISTS.ITEM_DEF_REF,
  templates: FIELD_LISTS.ITEM_DEF_REF,
  outputItem: FIELD_LISTS.ITEM_DEF_REF,
  'voxStatus.outputItems': FIELD_LISTS.ITEM,
  blockRecipes: FIELD_LISTS.RECIPE,
  shapeRecipes: FIELD_LISTS.RECIPE,
  refineRecipes: FIELD_LISTS.RECIPE,
  grindRecipes: FIELD_LISTS.RECIPE,
  purifyRecipes: FIELD_LISTS.RECIPE,
  voxStatus: FIELD_LISTS.VOX_STATUS,
};

const GetQueryPart = (name: string, def: any, parent: string, indent: string) => {
  const query : string[] = [];
  query.push(indent + name + ' {');
  const isArray = Array.isArray(def);
  const fields = typeof def === 'string' ? TYPES[def] : (
    isArray ? def : ((parent && TYPES[parent + '.' + name]) || TYPES[name])
  );
  if (fields) fields.forEach((field: string) => query.push(indent + '  ' + field));
  if (typeof def === 'object' && !isArray) {
    for (const key in def) {
      query.push(GetQueryPart(key, def[key], name, indent + '  '));
    }
  }
  query.push(indent + '}');
  return query.join('\n');
};

const GetQueryText = (name: string, def: any, indent: string = '') => {
  const query : string[] = [];
  query.push('query ' + name + ' {');
  for (const key in def) {
    const s = key as string;
    query.push(GetQueryPart(key, def[key], null, indent + '  '));
  }
  query.push('}');
  return query.join('\n');
};

const QUERY_VOX_STATUS = GetQueryText('VoxStatus', {
  crafting: {
    voxStatus: {
      template: true,
      ingredients: {
        staticDefinition: true,
        stats: { item: true, durability: true },
      },
      outputItems: {
        staticDefinition: true,
        stats: { item: true, durability: true },
      },
    },
  },
});

const QUERY_POSSIBLE_INGREDIENTS = GetQueryText('PossibleIngredients', {
  crafting: {
    possibleIngredients: {
      staticDefinition: true,
      stats: {
        item: true,
        durability: true,
      },
    },
  },
});

const QUERY_PURIFY_RECIPES = GetQueryText('PurifyRecipes', {
  crafting: { purifyRecipes: { outputItem: true, ingredientItem: true } },
});

const QUERY_GRIND_RECIPES = GetQueryText('GrindRecipes', {
  crafting: { grindRecipes: { outputItem: true, ingredientItem: true } },
});

const QUERY_REFINE_RECIPES = GetQueryText('RefineRecipes', {
  crafting: { refineRecipes: { ingredientItem: true } },
});

const QUERY_SHAPE_RECIPES = GetQueryText('ShapeRecipes', {
  crafting: { shapeRecipes: { outputItem: true, ingredients: true } },
});

const QUERY_BLOCK_RECIPES = GetQueryText('BlockRecipes', {
  crafting: { blockRecipes: { outputItem: true, ingredients: true } },
});

const QUERY_TEMPLATES = GetQueryText('Templates', { crafting: { templates: true } });

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
