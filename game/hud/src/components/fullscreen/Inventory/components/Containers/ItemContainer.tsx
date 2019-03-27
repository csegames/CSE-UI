/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import * as base from 'fullscreen/ItemShared/InventoryBase';
import InventoryDrawer from './InventoryDrawer';
import ContainerHeader from './ContainerHeader';
import { InventoryDataTransfer } from 'fullscreen/lib/itemEvents';
import { InventorySlotItemDef, SlotItemDefType } from 'fullscreen/lib/itemInterfaces';
import {
  InventoryItem,
  ContainerDrawers,
  GearSlotDefRef,
} from 'gql/interfaces';
import {
  getContainerColor,
  hasViewContentPermissions,
  hasAddContentPermissions,
  hasRemoveContentPermissions,
} from 'fullscreen/lib/utils';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  border-left: 1px solid ${(props: any) => props.borderColor};
  border-bottom: 1px solid ${(props: any) => props.borderColor};
  border-right: 1px solid ${(props: any) => props.borderColor};
  -webkit-border-image: linear-gradient(to top, ${(props: any) => props.borderColor}, transparent 70%) 1% 1%;
`;

// #region ContainerHeaderOverlay constants
const CONTAINER_HEADER_OVERLAY_HEIGHT = 90;
// #endregion
const ContainerHeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: ${CONTAINER_HEADER_OVERLAY_HEIGHT}px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: url(../images/inventory/title-bg-grey.png) no-repeat;
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

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEADER_OVERLAY_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTAINER_HEADER_OVERLAY_HEIGHT * HD_SCALE}px;
  }
`;

// #region ContainerSubHeader constants
const CONTAINER_SUB_HEADER = 60;
// #endregion
const ContainerSubHeader = styled.div`
  position: relative;
  height: ${CONTAINER_SUB_HEADER}px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.2));

  @media (max-width: 2560px) {
    height: ${CONTAINER_SUB_HEADER * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTAINER_SUB_HEADER * HD_SCALE}px;
  }
`;

// #region PermissionIcon constants
const PERMISSION_ICON_PADDING_HORIZONTAL = 10;
const PERMISSION_ICON_FONT_SIZE = 32;
// #endregion
const PermissionIcon = styled.div`
  opacity: ${(props: any) => props.opacity};
  color: ${(props: any) => props.color};
  padding: 0 ${PERMISSION_ICON_PADDING_HORIZONTAL}px;
  font-size: ${PERMISSION_ICON_FONT_SIZE}px;

  @media (max-width: 2560px) {
    padding 0 ${PERMISSION_ICON_PADDING_HORIZONTAL * MID_SCALE}px;
    font-size: ${PERMISSION_ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding 0 ${PERMISSION_ICON_PADDING_HORIZONTAL * HD_SCALE}px;
    font-size: ${PERMISSION_ICON_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface ItemContainerProps extends base.InventoryBaseProps {
  item: InventorySlotItemDef;
  onCloseClick: () => void;
  containerID: string[];
  showTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideTooltip: () => void;
  onRightOrLeftItemAction: (item: InventoryItem.Fragment, action: (gearSlots: GearSlotDefRef.Fragment[]) => void) => void;
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
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
        {item.containerDrawers.map((_drawer: ContainerDrawers.Fragment, i: number) => {
          const isLastItem = i === item.containerDrawers.length - 1;
          return (
            <InventoryDrawer
              key={i}
              index={i}
              searchValue={''}
              activeFilters={null}
              marginTop={-29}
              footerWidth={isLastItem ? '100%' : 'calc(100% - 153px)'}
              drawer={_drawer}
              containerItem={item}
              containerID={this.props.containerID ? this.props.containerID : [item.id]}
              onRightOrLeftItemAction={this.props.onRightOrLeftItemAction}
              showTooltip={this.props.showTooltip}
              hideTooltip={this.props.hideTooltip}
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
      this.props.bodyWidth !== nextProps.bodyWidth;
  }
}

export default ItemContainer;
