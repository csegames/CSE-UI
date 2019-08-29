/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import TooltipDurabilityInfo from './TooltipDurabilityInfo';
import TooltipRequirementInfo from './TooltipRequirementInfo';
import { hasDurabilityStats, hasItemRequirements } from 'fullscreen/lib/utils';
import { defaultSlotIcons, HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';
import { InventoryItem } from 'gql/interfaces';

// #region Container constants
const CONTAINER_PADDING = 20;
const CONTAINER_HORIZONTAL_ALIGNMENT = 140;
const CONTAINER_TOP = -10;
const CONTAINER_HEIGHT = 20;
// #endregion
const Container = styled.div`
  position: relative;
  padding: ${CONTAINER_PADDING}px;
  color: #A49A8A;
  border-top: 2px solid #292929;
  &:before {
    content: '';
    position: absolute;
    left: ${CONTAINER_HORIZONTAL_ALIGNMENT}px;
    right: ${CONTAINER_HORIZONTAL_ALIGNMENT}px;
    top: ${CONTAINER_TOP}px;
    height: ${CONTAINER_HEIGHT}px;
    background-image: url(../images/item-tooltips/divider_bottom.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }

  @media (max-width: 2560px) {
    padding: ${CONTAINER_PADDING * MID_SCALE}px;

    &:before {
      left: ${CONTAINER_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
      right: ${CONTAINER_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
      top: ${CONTAINER_TOP * MID_SCALE}px;
      height: ${CONTAINER_HEIGHT * MID_SCALE}px;
      background-image: url(../images/item-tooltips/divider_bottom.png);
    }
  }

  @media (max-width: 1920px) {
    padding: ${CONTAINER_PADDING * HD_SCALE}px;

    &:before {
      left: ${CONTAINER_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
      right: ${CONTAINER_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
      top: ${CONTAINER_TOP * HD_SCALE}px;
      height: ${CONTAINER_HEIGHT * HD_SCALE}px;
      background-image: url(../images/item-tooltips/divider_bottom.png);
    }
  }
`;

// #region FooterOverlay constants
const FOOTER_OVERLAY_BG_POSITION = -100;
// #endregion
const FooterOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(../images/item-tooltips/bg.png);
  background-repeat: no-repeat;
  background-size: 150% 150%;
  background-position: ${FOOTER_OVERLAY_BG_POSITION}px;
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

  @media (max-width: 2560px) {
    background-position: ${FOOTER_OVERLAY_BG_POSITION * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-position: ${FOOTER_OVERLAY_BG_POSITION * HD_SCALE}px;
  }
`;

// #region MidSectionContainer constants
const MID_SECTION_CONTAINER_PADDING_TOP = 20;
const MID_SECTION_CONTAINER_MARGIN_TOP = 20;
// #endregion
const MidSectionContainer = styled.div`
  position: relative;
  padding-top: ${MID_SECTION_CONTAINER_PADDING_TOP}px;
  margin-top: ${MID_SECTION_CONTAINER_MARGIN_TOP}px;

  @media (max-width: 2560px) {
    padding-top: ${MID_SECTION_CONTAINER_PADDING_TOP * MID_SCALE}px;
    margin-top: ${MID_SECTION_CONTAINER_MARGIN_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding-top: ${MID_SECTION_CONTAINER_PADDING_TOP * HD_SCALE}px;
    margin-top: ${MID_SECTION_CONTAINER_MARGIN_TOP * HD_SCALE}px;
  }
`;

const Divider = styled.div`
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
    background: url(../images/inventory/texture-over-line.png);
    background-size: cover;
  }
`;

// #region StatItem constants
const STAT_ITEM_FONT_SIZE = 28;
// #endregion
const StatItem = styled.div`
  font-size: ${STAT_ITEM_FONT_SIZE}px;
  display: flex;
  justify-content: space-between;

  @media (max-width: 2560px) {
    font-size: ${STAT_ITEM_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${STAT_ITEM_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region EquipmentSlotsContainer constants
const EQUIPMENT_SLOTS_CONTAINER_MARGIN_LEFT = 10;
const EQUIPMENT_SLOTS_CONTAINER_MAX_WIDTH = 300;
// #endregion
const EquipmentSlotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: ${EQUIPMENT_SLOTS_CONTAINER_MARGIN_LEFT}px;
  max-width: ${EQUIPMENT_SLOTS_CONTAINER_MAX_WIDTH}px;

  @media (max-width: 2560px) {
    margin-left: ${EQUIPMENT_SLOTS_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
    max-width: ${EQUIPMENT_SLOTS_CONTAINER_MAX_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-left: ${EQUIPMENT_SLOTS_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
    max-width: ${EQUIPMENT_SLOTS_CONTAINER_MAX_WIDTH * HD_SCALE}px;
  }
`;

// #region EquipmentSlotsValue constants
const EQUIPMENT_SLOTS_VALUE_MARGIN_RIGHT = 6;
const EQUIPMENT_SLOTS_FONT_SIZE = 32;
// #endregion
const EquipmentSlotsValue = styled.div`
  display: flex;
  text-align: right;
  border-right: ${(props: any) => props.showBorder ? '1px solid gray' : '0px'};
  margin-right: ${EQUIPMENT_SLOTS_VALUE_MARGIN_RIGHT}px;
  font-size: ${EQUIPMENT_SLOTS_FONT_SIZE}px;

  @media (max-width: 2560px) {
    margin-right: ${EQUIPMENT_SLOTS_VALUE_MARGIN_RIGHT * MID_SCALE}px;
    font-size: ${EQUIPMENT_SLOTS_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${EQUIPMENT_SLOTS_VALUE_MARGIN_RIGHT * HD_SCALE}px;
    font-size: ${EQUIPMENT_SLOTS_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region EquipmentSlotIcon constants
const EQUIPMENT_SLOT_ICON_MARGIN_RIGHT = 6;
const EQUIPMENT_SLOT_ICON_FONT_SIZE = 32;
// #endregion
const EquipmentSlotIcon = styled.span`
  opacity: ${(props: any) => props.isUnder ? 0.6 : 1};
  -webkit-transform: ${(props: any) => props.isRight ? 'scaleX(-1)' : ''};
  transform: ${(props: any) => props.isRight ? 'scaleX(-1)' : ''};
  margin-right: ${EQUIPMENT_SLOT_ICON_MARGIN_RIGHT}px;
  font-size: ${EQUIPMENT_SLOT_ICON_FONT_SIZE}px;

  @media (max-width: 2560px) {
    margin-right: ${EQUIPMENT_SLOT_ICON_MARGIN_RIGHT * MID_SCALE}px;
    font-size: ${EQUIPMENT_SLOT_ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${EQUIPMENT_SLOT_ICON_MARGIN_RIGHT * HD_SCALE}px;
    font-size: ${EQUIPMENT_SLOT_ICON_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region InstructionText constants
const INSTRUCTION_TEXT_FONT_SIZE = 24;
const INSTRUCTION_TEXT_PADDING_VERTICAL = 10;
// #endregion
const InstructionText = styled.div`
  font-size: ${INSTRUCTION_TEXT_FONT_SIZE}px;
  padding: ${INSTRUCTION_TEXT_PADDING_VERTICAL}px 0;
  font-style: italic;
  color: #C3C3C3;

  @media (max-width: 2560px) {
    font-size: ${INSTRUCTION_TEXT_FONT_SIZE * MID_SCALE}px;
    padding: ${INSTRUCTION_TEXT_PADDING_VERTICAL * MID_SCALE}px 0;
  }

  @media (max-width: 1920px) {
    font-size: ${INSTRUCTION_TEXT_FONT_SIZE * HD_SCALE}px;
    padding: ${INSTRUCTION_TEXT_PADDING_VERTICAL * HD_SCALE}px 0;
  }
`;

export interface TooltipFooterProps {
  item: InventoryItem.Fragment;
  instructions: string;
}

class TooltipFooter extends React.PureComponent<TooltipFooterProps> {
  public render() {
    const { item, instructions } = this.props;
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
        <InstructionText>{instructions}</InstructionText>
      </Container>
    );
  }
}

export default TooltipFooter;
