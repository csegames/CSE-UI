/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { debounce } from 'lodash';

export const MAX_GROUP_COUNT = 6;
export const MAX_CHILD_SLOT_COUNT = 4;

const ABILITY_BAR_VERSION = '2';
const ABILITY_BAR_VERSION_KEY = 'cu/game/abilities/barVersion';
const ABILITY_BAR_KEY = 'cu/game/abilities/bar';

function idIsInvalid(id: number) {
  return typeof id !== 'number' || id < 0;
}

export enum EditMode {
  Disabled,
  ActionEdit,
  SlotEdit,
  Changing,
}

interface ContextState {
  anchors: { [anchorId: number]: ActionViewAnchor };
  actions: { [actionId: number]: ActionPosition[] }; // action id => position map
  slots: { [slotId: number]: ActionSlot };

  editMode: EditMode;
  queuedAbilityId: number;
  anchorIdToVisibility: { [anchorId: number]: boolean };
  systemAnchorIdToAbilities: { [systemAnchorId: number]: number[] };
}

interface ContextFunctions {
  getAbilityGroupActionView: (abilityIds: number[], systemAnchorId?: number) => ContextState;
  enableActionEditMode: () => void;
  enableSlotEditMode: () => void;
  disableEditMode: () => void;
  addGroup: (anchorId: number) => void;
  removeGroup: (anchorId: number, groupId: number) => void;
  activateGroup: (anchorId: number, groupIndex: number) => void;
  activateNextGroup: (anchorId: number) => void;
  activatePrevGroup: (anchorId: number) => void;
  addSlot: (addingToAnchor: boolean, parentId: number) => void;
  removeSlot: (slotId: number) => void;
  setSlotAngle: (slotId: number, angle: number) => void;
  addAction: (actionId: number, groupId: number, slotId: number) => void;
  addAndRemoveAction: (
    actionId: number,
    from: { groupId: number, slotId: number },
    target: { groupId: number, slotId: number }
  ) => void;
  removeAction: (actionId: number, groupId: number, slotId: number) => void;
  replaceOrSwapAction: (
    from: {
      actionId: number,
      groupId?: number,
      slotId?: number,
    },
    target: {
      actionId: number,
      groupId: number,
      slotId: number,
  }) => void;
  setAnchorPosition: (anchorId: number, position: Vec2f) => void;
  queueAddAction: (abilityId: number) => void;
  clearQueueAddAction: () => void;
  addAnchor: () => void;
  removeAnchor: (anchorId: number) => void;
  deleteAbility: (abilityId: number) => void;
}

export type ActionViewContextState = ContextState & ContextFunctions;

export interface ActionPosition {
  group: number; // group id
  slot: number; // slot id
}

export interface ActionViewAnchor {
  id: number;
  positionPercentage: Vec2f;
  activeGroupIndex: number;
  groups: number[]; // ids of groups on this anchor in order.
  children: number[]; // direct child slots
}

export enum ParentType {
  Anchor,
  Slot
}

export interface ActionSlot {
  id: number;
  angle: number;
  anchorId: number;
  parent: { type: ParentType, id: number };
  children: number[];
}

function noOp(): any {}
export function getDefaultActionViewContextState(): ContextState {
  return {
    anchors: {},
    actions: {},
    slots: {},
    editMode: EditMode.Disabled,
    queuedAbilityId: null,
    anchorIdToVisibility: {},
    systemAnchorIdToAbilities: {},
  }
}

export const ActionViewContext = React.createContext<ActionViewContextState>({
  ...getDefaultActionViewContextState(),
  getAbilityGroupActionView: noOp,
  enableActionEditMode: noOp,
  enableSlotEditMode: noOp,
  disableEditMode: noOp,
  addGroup: noOp,
  removeGroup: noOp,
  activateGroup: noOp,
  activateNextGroup: noOp,
  activatePrevGroup: noOp,
  addSlot: noOp,
  removeSlot: noOp,
  setSlotAngle: noOp,
  addAction: noOp,
  addAndRemoveAction: noOp,
  removeAction: noOp,
  replaceOrSwapAction: noOp,
  setAnchorPosition: noOp,
  queueAddAction: noOp,
  clearQueueAddAction: noOp,
  addAnchor: noOp,
  removeAnchor: noOp,
  deleteAbility: noOp,
});

export function isSystemAnchorId(anchorId: number) {
  return anchorId < 0;
}

export class ActionViewContextProvider extends React.Component<{}, ContextState> {
  private abilityBarUpdateEVH: EventHandle;
  private systemAnchorInitEVH: EventHandle;
  private initializeStateTimeout: number;
  private refetchAbilitiesTimeout: number;
  private isInitial: boolean = true;

  constructor(props: {}) {
    super(props);

    this.handleAbilityBarStateUpdate = debounce(this.handleAbilityBarStateUpdate, 50);
    this.state = getDefaultActionViewContextState();
  }

  public render() {
    return (
      <ActionViewContext.Provider value={{
        ...this.state,
        getAbilityGroupActionView: this.getAbilityGroupActionView,
        enableActionEditMode: this.enableActionEditMode,
        enableSlotEditMode: this.enableSlotEditMode,
        disableEditMode: this.disableEditMode,
        addGroup: this.addGroup,
        removeGroup: this.removeGroup,
        activateGroup: this.activateGroup,
        activateNextGroup: this.activateNextGroup,
        activatePrevGroup: this.activatePrevGroup,
        addSlot: this.addSlot,
        removeSlot: this.removeSlot,
        setSlotAngle: this.setSlotAngle,
        addAction: this.addAction,
        addAndRemoveAction: this.addAndRemoveAction,
        removeAction: this.removeAction,
        replaceOrSwapAction: this.replaceOrSwapAction,
        setAnchorPosition: this.setAnchorPosition,
        queueAddAction: this.queueAddAction,
        clearQueueAddAction: this.clearQueueAddAction,
        addAnchor: this.addAnchor,
        removeAnchor: this.removeAnchor,
        deleteAbility: this.deleteAbility,
      }}>
        {this.props.children}
      </ActionViewContext.Provider>
    );
  }

  public componentDidMount() {
    if (!game.actions) return;
    this.fetchAPIAbilitiesAndInitialize();
    camelotunchained.game.abilityBarState.onUpdated(this.handleAbilityBarStateUpdate);
    game.onAnchorVisibilityChanged(this.handleAnchorVisibilityChanged);
  }

  public componentWillUnmount() {
    if (this.abilityBarUpdateEVH) {
      this.abilityBarUpdateEVH.clear();
    }

    if (this.systemAnchorInitEVH) {
      this.systemAnchorInitEVH.clear();
    }

    if (this.initializeStateTimeout) {
      window.clearTimeout(this.initializeStateTimeout);
    }
  }

  private handleAnchorVisibilityChanged = (anchorId: number, visible: boolean) => {
    const anchorIdToVisibility = { ...this.state.anchorIdToVisibility };
    anchorIdToVisibility[anchorId] = visible;
    this.setState({ anchorIdToVisibility });
  }

  private fetchAPIAbilitiesAndInitialize = async () => {
    if (game.webAPIHost &&
        (!camelotunchained.game.store.myCharacter || !camelotunchained.game.store.myCharacter.abilities)) {
      const res = await camelotunchained.game.store.refetch();
      if (!res.myCharacter || res.myCharacter.abilities) {
        this.refetchAbilitiesTimeout = window.setTimeout(this.fetchAPIAbilitiesAndInitialize, 500);
        return;
      }
    }

    window.clearTimeout(this.refetchAbilitiesTimeout);
    this.refetchAbilitiesTimeout = null;
    this.initializeState();
  }

  private handleAbilityBarStateUpdate = () => {
    const abilitiesArray = Object.values(camelotunchained.game.abilityBarState.abilities);
    this.setState(this.initializeActionView(abilitiesArray));
  }

  private initializeState = () => {
    if (camelotunchained.game.abilityBarState.isReady) {
      const abilitiesArray = Object.values(camelotunchained.game.abilityBarState.abilities);
      if (abilitiesArray.length === 0) {
        this.initializeStateTimeout = window.setTimeout(this.initializeState, 100);
        return;
      }

      const initialState = this.initializeActionView(abilitiesArray);
      const anchorIdToVisibility = { ...this.state.anchorIdToVisibility };
      Object.keys(initialState.anchors).forEach((anchorId) => {
        anchorIdToVisibility[anchorId] = typeof this.state.anchorIdToVisibility[anchorId] === 'boolean' ?
          this.state.anchorIdToVisibility[anchorId] : (isSystemAnchorId(Number(anchorId)) ? false : true);
      });
      this.setState({ ...initialState, anchorIdToVisibility });
    }
  }

  private updateLocalStorage = (state: ContextState) => {
    const persistedState = {
      anchors: state.anchors,
      actions: state.actions,
      slots: state.slots,
    }
    localStorage.setItem(ABILITY_BAR_KEY + game.characterID, JSON.stringify(persistedState));
  }

  private initializeActionView = (abilities: AbilityBarItem[]) => {
    let shouldOverrideLocalStorage = false;
    const cacheAbilityBarVersion = localStorage.getItem(ABILITY_BAR_VERSION_KEY + game.characterID);
    if (!cacheAbilityBarVersion || cacheAbilityBarVersion !== ABILITY_BAR_VERSION) {
      shouldOverrideLocalStorage = true;
      localStorage.setItem(ABILITY_BAR_VERSION_KEY + game.characterID, ABILITY_BAR_VERSION);
    }

    let actionViewString = shouldOverrideLocalStorage === false ?
      localStorage.getItem(ABILITY_BAR_KEY + game.characterID) : null;

    let actionView: ContextState = null;
    if (actionViewString) {
      try {
        actionView = JSON.parse(actionViewString);
      } catch(e) {
        console.error('Failed to parse localStorage ability bar');
      }
    }

    // No action view in local storage. Create a default action view.
    const systemAnchorIdToAbilities: { [systemAnchorId: number]: number[] } = {};
    const nonSystemAnchorAbilityIds: number[] = [];

    abilities.forEach((ability) => {
      if (!ability.systemAnchorID) {
        nonSystemAnchorAbilityIds.push(ability.id);
        return;
      }

      if (systemAnchorIdToAbilities[ability.systemAnchorID]) {
        systemAnchorIdToAbilities[ability.systemAnchorID].push(ability.id);
      } else {
        systemAnchorIdToAbilities[ability.systemAnchorID] = [ability.id];
      }
    });

    // Get non systemanchor action view
    if (!actionView) {
      actionView = this.getAbilityGroupActionView(nonSystemAnchorAbilityIds);
    }

    let shouldUpdateLocalStorage = !actionViewString;
    Object.keys(systemAnchorIdToAbilities).forEach((systemAnchorId) => {
      if (actionView.anchors[systemAnchorId]) {
        return;
      }
    });

    // Check to see if ability still exists. If it doesn't, remove it from the actionView
    Object.keys(actionView.actions).forEach((actionId) => {
      const ability = abilities.find(ability => ability.id === Number(actionId));
      if (!ability) {
        delete actionView.actions[actionId];
      }
    });

    if (shouldUpdateLocalStorage) {
      this.updateLocalStorage(actionView);
    }

    if (this.isInitial) {
      this.initializeClient(actionView.anchors, actionView.slots, actionView.actions);
      this.isInitial = false;
    }

    return {
      ...actionView,
      editMode: EditMode.Disabled,
      systemAnchorIdToAbilities
    };
  }

  private getAbilityGroupActionView = (abilityIds: number[], systemAnchorId?: number) => {
    const anchorId = systemAnchorId || this.generateAnchorId(this.state.anchors);
    const groupId = this.generateGroupId(anchorId, this.state.anchors);

    const slots: { [slotId: string]: ActionSlot } = {};
    const actions: { [actionId: string]: ActionPosition[] } = {};

    let firstSlotId: number = null;
    let prevSlotId: number = null;
    let nextSlotId: number = null;                                             

    abilityIds.forEach((abilityId, i) => {
      const currentSlotId = nextSlotId ? nextSlotId : this.generateSlotId(slots);

      if (i === abilityIds.length - 1) {
        nextSlotId = null;
      } else {
        nextSlotId = currentSlotId + 1;
      }

      slots[currentSlotId] = {
        id: currentSlotId,
        angle: 0,
        anchorId,
        parent: prevSlotId === null ? { type: ParentType.Anchor, id: anchorId } : { type: ParentType.Slot, id: prevSlotId },
        children: nextSlotId ? [nextSlotId] : [],
      };

      actions[abilityId] = [{
        group: groupId,
        slot: currentSlotId,
      }]

      prevSlotId = currentSlotId;

      if (firstSlotId == null) {
        firstSlotId = currentSlotId;
      }
    });

    return {
      anchors: {
        [anchorId]: {
          id: anchorId,
          positionPercentage: { x: 50, y: systemAnchorId ? 90 : 95 },
          activeGroupIndex: 0,
          groups: [groupId],
          children: [firstSlotId],
        },
      },
      actions,
      slots,
      editMode: EditMode.Disabled,
      queuedAbilityId: null as number,
    } as any;
  }

  private initializeClient = async (anchors: { [anchorId: string]: ActionViewAnchor },
                                    slots: { [slotId: string]: ActionSlot },
                                    actions: { [actionId: string]: ActionPosition[] }) => {
    try {
      const res = await game.actions.enterActionBarEditModeAsync();
      if (res.success) {
        Object.values(anchors).forEach((anchor, i) => {
          if (!isSystemAnchorId(anchor.id)) {
            this.clientSetActiveAnchorGroup(anchor.id, anchor.groups[anchor.activeGroupIndex]);
          }
        });

        Object.keys(actions).forEach((actionId) => {
          actions[actionId].forEach(action => {
            const slot = slots[action.slot];
            if (!isSystemAnchorId(slot.anchorId)) {
              if (!action) {
                console.error('There was an action that was undefined');
                return;
              }

              this.clientAssignSlottedAction(slot.id, slot.anchorId, action.group, Number(actionId));
            }
          });
        });
        
      } else {
        console.error('Could not enter edit mode');
      }

      await game.actions.exitActionBarEditModeAsync();
    } catch(e) {
      console.error('Failed to initialize slots through client api.');
      console.log(e);
    }
  }

  private enableActionEditMode = async () => {
    this.setState({ editMode: EditMode.Changing });
    try {
      const res = await game.actions.enterActionBarEditModeAsync();
      if (res.success) {
        this.setState({ editMode: EditMode.ActionEdit });
      }
    } catch(e) {
      console.error('There was an error entering enableActionEditMode');
      this.setState({ editMode: EditMode.Disabled });
    }
  }

  private enableSlotEditMode = async () => {
    this.setState({ editMode: EditMode.Changing });
    try {
      const res = await game.actions.enterActionBarEditModeAsync();
      if (res.success) {
        this.setState({ editMode: EditMode.SlotEdit });
      }
    } catch(e) {
      console.error('There was an error entering enableActionEditMode');
      this.setState({ editMode: EditMode.Disabled });
    }
  }

  private disableEditMode = async () => {
    this.setState({ editMode: EditMode.Changing });
    try {
      const res = await game.actions.exitActionBarEditModeAsync();
      if (res.success) {
        this.setState({ editMode: EditMode.Disabled, queuedAbilityId: null });
      }
    } catch(e) {
      console.error('There was an error exiting diableEditMode');
      this.setState({ editMode: EditMode.Disabled });
    }
  }

  private addGroup = (anchorId: number) => {
    const anchor = this.state.anchors[anchorId];

    if (anchor.groups.length >= MAX_GROUP_COUNT) {
      return;
    }

    const newGroupId = this.generateGroupId(anchorId, this.state.anchors);
    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchor.id]: {
          ...anchor,
          groups: [
            ...anchor.groups,
            newGroupId,
          ],
        },
      },
    };

    this.updateState(updatedState);
  }

  private removeGroup = (anchorId: number, groupId: number) => {
    const anchor = cloneDeep(this.state.anchors[anchorId]);

    if (anchor.groups.length === 1) return;

    anchor.groups = anchor.groups.remove(groupId);
    if (anchor.activeGroupIndex >= anchor.groups.length) {
      anchor.activeGroupIndex = anchor.groups.length - 1;
      this.clientSetActiveAnchorGroup(anchorId, anchor.groups[anchor.activeGroupIndex]);
    }

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchor.id]: anchor,
      },
    };

    this.updateState(updatedState);
  }

  private activateGroup = (anchorId: number, groupIndex: number) => {
    const anchor = this.state.anchors[anchorId];
    if (!anchor) {
      console.warn(`Anchor with id '${anchorId}' was not found.`);
      return;
    }

    if (groupIndex < 0 || groupIndex >= anchor.groups.length) {
      console.warn(`Invalid index provided to action. (index: ${groupIndex})`);
      return;
    }

    this.clientSetActiveAnchorGroup(anchorId, anchor.groups[groupIndex]);

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          ...anchor,
          activeGroupIndex: groupIndex,
        },
      },
    };

    this.updateState(updatedState);
  }

  private activateNextGroup = (anchorId: number) => {
    const anchor = this.state.anchors[anchorId];
    if (!anchor) {
      console.warn(`Could not activateNextGroup. An anchor with id '${anchorId}' was not found.`);
      return;
    }

    if (!anchor.groups[anchor.activeGroupIndex + 1]) {
      return;
    }

    let index = anchor.activeGroupIndex + 1;
    if (index >= anchor.groups.length) {
      index = 0;
    }

    this.clientSetActiveAnchorGroup(anchorId, anchor.groups[index]);

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          ...anchor,
          activeGroupIndex: index,
        },
      },
    };

    this.updateState(updatedState);
  }

  private activatePrevGroup = (anchorId: number) => {
    const anchor = this.state.anchors[anchorId];
    if (!anchor) {
      console.warn(`Could not activatePrevGroup. An anchor with id '${anchorId}' was not found.`);
      return;
    }

    if (anchor.groups[anchor.activeGroupIndex - 1]) {
      return;
    }

    let index = anchor.activeGroupIndex - 1;
    if (index < 0) {
      index = anchor.groups.length - 1;
    }

    this.clientSetActiveAnchorGroup(anchorId, anchor.groups[index]);

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          ...anchor,
          activeGroupIndex: index,
        },
      },
    };

    this.updateState(updatedState);
  }

  private addSlot = (addingToAnchor: boolean, parentId: number) => {
    const anchorId = this.state.slots[parentId] ? this.state.slots[parentId].anchorId : parentId;

    const newSlot: ActionSlot = {
      id: this.generateSlotId(this.state.slots),
      angle: 0,
      anchorId,
      parent: { type: addingToAnchor ? ParentType.Anchor : ParentType.Slot, id: parentId },
      children: [],
    };

    if (this.state.anchors[parentId]) {
      // parent is an anchor
      const anchor = this.state.anchors[parentId];

      if (anchor.children.length + 1 > MAX_CHILD_SLOT_COUNT) {
        // don't add
        return;
      }

      const updatedState: ContextState = {
        ...this.state,
        anchors: {
          ...this.state.anchors,
          [anchor.id]: {
            ...anchor,
            children: [
              ...anchor.children,
              newSlot.id,
            ],
          },
        },
        slots: {
          ...this.state.slots,
          [newSlot.id]: newSlot,
        },
      }

      this.updateState(updatedState);
    } else {
      const parent = this.state.slots[parentId];

      if (parent.children.length + 1 > MAX_CHILD_SLOT_COUNT) {
        // don't add
        return;
      }

      const updatedState: ContextState = {
        ...this.state,
        slots: {
          ...this.state.slots,
          [parent.id]: {
            ...parent,
            children: [
              ...parent.children,
              newSlot.id,
            ],
          },
          [newSlot.id]: newSlot,
        },
      }
      this.updateState(updatedState);
    }
  }

  private removeSlot = (slotId: number) => {
    const slot = this.state.slots[slotId];
    if (!slot) {
      return;
    }

    if (slot.parent.type === ParentType.Anchor && this.state.anchors[slot.parent.id]) {

      // if this is the last slot, don't remove it
      if (slot.children.length === 0) {
        return;
      }

      // parent is an anchor
      const anchor = cloneDeep(this.state.anchors[slot.parent.id]);
      anchor.children.remove(slot.id);
      anchor.children.push(...slot.children);

      const slots = cloneDeep(this.state.slots);
      delete slots[slot.id];

      anchor.children.forEach((child) => {
        if (slots[child]) {
          slots[child].parent.id = anchor.id;
        }
      });

      const updatedState: ContextState = {
        ...this.state,
        anchors: {
          ...this.state.anchors,
          [anchor.id]: anchor,
        },
        slots,
      };

      this.updateState(updatedState);
      return;
    }

    const parent = cloneDeep(this.state.slots[slot.parent.id]);
    if (!parent) {
      console.warn(`Failed to remove slot as parent not found.`);
      return;
    }

    parent.children.remove(slot.id);
    parent.children.push(...slot.children);

    const slots = cloneDeep(this.state.slots);
    delete slots[slot.id];
    parent.children.forEach((child) => {
      if (slots[child]) {
        slots[child].parent.id = parent.id;
      }
    });
    slots[parent.id] = parent;

    const updatedState: ContextState = {
      ...this.state,
      slots,
    };

    this.updateState(updatedState);
  }

  private setSlotAngle = (slotId: number, angle: number) => {
    const slot = this.state.slots[slotId];
    if (!slot) {
      console.warn(`Attempted to set angle on unknown slot. (id:${slotId})`);
      return;
    }

    const updatedState: ContextState = {
      ...this.state,
      slots: {
        ...this.state.slots,
        [slot.id]: {
          ...slot,
          angle,
        },
      },
    };

    this.updateState(updatedState);
  }

  private addAction = (actionId: number, groupId: number, slotId: number) => {
    const positions = (this.state.actions[actionId] || []).slice();
    positions.push({
      group: groupId,
      slot: slotId,
    });

    const updatedState: ContextState = {
      ...this.state,
      actions: {
        ...this.state.actions,
        [actionId]: positions,
      },
      queuedAbilityId: null,
    };

    this.clientAssignSlottedAction(slotId, updatedState.slots[slotId].anchorId, groupId, actionId);

    this.updateState(updatedState);
  }

  private addAndRemoveAction = (
    actionId: number,
    from: {
      groupId: number,
      slotId: number,
      anchorId: number,
    },
    target: {
      groupId: number,
      slotId: number,
      anchorId: number,
    },
  ) => {
    const positions = (this.state.actions[actionId] || []).slice()
      .filter(a => !(a.group === from.groupId && a.slot === from.slotId));
    positions.push({
      group: target.groupId,
      slot: target.slotId,
    });

    const updatedState: ContextState = {
      ...this.state,
      actions: {
        ...this.state.actions,
        [actionId]: positions,
      },
    };

    game.actions.clearSlottedAction(from.slotId);
    this.clientAssignSlottedAction(target.slotId, target.anchorId, target.groupId, actionId);
    this.updateState(updatedState);
  }

  private removeAction = (actionId: number, groupId: number, slotId: number) => {
    const positions = (this.state.actions[actionId] || []).slice()
      .filter(a => !(a.group === groupId && a.slot === slotId));

    const updatedState: ContextState = {
      ...this.state,
      actions: {
        ...this.state.actions,
        [actionId]: positions,
      },
    };

    game.actions.clearSlottedAction(slotId);

    this.updateState(updatedState);
  }

  private replaceOrSwapAction = (
    from: {
      actionId: number,
      groupId?: number,
      slotId?: number,
    },
    target: {
      actionId: number,
      groupId: number,
      slotId: number,
    }
  ) => {
    if (!target || !from) {
      return;
    }

    if (target.actionId === from.actionId) {
      // do nothing when the same actions
      return;
    }

    if (idIsInvalid(from.groupId)) {
      // replacing
      const targetPositions = (this.state.actions[target.actionId] || []).slice()
      .filter(a => !(a.group === target.groupId && a.slot === target.slotId));

      const fromPositions = (this.state.actions[from.actionId] || []).slice()
      .filter(a => !(a.group === from.groupId && a.slot === from.slotId));
      fromPositions.push({
        group: target.groupId,
        slot: target.slotId,
      });

      const updatedState: ContextState = {
        ...this.state,
        actions: {
          ...this.state.actions,
          [target.actionId]: targetPositions,
          [from.actionId]: fromPositions,
        },
        queuedAbilityId: null,
      };

      this.clientAssignSlottedAction(
        target.slotId,
        updatedState.slots[target.slotId].anchorId,
        target.groupId,
        from.actionId,
      );

      this.updateState(updatedState);
    } else {
      // swapping
      const targetPositions = (this.state.actions[target.actionId] || []).slice()
        .filter(a => !(a.group === target.groupId && a.slot === target.slotId));
      targetPositions.push({
        group: from.groupId,
        slot: from.slotId,
      });

      const fromPositions = (this.state.actions[from.actionId] || []).slice()
        .filter(a => !(a.group === from.groupId && a.slot === from.slotId));
      fromPositions.push({
        group: target.groupId,
        slot: target.slotId,
      });

      const updatedState: ContextState = {
        ...this.state,
        actions: {
          ...this.state.actions,
          [target.actionId]: targetPositions,
          [from.actionId]: fromPositions,
        },
        slots: {
          ...this.state.slots,
          [from.slotId]: {
            ...this.state.slots[from.slotId],
            anchorId: this.state.slots[target.slotId].anchorId,
          },
          [target.slotId]: {
            ...this.state.slots[target.slotId],
            anchorId: this.state.slots[from.slotId].anchorId,
          }
        },
        queuedAbilityId: null,
      };

      this.clientAssignSlottedAction(from.slotId, this.state.slots[from.slotId].anchorId, from.groupId, target.actionId);
      this.clientAssignSlottedAction(target.slotId, this.state.slots[target.slotId].anchorId, target.groupId, from.actionId);

      this.updateState(updatedState);
    }
  }

  private setAnchorPosition = (anchorId: number, positionPercentage: Vec2f) => {
    if (!this.state.anchors[anchorId]) {
      return;
    }

    const updatedState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          ...this.state.anchors[anchorId],
          positionPercentage,
        },
      },
    }

    this.updateState(updatedState);
  }

  private queueAddAction = (abilityId: number) => {
    this.setState({ queuedAbilityId: abilityId });
    this.enableActionEditMode();
  }

  private clearQueueAddAction = () => {
    this.setState({ queuedAbilityId: null });
  }

  private addAnchor = () => {
    const anchorId = this.generateAnchorId(this.state.anchors);
    const groupId = this.generateGroupId(anchorId, this.state.anchors);

    const newSlot: ActionSlot = {
      id: this.generateSlotId(this.state.slots),
      angle: 0,
      anchorId,
      parent: { type: ParentType.Anchor, id: anchorId },
      children: [],
    };

    const updatedState = {
      ...this.state,
      anchors: {
        ...this.state.anchors,
        [anchorId]: {
          id: anchorId,
          positionPercentage: { x: 50, y: 90 },
          activeGroupIndex: 0,
          groups: [groupId],
          children: [newSlot.id],
        },
      },

      anchorIdToVisibility: {
        ...this.state.anchorIdToVisibility,
        [anchorId]: true,
      },

      slots: {
        ...this.state.slots,
        [newSlot.id]: newSlot,
      }
    }

    this.updateState(updatedState);
  }

  private removeAnchor = (anchorId: number) => {
    if (Object.keys(this.state.anchors).filter(anchor => !isSystemAnchorId(Number(anchor))).length <= 1) {
      return;
    }
    const anchorsClone = cloneDeep(this.state.anchors);
    const slotsClone = cloneDeep(this.state.slots);
    const actionsClone = cloneDeep(this.state.actions);

    const childrenToRemove = Object.values(slotsClone).filter((slot) => {
      return slot.anchorId === anchorId;
    });

    let actionSlotIndex = -1;
    childrenToRemove.forEach((childSlot) => {
      Object.keys(actionsClone).forEach((actionId) => {
        if (actionsClone[actionId as any].find(a => a.slot === childSlot.id)) {
          if (!idIsInvalid(Number(actionId))) {
            // Remove slot from actions map
            const action = actionsClone[actionId as any];
            const slotIndex = action.findIndex(a => a.slot === childSlot.id);
            if (slotIndex !== -1) {
              actionSlotIndex = slotIndex;
            }
    
            if (actionSlotIndex !== 1) {
              actionsClone[actionId].splice(actionSlotIndex, 1);
            }
          }
        }
      });

      // Remove slot from slots map
      delete slotsClone[childSlot.id];
    });

    // Remove anchor from anchors map
    delete anchorsClone[anchorId];

    const updatedState: ContextState = {
      ...this.state,
      anchors: {
        ...anchorsClone,
      },
      slots: {
        ...slotsClone,
      },
      actions: {
        ...actionsClone,
      },
    };

    game.actions.removeAnchor(anchorId);
    this.updateState(updatedState);
  }

  private clientAssignSlottedAction = (slotId: number,
                                          anchorId: number,
                                          groupId: number,
                                          actionId: number) => {
    game.actions.assignSlottedAction(slotId, anchorId, groupId, actionId);
  }

  private clientSetActiveAnchorGroup = (anchorId: number, groupId: number) => {
    game.actions.setActiveAnchorGroup(anchorId, groupId);
  }

  private generateAnchorId = (anchors: { [anchorId: number]: ActionViewAnchor }): number => {
    const sortedAnchors = Object.values(anchors).sort((a, b) => {
      return a.id - b.id;
    });

    const lastAnchor = sortedAnchors[sortedAnchors.length - 1];

    if (!lastAnchor) {
      return 1;
    }

    return lastAnchor.id + 1;
  }

  private generateGroupId = (anchorId: number, anchors: { [anchorId: number]: ActionViewAnchor }): number => {
    if (typeof anchors[anchorId] === 'undefined') {
      return 1;
    }

    const sortedGroups = anchors[anchorId].groups.sort((a, b) => {
      return a - b;
    });

    return sortedGroups[sortedGroups.length - 1] + 1;
  }

  private generateSlotId = (slots: { [slotId: number]: ActionSlot }): number => {
    const sortedSlots = Object.values(slots).sort((a, b) => {
      return a.id - b.id;
    });

    if (!sortedSlots[sortedSlots.length - 1]) {
      return 1;
    }

    return sortedSlots[sortedSlots.length - 1].id + 1;
  }

  private deleteAbility = (abilityId: number) => {
    const actions = { ...this.state.actions };
    delete actions[abilityId];

    const state: ContextState = {
      ...this.state,
      actions,
    };

    this.updateState(state);
  }

  private updateState = (updatedState: ContextState) => {
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }
}
