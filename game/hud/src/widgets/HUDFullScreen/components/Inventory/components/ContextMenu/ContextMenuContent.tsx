/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ql, client, events, webAPI, ContextMenuContentProps } from '@csegames/camelot-unchained';
import { ItemActionDefGQL } from '@csegames/camelot-unchained/lib/graphql/schema';

import ContextMenuAction from './ContextMenuAction';
import eventNames, { UpdateInventoryItemsPayload, EquipItemPayload } from '../../../../lib/eventNames';
import { InventoryItemFragment, GearSlotDefRefFragment } from '../../../../../../gqlInterfaces';
import {
  prettifyText,
  hasGroundPermissions,
  hasEquipmentPermissions,
  getInventoryDataTransfer,
} from '../../../../lib/utils';

declare const toastr: any;

export interface ContextMenuContentCompProps {
  item: InventoryItemFragment;
  contextMenuProps: ContextMenuContentProps;
  syncWithServer: () => void;
  containerID: string[];
  drawerID: string;
  onMoveStack: (item: InventoryItemFragment, amount: number) => void;
}

class ContextMenuContent extends React.Component<ContextMenuContentCompProps> {
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
                if (i !== gearSlotSet.gearSlots.length - 1) {
                  return prettifyText(gearSlot.id) + ', ';
                } else {
                  return prettifyText(gearSlot.id);
                }
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
              action={action as ItemActionDefGQL}
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

  private onEquipItem = (gearSlots: GearSlotDefRefFragment[]) => {
    const { item, contextMenuProps } = this.props;
    const itemDataTransfer = getInventoryDataTransfer({
      item,
      position: item.location.inContainer ? item.location.inContainer.position : item.location.inventory.position,
      location: item.location.inContainer ? 'Container' : 'Inventory',
      containerID: this.props.containerID,
      drawerID: this.props.drawerID,
    });
    const payload: EquipItemPayload = {
      inventoryItem: itemDataTransfer,
      willEquipTo: gearSlots,
    };
    events.fire(eventNames.onEquipItem, payload);
    events.fire(eventNames.onDehighlightSlots);
    contextMenuProps.close();
  }

  private onDropItem = () => {
    const { item, contextMenuProps, containerID, drawerID } = this.props;
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
    events.fire(eventNames.updateInventoryItems, payload);
    events.fire(eventNames.onDropItem, payload);
    contextMenuProps.close();
  }

  private onDeployItem = (action?: ItemActionDefGQL) => {
    const { id, staticDefinition } = this.props.item;
    this.closeInventory();
    const deploySettings = {};
    Object.keys(staticDefinition.deploySettings).forEach((key) => {
      if (key !== 'resourceID') {
        deploySettings[key] = staticDefinition.deploySettings[key];
      }
    });

    const deploySettingsWithNumericID = {
      ...staticDefinition.deploySettings,
      numericItemDefID: staticDefinition.numericItemDefID,
    };

    const _resourceID = staticDefinition.deploySettings.resourceID !== '0' ?
      staticDefinition.deploySettings.resourceID : staticDefinition.defaultResourceID;
    client.StartPlacingItem(_resourceID, id, deploySettingsWithNumericID, action ? action.id : null);
  }

  private onActionClick = (action: ItemActionDefGQL) => {
    if (action.uIReaction === 'PlacementMode') {
      this.onDeployItem(action);
      this.closeInventory();
    } else {
      this.makeItemActionRequest(action);
    }
  }

  private makeItemActionRequest = async (action: ItemActionDefGQL) => {
    try {
      const res = await webAPI.ItemAPI.PerformItemAction(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        this.props.item.id,
        client.playerState.id,
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

  private handleUIReaction = (action: ItemActionDefGQL) => {
    switch (action.uIReaction) {
      case 'CloseInventory': {
        this.closeInventory();
        this.props.contextMenuProps.close();
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
    events.fire('hudnav--navigate', 'inventory');
  }

  private openMiniMap = () => {
    events.fire('hudnav--navigate', 'map');
  }

  private onHighlightSlots = (gearSlots: Partial<ql.schema.GearSlotDefRef>[]) => {
    events.fire(eventNames.onHighlightSlots, gearSlots);
  }

  private onDehighlightSlots = () => {
    events.fire(eventNames.onDehighlightSlots);
  }
}

export default ContextMenuContent;
