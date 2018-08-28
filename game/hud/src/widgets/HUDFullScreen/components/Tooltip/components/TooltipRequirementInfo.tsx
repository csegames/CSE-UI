/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { shortenedWeaponStatWords } from '../../../lib/constants';
import { prettifyText } from '../../../lib/utils';
import { InventoryItem } from 'gql/interfaces';

const StatItem = styled('div')`
  display: flex;
  justify-content: space-between;
  border-image: linear-gradient(to right, rgba(177, 168, 156, 0.4), #131313, rgba(177, 168, 156, 0.4));
  border-image-slice: 1;
  border-width: 2px;
  border-style: solid;
  padding: 0 5px;
`;

const StatName = styled('div')`
  font-size: ${(props: any) => props.fontSize}px;
`;

const StatValue = styled('div')`
`;

export interface TooltipRequirementInfoProps {
  item: InventoryItem.Fragment;
}

class TooltipRequirementInfo extends React.PureComponent<TooltipRequirementInfoProps> {
  public render() {
    const itemStatRequirements = this.getItemStatRequirements();
    return (
      !_.isEmpty(itemStatRequirements) &&
        <div>
          <StatName>Requirements</StatName>
          <StatItem>
            {Object.keys(itemStatRequirements).map((itemStatName, i) => {
              return (
                <div key={i}>
                  <StatName>{prettifyText(itemStatName, shortenedWeaponStatWords)}</StatName>
                  <StatValue>{itemStatRequirements[itemStatName]}</StatValue>
                </div>
              );
            })}
          </StatItem>
        </div>
    );
  }

  private getItemStatRequirements = () => {
    const { item } = this.props;

    const itemStatRequirements = {};
    Object.keys(item.stats.item).forEach((itemStatName) => {
      if (_.includes(itemStatName.toLowerCase(), 'requirement') && item.stats.item[itemStatName] !== 0) {
        itemStatRequirements[itemStatName] = item.stats.item[itemStatName];
      }
    });

    return itemStatRequirements;
  }
}

export default TooltipRequirementInfo;
