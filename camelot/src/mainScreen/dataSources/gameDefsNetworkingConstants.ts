/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import gql from 'graphql-tag';
import { CUQuery } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Pick2 } from '@csegames/library/dist/_baseGame/utils/objectUtils';

// Specify the subset of keys from CUQuery that we are interested in.
export type GameDefsQueryResult = Pick2<
  CUQuery,
  'game',
  | 'abilityNetworks'
  | 'damageTypes'
  | 'entityResources'
  | 'factions'
  | 'gearSlots'
  | 'items'
  | 'itemStats'
  | 'itemTooltipCategories'
  | 'settings'
  | 'stats'
  | 'races'
  | 'classes'
  | 'genders'
  | 'abilityComponents'
>;
export type StatusesQueryResult = Pick2<CUQuery, 'status', 'statuses'>;
export type MyCharacterAbilitiesQueryResult = Pick2<CUQuery, 'myCharacter', 'abilities'>;
export type MyCharacterStatsQueryResult = Pick2<CUQuery, 'myCharacter', 'stats'>;

export const gameDefsQuery = gql`
  query GameDefsStaticDataQuery {
    game {
      abilityNetworks {
        componentCategories {
          displayInfo {
            description
            iconClass
            iconURL
            name
          }
          displayOption
          id
          isPrimary
          isRequired
        }
        display {
          description
          iconClass
          iconURL
          name
        }
        id
      }

      factions {
        description
        hueRotation
        id
        name
      }

      gearSlots {
        gearSlotType
        iconClass
        id
        name
        numericID
      }

      items {
        defaultResourceID
        deploySettings {
          controlRequirements
          isDoor
          itemPlacementType
          itemTemplateType
          mapIconClass
          maxPitch
          maxTerrainPitch
          plotSize
          requiredZoneType
          resourceID
          rotatePitch
          rotateRoll
          rotateYaw
          skipDeployLimitCheck
          snapToGround
        }
        description
        equipRequirements
        gearSlotSets {
          gearSlots
        }
        iconUrl
        id
        isStackableItem
        itemType
        name
        numericItemDefID
        #TODO: We want to strip these down to an ID as well, probably, but we'd need to re-add "game.substances" to the query.
        substanceDefinition {
          id
          maxQuality
          minQuality
          #As defined, this is a full ItemDefRef, but that would be recursive, so we just grab the id and look it up at runtime.
          purifyItemDef {
            id
          }
        }
        tags
      }

      entityResources {
        id
        name
        numericID
        tooltipTextColor
        unitFrameDisplay
        unitFrameSortOrder
      }

      itemStats {
        category
        description
        displayPrecision
        displayType
        iconClass
        id
        name
        numericID
        unitDescription
      }

      settings {
        abilityDescriptionMaxLength
        abilityNameMaxLength
        abilityNameMinLength
        itemLowQualityThreshold
        maxCharacterNameLength
        minCharacterNameLength
        startingAttributePoints
        traitsMaxPoints
        traitsMinPoints
        woundStatusTag
      }

      stats {
        addPointsAtCharacterCreation
        description
        id
        itemRequirementStat
        name
        operation
        showAtCharacterCreation
        statType
      }

      itemTooltipCategories {
        id
        name
        sortOrder
      }

      damageTypes {
        id
        numericID
        name
        iconClass
      }

      abilityComponents {
        abilityComponentCategory {
          displayInfo {
            description
            iconClass
            iconURL
            name
          }
          displayOption
          id
          isPrimary
          isRequired
        }
        abilityTags
        display {
          description
          iconClass
          iconURL
          name
        }
        id
        abilityBarKind
        networkRequirements {
          excludeComponent {
            component {
              #As defined, this is a full AbilityComponentDefRef, but game.abilityComponents already has the full list, so we just keep an id to look up at runtime.
              id
            }
          }
          excludeTag {
            tag
          }
          requireComponent {
            component {
              #As defined, this is a full AbilityComponentDefRef, but game.abilityComponents already has the full list, so we just keep an id to look up at runtime.
              id
            }
          }
          requireTag {
            tag
          }
        }
      }

      classes {
        numericID
        buildableAbilityNetworks
        factionID
        id
        name
      }

      races {
        buildableAbilityNetworks
        description
        factionID
        id
        name
        numericID
        raceTags
      }

      genders {
        id
        numericID
        name
      }
    }
  }
`;

export const statusesQuery = gql`
  query StatusesStaticDataQuery {
    status {
      statuses {
        blocksAbilities
        description
        iconClass
        iconURL
        id
        name
        numericID
        statusTags
        stacking {
          group
          removalOrder
        }
        uIText
        uIVisibility
      }
    }
  }
`;

export const myCharacterAbilitiesQuery = gql`
  query MyCharacterAbilitiesQuery {
    myCharacter {
      abilities {
        description
        icon
        id
        name
        readOnly
        abilityComponents {
          #As defined, this is a full AbilityComponentDefRef, but game.abilityComponents already has the full list, so we just keep an id to look up at runtime.
          id
        }
        abilityNetwork {
          #As defined, this is a full AbilityNetworkDef, but game.abilityNetworks already has the full list, so we just keep an id to look up at runtime.
          id
        }
      }
    }
  }
`;

export const myCharacterStatsQuery = gql`
  query MyCharacterStatsQuery {
    myCharacter {
      stats {
        stat
        value
        description
      }
    }
  }
`;
