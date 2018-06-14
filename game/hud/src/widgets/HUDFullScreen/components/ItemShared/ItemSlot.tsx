/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ql, Tooltip } from '@csegames/camelot-unchained';

import TooltipContent, { defaultTooltipStyle } from '../Tooltip';
import { placeholderIcon } from '../../lib/constants';
import { InventoryItemFragment } from '../../../../gqlInterfaces';

const Container = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  border: 1px solid #AAACB1;
  cursor: pointer;
`;

const EmptySlot = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 65px;
  height: 65px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid #AAACB1;
  cursor: pointer;
`;

const SlotOverlay = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  &:active {
    box-shadow: inset 0 0 20px 3px black;
  }
`;

export interface ItemSlotProps {
  slotName?: string;
  gearSlots?: ql.schema.GearSlotDefRef;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children?: JSX.Element;
  tooltipInstructions?: string;
  showTooltip?: boolean;
  useFontIcon?: boolean;
  item: InventoryItemFragment;
  iconUrl: string;
}

const ItemSlot = (props: ItemSlotProps) => {
  const {
    item,
    iconUrl,
    onClick,
    onDoubleClick,
    onMouseEnter,
    onMouseLeave,
    showTooltip,
    useFontIcon,
  } = props;
  return item ? (
    <Tooltip
      show={showTooltip}
      styles={defaultTooltipStyle}
      content={() =>
        <TooltipContent isVisible={showTooltip} item={item} />
      }>
        <Container
          onDoubleClick={onDoubleClick}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <img src={iconUrl || placeholderIcon} width='100%' height='100%' />
          <SlotOverlay />
          {props.children}
        </Container>
      </Tooltip>
  ) : (
    <EmptySlot
      onClick={onClick}
    >
      {useFontIcon ? <i className={iconUrl} /> : <img src={iconUrl} width='100%' height='100%' />}
      <SlotOverlay />
      {props.children}
    </EmptySlot>
  );
};

export default ItemSlot;
