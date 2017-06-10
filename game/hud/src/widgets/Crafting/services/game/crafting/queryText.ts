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

const ITEM_STAT_SINGLE = `
  {
    quality
    mass
    encumbrance
    agilityRequirement
    dexterityRequirement
    strengthRequirement
    unitCount
  }
`;

const ALLOY_STAT_SINGLE = `
  {
    hardness
    impactToughness
    fractureChance
    malleability
    massPCF
    density
    meltingPoint
    thermConductivity
    slashingResistance
    piercingResistance
    crushingResistance
    acidResistance
    poisonResistance
    diseaseResistance
    earthResistance
    waterResistance
    fireResistance
    airResistance
    lightningResistance
    frostResistance
    lifeResistance
    mindResistance
    spiritResistance
    radiantResistance
    deathResistance
    shadowResistance
    chaosResistance
    voidResistance
    arcaneResistance
    magicalResistance
    hardnessFactor
    strengthFactor
    fractureFactor
    massFactor
    damageResistance
  }
`;

const SUBSTANCE_STAT_SINGLE = `
  {
    hardness
    impactToughness
    fractureChance
    malleability
    massPCF
    density
    meltingPoint
    thermConductivity
    slashingResistance
    piercingResistance
    crushingResistance
    acidResistance
    poisonResistance
    diseaseResistance
    earthResistance
    waterResistance
    fireResistance
    airResistance
    lightningResistance
    frostResistance
    lifeResistance
    mindResistance
    spiritResistance
    radiantResistance
    deathResistance
    shadowResistance
    chaosResistance
    voidResistance
    arcaneResistance
    magicalResistance
    hardnessFactor
    strengthFactor
    fractureFactor
    massFactor
  }
`;

const DURABILITY_STAT_SINGLE = `
  {
    maxRepairPoints
    maxDurability
    fractureThreshold
    fractureChance
    currentRepairPoints
    currentDurability
  }
`;

const WEAPON_STAT_SINGLE = `
  {
    piercingDamage
    piercingBleed
    piercingArmorPenetration
    slashingDamage
    slashingBleed
    slashingArmorPenetration
    crushingDamage
    fallbackCrushingDamage
    disruption
    deflectionAmount
    physicalProjectileSpeed
    knockbackAmount
    stability
    falloffMinDistance
    falloffMaxDistance
    falloffReduction
    deflectionRecovery
    staminaCost
    physicalPreparationTime
    physicalRecoveryTime
    range
  }
`;

const BLOCK_STAT_SINGLE = `
  {
    compressiveStrength
    shearStrength
    tensileStrength
    density
    healthUnits
    buildTimeUnits
    unitMass
  }
`;

const CONTAINER_STAT_SINGLE = `
  {
    maxItemCount
    maxItemMass
  }
`;

const SIEGE_ENGINE_STAT_SINGLE = `
  {
    health
    yawSpeedDegPerSec
    pitchSpeedDegPerSec
  }
`;

const STATS = `
  {
    item ${ITEM_STAT_SINGLE}
  }
`;

// makes the stats query too complex
/*
    alloy ${ALLOY_STAT_SINGLE}
    substance ${SUBSTANCE_STAT_SINGLE}
    durability ${DURABILITY_STAT_SINGLE}
    weapon ${WEAPON_STAT_SINGLE}
    block ${BLOCK_STAT_SINGLE}
    container ${CONTAINER_STAT_SINGLE}
    siegeEngine ${SIEGE_ENGINE_STAT_SINGLE}
*/

const GEAR_SLOT_SETS = `
  {
    gearSlots {
      id
      gearLayer {
        id
        armourStatCalculationType
        gearLayerType
      }
    }
  }
`;

const ITEM_DEF_REF = `
  {
    id
    iconUrl
    name
    description
    isVox
    itemType
  }
`;
//  gearSlotSets ${GEAR_SLOT_SETS}    // makes query too complex

const TEMPLATE = `{ id }`;

const ITEM = `
  {
    givenName
    name
    id
    shardID
    stats ${STATS}
    staticDefinition ${ITEM_DEF_REF}
  }
`;

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
    template ${TEMPLATE}
    ingredients ${ITEM}
    outputItems ${ITEM}
  }
`;

const QUERY_POSSIBLE_INGREDIENTS = `
  possibleIngredients ${ITEM}
`;

const QUERY_PURIFY_RECIPES = `
  purifyRecipes {
    id
    ingredientItem ${ITEM_DEF_REF}
    outputItem ${ITEM_DEF_REF}
  }
`;

const QUERY_GRIND_RECIPES = `
  grindRecipes {
    id
    ingredientItem ${ITEM_DEF_REF}
    outputItem ${ITEM_DEF_REF}
  }
`;

const QUERY_REFINE_RECIPES = `
  refineRecipes {
    id
    ingredientItem ${ITEM_DEF_REF}
  }
`;

const QUERY_SHAPE_RECIPES = `
  shapeRecipes {
    id
    outputItem ${ITEM_DEF_REF}
    ingredients ${ITEM_DEF_REF}
  }
`;

const QUERY_BLOCK_RECIPES = `
  blockRecipes {
    id
    outputItem ${ITEM_DEF_REF}
    ingredients ${ITEM_DEF_REF}
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
