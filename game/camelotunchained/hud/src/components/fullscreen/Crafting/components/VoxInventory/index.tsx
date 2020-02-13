/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { webAPI } from '@csegames/library/lib/camelotunchained';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { InventoryItemFragment } from 'gql/fragments/InventoryItemFragment';
import { VoxInventoryQuery, InventoryItem } from 'gql/interfaces';
import { VoxInventoryView } from './VoxInventoryView';
import { InventoryContext } from 'fullscreen/ItemShared/InventoryContext';
import { VoxInventoryContext, ContextState, defaultVoxContextState } from './VoxInventoryContext';
import { DrawerSlotNumberToItem, ContainerIdToDrawerInfo } from 'fullscreen/ItemShared/InventoryBase';
import { getItemUnitCount, firstAvailableSlot, getItemWithNewContainerPosition } from 'fullscreen/lib/utils';
import { nullVal } from 'fullscreen/lib/constants';

const query = gql`
  query VoxInventoryQuery($voxEntityID: String!) {
    entityItems(id: $voxEntityID) {
      items {
        ...InventoryItem
      }
    }
  }
  ${InventoryItemFragment}
`;

export interface InjectedProps {
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
  onAddContainer: (containerID: string, drawerID: string, drawerSlotNumberToItem: DrawerSlotNumberToItem) => void;
  onRemoveContainer: (containerID: string) => void;
}

export interface ComponentProps {
  voxEntityID: string;
  voxContainerID: string;
}

export type Props = InjectedProps & ComponentProps;

class VoxInventory extends React.Component<Props, ContextState> {
  private graphql: GraphQLResult<VoxInventoryQuery.Query>;
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultVoxContextState,
      refetchVoxInventory: this.refetchVoxInventory,
    };
  }

  public render() {
    return this.props.voxEntityID ? (
      <GraphQL query={{ query, variables: { voxEntityID: this.props.voxEntityID } }} onQueryResult={this.handleQueryResult}>
        {(graphql: GraphQLResult<VoxInventoryQuery.Query>) => {
          this.graphql = graphql;
          let item = null;
          if (graphql.data && graphql.data.entityItems && graphql.data.entityItems.items) {
            item = graphql.data.entityItems.items[0];
          }
          return (
            <VoxInventoryContext.Provider value={this.state}>
              <VoxInventoryView item={item} slotNumberToItem={this.getDrawerSlotNumberToItem()} />
            </VoxInventoryContext.Provider>
          );
        }}
      </GraphQL>
    ) :
      <VoxInventoryContext.Provider value={this.state}>
        <VoxInventoryView item={null} slotNumberToItem={this.getDrawerSlotNumberToItem()} />
      </VoxInventoryContext.Provider>;
  }

  public componentWillUnmount() {
    this.props.onRemoveContainer(this.props.voxContainerID);
  }

  private handleQueryResult = (graphql: GraphQLResult<VoxInventoryQuery.Query>) => {
    if (!graphql.data || !graphql.data.entityItems || !graphql.data.entityItems.items) return graphql;

    this.initializeContextState(graphql);
  }

  private initializeContextState = (graphql: GraphQLResult<VoxInventoryQuery.Query>) => {
    const slotNumberToItem: DrawerSlotNumberToItem = {};
    const voxItem = graphql.data.entityItems.items[0];
    if (!voxItem.containerDrawers || !voxItem.containerDrawers[0]) return;
    voxItem.containerDrawers[0].containedItems.forEach((item: InventoryItem.Fragment) => {
      const currentPosition = item.location.inContainer.position;
      if (currentPosition === -1 || slotNumberToItem[currentPosition]) {
        const nextPosition = firstAvailableSlot(0, slotNumberToItem);
        slotNumberToItem[nextPosition] = {
          item: getItemWithNewContainerPosition(item, nextPosition),
          slot: nextPosition,
          drawerId: 'default',
          containerId: this.props.voxContainerID,
        };
        const moveReq = {
          moveItemID: item.id,
          stackHash: item.stackHash,
          unitCount: getItemUnitCount(item) || -1,
          to: {
            entityID: this.props.voxEntityID,
            characterID: nullVal,
            position: nextPosition,
            containerID: this.props.voxContainerID,
            drawerID: 'default',
            location: 'Container',
            voxSlot: 'Invalid',
          },
          from: {
            entityID: this.props.voxEntityID,
            characterID: nullVal,
            position: currentPosition,
            containerID: this.props.voxContainerID,
            drawerID: 'default',
            location: 'Container',
            voxSlot: 'Invalid',
          },
        };
        webAPI.ItemAPI.MoveItems(webAPI.defaultConfig, moveReq as any);
        return;
      } else {
        slotNumberToItem[currentPosition] = {
          item,
          slot: currentPosition,
          drawerId: 'default',
          containerId: this.props.voxContainerID,
        };
      }
    });

    this.props.onAddContainer(this.props.voxContainerID, 'default', slotNumberToItem);
  }

  private refetchVoxInventory = () => {
    if (!this.graphql) return;

    this.graphql.refetch();
  }

  private getDrawerSlotNumberToItem = () => {
    const { containerIdToDrawerInfo, voxContainerID } = this.props;
    const drawerInfo = containerIdToDrawerInfo[voxContainerID];
    if (!drawerInfo) return {};
    return containerIdToDrawerInfo[voxContainerID].drawers['default'];
  }
}

class VoxInventoryWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <InventoryContext.Consumer>
        {({ onAddContainer, onRemoveContainer, containerIdToDrawerInfo }) => (
          <VoxInventory
            {...this.props}
            containerIdToDrawerInfo={containerIdToDrawerInfo}
            onAddContainer={onAddContainer}
            onRemoveContainer={onRemoveContainer}
          />
        )}
      </InventoryContext.Consumer>
    );
  }
}

export default VoxInventoryWithInjectedContext;
