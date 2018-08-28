/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const FIELD_LISTS = {
  ITEM: [
    'givenName', 'debugname', 'id', 'shardID',
  ],
  RECIPE: ['id'],
  ITEM_DEF_REF: [
    'id', 'iconUrl', 'name', 'description', 'isVox', 'itemType',
  ],
  MAKE_RECIPE_INGREDIENT_DEF: [
    'slot', 'requirementDescription', 'minQuality', 'maxQuality', 'unitCount',
  ],
  RECIPE_INGREDIENT_DEF: [
    'requirementPath', 'minPercent', 'maxPercent', 'minQuality', 'maxQuality',
  ],
  STATIC: [
    'id', 'iconUrl', 'name', 'description', 'isVox', 'itemType',
  ],
  STATS_ITEM: [
    'quality', 'selfMass', 'encumbrance', 'unitCount',
    'agilityRequirement', 'dexterityRequirement', 'strengthRequirement',
  ],
  STATS_DURABILITY: [
    'maxRepairPoints', 'maxHealth', 'fractureThreshold', 'fractureChance',
    'currentRepairPoints', 'currentHealth',
  ],
  IN_VOX: ['itemSlot', 'voxInstanceID'],
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
  ingredient: FIELD_LISTS.ITEM_DEF_REF,
  'voxStatus.ingredients': FIELD_LISTS.ITEM,
  ingredients: FIELD_LISTS.RECIPE_INGREDIENT_DEF,
  'makeRecipes.ingredients': FIELD_LISTS.MAKE_RECIPE_INGREDIENT_DEF,
  outputItem: FIELD_LISTS.ITEM_DEF_REF,
  'voxStatus.outputItems': FIELD_LISTS.ITEM,
  blockRecipes: FIELD_LISTS.RECIPE,
  shapeRecipes: FIELD_LISTS.RECIPE,
  grindRecipes: FIELD_LISTS.RECIPE,
  purifyRecipes: FIELD_LISTS.RECIPE,
  makeRecipes: FIELD_LISTS.RECIPE,
  voxStatus: FIELD_LISTS.VOX_STATUS,
  inVox: FIELD_LISTS.IN_VOX,
};

const GetQueryPart = (name: string, def: any, parent: string, indent: string) => {
  const query: string[] = [];
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
  const query: string[] = [];
  query.push('query' + ' ' + name + ' {');
  for (const key in def) {
    query.push(GetQueryPart(key, def[key], null, indent + '  '));
  }
  query.push('}');
  return query.join('\n');
};

const QUERY_VOX_STATUS = GetQueryText('VoxStatus', {
  crafting: {
    voxStatus: {
      ingredients: {
        staticDefinition: true,
        stats: { item: true, durability: true },
        location: { inVox: true },
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
      stats: { item: true, durability: true },
    },
  },
});

const QUERY_PURIFY_RECIPES = GetQueryText('PurifyRecipes', {
  crafting: { purifyRecipes: { outputItem: true, ingredientItem: true } },
});

const QUERY_GRIND_RECIPES = GetQueryText('GrindRecipes', {
  crafting: { grindRecipes: { outputItem: true, ingredientItem: true } },
});

const QUERY_SHAPE_RECIPES = GetQueryText('ShapeRecipes', {
  crafting: { shapeRecipes: { outputItem: true, ingredients: { ingredient: true } } },
});

const QUERY_BLOCK_RECIPES = GetQueryText('BlockRecipes', {
  crafting: { blockRecipes: { outputItem: true, ingredients: { ingredient: true } } },
});

const QUERY_MAKE_RECIPES = GetQueryText('MakeRecipes', {
  crafting: { makeRecipes: { outputItem: true, ingredients: { ingredient: true } } },
});

const QUERY_POSSIBLE_ITEMSLOTS = GetQueryText('PossibleItemSlots', {
  crafting: ['possibleItemSlots'],
});

export const QUERIES = {
  QUERY_VOX_STATUS,
  QUERY_POSSIBLE_INGREDIENTS,
  QUERY_POSSIBLE_ITEMSLOTS,
  QUERY_PURIFY_RECIPES,
  QUERY_GRIND_RECIPES,
  QUERY_SHAPE_RECIPES,
  QUERY_BLOCK_RECIPES,
  QUERY_MAKE_RECIPES,
};
