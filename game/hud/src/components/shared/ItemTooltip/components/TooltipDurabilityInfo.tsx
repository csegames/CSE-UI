/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InventoryItem } from 'gql/interfaces';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

const DurabilityContainer = styled.div`
  column-count: 2;
  column-gap: 0;
`;

const ItemContainer = styled.div`
  width: 100%;
`;

// #region StatItem constants
const STAT_ITEM_PADDING_HORIZONTAL = 10;
const STAT_ITEM_FONT_SIZE = 32;
// #endregion
const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  border-image: ${(props: any) => props.showBorder ?
    'linear-gradient(to right, rgba(177, 168, 156, 0.15), #131313, rgba(177, 168, 156, 0.15))' : 'none'};
  border-image-slice: ${(props: any) => props.showBorder ? 1 : 0};
  border-width: ${(props: any) => props.showBorder ? '1px' : 0};
  border-style: ${(props: any) => props.showBorder ? 'solid' : ''};
  padding: 0 ${STAT_ITEM_PADDING_HORIZONTAL}px;
  font-size: ${STAT_ITEM_FONT_SIZE}px;
  font-family: "TitilliumWeb";
  font-size: ${(props: any) => props.fontSize}px;
  -webkit-column-break-inside: avoid;

  @media (max-width: 2560px) {
    padding: 0 ${STAT_ITEM_PADDING_HORIZONTAL * MID_SCALE}px;
    font-size: ${STAT_ITEM_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${STAT_ITEM_PADDING_HORIZONTAL * HD_SCALE}px;
    font-size: ${STAT_ITEM_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region StatValue constants
const STAT_VALUE_MARGIN_LEFT = 10;
const STAT_VALUE_FONT_SIZE = 32;
// #endregion
const StatValue = styled.div`
  margin-left: ${STAT_VALUE_MARGIN_LEFT}px;
  font-size: ${STAT_VALUE_FONT_SIZE}px;

  @media (max-width: 2560px) {
    margin-left: ${STAT_VALUE_MARGIN_LEFT * MID_SCALE}px;
    font-size: ${STAT_VALUE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-left: ${STAT_VALUE_MARGIN_LEFT * HD_SCALE}px;
    font-size: ${STAT_VALUE_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface TooltipDurabilityInfoProps {
  item: InventoryItem.Fragment;
}

class TooltipDurabilityInfo extends React.PureComponent<TooltipDurabilityInfoProps> {
  public render() {
    const { durability } = this.props.item.stats;
    return (
      <div>
        {durability.maxHealth !== 0 &&
          <ItemContainer>
            <StatItem fontSize={16}>
              <div>Durability</div>
              <div>{durability.currentHealth.toFixed(0)} / {durability.maxHealth.toFixed(0)}</div>
            </StatItem>
          </ItemContainer>
        }
        <DurabilityContainer>
          {durability.fractureThreshold !== 0 &&
            <ItemContainer>
              <StatItem showBorder fontSize={12}>
                <div>Fracture TH</div>
                <StatValue>{durability.fractureThreshold.toFixed(0)}</StatValue>
              </StatItem>
            </ItemContainer>
          }
          {durability.maxRepairPoints !== 0 &&
            <ItemContainer>
              <StatItem showBorder fontSize={12}>
                <div>Repair Points</div>
                <StatValue>{durability.currentRepairPoints.toFixed(0)} / {durability.maxRepairPoints.toFixed(0)}</StatValue>
              </StatItem>
            </ItemContainer>
          }
          {durability.healthLossPerUse !== 0 &&
            <ItemContainer>
              <StatItem showBorder fontSize={12}>
                <div>Health Loss Per Use</div>
                <StatValue>{durability.healthLossPerUse.toFixed(0)}</StatValue>
              </StatItem>
            </ItemContainer>
          }
        </DurabilityContainer>
      </div>
    );
  }
}

export default TooltipDurabilityInfo;
