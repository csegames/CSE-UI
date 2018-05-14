/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ql, client, events, webAPI, ContextMenuContentProps } from '@csegames/camelot-unchained';

import ContextMenuAction from './ContextMenuAction';
import eventNames from '../../../../lib/eventNames';
import { prettifyText } from '../../../../lib/utils';
import { InventoryItemFragment, ItemActionsFragment } from '../../../../../../gqlInterfaces';

declare const toastr: any;

export interface ContextMenuContentCompProps {
  item: InventoryItemFragment;
  contextMenuProps: ContextMenuContentProps;
  syncWithServer: () => void;
}

class ContextMenuContent extends React.Component<ContextMenuContentCompProps> {
  public render() {
    return (
      <div>
        {this.renderGearSlotButtons()}
        {this.props.item.actions && this.props.item.actions.map((action) => {
          return (
            <ContextMenuAction
              key={action.id}
              name={action.name}
              action={action}
              onActionClick={this.onActionClick}
              syncWithServer={this.props.syncWithServer}
            />
          );
        })}
        {this.props.item.staticDefinition.deploySettings &&
          <ContextMenuAction name={'Deploy'} onActionClick={this.onDeployItem} syncWithServer={this.props.syncWithServer} />
        }
        <ContextMenuAction name={'Drop item'} onActionClick={this.onDropItem} syncWithServer={this.props.syncWithServer} />
      </div>
    );
  }

  private renderGearSlotButtons = () => {
    const item = this.props.item;
    const gearSlotSets = item && item.staticDefinition && item.staticDefinition.gearSlotSets;
    return gearSlotSets && gearSlotSets.map((gearSlotSet, i) => {
      return (
        <ContextMenuAction
          key={i}
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
    });
  }

  private onEquipItem = (gearSlots: Partial<ql.schema.GearSlotDefRef>[]) => {
    const { item, contextMenuProps } = this.props;
    const payload: any = {
      inventoryItem: item,
      willEquipTo: gearSlots,
    };
    events.fire(eventNames.onEquipItem, payload);
    events.fire(eventNames.onDehighlightSlots);
    contextMenuProps.close();
  }

  private onDropItem = () => {
    const { item, contextMenuProps } = this.props;
    const payload = {
      inventoryItem: item,
    };
    events.fire(eventNames.updateInventoryItems, payload);
    events.fire(eventNames.onDropItem, payload);
    contextMenuProps.close();
  }

  private onDeployItem = () => {
    const { id, staticDefinition } = this.props.item;
    this.closeInventory();
    const deploySettings = {};
    Object.keys(staticDefinition.deploySettings).forEach((key) => {
      if (key !== 'resourceID') {
        deploySettings[key] = staticDefinition.deploySettings[key];
      }
    });

    const _resourceID = staticDefinition.deploySettings.resourceID !== '0' ?
      staticDefinition.deploySettings.resourceID : staticDefinition.defaultResourceID;
    client.StartPlacingItem(_resourceID, id, deploySettings);
  }

  private onActionClick = async (action: ItemActionsFragment) => {
    try {
      const res = await webAPI.ItemAPI.PerformItemAction(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        this.props.item.id,
        client['playerState'].id,
        action.id,
        null,
      );
      if (res.ok) {
        if (action.uIReaction === 'CloseInventory') {
          this.closeInventory();
          this.props.contextMenuProps.close();
        }
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

  private closeInventory = () => {
    events.fire(eventNames.onCloseInventory);
  }

  private onHighlightSlots = (gearSlots: Partial<ql.schema.GearSlotDefRef>[]) => {
    events.fire(eventNames.onHighlightSlots, gearSlots);
  }

  private onDehighlightSlots = () => {
    events.fire(eventNames.onDehighlightSlots);
  }
}

export default ContextMenuContent;
