import gql from 'graphql-tag';

export const groupMemberFragment = gql`
  fragment GroupMember on GroupMemberState {
    entityID
    type
    warbandID
    characterID
    faction
    name
    isAlive
    race
    gender
    classID
    statuses {
      id
      iconURL
      description
      name
    }
    health {
      current
      max
      wounds
    }
    stamina {
      current
      max
    }
    blood {
      current
      max
    }
    position {
      x
      y
      z
    }
    isLeader
    canKick
    rankLevel
  }
`;

const containerColorFragment = gql`
  fragment ContainerColor on ColorRGBA {
    r
    g
    b
    a
    rgba
    hex
    hexa
  }
`;

const itemLocationFragment = gql`
  fragment ItemLocation on ItemLocationDescription {
    inContainer {
      position
    }
    inventory {
      characterID
      position
    }
    equipped {
      characterID
      gearSlots {
        id
      }
    }
    inVox {
      voxInstanceID
      voxJobInstanceID
    }
  }
`;

const itemActionsFragment = gql`
  fragment ItemActions on ItemActionDefGQL {
    id
    name
    cooldownSeconds
    enabled
    lastTimePerformed
    uIReaction
    showWhenDisabled
  }
`;

const gearSlotDefRefFragment = gql`
  fragment GearSlotDefRef on GearSlotDefRef {
    id
  }
`;

const itemDefRefFragment = gql`
  fragment ItemDefRef on ItemDefRef {
    id
    description
    name
    iconUrl
    itemType
    defaultResourceID
    numericItemDefID
    isStackableItem
    tags
    equipRequirements
    deploySettings {
      resourceID
      controlRequirements
      isDoor
      snapToGround
      rotateYaw
      rotatePitch
      rotateRoll
    }
    gearSlotSets {
      gearSlots {
        ...GearSlotDefRef
      }
    }
    substanceDefinition {
      id
      minQuality
      maxQuality
    }
  }
  ${gearSlotDefRefFragment}
`;

const requirementsFragment = gql`
  fragment Requirements on RequirementDefRef {
    description
    icon
  }
`;

const permissibleHolderFragment = gql`
  fragment PermissibleHolder on FlagsPermissibleHolderGQL {
    userPermissions
    userGrants {
      permissions
      target {
        targetType
        description
      }
    }
    permissibleSets {
      keyType
      isActive
      permissibles {
        permissions
        target {
          targetType
          description
        }
      }
    }
  }
`;

const containerStatsFragment = gql`
  fragment ContainerStats on ContainerDefStat_Single {
    maxItemCount
    maxItemMass
  }
`;

const containedItemsFragment = gql`
  fragment ContainedItems on Item {
    id
    givenName
    stackHash
    containerColor {
      ...ContainerColor
    }
    location {
      ...ItemLocation
    }
    actions {
      ...ItemActions
    }
    resourceList {
      currentValue
      id
      maxValue
    }
    statList {
      statID
      value
    }
    staticDefinition {
      ...ItemDefRef
    }
    permissibleHolder {
      ...PermissibleHolder
    }
    containerDrawers {
      id
      requirements {
        ...Requirements
      }
      stats {
        ...ContainerStats
      }
      containedItems {
        id
        givenName
        stackHash
        containerColor {
          ...ContainerColor
        }
        actions {
          ...ItemActions
        }
        location {
          ...ItemLocation
        }
        resourceList {
          currentValue
          id
          maxValue
        }
        statList {
          statID
          value
        }
        staticDefinition {
          ...ItemDefRef
        }
        permissibleHolder {
          ...PermissibleHolder
        }
      }
    }
  }
  ${containerColorFragment}
  ${itemLocationFragment}
  ${itemActionsFragment}
  ${itemDefRefFragment}
  ${permissibleHolderFragment}
  ${requirementsFragment}
  ${containerStatsFragment}
`;

const containerDrawersFragment = gql`
  fragment ContainerDrawers on ContainerDrawerGQL {
    id
    requirements {
      ...Requirements
    }
    containedItems {
      ...ContainedItems
    }
    stats {
      ...ContainerStats
    }
  }
  ${requirementsFragment}
  ${containedItemsFragment}
  ${containerStatsFragment}
`;

export const inventoryItemFragment = gql`
  fragment InventoryItem on Item {
    id
    givenName
    stackHash
    hasSubItems
    containerColor {
      ...ContainerColor
    }
    location {
      ...ItemLocation
    }
    actions {
      ...ItemActions
    }
    resourceList {
      currentValue
      id
      maxValue
    }
    scenarioRelationship {
      restrictedToScenario
      scenarioID
    }
    statList {
      statID
      value
    }
    staticDefinition {
      ...ItemDefRef
    }
    containerDrawers {
      ...ContainerDrawers
    }
    permissibleHolder {
      ...PermissibleHolder
    }
  }
  ${containerColorFragment}
  ${itemLocationFragment}
  ${itemActionsFragment}
  ${itemDefRefFragment}
  ${containerDrawersFragment}
  ${permissibleHolderFragment}
`;
