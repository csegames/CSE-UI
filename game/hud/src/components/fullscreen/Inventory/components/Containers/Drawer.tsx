/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { Tooltip } from '@csegames/camelot-unchained';

import * as base from 'fullscreen/ItemShared/InventoryBase';
import DrawerView from './DrawerView';
import InventoryRowActionButton from 'fullscreen/Inventory/components/InventoryRowActionButton';
import { rowActionIcons, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { getContainerColor, getContainerInfo } from 'fullscreen/lib/utils';
import { InventorySlotItemDef, ContainerSlotItemDef } from 'fullscreen/lib/itemInterfaces';
import { InventoryItem, ContainerDrawers } from 'gql/interfaces';

const Container = styled.div`
  position: relative;
  display: flex;
`;

// #region HeaderContent constants
const HEADER_CONTENT_PADDING_LEFT = 30;
// #endregion
const HeaderContent = styled.div`
  position: relative;
  padding-left: ${HEADER_CONTENT_PADDING_LEFT}px;
  background: ${(props: any) => props.showImg ? 'url(../images/inventory/sub-title.png)' : 'transparent' };
  background-size: 100% 100%;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${(props: any) => props.showImg ? 'url(../images/inventory/sub-title.png)' : 'transparent' };
    background-size: 100% 100%;
  }

  @media (max-width: 2560px) {
    padding-left: ${HEADER_CONTENT_PADDING_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding-left: ${HEADER_CONTENT_PADDING_LEFT * HD_SCALE}px;
  }
`;

// #region MainContent constants
const MAIN_CONTENT_PADDING_HORIZONTAL = 20;
// #endregion
const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 ${MAIN_CONTENT_PADDING_HORIZONTAL}px;
  flex: 1;

  @media (max-width: 2560px) {
    padding: 0 ${MAIN_CONTENT_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${MAIN_CONTENT_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region FooterContainer constants
const FOOTER_CONTAINER_HEIGHT = 60;
const FOOTER_CONTAINER_PADDING_RIGHT = 6;
// #endregion
const FooterContainer = styled.div`
  height: ${FOOTER_CONTAINER_HEIGHT}px;
  padding-right: ${FOOTER_CONTAINER_PADDING_RIGHT}px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;

  @media (max-width: 2560px) {
    height: ${FOOTER_CONTAINER_HEIGHT * MID_SCALE}px;
    padding-right: ${FOOTER_CONTAINER_PADDING_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${FOOTER_CONTAINER_HEIGHT * HD_SCALE}px;
    padding-right: ${FOOTER_CONTAINER_PADDING_RIGHT * HD_SCALE}px;
  }
`;

const RequirementsContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

// #region RequirementIcon constants
const REQUIREMENT_ICON_FONT_SIZE = 30;
const REQUIREMENT_ICON_MARGIN_RIGHT = 10;
// #endregion
const RequirementIcon = styled.span`
  display: flex;
  font-size: ${REQUIREMENT_ICON_FONT_SIZE}px;
  margin-right: ${REQUIREMENT_ICON_MARGIN_RIGHT}px;
  color: ${(props: any) => props.color};

  @media (max-width: 2560px) {
    font-size: ${REQUIREMENT_ICON_FONT_SIZE * MID_SCALE}px;
    margin-right: ${REQUIREMENT_ICON_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${REQUIREMENT_ICON_FONT_SIZE * HD_SCALE}px;
    margin-right: ${REQUIREMENT_ICON_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

// #region PermissionContainer constants
const PERMISSION_CONTAINER_PADDING = 10;
const PERMISSION_CONTAINER_FONT_SIZE = 32;
// #endregion
const PermissionContainer = styled.div`
  background: rgba(0,0,0,0.5);
  padding: 0 ${PERMISSION_CONTAINER_PADDING}px;
  font-size: ${PERMISSION_CONTAINER_FONT_SIZE}px;

  @media (max-width: 2560px) {
    padding: 0 ${PERMISSION_CONTAINER_PADDING * MID_SCALE}px;
    font-size: ${PERMISSION_CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${PERMISSION_CONTAINER_PADDING * HD_SCALE}px;
    font-size: ${PERMISSION_CONTAINER_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region PermissionIcon constants
const PERMISSION_ICON_PADDING_TOP = 10;
const PERMISSION_ICON_FONT_SIZE = 32;
// #endregion
const PermissionIcon = styled.span`
  opacity: ${(props: any) => props.opacity};
  padding: 0 ${PERMISSION_ICON_PADDING_TOP}px 0 0;
  font-size: ${PERMISSION_ICON_FONT_SIZE}px;
  vertical-align: middle;

  @media (max-width: 2560px) {
    padding: 0 ${PERMISSION_ICON_PADDING_TOP * MID_SCALE}px 0 0;
    font-size: ${PERMISSION_ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${PERMISSION_ICON_PADDING_TOP * HD_SCALE}px 0 0;
    font-size: ${PERMISSION_ICON_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface DrawerCurrentStats {
  totalUnitCount: number;
  weight: number;
}

export interface DrawerProps {
  containerItem: InventoryItem.Fragment;
  index: number;
  drawer: ContainerDrawers.Fragment;
  rows: JSX.Element[];
  rowData: ContainerSlotItemDef[][];
  marginTop?: number;
  footerWidth?: number;
  disableHeader?: boolean;
}

export interface DrawerState extends base.InventoryBaseState {
}

class Drawer extends React.Component<DrawerProps, DrawerState> {
  private contentRef: any;
  constructor(props: DrawerProps) {
    super(props);
    this.state = {
      ...base.defaultInventoryBaseState(),
    };
  }
  public render() {
    const { requirements, requirementIconColor, stats, totalUnitCount, weight } = this.getDrawerData();
    return (
      <DrawerView
        marginTop={this.props.marginTop}
        footerWidth={this.props.footerWidth}
        containerItem={this.props.containerItem}
        headerContent={() => !this.props.disableHeader ? (
          <HeaderContent showImg={this.props.index !== 0}>
            <RequirementsContainer>
              {requirements &&
                <Tooltip content={() => (
                  <div>{requirements.description}</div>
                )}>
                  <RequirementIcon
                    className={requirements.icon}
                    color={requirementIconColor}
                  />
                </Tooltip>
              }
            </RequirementsContainer>
          </HeaderContent>
        ) : null}
        mainContent={() => (
          <Container>
            <MainContent>
              {this.props.rows}
            </MainContent>
          </Container>
        )}
        footerContent={() => (
          <FooterContainer>
            <InventoryRowActionButton
              tooltipContent={'Add Empty Row'}
              iconClass={rowActionIcons.addRow}
              onClick={this.addRowOfSlots}
            />
            <InventoryRowActionButton
              tooltipContent={'Remove Empty Row'}
              iconClass={rowActionIcons.removeRow}
              onClick={() => this.removeRowOfSlots(this.props.rowData)}
              disabled={base.inventoryContainerRemoveButtonDisabled(this.props.rowData)}
            />
            <InventoryRowActionButton
              tooltipContent={'Prune Empty Rows'}
              iconClass={rowActionIcons.pruneRows}
              onClick={() => this.pruneRowsOfSlots(this.props.rowData)}
              disabled={base.inventoryContainerRemoveButtonDisabled(this.props.rowData)}
            />
            {stats && stats.maxItemMass !== -1 &&
              <PermissionContainer>
                <PermissionIcon className='icon-ui-weight' />
                {weight} / {stats.maxItemMass}
              </PermissionContainer>
            }
            {stats && stats.maxItemCount !== -1 &&
              <PermissionContainer>
                <PermissionIcon className='icon-ui-bag' />
                {totalUnitCount} / {stats.maxItemCount}
              </PermissionContainer>
            }
          </FooterContainer>
        )}
        contentRef={r => this.contentRef = r}>
      </DrawerView>
    );
  }

  private getDrawerData = () => {
    let requirements = null;
    let stats = null;
    let totalUnitCount = null;
    let weight = null;
    let requirementIconColor = null;

    if (this.props.drawer && this.props.containerItem) {
      requirements = this.props.drawer.requirements;
      stats = this.props.drawer.stats;

      const containerInfo = getContainerInfo(this.props.drawer.containedItems as InventoryItem.Fragment[]);
      totalUnitCount = containerInfo.totalUnitCount;
      weight = containerInfo.weight;

      requirementIconColor = getContainerColor(this.props.containerItem, 0.3);
    }

    return {
      requirements,
      stats,
      totalUnitCount,
      weight,
      requirementIconColor,
    };
  }

  private addRowOfSlots = () => {
  }

  private removeRowOfSlots = (rowData: InventorySlotItemDef[][]) => {
    const heightOfBody = this.contentRef.getBoundingClientRect().height;
    this.setState(state => base.removeRowOfSlots(state, rowData, heightOfBody, true));
  }

  private pruneRowsOfSlots = (rowData: InventorySlotItemDef[][]) => {
    const heightOfBody = this.contentRef.getBoundingClientRect().height;
    this.setState(state => base.pruneRowsOfSlots(state, rowData, heightOfBody, true));
  }
}

export default Drawer;
