/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ql, client, events, ContextMenuContentProps } from '@csegames/camelot-unchained';
import eventNames from '../../../lib/eventNames';
import { prettifyText } from '../../../lib/utils';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';

const Button = styled('div')`
  background-color: gray;
  color: white;
  pointer-events: all;
  border-bottom: 1px solid #222;
  max-width: 300px;
  padding: 5px;
  cursor: pointer;

  &:hover {
    -webkit-filter: brightness(120%);
    filter: brightness(120%);
  }

  &:active {
    box-shadow: inset 0 0 3px rgba(0,0,0,0.5);
  }
`;

export interface ContextMenuContentCompProps {
  item: InventoryItemFragment;
  contextMenuProps: ContextMenuContentProps;
}

class ContextMenuContent extends React.Component<ContextMenuContentCompProps, {}> {
  public render() {
    return (
      <div>
        {this.renderGearSlotButtons()}
        {this.props.item.staticDefinition.deploySettings && <Button onClick={this.onDeployItem}>Deploy</Button>}
        <Button onClick={this.onDropItem}>
          Drop item
        </Button>
      </div>
    );
  }

  private renderGearSlotButtons = () => {
    const item = this.props.item;
    const gearSlotSets = item && item.staticDefinition && item.staticDefinition.gearSlotSets;
    return gearSlotSets && gearSlotSets.map((gearSlotSet, i) => {
      return (
        <Button
          key={i}
          onClick={() => this.onEquipItem(gearSlotSet.gearSlots)}
          onMouseOver={() => this.onHighlightSlots(gearSlotSet.gearSlots)}
          onMouseLeave={this.onDehighlightSlots}>
          Equip to&nbsp;
          {gearSlotSet.gearSlots.map((gearSlot, i) => {
            if (i !== gearSlotSet.gearSlots.length - 1) {
              return prettifyText(gearSlot.id) + ', ';
            } else {
              return prettifyText(gearSlot.id);
            }
          })}
        </Button>
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

  private closeInventory = () => {
    events.fire('hudnav--navigate', 'inventory');
  }

  private onHighlightSlots = (gearSlots: Partial<ql.schema.GearSlotDefRef>[]) => {
    events.fire(eventNames.onHighlightSlots, gearSlots);
  }

  private onDehighlightSlots = () => {
    events.fire(eventNames.onDehighlightSlots);
  }
}

export default ContextMenuContent;
