/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';

const DurabilityContainer = styled('div')`
  column-count: 2;
  column-gap: 0;
`;

const ItemContainer = styled('div')`
  width: 100%;
`;

const StatItem = styled('div')`
  display: flex;
  justify-content: space-between;
  border-image: ${(props: any) => props.showBorder ?
    'linear-gradient(to right, rgba(177, 168, 156, 0.15), #131313, rgba(177, 168, 156, 0.15))' : 'none'};
  border-image-slice: ${(props: any) => props.showBorder ? 1 : 0};
  border-width: ${(props: any) => props.showBorder ? '1px' : 0};
  border-style: ${(props: any) => props.showBorder ? 'solid' : ''};
  padding: 0 5px;
  font-family: "TitilliumWeb";
  font-size: ${(props: any) => props.fontSize}px;
  -webkit-column-break-inside: avoid;
`;

const StatValue = styled('div')`
  margin-left: 5px;
`;

export interface TooltipDurabilityInfoProps {
  item: InventoryItemFragment;
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
