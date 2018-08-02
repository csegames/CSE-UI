/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import * as base from '../../../ItemShared/InventoryBase';
import Drawer from './Drawer';
import ContainerHeader from './ContainerHeader';
import { InventoryDataTransfer } from '../../../../lib/eventNames';
import { InventorySlotItemDef, SlotItemDefType } from '../../../../lib/itemInterfaces';
import { ContainerDrawersFragment, InventoryItemFragment, GearSlotDefRefFragment } from '../../../../../../gqlInterfaces';
import {
  getContainerColor,
  hasViewContentPermissions,
  hasAddContentPermissions,
  hasRemoveContentPermissions,
} from '../../../../lib/utils';

const Container = styled('div')`
  position: relative;
  border-left: 1px solid ${(props: any) => props.borderColor};
  border-bottom: 1px solid ${(props: any) => props.borderColor};
  border-right: 1px solid ${(props: any) => props.borderColor};
  -webkit-border-image: linear-gradient(to top, ${(props: any) => props.borderColor}, transparent 70%) 1% 1%;
`;

const ContainerHeaderOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 45px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: url(images/inventory/title-bg-grey.png) no-repeat;
    box-shadow: inset 0 0 5px 2px rgba(0,0,0,1);
    background-size: cover;
  }
  &:after {
    content: '';
    background: linear-gradient(to right, ${(props: any) => props.color} 50%,
      transparent, ${(props: any) => props.fadeColor});
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
  }
`;

const ContainerSubHeader = styled('div')`
  position: relative;
  height: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.2));
`;

const PermissionIcon = styled('div')`
  opacity: ${(props: any) => props.opacity};
  color: ${(props: any) => props.color};
  padding: 0 5px;
`;

export interface ItemContainerProps extends base.InventoryBaseProps {
  item: InventorySlotItemDef;
  slotsPerRow: number;
  onCloseClick: () => void;
  containerID: string[];
  showTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideTooltip: () => void;
  onRightOrLeftItemAction: (item: InventoryItemFragment, action: (gearSlots: GearSlotDefRefFragment[]) => void) => void;

  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  onChangeContainerIdToDrawerInfo: (newObj: base.ContainerIdToDrawerInfo) => void;
  syncWithServer: () => void;
  bodyWidth: number;
}

class ItemContainer extends React.Component<ItemContainerProps> {
  public render() {
    const { item } = this.props.item;

    const overlayColor = getContainerColor(item, 0.3);
    const fadeColor = getContainerColor(item, 0.05);
    const containerBorderColor = getContainerColor(item, 0.4);
    return (
      <Container borderColor={containerBorderColor}>
        <ContainerHeaderOverlay color={overlayColor} fadeColor={fadeColor} />
        <ContainerHeader containerItem={item} onCloseClick={this.props.onCloseClick} />
        <ContainerSubHeader>
          <PermissionIcon
            className='fa fa-eye'
            color={'#fff'}
            opacity={hasViewContentPermissions(item) ? 1 : 0.3}
          />
          <PermissionIcon
            className='icon-permissions-drop-in'
            color={'#fff'}
            opacity={hasAddContentPermissions(item) ? 1 : 0.3} />
          <PermissionIcon
            className='icon-permissions-pick-up'
            color={'#fff'}
            opacity={hasRemoveContentPermissions(item) ? 1 : 0.3}
          />
        </ContainerSubHeader>
        {item.containerDrawers.map((_drawer: ContainerDrawersFragment, i: number) => {
          const isLastItem = i === item.containerDrawers.length - 1;
          return (
            <Drawer
              key={i}
              index={i}
              searchValue={''}
              activeFilters={null}
              marginTop={-29}
              footerWidth={isLastItem ? '100%' : 'calc(100% - 153px)'}
              drawer={_drawer}
              onChangeInventoryItems={this.props.onChangeInventoryItems}
              containerItem={item}
              containerID={this.props.containerID ? this.props.containerID : [item.id]}
              onChangeContainerIdToDrawerInfo={this.props.onChangeContainerIdToDrawerInfo}
              onChangeStackGroupIdToItemIDs={this.props.onChangeStackGroupIdToItemIDs}
              onRightOrLeftItemAction={this.props.onRightOrLeftItemAction}
              showTooltip={this.props.showTooltip}
              hideTooltip={this.props.hideTooltip}
              slotsPerRow={this.props.slotsPerRow}
              syncWithServer={this.props.syncWithServer}
              permissions={item.permissibleHolder}
              bodyWidth={this.props.bodyWidth}
            />
          );
        })}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: ItemContainerProps) {
    return this.props.searchValue !== nextProps.searchValue ||
      this.props.activeFilters !== nextProps.activeFilters ||
      !_.isEqual(this.props.item, nextProps.item) ||
      !_.isEqual(this.props.containerID, nextProps.containerID) ||
      this.props.bodyWidth !== nextProps.bodyWidth ||
      this.props.slotsPerRow !== nextProps.slotsPerRow ||
      this.props.bodyWidth !== nextProps.bodyWidth;
  }
}

export default ItemContainer;
