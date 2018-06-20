/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import TooltipDurabilityInfo from './TooltipDurabilityInfo';
import TooltipRequirementInfo from './TooltipRequirementInfo';
import { hasDurabilityStats, hasItemRequirements } from '../../../lib/utils';
import { defaultSlotIcons, TOOLTIP_PADDING } from '../../../lib/constants';
import { SlotType } from '../../../lib/itemInterfaces';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';

const Container = styled('div')`
  position: relative;
  padding: ${TOOLTIP_PADDING};
  color: #A49A8A;
  border-top: 2px solid #292929;
  &:before {
    content: '';
    position: absolute;
    left: 70px;
    right: 70px;
    top: -5px;
    height: 10px;
    background-image: url(images/item-tooltips/divider_bottom.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
`;

const FooterOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url(images/item-tooltips/bg.png) no-repeat;
  background-size: 150% 150%;
  background-position: -50px -50px;
  z-index: -1;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(to bottom right, rgba(161, 114, 64, 0.15), transparent 65%);
    z-index: -1;
  }
`;

const MidSectionContainer = styled('div')`
  position: relative;
  padding-top: ${TOOLTIP_PADDING};
  margin-top: 10px;
`;

const Divider = styled('div')`
  position: absolute;
  top: ${(props: any) => props.top}px;
  bottom: ${(props: any) => props.bottom}px;
  left: 0;
  right: 0;
  height: ${(props: any) => props.height}px;
  background-color: #292929;
  &:before {
    content: '';
    position: absolute;
    top: ${(props: any) => props.top}px;
    bottom: ${(props: any) => props.bottom}px;
    left: 0;
    right: 0;
    height: ${(props: any) => props.height}px;
    background: url(images/inventory/texture-over-line.png);
    background-size: cover;
  }
`;

const StatItem = styled('div')`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
`;

const EquipmentSlotsContainer = styled('div')`
  display: flex;
  flex-wrap: wrap;
  margin-left: 5px;
  max-width: 150px;
`;

const EquipmentSlotsValue = styled('div')`
  display: flex;
  text-align: right;
  border-right: ${(props: any) => props.showBorder ? '1px solid gray' : '0px'};
  margin-right: 3px;
`;

const EquipmentSlotIcon = styled('span')`
  opacity: ${(props: any) => props.isUnder ? 0.6 : 1};
  -webkit-transform: ${(props: any) => props.isRight ? 'scaleX(-1)' : ''};
  transform: ${(props: any) => props.isRight ? 'scaleX(-1)' : ''};
  margin-right: 3px;
`;

const InstructionText = styled('div')`
  font-size: 12px;
  padding: 5px 0;
  font-style: italic;
  color: #C3C3C3;
`;

export interface TooltipFooterProps {
  item: InventoryItemFragment;
  slotType?: SlotType;
}

class TooltipFooter extends React.PureComponent<TooltipFooterProps> {
  public render() {
    const { item, slotType } = this.props;
    return (
      <Container>
        <FooterOverlay />
        {hasDurabilityStats(item) && <TooltipDurabilityInfo item={item} />}
        {(!_.isEmpty(item.staticDefinition.gearSlotSets) || hasItemRequirements(item)) &&
          <MidSectionContainer>
            {!_.isEmpty(item.staticDefinition.gearSlotSets) && <Divider top={0} height={2} />}
            {!_.isEmpty(item.staticDefinition.gearSlotSets) &&
              <StatItem>
                <div>EquipmentSlots</div>
                <EquipmentSlotsContainer>
                  {item.staticDefinition.gearSlotSets.map((set, i) => {
                    const isLastSet = i === item.staticDefinition.gearSlotSets.length - 1;
                    return (
                      <EquipmentSlotsValue key={i} showBorder={!isLastSet}>
                        {set.gearSlots.map((gearSlot, i) => {
                          const isUnder = _.includes(gearSlot.id.toLowerCase(), 'under');
                          const isRight = _.includes(gearSlot.id.toLowerCase(), 'right');
                          return (
                            <EquipmentSlotIcon
                              key={i}
                              isUnder={isUnder}
                              isRight={isRight}
                              className={defaultSlotIcons[gearSlot.id]}
                            ></EquipmentSlotIcon>
                          );
                        })}
                      </EquipmentSlotsValue>
                    );
                  })}
                </EquipmentSlotsContainer>
              </StatItem>
            }
            <TooltipRequirementInfo item={item} />
          </MidSectionContainer>
        }
        <InstructionText>
          {slotType === SlotType.CraftingContainer ? 'left click to open crafting container | ' : ''}
          right click item for more actions
        </InstructionText>
      </Container>
    );
  }
}

export default TooltipFooter;
