/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import gql from 'graphql-tag';
import { CUQuery, CUSubscription } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Pick2 } from '@csegames/library/dist/_baseGame/utils/objectUtils';

// Specify the subset of keys from CUQuery that we are interested in.
export type GameDefsQueryResult = Pick2<
  CUQuery,
  'game',
  | 'abilityNetworks'
  | 'damageTypes'
  | 'entityResources'
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
  | 'manifests'
>;
export type MyCharacterAbilitiesQueryResult = Pick2<CUQuery, 'myCharacter', 'abilities'>;
export type MyCharacterStatsQueryResult = Pick2<CUQuery, 'myCharacter', 'stats'>;
export type ManifestUpdateSubscriptionResult = Pick<CUSubscription, 'manifestUpdates'>;

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

      manifests {
        id
        schemaVersion
        contents
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
        isDeployable
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

export const manifestUpdateSubscription = gql`
  subscription ManifestUpdateSubscription {
    manifestUpdates {
      manifests {
        id
        schemaVersion
        contents
      }
    }
  }
`;
