/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { TOOLTIP_PADDING } from '../../../lib/constants';
import { getContainerInfo } from '../../../lib/utils';
import { InventoryItem } from 'gql/interfaces';

const Container = styled('div')`
  padding: ${TOOLTIP_PADDING};
  color: #C3C3C3;
`;

export interface TooltipDrawerItemCountStats {
  currentItemCount: number;
  maxItemCount: number;
}

export interface TooltipDrawerMassStats {
  currentMass: number;
  maxItemMass: number;
}

export interface TooltipContainerInfoProps {
  item: InventoryItem.Fragment;
}

class TooltipContainerInfo extends React.PureComponent<TooltipContainerInfoProps> {
  public render() {
    const { drawerStatsItemCount, drawerStatsMass } = this.getContainerDrawerStats();
    return !_.isEmpty(drawerStatsItemCount) && !_.isEmpty(drawerStatsMass) ? (
      <Container>
        {!_.isEmpty(drawerStatsItemCount) &&
          <div>
            Items
            {drawerStatsItemCount.map((_drawerStats, i) => {
              return (
                <div key={i}>{_drawerStats.currentItemCount} / {_drawerStats.maxItemCount}</div>
              );
            })}
          </div>
        }
        {!_.isEmpty(drawerStatsMass) &&
          <div>
            Weight
            {drawerStatsMass.map((_drawerStats, i) => {
              return (
                <div key={i}>{_drawerStats.currentMass} / {_drawerStats.maxItemMass}</div>
              );
            })}
          </div>
        }
      </Container>
    ) : null;
  }

  private getContainerDrawerStats = () => {
    const { item } = this.props;
    const drawerStatsItemCount: TooltipDrawerItemCountStats[] = [];
    const drawerStatsMass: TooltipDrawerMassStats[] = [];

    // Split up item count and mass info into two arrays which will be displayed as seperate sections in the tooltip.
    item.containerDrawers.forEach((_containerDrawer) => {
      const drawerCurrentStats = getContainerInfo(_containerDrawer.containedItems as any);

      // Put current and max item count into drawerStatsItemCount array
      if (_containerDrawer.stats.maxItemCount !== -1) {
        const itemCountInfo = {
          currentItemCount: drawerCurrentStats.totalUnitCount,
          maxItemCount: _containerDrawer.stats.maxItemCount,
        };
        drawerStatsItemCount.push(itemCountInfo);
      }

      // Put current and max mass into drawerStatsMass array
      if (_containerDrawer.stats.maxItemMass !== -1) {
        const massInfo = {
          currentMass: drawerCurrentStats.weight,
          maxItemMass: _containerDrawer.stats.maxItemMass,
        };
        drawerStatsMass.push(massInfo);
      }
    });

    return {
      drawerStatsItemCount,
      drawerStatsMass,
    };
  }
}

export default TooltipContainerInfo;
