/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import TooltipInfoSection, { TooltipSection } from './TooltipInfoSection';
import { TOOLTIP_PADDING } from '../../../lib/constants';
import { InventoryItem } from 'gql/interfaces';

const Container = styled('div')`
  padding: ${TOOLTIP_PADDING};
  color: #C3C3C3;
`;

export interface TooltipSubstanceInfoProps {
  item: InventoryItem.Fragment;
}

class TooltipSubstanceInfo extends React.PureComponent<TooltipSubstanceInfoProps> {
  public render() {
    const { filteredResistances, filteredSubstanceStats } = this.getFilteredSubstanceStats();
    return (
      <Container>
        <TooltipInfoSection useIcon turnValueToPercent name='Resistances' stats={filteredResistances} columnCount={2} />
        <TooltipInfoSection name='Substance Stats' stats={filteredSubstanceStats} columnCount={2} />
      </Container>
    );
  }

  private getFilteredSubstanceStats = () => {
    const { item } = this.props;
    const itemStats = item.stats.substance;

    // Split up resistances and stats into two seperate maps
    const filteredResistances: TooltipSection[] = [];
    const filteredSubstanceStats: TooltipSection[] = [];

    Object.keys(item.stats.substance).forEach((statName) => {
      if (_.includes(statName.toLowerCase(), 'resistance') && itemStats[statName] !== 0) {
        // Is a resistance
        filteredResistances.push({
          name: statName.replace('Resistance', ''),
          value: itemStats[statName],
        });
        return;
      }

      if (item.stats.substance[statName] !== 0) {
        // Is a non zero substance stat
        filteredSubstanceStats.push({
          name: statName,
          value: itemStats[statName],
        });
      }
    });

    return {
      filteredResistances,
      filteredSubstanceStats,
    };
  }
}

export default TooltipSubstanceInfo;
