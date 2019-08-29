/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import TooltipInfoSection, { TooltipSection } from './TooltipInfoSection';
import { InventoryItem } from 'gql/interfaces';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_PADDING = 20;
// #endregion
const Container = styled.div`
  padding: ${CONTAINER_PADDING}px;
  color: #C3C3C3;

  @media (max-width: 2560px) {
    padding: ${CONTAINER_PADDING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${CONTAINER_PADDING * HD_SCALE}px;
  }
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
        <TooltipInfoSection name='Alloy' stats={alloyStats} columnCount={4} />
      </Container>
    );
  }

  private getStats = () => {
    const alloyStats = this.props.item.stats.alloy;
    const stats: TooltipSection[] = [];
    Object.keys(alloyStats).forEach((statName) => {
      if (alloyStats[statName] !== 0) {
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
