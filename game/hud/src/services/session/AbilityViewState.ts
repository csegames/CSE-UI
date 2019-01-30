/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSharedStateWithReducer } from './lib/sharedState';
const maxGroupCount = 6;

export enum EditMode {
  Disabled,
  AbilityEdit,
  SlotEdit,
}

export interface AbilityViewState {
  anchors: Dictionary<AbilityViewAnchor>;
  abilities: Dictionary<AbilityPosition[]>; // ability id => position map
  slots: Dictionary<AbilitySlot>;

  // ClientSlotID handling. A ClientSlotID is an id used for keybinding a slot on the client
  clientSlotIDMap: { [clientSlotID: number]: string; }; // client slot id to ui slot id map

  editMode: EditMode;
}

export interface AbilityPosition {
  group: string; // group id
  slot: string; // slot id
}

export interface AbilityViewAnchor {
  id: string;
  position: Vec2f;
  activeGroupIndex: number;
  groups: string[]; // ids of groups on this anchor in order.
  children: string[]; // direct child slots
}

export interface AbilitySlot {
  id: string;
  angle: number;
  clientSlotID: number;
  parent: string;
  children: string[];
}

function initialState(): AbilityViewState {
  const anchorID = genID();
  const group1 = genID();
  const group2 = genID();
  const group3 = genID();
  const slot1 = genID();
  const slot2 = genID();
  const slot3 = genID();
  const slot4 = genID();
  return {
    anchors: {
      [anchorID]: {
        id: anchorID,
        position: { x: 200, y: 200 },
        activeGroupIndex: 0,
        groups: [group1, group2, group3],
        children: [slot1],
      },
    },
    abilities: {
      one: [
        {
          group: group1,
          slot: slot1,
        },
        {
          group: group1,
          slot: slot3,
        },
        {
          group: group2,
          slot: slot2,
        },
        {
          group: group3,
          slot: slot3,
        },
        {
          group: group3,
          slot: slot4,
        },
        {
          group: group1,
          slot: slot4,
        },
      ],
      two: [
        {
          group: group2,
          slot: slot4,
        },
      ],
    },
    slots: {
      [slot1]: {
        id: slot1,
        angle: 0,
        clientSlotID: 1,
        parent: anchorID,
        children: [slot2],
      },
      [slot2]: {
        id: slot2,
        angle: 0,
        clientSlotID: 2,
        parent: slot1,
        children: [slot3],
      },
      [slot3]: {
        id: slot3,
        angle: 0,
        clientSlotID: 3,
        parent: slot2,
        children: [slot4],
      },
      [slot4]: {
        id: slot4,
        angle: 0,
        clientSlotID: 4,
        parent: slot3,
        children: [],
      },
    },
    clientSlotIDMap: {
      1: slot1,
      2: slot2,
      3: slot3,
    },
    editMode: EditMode.Disabled,
  };
}

let lastClientSlotID = -1;
function getNextAvailableClientSlotID(state: AbilityViewState) {
  for (const key in state.clientSlotIDMap) {
    if (state.clientSlotIDMap[key]) continue;
    return Number(key);
  }
  return ++lastClientSlotID;
}

export const useAbilityStateReducer
  = createSharedStateWithReducer('ability-view-state', initialState(), abilityStateReducer);

// Ability View State Actions

interface EnableAbilityEditMode {
  type: 'enable-ability-edit-mode';
}

function enableAbilityEditMode(state: AbilityViewState, action: EnableAbilityEditMode): AbilityViewState {
  return {
    ...state,
    editMode: EditMode.AbilityEdit,
  };
}

interface EnableSlotEditMode {
  type: 'enable-slot-edit-mode';
}

function enableSlotEditMode(state: AbilityViewState, action: EnableSlotEditMode): AbilityViewState {
  return {
    ...state,
    editMode: EditMode.SlotEdit,
  };
}

interface DisableEditMode {
  type: 'disable-edit-mode';
}

function disableEditMode(state: AbilityViewState, action: DisableEditMode): AbilityViewState {
  return {
    ...state,
    editMode: EditMode.Disabled,
  };
}

interface AddGroup {
  type: 'add-group';
  anchor: string;
}

function addGroup(state: AbilityViewState, action: AddGroup): AbilityViewState {
  const anchor = state.anchors[action.anchor];

  if (anchor.groups.length >= maxGroupCount) {
    return state;
  }

  const newGroupID = genID();
  return {
    ...state,
    anchors: {
      ...state.anchors,
      [anchor.id]: {
        ...anchor,
        groups: {
          ...anchor.groups,
          [newGroupID]: newGroupID,
        },
      },
    },
  };
}

interface DeleteGroup {
  type: 'delete-group';
  anchor: string;
  group: string;
}

function deleteGroup(state: AbilityViewState, action: DeleteGroup): AbilityViewState {
  const anchor = cloneDeep(state.anchors[action.anchor]);
  anchor.groups = anchor.groups.remove(action.group);
  return {
    ...state,
    anchors: {
      ...state.anchors,
      [anchor.id]: anchor,
    },
  };
}

interface ActivateGroup {
  type: 'activate-group';
  anchor: string;
  index: number;
}

function activateGroup(state: AbilityViewState, action: ActivateGroup): AbilityViewState {
  const anchor = state.anchors[action.anchor];
  if (!anchor) {
    console.warn(`${action.type} | And anchor with id '${action.anchor}' was not found.`);
    return state;
  }

  if (action.index < 0 || action.index >= anchor.groups.length) {
    console.warn(`${action.type} | Invalid index provided to action. (index: ${action.index})`);
    return state;
  }

  return {
    ...state,
    anchors: {
      ...state.anchors,
      [action.anchor]: {
        ...anchor,
        activeGroupIndex: action.index,
      },
    },
  };
}

interface ActivateNextGroup {
  type: 'activate-next-group';
  anchor: string;
}

function activateNextGroup(state: AbilityViewState, action: ActivateNextGroup): AbilityViewState {
  const anchor = state.anchors[action.anchor];
  if (!anchor) {
    console.warn(`${action.type} | And anchor with id '${action.anchor}' was not found.`);
    return state;
  }

  let index = anchor.activeGroupIndex + 1;
  if (index >= anchor.groups.length) {
    index = 0;
  }

  return {
    ...state,
    anchors: {
      ...state.anchors,
      [action.anchor]: {
        ...anchor,
        activeGroupIndex: index,
      },
    },
  };
}

interface ActivatePrevGroup {
  type: 'activate-prev-group';
  anchor: string;
}

function activatePrevGroup(state: AbilityViewState, action: ActivatePrevGroup): AbilityViewState {
  const anchor = state.anchors[action.anchor];
  if (!anchor) {
    console.warn(`${action.type} | And anchor with id '${action.anchor}' was not found.`);
    return state;
  }

  let index = anchor.activeGroupIndex - 1;
  if (index < 0) {
    index = anchor.groups.length - 1;
  }

  return {
    ...state,
    anchors: {
      ...state.anchors,
      [action.anchor]: {
        ...anchor,
        activeGroupIndex: index,
      },
    },
  };
}


interface AddSlot {
  type: 'add-slot';
  parent: string;
}

function addSlot(state: AbilityViewState, action: AddSlot): AbilityViewState {
  const newSlot: AbilitySlot = {
    id: genID(),
    angle: 0,
    clientSlotID: getNextAvailableClientSlotID(state),
    parent: action.parent,
    children: [],
  };

  if (state.anchors[action.parent]) {
    // parent is an anchor
    const anchor = state.anchors[action.parent];
    return {
      ...state,
      anchors: {
        ...state.anchors,
        [anchor.id]: {
          ...anchor,
          children: [
            ...anchor.children,
            newSlot.id,
          ],
        },
      },
      slots: {
        ...state.slots,
        [newSlot.id]: newSlot,
      },
    };
  }

  const parent = state.slots[action.parent];
  return {
    ...state,
    slots: {
      ...state.slots,
      [parent.id]: {
        ...parent,
        children: [
          ...parent.children,
          newSlot.id,
        ],
      },
      [newSlot.id]: newSlot,
    },
  };
}

interface RemoveSlot {
  type: 'remove-slot';
  slot: string;
}

function removeSlot(state: AbilityViewState, action: RemoveSlot): AbilityViewState {

  const slot = state.slots[action.slot];
  if (!slot) return state;

  if (state.anchors[slot.parent]) {
    // parent is an anchor
    const anchor = cloneDeep(state.anchors[slot.parent]);
    anchor.children.remove(slot.id);
    anchor.children.push(...slot.children);

    const slots = cloneDeep(state.slots);
    delete slots[slot.id];

    return {
      ...state,
      anchors: {
        ...state.anchors,
        [anchor.id]: anchor,
      },
      slots,
    };
  }

  const parent = cloneDeep(state.slots[slot.parent]);
  if (!parent) {
    console.warn(`${action.type} | Failed to remove slot as parent not found.`);
    return state;
  }

  parent.children.push(...slot.children);

  const slots = cloneDeep(state.slots);
  delete slots[slot.id];
  slots[parent.id] = parent;

  return {
    ...state,
    slots,
  };
}

interface SetSlotAngle {
  type: 'set-slot-angle';
  slot: string;
  angle: number;
}

function setSlotAngle(state: AbilityViewState, action: SetSlotAngle): AbilityViewState {
  const slot = state.slots[action.slot];
  if (!slot) {
    console.warn(`${action.type} | Attempted to set angle on unknown slot. (id:${action.slot})`);
    return state;
  }

  return {
    ...state,
    slots: {
      ...state.slots,
      [slot.id]: {
        ...slot,
        angle: action.angle,
      },
    },
  };
}


interface AddAbility {
  type: 'add-ability';
  ability: string;
  group: string;
  slot: string;
}

function addAbility(state: AbilityViewState, action: AddAbility): AbilityViewState {
  const positions = (state.abilities[action.ability] || []).slice();
  positions.push({
    group: action.group,
    slot: action.slot,
  });
  return {
    ...state,
    abilities: {
      ...state.abilities,
      [action.ability]: positions,
    },
  };
}

interface AddAndRemoveAbility {
  type: 'add-and-remove-ability';
  ability: string;
  from: {
    group: string;
    slot: string;
  };
  target: {
    group: string;
    slot: string;
  };
}

function addAndRemoveAbility(state: AbilityViewState, action: AddAndRemoveAbility): AbilityViewState {
  const positions = (state.abilities[action.ability] || []).slice()
    .filter(a => !(a.group === action.from.group && a.slot === action.from.slot));
  positions.push({
    group: action.target.group,
    slot: action.target.slot,
  });
  return {
    ...state,
    abilities: {
      ...state.abilities,
      [action.ability]: positions,
    },
  };
}

interface RemoveAbility {
  type: 'remove-ability';
  ability: string;
  group: string;
  slot: string;
}

function removeAbility(state: AbilityViewState, action: RemoveAbility): AbilityViewState {
  const positions = (state.abilities[action.ability] || []).slice()
    .filter(a => !(a.group === action.group && a.slot === action.slot));
  return {
    ...state,
    abilities: {
      ...state.abilities,
      [action.ability]: positions,
    },
  };
}

interface ReplaceOrSwapAbility {
  type: 'replace-or-swap-ability';
  from: {
    ability: string;
    group?: string;
    slot?: string;
  };
  target: {
    ability: string;
    group: string;
    slot: string;
  };
}

function replaceOrSwapAbility(state: AbilityViewState, action: ReplaceOrSwapAbility): AbilityViewState {
  if (!action.target || !action.from) {
    console.warn(`${action.type} | Attempted to swap abilities with invalid locations.`);
    return state;
  }

  if (action.target.ability === action.from.ability) {
    // do nothing when the same abilities
    return state;
  }

  if (!action.from.group) {
    // replacing
    const targetPositions = (state.abilities[action.target.ability] || []).slice()
    .filter(a => !(a.group === action.target.group && a.slot === action.target.slot));

    const fromPositions = (state.abilities[action.from.ability] || []).slice()
    .filter(a => !(a.group === action.from.group && a.slot === action.from.slot));
    fromPositions.push({
      group: action.target.group,
      slot: action.target.slot,
    });

    return {
      ...state,
      abilities: {
        ...state.abilities,
        [action.target.ability]: targetPositions,
        [action.from.ability]: fromPositions,
      },
    };
  } else {
    // swapping
    const targetPositions = (state.abilities[action.target.ability] || []).slice()
    .filter(a => !(a.group === action.target.group && a.slot === action.target.slot));
    targetPositions.push({
      group: action.from.group,
      slot: action.from.slot,
    });

    const fromPositions = (state.abilities[action.from.ability] || []).slice()
    .filter(a => !(a.group === action.from.group && a.slot === action.from.slot));
    fromPositions.push({
      group: action.target.group,
      slot: action.target.slot,
    });

    return {
      ...state,
      abilities: {
        ...state.abilities,
        [action.target.ability]: targetPositions,
        [action.from.ability]: fromPositions,
      },
    };
  }
}

export type Actions =
  EnableAbilityEditMode |
  EnableSlotEditMode |
  DisableEditMode |
  AddGroup |
  DeleteGroup |
  AddAbility |
  AddAndRemoveAbility |
  RemoveAbility |
  ReplaceOrSwapAbility |
  AddSlot |
  RemoveSlot |
  SetSlotAngle |
  ActivateGroup |
  ActivateNextGroup |
  ActivatePrevGroup;

function abilityStateReducer(state: AbilityViewState, action: Actions) {
  if (!state) {
    return cloneDeep(initialState());
  }

  switch (action.type) {
    case 'enable-ability-edit-mode': return enableAbilityEditMode(state, action);
    case 'enable-slot-edit-mode': return enableSlotEditMode(state, action);
    case 'disable-edit-mode': return disableEditMode(state, action);
    case 'add-group': return addGroup(state, action);
    case 'delete-group': return deleteGroup(state, action);
    case 'add-ability': return addAbility(state, action);
    case 'add-and-remove-ability': return addAndRemoveAbility(state, action);
    case 'remove-ability': return removeAbility(state, action);
    case 'replace-or-swap-ability': return replaceOrSwapAbility(state, action);
    case 'add-slot': return addSlot(state, action);
    case 'remove-slot': return removeSlot(state, action);
    case 'set-slot-angle': return setSlotAngle(state, action);
    case 'activate-group': return activateGroup(state, action);
    case 'activate-next-group': return activateNextGroup(state, action);
    case 'activate-prev-group': return activatePrevGroup(state, action);
    default: return state;
  }
}

