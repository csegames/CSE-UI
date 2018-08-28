/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

import TooltipInfoSection, { TooltipSection } from './TooltipInfoSection';
import { TOOLTIP_PADDING } from '../../../lib/constants';
import { InventoryItem } from 'gql/interfaces';

const Container = styled('div')`
  padding: ${TOOLTIP_PADDING};
  color: #C3C3C3;
`;

export interface Props {
  item: InventoryItem.Fragment;
}

export interface State {

}

class TooltipAlloyInfo extends React.Component<Props, State> {
  public render() {
    const alloyStats = this.getStats();
    return (
      <Container>
        <TooltipInfoSection name='Alloy' stats={alloyStats} columnCount={7} />
      </Container>
    );
  }

  private getStats = () => {
    const alloyStats = this.props.item.stats.alloy;
    const stats: TooltipSection[] = [];
    Object.keys(alloyStats).forEach((statName) => {
      if (alloyStats[statName]) {
        stats.push({
          name: statName,
          value: alloyStats[statName],
        });
      }
    });

    return stats;
  }
}

export default TooltipAlloyInfo;
