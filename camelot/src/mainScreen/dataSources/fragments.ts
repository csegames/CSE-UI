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
    resources {
      id
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
      gearSlotSetIndex
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
    isDeployable
    gearSlotSets {
      gearSlots
    }
  }
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

const containedItemsFragment = gql`
  fragment ContainedItems on Item {
    id
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
      requirements {
        ...Requirements
      }
      maxItemPositions
      containedItems {
        id
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
`;

const containerDrawersFragment = gql`
  fragment ContainerDrawers on ContainerDrawerGQL {
    requirements {
      ...Requirements
    }
    containedItems {
      ...ContainedItems
    }
    maxItemPositions
  }
  ${requirementsFragment}
  ${containedItemsFragment}
`;

export const inventoryItemFragment = gql`
  fragment InventoryItem on Item {
    id
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
