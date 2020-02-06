/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { includes } from 'lodash';
import { webAPI } from '@csegames/library/lib/camelotunchained';

import ContextMenuAction from './ContextMenuAction';
import { hideContextMenu } from 'actions/contextMenu';
import eventNames, { UpdateInventoryItemsPayload, EquipItemPayload } from 'fullscreen/lib/itemEvents';
import {
  GearSlotDefRef,
  InventoryItem,
} from 'gql/interfaces';
import {
  prettifyText,
  hasGroundPermissions,
  hasEquipmentPermissions,
  getInventoryDataTransfer,
  FullScreenContext,
} from 'fullscreen/lib/utils';

declare const toastr: any;

export interface InjectedContextedMenuContentProps {
  visibleComponentRight: string;
  visibleComponentLeft: string;
}

export interface ContextMenuProps {
  item: InventoryItem.Fragment;
  syncWithServer: () => void;
  containerID: string[];
  drawerID: string;
  onContextMenuShow: () => void;
  onContextMenuHide: () => void;
}

export type ContextMenuComponentProps = InjectedContextedMenuContentProps & ContextMenuProps;

class ContextMenuContent extends React.Component<ContextMenuComponentProps> {
  private evh: EventHandle;
  private prevPlacementModeActive: boolean = false;
  public render() {
    const { item } = this.props;
    const gearSlotSets = item && item.staticDefinition && item.staticDefinition.gearSlotSets;
    return (
      <div>
        {hasEquipmentPermissions(item) ? gearSlotSets && gearSlotSets.map((gearSlotSet, i) => {
          return (
            <ContextMenuAction
              key={i}
              itemId={item.id}
              name={`Equip to ${gearSlotSet.gearSlots.map((gearSlot, i) => {
                return prettifyText(gearSlot.id);
              }).toString()}`}
              onActionClick={() => this.onEquipItem(gearSlotSet.gearSlots)}
              onMouseOver={() => this.onHighlightSlots(gearSlotSet.gearSlots)}
              onMouseLeave={this.onDehighlightSlots}
              syncWithServer={this.props.syncWithServer}
            />
          );
        }) : null}
        {/* TODO
        {isStackedItem(item) &&
          <ContextMenuAction
            name={'Move half'}
            onActionClick={() => this.props.onMoveStack(item, Math.floor(item.stats.item.unitCount / 2))}
            syncWithServer={this.props.syncWithServer}
          />
        } */}
        {item.actions && item.actions.map((action) => {
          if (!action.enabled && !action.showWhenDisabled) {
            return null;
          }
          return (
            <ContextMenuAction
              key={action.id}
              itemId={item.id}
              name={action.name}
              action={action}
              onActionClick={this.onActionClick}
              syncWithServer={this.props.syncWithServer}
            />
          );
        })}
        {hasGroundPermissions(item) && item.staticDefinition.deploySettings ?
          <ContextMenuAction
            itemId={item.id}
            name={'Deploy'}
            onActionClick={this.onDeployItem}
            syncWithServer={this.props.syncWithServer}
          /> : null
        }
        {hasGroundPermissions(item) ?
          <ContextMenuAction
            itemId={item.id}
            name={'Drop item'}
            onActionClick={this.onDropItem}
            syncWithServer={this.props.syncWithServer}
          /> : null
        }
      </div>
    );
  }

  public componentDidMount() {
    this.props.onContextMenuShow();
    this.evh = camelotunchained.game.onItemPlacementModeChanged(this.handleItemPlacementModeChanged);
  }

  public componentDidUpdate(prevProps: ContextMenuComponentProps) {
    const { visibleComponentLeft, visibleComponentRight } = this.props;
    if (includes(prevProps.visibleComponentRight, 'inventory') && !includes(visibleComponentRight, 'inventory') ||
        includes(prevProps.visibleComponentLeft, 'inventory') && !includes(visibleComponentLeft, 'inventory')) {
      hideContextMenu();
    }
  }

  public componentWillUnmount() {
    this.props.onContextMenuHide();
    this.evh.clear();
  }

  private handleItemPlacementModeChanged = (isActive: boolean) => {
    if (!this.prevPlacementModeActive && isActive) {
      hideContextMenu();
    }

    this.prevPlacementModeActive = isActive;
  }

  private onEquipItem = (gearSlots: GearSlotDefRef.Fragment[]) => {
    const { item } = this.props;
    const itemDataTransfer = getInventoryDataTransfer({
      item,
      position: item.location.inContainer ? item.location.inContainer.position : item.location.inventory.position,
      location: item.location.inContainer ? 'inContainer' : 'inventory',
      containerID: this.props.containerID,
      drawerID: this.props.drawerID,
    });
    const payload: EquipItemPayload = {
      newItem: itemDataTransfer,
      willEquipTo: gearSlots,
    };
    game.trigger(eventNames.onEquipItem, payload);
    game.trigger(eventNames.onDehighlightSlots);
    hideContextMenu();
  }

  private onDropItem = () => {
    const { item, containerID, drawerID } = this.props;
    const position = item.location.inContainer ? item.location.inContainer.position : item.location.inventory.position;
    const dataTransfer = getInventoryDataTransfer({
      item,
      location: item.location.inContainer ? 'inContainer' : 'inventory',
      position,
      containerID,
      drawerID,
    });

    const payload: UpdateInventoryItemsPayload = {
      type: 'Drop',
      inventoryItem: dataTransfer,
    };
    game.trigger(eventNames.updateInventoryItems, payload);
    game.trigger(eventNames.onDropItem, payload);
    hideContextMenu();
  }

  private onDeployItem = (action?: InventoryItem.Actions) => {
    const { id, staticDefinition } = this.props.item;
    this.closeInventory();

    game.itemPlacementMode.requestStart(staticDefinition.numericItemDefID, id, (action && action.id) || '');
  }

  private onActionClick = (action: InventoryItem.Actions) => {
    if (action.uIReaction === 'PlacementMode') {
      this.onDeployItem(action);
      this.closeInventory();
    } else {
      this.makeItemActionRequest(action);
    }
  }

  private makeItemActionRequest = async (action: InventoryItem.Actions) => {
    try {
      const res = await webAPI.ItemAPI.PerformItemAction(
        webAPI.defaultConfig,
        this.props.item.id,
        camelotunchained.game.selfPlayerState.entityID, // TODO COHERENT check if this is correct
        action.id,
        null,
      );
      if (res.ok) {
        this.handleUIReaction(action);
      } else {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
        } else {
          // This means api server failed perform item action request but did not provide a message about what happened
          toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
        }
      }
    } catch (e) {
      toastr.error('There was an unhandled error!', 'Oh No!!', { timeout: 5000 });
    }
  }

  private handleUIReaction = (action: InventoryItem.Actions) => {
    switch (action.uIReaction) {
      case 'CloseInventory': {
        this.closeInventory();
        hideContextMenu();
        break;
      }

      case 'OpenMiniMap': {
        this.openMiniMap();
        break;
      }

      default: break;
    }
  }

  private closeInventory = () => {
    game.trigger('navigate', 'inventory');
  }

  private openMiniMap = () => {
    game.trigger('navigate', 'map');
  }

  private onHighlightSlots = (gearSlots: Partial<GearSlotDefRef>[]) => {
    game.trigger(eventNames.onHighlightSlots, gearSlots);
  }

  private onDehighlightSlots = () => {
    game.trigger(eventNames.onDehighlightSlots);
  }
}

class ContextMenuContentWithInjectedProps extends React.Component<ContextMenuProps> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({ visibleComponentLeft, visibleComponentRight }) => {
          return (
            <ContextMenuContent
              {...this.props}
              visibleComponentLeft={visibleComponentLeft}
              visibleComponentRight={visibleComponentRight}
            />
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default ContextMenuContentWithInjectedProps;
