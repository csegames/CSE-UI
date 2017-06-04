/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-04 19:16:48
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-04 20:51:13
 */

export const VoxStatus = JSON.parse(`{
  "voxStatus": {
    "jobType": "purify",
    "jobState": "Configuring",
    "startTime": "0001-01-01T00:00:00Z",
    "totalCraftingTime": 0.0,
    "givenName": "",
    "itemCount": 0,
    "recipeID": "craft_purify_wood",
    "endQuality": 0.0,
    "usedRepairPoints": 0,
    "ingredients": [
      {
        "id": "8qHnFxy1Go56ZWLpyIE57K",
        "shardID": 1,
        "stats": {
          "item": {
            "quality": 0.01,
            "mass": 0.1,
            "unitCount": 100.0
          }
        }
      }
    ],
    "template": null
  }
}`);

export const PossibleIngredients = JSON.parse(`{
  "possibleIngredients": [
    {
      "givenName": "Rough Stone Slab",
      "id": "4z8cQ0iguz5r6yIiNdeX86",
      "shardID": 1,
      "stats": {
        "item": {
          "quality": 0.01,
          "mass": 11.0,
          "unitCount": 1100.0
        }
      }
    },
    {
      "givenName": "WoodLog",
      "id": "gsvYr3KGDd5PchoLmwXlC3",
      "shardID": 1,
      "stats": {
        "item": {
          "quality": 0.01,
          "mass": 10.8,
          "unitCount": 10800.0
        }
      }
    }
  ]
}`);

export const PurifyRecipes = JSON.parse(`{
  "purifyRecipes": [
    { "id": "craft_purify_wood" },
    { "id": "craft_purify_stone" },
    { "id": "craft_purify_aluminum" }
  ]
}`);

export const GrindRecipes = JSON.parse(`{
  "grindRecipes": [
    { "id": "craft_grind_aluminum_pure" },
    { "id": "craft_grind_aluminum_raw" }
  ]
}`);

export const RefineRecipes = JSON.parse(`{
  "refineRecipes": [
    { "id": "craft_refine_stone" },
    { "id": "craft_refine_wood" },
    { "id": "craft_refine_aluminum" }
  ]
}`);

export const ShapeRecipes = JSON.parse(`{
      "shapeRecipes": []
}`);

export const BlockRecipes = JSON.parse(`{
  "blockRecipes": [
    { "id": "block_recipe_wood" },
    { "id": "block_recipe_stone" }
  ]
}`);

const ICON_ROOT = 'https://s3.amazonaws.com/camelot-unchained/icons/inventory/';

export const Templates = JSON.parse(`{
  "templates": [
    {
      "id": "item_TDD_WeaponPolearm01",
      "name": "Tangleroot Glaive",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_TanglerootGlaive.png",
      "description": "Weapon Polearm"
    },
    {
      "id": "item_Arthurian_WeaponStaff01",
      "name": "Jeweled Staff",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_JeweledStaff.png",
      "description": "Weapon Staff"
    },
    {
      "id": "item_Arthurian_ArmorMediumForearm01",
      "name": "Reinforced Vambrace",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_ReinforcedVambrace.png",
      "description": "Armor Medium Forearm"
    },
    {
      "id": "item_Arthurian_ArmorHeavyHand01",
      "name": "Heavy Plate Gauntlet",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_HeavyPlateGauntlet.png",
      "description": "Armor Heavy Hand"
    },
    {
      "id": "item_TDD_ArmorMediumHead01",
      "name": "Medium Veined Helm",
      "iconUrl": "${ICON_ROOT}/armor_tdd_MediumVeinedHelm.png",
      "description": "Armor Medium Head"
    },
    {
      "id": "item_TDD_ArmorHeavyUpperLegs01",
      "name": "Hulking Cuisses",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HulkingCuisses.png",
      "description": "Armor Heavy Upper Legs"
    },
    {
      "id": "item_Viking_WeaponHammer01",
      "name": "Battle Hammer",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_BattleHammer.png",
      "description": "Weapon Hammer"
    },
    {
      "id": "item_TDD_ArmorHeavyLowerLegs01",
      "name": "Heavy Ridgid Greaves",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyRidgidGreaves.png",
      "description": "Armor Heavy Lower Legs"
    },
    {
      "id": "item_Viking_ArmorMediumFeet01",
      "name": "Skull Bound Sabatons",
      "iconUrl": "${ICON_ROOT}/armor_vikings_SkullBoundSabatons.png",
      "description": "Armor Medium Feet"
    },
    {
      "id": "item_Arthurian_WeaponAxe04",
      "name": "Grand Jeweled Axe",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_GrandJeweledAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_Viking_ArmorMediumForearm01",
      "name": "Tooth Spiked Vambrace",
      "iconUrl": "${ICON_ROOT}/armor_vikings_ToothSpikedVambrace.png",
      "description": "Armor Medium Forearm"
    },
    {
      "id": "item_Arthurian_MunitionArrow02",
      "name": "Basic Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_BasicArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_TDD_MunitionArrow03",
      "name": "Leafblade Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_LeafbladeArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_TDD_WeaponAxe02",
      "name": "Organic Axe",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_OrganicAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_TDD_WeaponBow01",
      "name": "Forest Bow",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_ForestBow.png",
      "description": "Weapon Bow"
    },
    {
      "id": "item_Arthurian_ArmorMediumChest01",
      "name": "Lion Crest Hauberk",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_LionCrestHauberk.png",
      "description": "Armor Medium Chest"
    },
    {
      "id": "item_Arthurian_WeaponPolearm01",
      "name": "Heavy Poleaxe",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_HeavyPoleaxe.png",
      "description": "Weapon Polearm"
    },
    {
      "id": "item_TDD_WeaponPolearm02",
      "name": "Wicked Glaive",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_WickedGlaive.png",
      "description": "Weapon Polearm"
    },
    {
      "id": "item_Viking_WeaponStaff01",
      "name": "Primitive Staff",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_PrimitiveStaff.png",
      "description": "Weapon Staff"
    },
    {
      "id": "item_Viking_WeaponStaff02",
      "name": "Weighted Staff",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_WeightedStaff.png",
      "description": "Weapon Staff"
    },
    {
      "id": "item_Arthurian_WeaponDagger03",
      "name": "Jeweled Dagger",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_JeweledDagger.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "item_Arthurian_WeaponDagger02",
      "name": "Noble Dagger",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_NobleDagger.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "item_Arthurian_WeaponDagger01",
      "name": "Arming Dagger",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_ArmingDagger.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "siege_viking_scorpion",
      "name": "Viking Scorpion",
      "iconUrl": "${ICON_ROOT}/other_vikings_Scorpion.png",
      "description": ""
    },
    {
      "id": "item_Viking_ArmorLightChest01",
      "name": "Ragged Primal Robe",
      "iconUrl": "${ICON_ROOT}/armor_vikings_RaggedPrimalRobe.png",
      "description": "Armor Light Chest"
    },
    {
      "id": "item_Viking_WeaponDagger03",
      "name": "Heavy Dagger",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_VicousSeax.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "item_TDD_WeaponStaff01",
      "name": "Ocular Staff",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_OcularStaff.png",
      "description": "Weapon Staff"
    },
    {
      "id": "item_Viking_WeaponSword01",
      "name": "Dragonscale Sword",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_DragonscaleSword.png",
      "description": "Weapon Sword"
    },
    {
      "id": "item_Viking_WeaponSword02",
      "name": "Frozen Rune Sword",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_FrozenRuneSword.png",
      "description": "Weapon Sword"
    },
    {
      "id": "item_Viking_WeaponSword03",
      "name": "Glowing Rune Sword",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_GlowingRuneSword.png",
      "description": "Weapon Sword"
    },
    {
      "id": "item_Viking_WeaponSword04",
      "name": "Warrior's Sword",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_WarriorsSword.png",
      "description": "Weapon Sword"
    },
    {
      "id": "item_Viking_WeaponSword05",
      "name": "Heavy Ice Sword",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_HeavyIceSword.png",
      "description": "Weapon Sword"
    },
    {
      "id": "item_TDD_ArmorHeavyArm01",
      "name": "Heavy Veined Arm Harness",
      "iconUrl": "",
      "description": "Armor Heavy Arm"
    },
    {
      "id": "item_Arthurian_WeaponAxe03",
      "name": "Jeweled Axe",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_JeweledAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_TDD_WeaponGreatsword01",
      "name": "Blackened Greatsword",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_BlackenedGreatsword.png",
      "description": "Weapon Greatsword"
    },
    {
      "id": "item_Viking_PlaceholderBook01",
      "name": "Book",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_Book.png",
      "description": "Placeholder Book"
    },
    {
      "id": "item_TDD_ArmorMediumFeet01",
      "name": "Interwoven Boots",
      "iconUrl": "${ICON_ROOT}/armor_tdd_InterwovenBoots.png",
      "description": "Armor Medium Feet"
    },
    {
      "id": "item_Viking_WeaponPolearm01",
      "name": "Light Atgeir",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_LightAtgeir.png",
      "description": "Weapon Polearm"
    },
    {
      "id": "item_Viking_WeaponPolearm02",
      "name": "Heavy Atgeir",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_HeavyAtgeir.png",
      "description": "Weapon Polearm"
    },
    {
      "id": "item_Viking_WeaponPolearm03",
      "name": "Bone Atgeir",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_BoneAtgeir.png",
      "description": "Weapon Polearm"
    },
    {
      "id": "item_Viking_ArmorClothingHand01",
      "name": "Simple Glove",
      "iconUrl": "${ICON_ROOT}/armor_vikings_SimpleGlove.png",
      "description": "Armor Clothing Hand"
    },
    {
      "id": "item_Viking_ArmorMediumHand01",
      "name": "Medium Bone Reinforced Glove",
      "iconUrl": "${ICON_ROOT}/armor_vikings_MediumBoneReinforcedGlove.png",
      "description": "Armor Medium Hand"
    },
    {
      "id": "item_Arthurian_ArmorHeavyLowerLegs01",
      "name": "Heavy Plate Leg Harness",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_HeavyPlateLegHarness.png",
      "description": "Armor Heavy Lower Legs"
    },
    {
      "id": "item_Viking_ArmorMediumChest01",
      "name": "Medium Bone Reinforced Breastplate",
      "iconUrl": "${ICON_ROOT}/armor_vikings_MediumBoneReinforcedBreastplate.png",
      "description": "Armor Medium Chest"
    },
    {
      "id": "item_Viking_ArmorClothingChest01",
      "name": "Simple Tunic",
      "iconUrl": "${ICON_ROOT}/armor_vikings_SimpleTunic.png",
      "description": "Armor Clothing Chest"
    },
    {
      "id": "item_Arthurian_ArmorClothingFeet01",
      "name": "Simple Shoes",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_SimpleShoes.png",
      "description": "Armor Clothing Feet"
    },
    {
      "id": "item_TDD_WeaponStaff02",
      "name": "Stone Staff",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_StoneStaff.png",
      "description": "Weapon Staff"
    },
    {
      "id": "item_TDD_ArmorHeavyArm02",
      "name": "Heavy Fall Court Arm Harness",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyFallCourtArmHarness.png",
      "description": "Armor Heavy Arm"
    },
    {
      "id": "item_TDD_ArmorHeavyHand01",
      "name": "Heavy Veined Gauntlet",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyVeinedGauntlet.png",
      "description": "Armor Heavy Hand"
    },
    {
      "id": "item_TDD_ArmorHeavyHand02",
      "name": "Heavy Fall Court Gauntlet",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyFallCourtGauntlet.png",
      "description": "Armor Heavy Hand"
    },
    {
      "id": "item_TDD_ArmorHeavyShoulder02",
      "name": "Heavy Fall Court  Pauldron",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyFallCourtPauldron.png",
      "description": "Armor Heavy Shoulder"
    },
    {
      "id": "item_TDD_ArmorHeavyShoulder01",
      "name": "Heavy Veined Pauldron",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyVeinedPauldron.png",
      "description": "Armor Heavy Shoulder"
    },
    {
      "id": "item_Arthurian_WeaponSpear02",
      "name": "Noble Spear",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_NobleSpear.png",
      "description": "Weapon Spear"
    },
    {
      "id": "item_Viking_ArmorClothingChest02",
      "name": "Battle Tunic",
      "iconUrl": "",
      "description": "Armor Clothing Chest"
    },
    {
      "id": "item_TDD_ArmorMediumShoulder01",
      "name": "Medium Layered Pauldron",
      "iconUrl": "${ICON_ROOT}/armor_tdd_MediumLayeredPauldron.png",
      "description": "Armor Medium Shoulder"
    },
    {
      "id": "item_Viking_ArmorHeavyChest01",
      "name": "Heavy Lamellar Hauberk",
      "iconUrl": "${ICON_ROOT}/armor_vikings_HeavyLamellarHauberk.png",
      "description": "Armor Heavy Chest"
    },
    {
      "id": "item_Viking_ArmorLightShoulder01",
      "name": "Fur Shawl",
      "iconUrl": "${ICON_ROOT}/armor_vikings_FurShawl.png",
      "description": "Armor Light Shoulder"
    },
    {
      "id": "item_TDD_WeaponMace02",
      "name": "Angled Mace",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_AngledMace.png",
      "description": "Weapon Mace"
    },
    {
      "id": "item_TDD_WeaponMace03",
      "name": "Wicked Mace",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_WickedMace.png",
      "description": "Weapon Mace"
    },
    {
      "id": "item_TDD_WeaponMace01",
      "name": "Briar Mace",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_BriarMace.png",
      "description": "Weapon Mace"
    },
    {
      "id": "item_Arthurian_MunitionArrow04",
      "name": "Blunt Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_BluntArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_TDD_MunitionArrow01",
      "name": "Basic Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_BasicArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "siege_arthurian_scorpion",
      "name": "Arthurian Scorpion",
      "iconUrl": "${ICON_ROOT}/other_arthurian_Scorpion.png",
      "description": ""
    },
    {
      "id": "item_Arthurian_WeaponShield02",
      "name": "Lion Crested Kite Shield",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_LionCrestedKiteShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_Arthurian_WeaponShield03",
      "name": "War Pavise",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_WarPavise.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_Arthurian_WeaponShield01",
      "name": "Heavy Kite Shield",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_HeavyKiteShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_Arthurian_WeaponSpear01",
      "name": "War Spear",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_WarSpear.png",
      "description": "Weapon Spear"
    },
    {
      "id": "item_TDD_ArmorLightFeet01",
      "name": "Light Layered Boots",
      "iconUrl": "${ICON_ROOT}/armor_tdd_LightLayeredBoots.png",
      "description": "Armor Light Feet"
    },
    {
      "id": "item_Arthurian_ArmorLightForearm01",
      "name": "Runic Scroll Sleeve",
      "iconUrl": "",
      "description": "Armor Light Forearm"
    },
    {
      "id": "item_Arthurian_WeaponLongsword01",
      "name": "Soldier's Longsword",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_SoldiersLongsword.png",
      "description": "Weapon Longsword"
    },
    {
      "id": "item_TDD_ArmorMediumUpperLegs01",
      "name": "Scaled Breeches",
      "iconUrl": "${ICON_ROOT}/armor_tdd_ScaledBreeches.png",
      "description": "Armor Medium Upper Legs"
    },
    {
      "id": "item_TDD_ArmorHeavyUpperLegs02",
      "name": "Heavy Fall Court Cuisses",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyFallCourtCuisses.png",
      "description": "Armor Heavy Upper Legs"
    },
    {
      "id": "item_TDD_WeaponSword05",
      "name": "fairy sword",
      "iconUrl": "",
      "description": "Weapon Sword"
    },
    {
      "id": "item_TDD_ArmorMediumForearm01",
      "name": "Interwoven Vambrace",
      "iconUrl": "${ICON_ROOT}/armor_tdd_InterwovenVambrace.png",
      "description": "Armor Medium Forearm"
    },
    {
      "id": "item_TDD_ArmorLightChest01",
      "name": "Astral Robe",
      "iconUrl": "${ICON_ROOT}/armor_tdd_AstralRobe.png",
      "description": "Armor Light Chest"
    },
    {
      "id": "item_Viking_ArmorMediumShoulder01",
      "name": "Skull Bound Spaulder",
      "iconUrl": "${ICON_ROOT}/armor_vikings_SkullBoundSpaulder.png",
      "description": "Armor Medium Shoulder"
    },
    {
      "id": "item_Viking_ArmorHeavyLowerLegs01",
      "name": "Heavy Piecemeal Leg Harness",
      "iconUrl": "${ICON_ROOT}/armor_vikings_HeavyPiecemealLegHarness.png",
      "description": "Armor Heavy Lower Legs"
    },
    {
      "id": "item_Arthurian_MunitionArrow01",
      "name": "Barbed Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_BarbedArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_TDD_MunitionArrow04",
      "name": "Notched Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_NotchedArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_TDD_WeaponAxe05",
      "name": "Valentine Axe",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_ValentineAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_Viking_ArmorHeavyHead01",
      "name": "Heavy Ocular Helmet",
      "iconUrl": "${ICON_ROOT}/armor_vikings_HeavyOcularHelmet.png",
      "description": "Armor Heavy Head"
    },
    {
      "id": "item_Arthurian_ArmorMediumFeet01",
      "name": "Reinforced Boots",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_ReinforcedBoots.png",
      "description": "Armor Medium Feet"
    },
    {
      "id": "item_Arthurian_PlaceholderBook01",
      "name": "Book",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_Book.png",
      "description": "Placeholder Book"
    },
    {
      "id": "item_Arthurian_ArmorMediumLowerLegs01",
      "name": "Lion Crest Greaves",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_LionCrestGreaves.png",
      "description": "Armor Medium Lower Legs"
    },
    {
      "id": "item_Viking_WeaponShield02",
      "name": "Sturdy Long Shield",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_SturdyLongShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_Viking_ArmorHeavyArm01",
      "name": "Heavy Piecemeal Arm Harness",
      "iconUrl": "${ICON_ROOT}/armor_vikings_HeavyPiecemealArmHarness.png",
      "description": "Armor Heavy Arm"
    },
    {
      "id": "item_Viking_WeaponBow01",
      "name": "Heavy Shortbow",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_HeavyGreataxe.png",
      "description": "Weapon Bow"
    },
    {
      "id": "item_Viking_WeaponDagger02",
      "name": "Runed Dagger",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_HeavyShortbow.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "item_TDD_WeaponSpear03",
      "name": "Horned Spear",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_HornedSpear.png",
      "description": "Weapon Spear"
    },
    {
      "id": "item_Viking_ArmorHeavyHand01",
      "name": "Heavy Plated Gauntlet",
      "iconUrl": "${ICON_ROOT}/armor_vikings_HeavyPlatedGauntlet.png",
      "description": "Armor Heavy Hand"
    },
    {
      "id": "item_Viking_WeaponGreataxe01",
      "name": "Heavy Greataxe",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_RunedDagger.png",
      "description": "Weapon Greataxe"
    },
    {
      "id": "item_Viking_ArmorMediumHead01",
      "name": "Banded Spangenhelm",
      "iconUrl": "${ICON_ROOT}/armor_vikings_BandedSpangenhelm.png",
      "description": "Armor Medium Head"
    },
    {
      "id": "item_TDD_ArmorHeavyChest02",
      "name": "Heavy Fall Court Breastplate",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyFallCourtBreastplate.png",
      "description": "Armor Heavy Chest"
    },
    {
      "id": "item_Arthurian_MunitionVial02",
      "name": "Elixir Vial",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_ElixirVial.png",
      "description": "Munition Vial"
    },
    {
      "id": "item_Arthurian_MunitionVial01",
      "name": "Potion Vial",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_Potion.png",
      "description": "Munition Vial"
    },
    {
      "id": "item_Arthurian_ArmorLightHead01",
      "name": "Padded Hood",
      "iconUrl": "",
      "description": "Armor Light Head"
    },
    {
      "id": "item_Arthurian_WeaponSword02",
      "name": "Glorious War Sword of the Renowned Hero",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_GloriousWarSwordoftheRenownedHero.png",
      "description": "Weapon Sword"
    },
    {
      "id": "item_Viking_ArmorMediumLowerLegs01",
      "name": "Skull Bound Greaves",
      "iconUrl": "${ICON_ROOT}/armor_vikings_SkullBoundGreaves.png",
      "description": "Armor Medium Lower Legs"
    },
    {
      "id": "item_TDD_WeaponSword03",
      "name": "Undergrowth Sword",
      "iconUrl": "",
      "description": "Weapon Sword"
    },
    {
      "id": "item_Viking_WeaponShield01",
      "name": "Sturdy Round Shield",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_SturdyRoundShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_Viking_ArmorMediumUpperLegs01",
      "name": "Bone Leg Harness",
      "iconUrl": "${ICON_ROOT}/armor_vikings_BoneLegHarness.png",
      "description": "Armor Medium Upper Legs"
    },
    {
      "id": "item_Arthurian_PlaceholderHorn01",
      "name": "Horn",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_Horn.png",
      "description": "Placeholder Horn"
    },
    {
      "id": "item_Arthurian_WeaponGreatsword01",
      "name": "Soldier's Greatsword",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_SoldiersGreatsword.png",
      "description": "Weapon Greatsword"
    },
    {
      "id": "item_Arthurian_WeaponGreatsword02",
      "name": "Noble Greatsword",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_NobleGreatsword.png",
      "description": "Weapon Greatsword"
    },
    {
      "id": "item_Arthurian_ArmorHeavyFeet01",
      "name": "Heavy Plate Sabatons",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_HeavyPlateSabatons.png",
      "description": "Armor Heavy Feet"
    },
    {
      "id": "item_Viking_WeaponSpear01",
      "name": "Vicious War Fork",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_ViciousWarFork.png",
      "description": "Weapon Spear"
    },
    {
      "id": "item_Viking_WeaponSpear02",
      "name": "Balanced War Fork",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_BalancedWarFork.png",
      "description": "Weapon Spear"
    },
    {
      "id": "item_Viking_WeaponSpear03",
      "name": "Light War Fork",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_LightWarFork.png",
      "description": "Weapon Spear"
    },
    {
      "id": "item_Viking_ArmorHeavyFeet01",
      "name": "Heavy Plated Boots",
      "iconUrl": "${ICON_ROOT}/armor_vikings_HeavyPlatedBoots.png",
      "description": "Armor Heavy Feet"
    },
    {
      "id": "item_Arthurian_ArmorMediumHead01",
      "name": "Reinforced Skullcap",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_ReinforcedSkullcap.png",
      "description": "Armor Medium Head"
    },
    {
      "id": "item_Arthurian_MunitionArrow06",
      "name": "Flight Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_FlightArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_TDD_PlaceholderBook01",
      "name": "Book",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_Book.png",
      "description": "Placeholder Book"
    },
    {
      "id": "item_TDD_ArmorClothingFeet01",
      "name": "Simple Shoes",
      "iconUrl": "${ICON_ROOT}/armor_tdd_SimpleShoes.png",
      "description": "Armor Clothing Feet"
    },
    {
      "id": "item_Arthurian_ArmorLightFeet01",
      "name": "Mystic Tooled Boots",
      "iconUrl": "",
      "description": "Armor Light Feet"
    },
    {
      "id": "item_TDD_WeaponDagger02",
      "name": "Horned Dagger",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_HornedDagger.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "item_TDD_WeaponDagger03",
      "name": "Vined Dirk",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_VinedDirk.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "item_TDD_WeaponDagger01",
      "name": "Light Dirk",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_LightDirk.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "item_Arthurian_WeaponSword01",
      "name": "Battle Sword",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_BattleSword.png",
      "description": "Weapon Sword"
    },
    {
      "id": "item_Viking_WeaponAxe01",
      "name": "Bearded Axe",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_BeardedAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_Viking_WeaponAxe02",
      "name": "Broad Axe",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_BroadAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_Viking_WeaponAxe03",
      "name": "Gilded Double-Axe",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_GildedDouble-Axe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_Viking_WeaponShield04",
      "name": "Light Long Shield",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_LightLongShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_Arthurian_ArmorMediumUpperLegs01",
      "name": "Lion Crest Leg Harness",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_LionCrestLegHarness.png",
      "description": "Armor Medium Upper Legs"
    },
    {
      "id": "item_Arthurian_ArmorMediumHand01",
      "name": "Reinforced Glove",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_ReinforcedGlove.png",
      "description": "Armor Medium Hand"
    },
    {
      "id": "item_Viking_ArmorLightHand01",
      "name": "Light Woven Glove",
      "iconUrl": "${ICON_ROOT}/armor_vikings_LightWovenGlove.png",
      "description": "Armor Light Hand"
    },
    {
      "id": "item_Arthurian_MunitionArrow03",
      "name": "Black Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_BlackArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_TDD_MunitionArrow02",
      "name": "Crescent Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_CrescentArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_TDD_WeaponAxe03",
      "name": "Mossy Axe",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_MossyAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_TDD_WeaponSword04",
      "name": "Blackened Sword",
      "iconUrl": "",
      "description": "Weapon Sword"
    },
    {
      "id": "item_TDD_ArmorLightShoulder01",
      "name": "Astral Shawl",
      "iconUrl": "${ICON_ROOT}/armor_tdd_AstralShawl.png",
      "description": "Armor Light Shoulder"
    },
    {
      "id": "item_TDD_WeaponGreatmace01",
      "name": "Wicked Greatmace",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_WickedGreatmace.png",
      "description": "Weapon Greatmace"
    },
    {
      "id": "item_Arthurian_WeaponMace05",
      "name": "Heavy Spiked Mace",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_HeavySpikedMace.png",
      "description": "Weapon Mace"
    },
    {
      "id": "item_Arthurian_WeaponMace04",
      "name": "Flanged War Mace",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_FlangedWarMace.png",
      "description": "Weapon Mace"
    },
    {
      "id": "item_Arthurian_WeaponMace03",
      "name": "Light Flanged Mace",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_LightFlangedMace.png",
      "description": "Weapon Mace"
    },
    {
      "id": "item_Arthurian_WeaponMace02",
      "name": "Spiked Mace",
      "iconUrl": "",
      "description": "Weapon Mace"
    },
    {
      "id": "item_Arthurian_WeaponMace01",
      "name": "Heavy Flanged Mace",
      "iconUrl": "",
      "description": "Weapon Mace"
    },
    {
      "id": "item_Arthurian_ArmorHeavyShoulder01",
      "name": "Heavy Plate Pauldron",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_HeavyPlatePauldron.png",
      "description": "Armor Heavy Shoulder"
    },
    {
      "id": "item_Arthurian_WeaponBow01",
      "name": "Classic Longbow",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_ClassicLongbow.png",
      "description": "Weapon Bow"
    },
    {
      "id": "item_TDD_WeaponSpear01",
      "name": "Light Spear",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_LightSpear.png",
      "description": "Weapon Spear"
    },
    {
      "id": "item_Arthurian_WeaponAxe02",
      "name": "Patterned Axe",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_PatternedAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_TDD_ArmorLightForearm01",
      "name": "Light Woven Sleeve",
      "iconUrl": "${ICON_ROOT}/armor_tdd_LightWovenSleeve.png",
      "description": "Armor Light Forearm"
    },
    {
      "id": "item_Arthurian_ArmorClothingChest01",
      "name": "Simple Tunic",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_SimpleTunic.png",
      "description": "Armor Clothing Chest"
    },
    {
      "id": "item_Arthurian_ArmorClothingChest02",
      "name": "Fancy Tunic",
      "iconUrl": "",
      "description": "Armor Clothing Chest"
    },
    {
      "id": "item_TDD_MunitionArrow05",
      "name": "Serrated Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_SerratedArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_Arthurian_ArmorHeavyChest01",
      "name": "Heavy Plate Breastplate",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_HeavyPlateBreastplate.png",
      "description": "Armor Heavy Chest"
    },
    {
      "id": "item_TDD_WeaponAxe04",
      "name": "Horned Axe",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_HornedAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_TDD_ArmorClothingChest01",
      "name": "Simple Tunic",
      "iconUrl": "${ICON_ROOT}/armor_tdd_SimpleTunic.png",
      "description": "Armor Clothing Chest"
    },
    {
      "id": "item_TDD_ArmorClothingChest02",
      "name": "Dark Tunic",
      "iconUrl": "",
      "description": "Armor Clothing Chest"
    },
    {
      "id": "item_Arthurian_ArmorLightShoudler01",
      "name": "Pleated Epaulet",
      "iconUrl": "",
      "description": "Armor Light Shoudler"
    },
    {
      "id": "item_TDD_ArmorClothingHand01",
      "name": "Simple Glove",
      "iconUrl": "${ICON_ROOT}/armor_tdd_SimpleGlove.png",
      "description": "Armor Clothing Hand"
    },
    {
      "id": "item_Arthurian_ArmorHeavyHead01",
      "name": "Heavy Plate Helm",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_HeavyPlateHelm.png",
      "description": "Armor Heavy Head"
    },
    {
      "id": "item_TDD_WeaponSword01",
      "name": "Organic Sword",
      "iconUrl": "",
      "description": "Weapon Sword"
    },
    {
      "id": "item_Viking_WeaponShield03",
      "name": "Light Round Shield",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_LightRoundShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_TDD_ArmorHeavyFeet01",
      "name": "Heavy Ridgid Sabatons",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyRidgidSabatons.png",
      "description": "Armor Heavy Feet"
    },
    {
      "id": "item_TDD_ArmorHeavyFeet02",
      "name": "Heavy Fall Court Sabatons",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyFallCourtSabatons.png",
      "description": "Armor Heavy Feet"
    },
    {
      "id": "item_Viking_ArmorLightLowerLegs01",
      "name": "Light Wrapped Leggings",
      "iconUrl": "${ICON_ROOT}/armor_vikings_LightWrappedLeggings.png",
      "description": "Armor Light Lower Legs"
    },
    {
      "id": "item_Arthurian_ArmorLightHand01",
      "name": "Mystic Tooled Glove",
      "iconUrl": "",
      "description": "Armor Light Hand"
    },
    {
      "id": "item_Viking_WeaponDagger01",
      "name": "Vicous Seax",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_CleavingGreataxe.png",
      "description": "Weapon Dagger"
    },
    {
      "id": "item_TDD_WeaponSpear02",
      "name": "Leaf Spear",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_LeafSpear.png",
      "description": "Weapon Spear"
    },
    {
      "id": "item_Arthurian_WeaponAxe01",
      "name": "Heavy War Axe",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_HeavyWarAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_TDD_WeaponShield03",
      "name": "Knot Crested Shield",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_KnotCrestedShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_TDD_WeaponShield02",
      "name": "Forest Guardian Shield",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_ForestGuardianShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_TDD_WeaponShield01",
      "name": "Tapered Shield",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_TaperedShield.png",
      "description": "Weapon Shield"
    },
    {
      "id": "item_Arthurian_ArmorLightChest01",
      "name": "Pleated Robe",
      "iconUrl": "",
      "description": "Armor Light Chest"
    },
    {
      "id": "item_Viking_ArmorLightForearm01",
      "name": "Light Wrapped Sleeve",
      "iconUrl": "${ICON_ROOT}/armor_vikings_LightWrappedSleeve.png",
      "description": "Armor Light Forearm"
    },
    {
      "id": "item_Viking_WeaponGreataxe02",
      "name": "Cleaving Greataxe",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_HeavyDagger.png",
      "description": "Weapon Greataxe"
    },
    {
      "id": "item_Factionless_ClothingCloak01",
      "name": "Basic Cloak",
      "iconUrl": "${ICON_ROOT}/other_arthurian_BasicCloak.png",
      "description": "Clothing Cloak"
    },
    {
      "id": "item_Viking_ArmorLightFeet01",
      "name": "Light Fortified Boots",
      "iconUrl": "${ICON_ROOT}/armor_vikings_LightFortifiedBoots.png",
      "description": "Armor Light Feet"
    },
    {
      "id": "item_Arthurian_WeaponStaff02",
      "name": "Battle Staff",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_BattleStaff.png",
      "description": "Weapon Staff"
    },
    {
      "id": "siege_tdd_scorpion",
      "name": "TDD Scorpion",
      "iconUrl": "${ICON_ROOT}/other_tdd_Scorpion.png",
      "description": ""
    },
    {
      "id": "item_Arthurian_ArmorHeavyArm01",
      "name": "Heavy Plate Arm Harness",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_HeavyPlateArmHarness.png",
      "description": "Armor Heavy Arm"
    },
    {
      "id": "item_TDD_ArmorClothingLegs01",
      "name": "Simple Breeches",
      "iconUrl": "${ICON_ROOT}/armor_tdd_SimpleBreeches.png",
      "description": "Armor Clothing Legs"
    },
    {
      "id": "item_Factionless_BasicTorch01",
      "name": "Torch",
      "iconUrl": "${ICON_ROOT}/other_Torch.png",
      "description": "Basic Torch"
    },
    {
      "id": "item_TDD_ArmorHeavyChest01",
      "name": "Heavy Layered Breastplate",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyLayeredBreastplate.png",
      "description": "Armor Heavy Chest"
    },
    {
      "id": "item_Arthurian_ArmorClothingLegs01",
      "name": "Simple Breeches",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_SimpleBreeches.png",
      "description": "Armor Clothing Legs"
    },
    {
      "id": "item_Arthurian_WeaponSword03",
      "name": "Elaborate Ornamental Sword of Intricity",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_ElaborateOrnamentalSwordofIntricity.png",
      "description": "Weapon Sword"
    },
    {
      "id": "item_TDD_ArmorMediumChest01",
      "name": "Medium Veined Breastplate",
      "iconUrl": "${ICON_ROOT}/armor_tdd_MediumVeinedBreastplate.png",
      "description": "Armor Medium Chest"
    },
    {
      "id": "item_Viking_WeaponGreathammer01",
      "name": "Heavy Greathammer",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_HeavyGreathammer.png",
      "description": "Weapon Greathammer"
    },
    {
      "id": "item_TDD_ArmorHeavyLowerLegs02",
      "name": "Heavy Fall Court  Greaves",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyFallCourtGreaves.png",
      "description": "Armor Heavy Lower Legs"
    },
    {
      "id": "item_TDD_WeaponSword02",
      "name": "Dire Sword",
      "iconUrl": "",
      "description": "Weapon Sword"
    },
    {
      "id": "item_TDD_ArmorMediumHand01",
      "name": "Medium Layered Glove",
      "iconUrl": "${ICON_ROOT}/armor_tdd_MediumLayeredGlove.png",
      "description": "Armor Medium Hand"
    },
    {
      "id": "item_TDD_ArmorHeavyHead01",
      "name": "Heavy Layered Barbute",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyLayeredBarbute.png",
      "description": "Armor Heavy Head"
    },
    {
      "id": "item_TDD_ArmorHeavyHead02",
      "name": "Heavy Fall Court  Barbute",
      "iconUrl": "${ICON_ROOT}/armor_tdd_HeavyFallCourtBarbute.png",
      "description": "Armor Heavy Head"
    },
    {
      "id": "item_Viking_ArmorHeavyShoulder01",
      "name": "Heavy Mail Pauldron",
      "iconUrl": "${ICON_ROOT}/armor_vikings_HeavyMailPauldron.png",
      "description": "Armor Heavy Shoulder"
    },
    {
      "id": "item_TDD_ArmorLightHand01",
      "name": "Light Woven Glove",
      "iconUrl": "${ICON_ROOT}/armor_tdd_LightWovenGlove.png",
      "description": "Armor Light Hand"
    },
    {
      "id": "item_Viking_MunitionArrow05",
      "name": "Light Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_LightArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_Viking_MunitionArrow04",
      "name": "Heavy War Arrorw",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_HeavyWarArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_Viking_MunitionArrow01",
      "name": "Basic Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_BasicArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_Viking_MunitionArrow03",
      "name": "Forked Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_ForkedArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_Viking_MunitionArrow02",
      "name": "Dart Point Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_vikings_DartPointArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_Arthurian_MunitionArrow05",
      "name": "Broadhead Arrow",
      "iconUrl": "${ICON_ROOT}/weapon_arthurian_BroadheadArrow.png",
      "description": "Munition Arrow"
    },
    {
      "id": "item_Viking_ArmorClothingLegs01",
      "name": "Simple Breeches",
      "iconUrl": "${ICON_ROOT}/armor_vikings_SimpleBreeches.png",
      "description": "Armor Clothing Legs"
    },
    {
      "id": "item_TDD_WeaponAxe01",
      "name": "Forest Axe",
      "iconUrl": "${ICON_ROOT}/weapon_tdd_ForestAxe.png",
      "description": "Weapon Axe"
    },
    {
      "id": "item_Viking_ArmorClothingFeet01",
      "name": "Simple Shoes",
      "iconUrl": "${ICON_ROOT}/armor_vikings_SimpleShoes.png",
      "description": "Armor Clothing Feet"
    },
    {
      "id": "item_Arthurian_ArmorMediumShoulder01",
      "name": "Reinforced Spaulder",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_ReinforcedSpaulder.png",
      "description": "Armor Medium Shoulder"
    },
    {
      "id": "item_Arthurian_ArmorClothingHand01",
      "name": "Simple Glove",
      "iconUrl": "${ICON_ROOT}/armor_arthurian_SimpleGlove.png",
      "description": "Armor Clothing Hand"
    }
  ]
}`);
