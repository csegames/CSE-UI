/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { debounce } from 'lodash';

export const MAX_GROUP_COUNT = 6;
export const MAX_CHILD_SLOT_COUNT = 4;

const ABILITY_BAR_VERSION = '1';
const ABILITY_BAR_VERSION_KEY = 'cu/game/abilities/barVersion';
const ABILITY_BAR_KEY = 'cu/game/abilities/bar';

function idIsInvalid(id: number) {
  return typeof id !== 'number' || id === 0;
}

export enum EditMode {
  Disabled,
  ActionEdit,
  SlotEdit,
}

interface ContextState {
  anchors: { [anchorId: number]: ActionViewAnchor };
  actions: { [actionId: number]: ActionPosition[] }; // action id => position map
  slots: { [slotId: number]: ActionSlot };

  editMode: EditMode;
  queuedAbilityId: number;
}

interface ContextFunctions {
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
  actions: number[];
  parent: { type: ParentType, id: number };
  children: number[];
}

function noOp() {}
export function getDefaultActionViewContextState(): ContextState {
  return {
    anchors: {},
    actions: {},
    slots: {},
    editMode: EditMode.Disabled,
    queuedAbilityId: null,
  }
}

export const ActionViewContext = React.createContext<ActionViewContextState>({
  ...getDefaultActionViewContextState(),
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
});

export function isSystemAnchorId(anchorId: number) {
  return anchorId < 0;
}

export class ActionViewContextProvider extends React.Component<{}, ContextState> {
  private abilityBarUpdateEVH: EventHandle;
  private systemAnchorInitEVH: EventHandle;
  private initializeStateTimeout: number;
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
      }}>
        {this.props.children}
      </ActionViewContext.Provider>
    );
  }

  public componentDidMount() {
    camelotunchained.game.store.refetch().then(() => {
      this.initializeState();
    });

    camelotunchained.game.abilityBarState.onUpdated(this.handleAbilityBarStateUpdate);
  }

  public componentWillUnmount() {
    this.abilityBarUpdateEVH.clear();
    this.systemAnchorInitEVH.clear();

    if (this.initializeStateTimeout) {
      window.clearTimeout(this.initializeStateTimeout);
    }
  }

  private handleAbilityBarStateUpdate = () => {
    const abilitiesArray = Object.values(camelotunchained.game.abilityBarState.abilities);
    this.initializeActionView(abilitiesArray);
  }

  private initializeState = () => {
    if (camelotunchained.game.abilityBarState.isReady) {
      const abilitiesArray = Object.values(camelotunchained.game.abilityBarState.abilities);
      if (abilitiesArray.length === 0) {
        this.initializeStateTimeout = window.setTimeout(this.initializeState, 100);
        return;
      }

      this.initializeActionView(abilitiesArray);
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
    // actionView = JSON.parse("{\"anchors\":{\"1\":{\"id\":1,\"children\":[1],\"groups\":[1,2,3],\"activeGroupIndex\":0,\"position\":{\"x\":961,\"y\":605}},\"2\":{\"id\":2,\"activeGroupIndex\":0,\"groups\":[1],\"children\":[24],\"position\":{\"x\":1329,\"y\":710}},\"-2\":{\"id\":-2,\"position\":{\"x\":300,\"y\":400},\"activeGroupIndex\":0,\"groups\":[1],\"children\":[17]}},\"actions\":{\"0\":[{\"group\":1,\"slot\":1}],\"1\":[{\"group\":1,\"slot\":2}],\"2\":[{\"group\":1,\"slot\":16}],\"3\":[{\"group\":1,\"slot\":4}],\"4\":[{\"group\":1,\"slot\":5}],\"5\":[{\"group\":1,\"slot\":24}],\"6\":[{\"group\":1,\"slot\":17}],\"7\":[{\"group\":1,\"slot\":18}],\"8\":[{\"group\":1,\"slot\":19}],\"9\":[{\"group\":1,\"slot\":20}],\"10\":[{\"group\":1,\"slot\":7}],\"11\":[{\"group\":1,\"slot\":25}],\"12\":[{\"group\":1,\"slot\":9}],\"13\":[{\"group\":1,\"slot\":10}],\"14\":[{\"group\":1,\"slot\":11}],\"15\":[{\"group\":1,\"slot\":12}],\"16\":[{\"group\":1,\"slot\":21}],\"17\":[{\"group\":1,\"slot\":22}],\"18\":[{\"group\":1,\"slot\":23}],\"19\":[{\"group\":1,\"slot\":14}],\"20\":[{\"group\":1,\"slot\":8}],\"21\":[{\"group\":1,\"slot\":15}],\"22\":[{\"group\":1,\"slot\":6}]},\"slots\":{\"1\":{\"id\":1,\"angle\":0,\"anchorId\":1,\"actions\":[0],\"parent\":{\"type\":0,\"id\":1},\"children\":[2]},\"2\":{\"id\":2,\"angle\":0,\"anchorId\":1,\"actions\":[1],\"parent\":{\"type\":1,\"id\":1},\"children\":[3]},\"3\":{\"id\":3,\"angle\":0,\"anchorId\":1,\"actions\":[2],\"parent\":{\"type\":1,\"id\":2},\"children\":[4]},\"4\":{\"id\":4,\"angle\":0,\"anchorId\":1,\"actions\":[3],\"parent\":{\"type\":1,\"id\":3},\"children\":[5]},\"5\":{\"id\":5,\"angle\":0,\"anchorId\":1,\"actions\":[4],\"parent\":{\"type\":1,\"id\":4},\"children\":[6]},\"6\":{\"id\":6,\"angle\":0,\"anchorId\":1,\"actions\":[5],\"parent\":{\"type\":1,\"id\":5},\"children\":[7]},\"7\":{\"id\":7,\"angle\":0,\"anchorId\":1,\"actions\":[10],\"parent\":{\"type\":1,\"id\":6},\"children\":[8]},\"8\":{\"id\":8,\"angle\":0,\"anchorId\":1,\"actions\":[11],\"parent\":{\"type\":1,\"id\":7},\"children\":[9]},\"9\":{\"id\":9,\"angle\":0,\"anchorId\":1,\"actions\":[12],\"parent\":{\"type\":1,\"id\":8},\"children\":[10]},\"10\":{\"id\":10,\"angle\":0,\"anchorId\":1,\"actions\":[13],\"parent\":{\"type\":1,\"id\":9},\"children\":[11]},\"11\":{\"id\":11,\"angle\":0,\"anchorId\":1,\"actions\":[14],\"parent\":{\"type\":1,\"id\":10},\"children\":[12]},\"12\":{\"id\":12,\"angle\":0,\"anchorId\":1,\"actions\":[15],\"parent\":{\"type\":1,\"id\":11},\"children\":[13]},\"13\":{\"id\":13,\"angle\":0,\"anchorId\":1,\"actions\":[19],\"parent\":{\"type\":1,\"id\":12},\"children\":[14]},\"14\":{\"id\":14,\"angle\":0,\"anchorId\":1,\"actions\":[20],\"parent\":{\"type\":1,\"id\":13},\"children\":[15]},\"15\":{\"id\":15,\"angle\":0,\"anchorId\":1,\"actions\":[21],\"parent\":{\"type\":1,\"id\":14},\"children\":[16]},\"16\":{\"id\":16,\"angle\":0,\"anchorId\":1,\"actions\":[22],\"parent\":{\"type\":1,\"id\":15},\"children\":[]},\"17\":{\"id\":17,\"angle\":0,\"anchorId\":-2,\"actions\":[6],\"parent\":{\"type\":0,\"id\":-2},\"children\":[18]},\"18\":{\"id\":18,\"angle\":0,\"anchorId\":-2,\"actions\":[7],\"parent\":{\"type\":1,\"id\":17},\"children\":[19]},\"19\":{\"id\":19,\"angle\":0,\"anchorId\":-2,\"actions\":[8],\"parent\":{\"type\":1,\"id\":18},\"children\":[20]},\"20\":{\"id\":20,\"angle\":0,\"anchorId\":-2,\"actions\":[9],\"parent\":{\"type\":1,\"id\":19},\"children\":[21]},\"21\":{\"id\":21,\"angle\":0,\"anchorId\":-2,\"actions\":[16],\"parent\":{\"type\":1,\"id\":20},\"children\":[22]},\"22\":{\"id\":22,\"angle\":0,\"anchorId\":-2,\"actions\":[17],\"parent\":{\"type\":1,\"id\":21},\"children\":[23]},\"23\":{\"id\":23,\"angle\":0,\"anchorId\":-2,\"actions\":[18],\"parent\":{\"type\":1,\"id\":22},\"children\":[]},\"24\":{\"id\":24,\"angle\":0,\"actions\":[],\"anchorId\":2,\"parent\":{\"type\":0,\"id\":2},\"children\":[25]},\"25\":{\"id\":25,\"angle\":0,\"actions\":[],\"anchorId\":2,\"parent\":{\"type\":1,\"id\":24},\"children\":[]}}}");

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

      shouldUpdateLocalStorage = true;

      const systemAnchorActionView = this.getAbilityGroupActionView(
        systemAnchorIdToAbilities[systemAnchorId],
        actionView,
        Number(systemAnchorId),
      );

      actionView = {
        ...actionView,
        anchors: {
          ...actionView.anchors,
          ...systemAnchorActionView.anchors,
        },
        actions: {
          ...actionView.actions,
          ...systemAnchorActionView.actions,
        },
        slots: {
          ...actionView.slots,
          ...systemAnchorActionView.slots,
        },
      };
    });

    if (shouldUpdateLocalStorage) {
      this.updateLocalStorage(actionView);
    }

    if (this.isInitial) {
      this.initializeClient(actionView.anchors, actionView.slots, actionView.actions);
      this.isInitial = false;
    }
    this.setState({ ...actionView, editMode: EditMode.Disabled });
  }

  private getAbilityGroupActionView = (abilityIds: number[], actionView?: ContextState, systemAnchorId?: number) => {
    const anchorId = systemAnchorId || this.generateAnchorId(this.state.anchors);
    const groupId = this.generateGroupId(anchorId, this.state.anchors);

    const slots: { [slotId: number]: ActionSlot } = actionView ? { ...actionView.slots } : {};
    const actions: { [actionId: number]: ActionPosition[] } = actionView ? { ...actionView.actions } : {};

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
        actions: [abilityId],
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
          positionPercentage: { x: 50, y: typeof systemAnchorId !== 'undefined' ? 80 : 95 },
          activeGroupIndex: 0,
          groups: [groupId],
          children: [firstSlotId],
        },
      },
      actions,
      slots,
      editMode: EditMode.Disabled,
      queuedAbilityId: null,
    } as ContextState;
  }

  private initializeClient = async (anchors: { [anchorId: number]: ActionViewAnchor },
                                    slots: { [slotId: number]: ActionSlot },
                                    actions: { [actionId: number]: ActionPosition[] }) => {
    // console.log('YOYOOYOYOYOYOYOOO');
    // console.log(anchors);
    // console.log(slots);
    // console.log(actions);
    try {
      const res = await game.actions.enterActionBarEditModeAsync();
      if (res.success) {
        Object.values(anchors).forEach((anchor, i) => {
          if (!isSystemAnchorId(anchor.id)) {
            this.clientSetActiveAnchorGroup(anchor.id, anchor.groups[anchor.activeGroupIndex]);
          }
        });

        Object.values(slots).forEach((slot, i) => {
          slot.actions.forEach((actionId) => {
            const action = actions[actionId].find(a => a.slot === slot.id);
            if (!isSystemAnchorId(slot.anchorId)) {
              if (!action) {
                console.error('There was an action that was undefined');
                return;
              }

              this.clientAssignSlottedAction(slot.id, slot.anchorId, action.group, actionId);
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
    try {
      const res = await game.actions.enterActionBarEditModeAsync();
      if (res.success) {
        this.setState({ editMode: EditMode.ActionEdit });
      }
    } catch(e) {
      console.error('There was an error entering enableActionEditMode');
    }
  }

  private enableSlotEditMode = async () => {
    try {
      const res = await game.actions.enterActionBarEditModeAsync();
      if (res.success) {
        this.setState({ editMode: EditMode.SlotEdit });
      }
    } catch(e) {
      console.error('There was an error entering enableActionEditMode');
    }
  }

  private disableEditMode = async () => {
    try {
      const res = await game.actions.exitActionBarEditModeAsync();
      if (res.success) {
        this.setState({ editMode: EditMode.Disabled, queuedAbilityId: null });
      }
    } catch(e) {
      console.error('There was an error exiting diableEditMode');
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

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
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

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
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

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private activateNextGroup = (anchorId: number) => {
    const anchor = this.state.anchors[anchorId];
    if (!anchor) {
      console.warn(`Could not activateNextGroup. An anchor with id '${anchorId}' was not found.`);
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

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private activatePrevGroup = (anchorId: number) => {
    const anchor = this.state.anchors[anchorId];
    if (!anchor) {
      console.warn(`Could not activatePrevGroup. An anchor with id '${anchorId}' was not found.`);
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

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private addSlot = (addingToAnchor: boolean, parentId: number) => {
    const anchorId = this.state.slots[parentId] ? this.state.slots[parentId].anchorId : parentId;

    const newSlot: ActionSlot = {
      id: this.generateSlotId(this.state.slots),
      angle: 0,
      actions: [],
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

      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
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
      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
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

      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
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
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
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
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
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
      slots: {
        ...this.state.slots,
        [slotId]: {
          ...this.state.slots[slotId],
          actions: this.state.slots[slotId].actions.concat(actionId),
        },
      },
      queuedAbilityId: null,
    };

    this.clientAssignSlottedAction(slotId, updatedState.slots[slotId].anchorId, groupId, actionId);

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private addAndRemoveAction = (
    actionId: number,
    from: {
      groupId: number,
      slotId: number,
    },
    target: {
      groupId: number,
      slotId: number,
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
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
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

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
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
        slots: {
          ...this.state.slots,
          [target.slotId]: {
            ...this.state.slots[target.slotId],
            actions: this.state.slots[target.slotId].actions.concat(from.actionId),
          }
        },
        queuedAbilityId: null,
      };

      this.clientAssignSlottedAction(
        target.slotId,
        updatedState.slots[target.slotId].anchorId,
        target.groupId,
        from.actionId,
      );

      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
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
            actions: this.state.slots[from.slotId].actions.filter(a => a !== from.actionId).concat(target.actionId),
          },
          [target.slotId]: {
            ...this.state.slots[target.slotId],
            anchorId: this.state.slots[from.slotId].anchorId,
            actions: this.state.slots[target.slotId].actions.filter(a => a !== target.actionId).concat(from.actionId),
          }
        },
        queuedAbilityId: null,
      };

      this.clientAssignSlottedAction(from.slotId, this.state.slots[from.slotId].anchorId, from.groupId, target.actionId);
      this.clientAssignSlottedAction(target.slotId, this.state.slots[target.slotId].anchorId, target.groupId, from.actionId);

      this.updateLocalStorage(updatedState);
      this.setState(updatedState);
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

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
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
      actions: [],
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
          positionPercentage: { x: 50, y: 80 },
          activeGroupIndex: 0,
          groups: [groupId],
          children: [newSlot.id],
        },
      },

      slots: {
        ...this.state.slots,
        [newSlot.id]: newSlot,
      }
    }

    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
  }

  private removeAnchor = (anchorId: number) => {
    if (Object.keys(this.state.anchors).length <= 1) {
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
      childSlot.actions.forEach((actionId) => {
        if (!idIsInvalid(actionId)) {
          // Remove slot from actions map
          const action = actionsClone[actionId];
          const slotIndex = action.findIndex(a => a.slot === childSlot.id);
          if (slotIndex !== -1) {
            actionSlotIndex = slotIndex;
          }
  
          if (actionSlotIndex !== 1) {
            actionsClone[actionId].splice(actionSlotIndex, 1);
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
    this.updateLocalStorage(updatedState);
    this.setState(updatedState);
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
}
