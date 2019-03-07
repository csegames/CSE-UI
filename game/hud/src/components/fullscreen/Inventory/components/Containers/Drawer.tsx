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
import { rowActionIcons } from 'fullscreen/lib/constants';
import { getContainerColor, getContainerInfo } from 'fullscreen/lib/utils';
import { InventorySlotItemDef, ContainerSlotItemDef } from 'fullscreen/lib/itemInterfaces';
import { InventoryItem, ContainerDrawers } from 'gql/interfaces';

const Container = styled.div`
  position: relative;
  display: flex;
`;

const HeaderContent = styled.div`
  position: relative;
  height: 30px;
  width: 160px;
  padding-left: 15px;
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
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
  flex: 1;
`;

const FooterContainer = styled.div`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding-right: 3px;
`;

const RequirementsContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const RequirementIcon = styled.span`
  display: flex;
  font-size: 15px;
  margin-right: 5px;
  color: ${(props: any) => props.color};
`;

const PermissionContainer = styled.div`
  background: rgba(0,0,0,0.5);
  padding: 0 5px;
`;

const PermissionIcon = styled.span`
  opacity: ${(props: any) => props.opacity};
  padding: 0 5px 0 0;
  vertical-align: middle;
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
