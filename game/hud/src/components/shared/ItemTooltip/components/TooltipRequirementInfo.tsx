/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import { shortenedWeaponStatWords, HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';
import { prettifyText } from 'fullscreen/lib/utils';
import { InventoryItem } from 'gql/interfaces';

// #region StatItem constants
const STAT_ITEM_PADDING_HORIZONTAL = 10;
// #endregion
const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  border-image: linear-gradient(to right, rgba(177, 168, 156, 0.4), #131313, rgba(177, 168, 156, 0.4));
  border-image-slice: 1;
  border-width: 2px;
  border-style: solid;
  padding: 0 ${STAT_ITEM_PADDING_HORIZONTAL}px;
`;

// #region StatName constants
const STAT_NAME_FONT_SIZE = 24;
// #endregion
const StatName = styled.div`
  font-size: ${STAT_NAME_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${STAT_NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${STAT_NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region StatValue constants
const STAT_VALUE_FONT_SIZE = 32;
// #endregion
const StatValue = styled.div`
  font-size: ${STAT_VALUE_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${STAT_VALUE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${STAT_VALUE_FONT_SIZE * HD_SCALE}px;
  }
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
