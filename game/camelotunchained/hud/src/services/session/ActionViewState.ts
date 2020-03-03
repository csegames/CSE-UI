/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createSharedStateWithReducer } from 'cseshared/lib/sharedState';
const maxGroupCount = 6;
const maxChildSlotCount = 4;

const ABILITY_BAR_KEY = 'cu/game/abilities/bar';

export enum EditMode {
  Disabled,
  ActionEdit,
  SlotEdit,
}

export interface ActionViewState {
  anchors: Dictionary<ActionViewAnchor>;
  actions: Dictionary<ActionPosition[]>; // action id => position map
  slots: Dictionary<ActionSlot>;

  // ClientSlotID handling. A ClientSlotID is an id used for keybinding a slot on the client
  clientSlotIDMap: { [clientSlotID: number]: string; }; // client slot id to ui slot id map

  editMode: EditMode;
}

export interface ActionPosition {
  group: string; // group id
  slot: string; // slot id
}

export interface ActionViewAnchor {
  id: string;
  position: Vec2f;
  activeGroupIndex: number;
  groups: string[]; // ids of groups on this anchor in order.
  children: string[]; // direct child slots
}

export interface ActionSlot {
  id: string;
  angle: number;
  clientSlotID: number;
  parent: string;
  children: string[];
}

function initializeState(): ActionViewState {
  let abilityBarString = localStorage.getItem(ABILITY_BAR_KEY);

  let abilityBar: ActionViewState = null;
  if (abilityBarString) {
    try {
      abilityBar = JSON.parse(abilityBarString);
    } catch(e) {
      console.error('Failed to parse localStorage ability bar');
    }
  }

  if (!abilityBar) {
    abilityBar = generateDefaultAbilityBar();
  }

  return abilityBar;
}

function generateDefaultAbilityBar(): ActionViewState {
  const anchorID = genID();
  const group1 = genID();
  return {
    anchors: {
      [anchorID]: {
        id: anchorID,
        position: { x: 300, y: 300 },
        activeGroupIndex: 0,
        groups: [group1],
        children: [] as string[],
      },
    },
    actions: {},
    slots: {},
    clientSlotIDMap: {},
    editMode: EditMode.Disabled,
  }
}

let lastClientSlotID = -1;
function getNextAvailableClientSlotID(state: ActionViewState) {
  for (const key in state.clientSlotIDMap) {
    if (state.clientSlotIDMap[key]) continue;
    return Number(key);
  }
  return ++lastClientSlotID;
}

export const useActionStateReducer = createSharedStateWithReducer('action-view-state', initializeState(), actionStateReducer);

// Action View State Actions

interface EnableActionEditMode {
  type: 'enable-action-edit-mode';
}

function enableActionEditMode(state: ActionViewState, action: EnableActionEditMode): ActionViewState {
  return {
    ...state,
    editMode: EditMode.ActionEdit,
  };
}

interface EnableSlotEditMode {
  type: 'enable-slot-edit-mode';
}

function enableSlotEditMode(state: ActionViewState, action: EnableSlotEditMode): ActionViewState {
  return {
    ...state,
    editMode: EditMode.SlotEdit,
  };
}

interface DisableEditMode {
  type: 'disable-edit-mode';
}

function disableEditMode(state: ActionViewState, action: DisableEditMode): ActionViewState {
  return {
    ...state,
    editMode: EditMode.Disabled,
  };
}

interface AddGroup {
  type: 'add-group';
  anchor: string;
}

function addGroup(state: ActionViewState, action: AddGroup): ActionViewState {
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
        groups: [
          ...anchor.groups,
          newGroupID,
        ],
      },
    },
  };
}

interface RemoveGroup {
  type: 'remove-group';
  anchor: string;
  group: string;
}

function removeGroup(state: ActionViewState, action: RemoveGroup): ActionViewState {
  const anchor = cloneDeep(state.anchors[action.anchor]);

  if (anchor.groups.length === 1) return;

  anchor.groups = anchor.groups.remove(action.group);
  if (anchor.activeGroupIndex >= anchor.groups.length) {
    anchor.activeGroupIndex = anchor.groups.length - 1;
  }
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

function activateGroup(state: ActionViewState, action: ActivateGroup): ActionViewState {
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

function activateNextGroup(state: ActionViewState, action: ActivateNextGroup): ActionViewState {
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

function activatePrevGroup(state: ActionViewState, action: ActivatePrevGroup): ActionViewState {
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

function addSlot(state: ActionViewState, action: AddSlot): ActionViewState {
  const newSlot: ActionSlot = {
    id: genID(),
    angle: 0,
    clientSlotID: getNextAvailableClientSlotID(state),
    parent: action.parent,
    children: [],
  };

  if (state.anchors[action.parent]) {
    // parent is an anchor
    const anchor = state.anchors[action.parent];

    if (anchor.children.length + 1 > maxChildSlotCount) {
      // don't add
      return state;
    }

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

  if (parent.children.length + 1 > maxChildSlotCount) {
    // don't add
    return state;
  }

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

function removeSlot(state: ActionViewState, action: RemoveSlot): ActionViewState {

  const slot = state.slots[action.slot];
  if (!slot) return state;

  if (state.anchors[slot.parent]) {

    // if this is the last slot, don't remove it
    if (slot.children.length === 0) {
      return state;
    }

    // parent is an anchor
    const anchor = cloneDeep(state.anchors[slot.parent]);
    anchor.children.remove(slot.id);
    anchor.children.push(...slot.children);

    const slots = cloneDeep(state.slots);
    delete slots[slot.id];

    anchor.children.forEach((child) => {
      if (slots[child]) slots[child].parent = anchor.id;
    });

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

  parent.children.remove(slot.id);
  parent.children.push(...slot.children);

  const slots = cloneDeep(state.slots);
  delete slots[slot.id];
  parent.children.forEach((child) => {
    if (slots[child]) slots[child].parent = parent.id;
  });
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

function setSlotAngle(state: ActionViewState, action: SetSlotAngle): ActionViewState {
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


interface AddAction {
  type: 'add-action';
  action: string;
  group: string;
  slot: string;
}

function addAction(state: ActionViewState, action: AddAction): ActionViewState {
  const positions = (state.actions[action.action] || []).slice();
  positions.push({
    group: action.group,
    slot: action.slot,
  });
  return {
    ...state,
    actions: {
      ...state.actions,
      [action.action]: positions,
    },
  };
}

interface AddAndRemoveAction {
  type: 'add-and-remove-action';
  action: string;
  from: {
    group: string;
    slot: string;
  };
  target: {
    group: string;
    slot: string;
  };
}

function addAndRemoveAction(state: ActionViewState, action: AddAndRemoveAction): ActionViewState {
  const positions = (state.actions[action.action] || []).slice()
    .filter(a => !(a.group === action.from.group && a.slot === action.from.slot));
  positions.push({
    group: action.target.group,
    slot: action.target.slot,
  });
  return {
    ...state,
    actions: {
      ...state.actions,
      [action.action]: positions,
    },
  };
}

interface RemoveAction {
  type: 'remove-action';
  action: string;
  group: string;
  slot: string;
}

function removeAction(state: ActionViewState, action: RemoveAction): ActionViewState {
  const positions = (state.actions[action.action] || []).slice()
    .filter(a => !(a.group === action.group && a.slot === action.slot));
  return {
    ...state,
    actions: {
      ...state.actions,
      [action.action]: positions,
    },
  };
}

interface ReplaceOrSwapAction {
  type: 'replace-or-swap-action';
  from: {
    action: string;
    group?: string;
    slot?: string;
  };
  target: {
    action: string;
    group: string;
    slot: string;
  };
}

function replaceOrSwapAction(state: ActionViewState, action: ReplaceOrSwapAction): ActionViewState {
  if (!action.target || !action.from) {
    console.warn(`${action.type} | Attempted to swap actions with invalid locations.`);
    return state;
  }

  if (action.target.action === action.from.action) {
    // do nothing when the same actions
    return state;
  }

  if (!action.from.group) {
    // replacing
    const targetPositions = (state.actions[action.target.action] || []).slice()
    .filter(a => !(a.group === action.target.group && a.slot === action.target.slot));

    const fromPositions = (state.actions[action.from.action] || []).slice()
    .filter(a => !(a.group === action.from.group && a.slot === action.from.slot));
    fromPositions.push({
      group: action.target.group,
      slot: action.target.slot,
    });

    return {
      ...state,
      actions: {
        ...state.actions,
        [action.target.action]: targetPositions,
        [action.from.action]: fromPositions,
      },
    };
  } else {
    // swapping
    const targetPositions = (state.actions[action.target.action] || []).slice()
    .filter(a => !(a.group === action.target.group && a.slot === action.target.slot));
    targetPositions.push({
      group: action.from.group,
      slot: action.from.slot,
    });

    const fromPositions = (state.actions[action.from.action] || []).slice()
    .filter(a => !(a.group === action.from.group && a.slot === action.from.slot));
    fromPositions.push({
      group: action.target.group,
      slot: action.target.slot,
    });

    return {
      ...state,
      actions: {
        ...state.actions,
        [action.target.action]: targetPositions,
        [action.from.action]: fromPositions,
      },
    };
  }
}

interface SetAnchorPosition {
  type: 'set-anchor-position';
  anchor: string;
  position: Vec2f;
}

function setAnchorPosition(state: ActionViewState, action: SetAnchorPosition) {
  if (!state.anchors[action.anchor]) return state;
  return {
    ...state,
    anchors: {
      ...state.anchors,
      [action.anchor]: {
        ...state.anchors[action.anchor],
        position: action.position,
      },
    },
  };
}

export type Actions =
  EnableActionEditMode |
  EnableSlotEditMode |
  DisableEditMode |
  AddGroup |
  RemoveGroup |
  AddAction |
  AddAndRemoveAction |
  RemoveAction |
  ReplaceOrSwapAction |
  AddSlot |
  RemoveSlot |
  SetSlotAngle |
  ActivateGroup |
  ActivateNextGroup |
  ActivatePrevGroup |
  SetAnchorPosition;

function actionStateReducer(state: ActionViewState, action: Actions) {
  if (!state) {
    return cloneDeep(initializeState());
  }

  switch (action.type) {
    case 'enable-action-edit-mode': return enableActionEditMode(state, action);
    case 'enable-slot-edit-mode': return enableSlotEditMode(state, action);
    case 'disable-edit-mode': return disableEditMode(state, action);
    case 'add-group': return addGroup(state, action);
    case 'remove-group': return removeGroup(state, action);
    case 'add-action': return addAction(state, action);
    case 'add-and-remove-action': return addAndRemoveAction(state, action);
    case 'remove-action': return removeAction(state, action);
    case 'replace-or-swap-action': return replaceOrSwapAction(state, action);
    case 'add-slot': return addSlot(state, action);
    case 'remove-slot': return removeSlot(state, action);
    case 'set-slot-angle': return setSlotAngle(state, action);
    case 'activate-group': return activateGroup(state, action);
    case 'activate-next-group': return activateNextGroup(state, action);
    case 'activate-prev-group': return activatePrevGroup(state, action);
    case 'set-anchor-position': return setAnchorPosition(state, action);
    default: return state;
  }
}

