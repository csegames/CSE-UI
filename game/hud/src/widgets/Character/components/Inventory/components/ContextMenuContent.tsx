/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-07-05 15:22:27
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-17 16:12:11
 */

import * as React from 'react';

import { ContextMenuContentProps, RaisedButton, client, events, ql } from 'camelot-unchained';
import { InjectedGraphQLProps, graphql } from 'react-apollo';

import { ContextMenuContentQuery } from '../../../../../gqlInterfaces';
import { StyleDeclaration } from 'aphrodite';
import eventNames from '../../../lib/eventNames';
import { prettifySlotName } from '../../../lib/utils';
import queries from '../../../../../gqlDocuments';

export interface ContextMenuContentStyle extends StyleDeclaration {
  contextMenuButton: React.CSSProperties;
}

export const defaultContextMenuContentStyle: ContextMenuContentStyle = {
  contextMenuButton: {
    borderBottom: '1px solid #222',
    maxWidth: '300px',
  },
};

export interface ContextMenuContentCompProps extends InjectedGraphQLProps<ContextMenuContentQuery> {
  styles?: Partial<ContextMenuContentStyle>;
  itemId?: string;
  contextMenuProps: ContextMenuContentProps;
}

class ContextMenuContent extends React.Component<ContextMenuContentCompProps, {}> {
  public render() {
    const { contextMenuButton } = defaultContextMenuContentStyle;
    return (
      <div>
        {this.renderGearSlotButtons()}
        <RaisedButton styles={{ button: contextMenuButton }} onClick={this.onDropItem}>
          Drop item
        </RaisedButton>
      </div>
    );
  }

  private renderGearSlotButtons = () => {
    const { gearSlotSets } = this.props.data.item && this.props.data.item.staticDefinition;
    const { contextMenuButton } = defaultContextMenuContentStyle;
    return gearSlotSets && gearSlotSets.map((gearSlotSet, i) => {
      return (
        <RaisedButton
          key={i}
          styles={{ button: contextMenuButton }}
          onClick={() => this.onEquipItem(gearSlotSet.gearSlots)}
          onMouseOver={() => this.onHighlightSlots(gearSlotSet.gearSlots)}
          onMouseLeave={this.onDehighlightSlots}>
          Equip to&nbsp;
          {gearSlotSet.gearSlots.map((gearSlot, i) => {
            if (i !== gearSlotSet.gearSlots.length - 1) {
              return prettifySlotName(gearSlot.id) + ', ';
            } else {
              return prettifySlotName(gearSlot.id);
            }
          })}
        </RaisedButton>
      );
    });
  }

  private onEquipItem = (gearSlots: Partial<ql.schema.GearSlotDefRef>[]) => {
    const { data, contextMenuProps } = this.props;
    const payload: any = {
      inventoryItem: data.item,
      willEquipTo: gearSlots,
    };
    events.fire(eventNames.onEquipItem, payload);
    events.fire(eventNames.onDehighlightSlots);
    client.EquipItem(data.item.id);
    contextMenuProps.close();
  }

  private onDropItem = () => {
    const { data, contextMenuProps } = this.props;
    const payload = {
      inventoryItem: data.item,
    };
    events.fire(eventNames.updateInventoryItems, payload);
    client.DropItem(data.item.id);
    contextMenuProps.close();
  }

  private onHighlightSlots = (gearSlots: Partial<ql.schema.GearSlotDefRef>[]) => {
    events.fire(eventNames.onHighlightSlots, gearSlots);
  }

  private onDehighlightSlots = () => {
    events.fire(eventNames.onDehighlightSlots);
  }
}

const ContextMenuContentWithQL = graphql(queries.ContextMenuContent as any, {
  skip: (props: ContextMenuContentCompProps) => !props.itemId,
  options: (props: ContextMenuContentCompProps) => ({
    variables: {
      id: props.itemId,
      shard: client.shardID,
    },
  }),
})(ContextMenuContent);

export default ContextMenuContentWithQL;
