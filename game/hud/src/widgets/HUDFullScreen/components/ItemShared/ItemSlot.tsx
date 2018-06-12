/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ql, Tooltip } from '@csegames/camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import TooltipContent, { defaultTooltipStyle } from '../Tooltip';
import { placeholderIcon } from '../../lib/constants';
import { InventoryItemFragment } from '../../../../gqlInterfaces';

export interface ItemStyles extends StyleDeclaration {
  ItemSlot: React.CSSProperties;
  EmptyItemSlot: React.CSSProperties;
  slotOverlay: React.CSSProperties;
  slotText: React.CSSProperties;
}

export const defaultItemStyles: ItemStyles = {
  ItemSlot: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65px',
    height: '65px',
    border: '1px solid #AAACB1',
    cursor: 'pointer',
  },
  EmptyItemSlot: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '65px',
    height: '65px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    border: '1px solid #AAACB1',
    cursor: 'pointer',
  },
  slotOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    ':active': {
      boxShadow: 'inset 0 0 20px 3px black',
    },
  },
  slotText: {
    fontSize: '8px',
    color: 'white',
    textAlign: 'center',
  },
};

export interface ItemSlotProps {
  styles?: Partial<ItemStyles>;
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
  const ss = StyleSheet.create({ ...defaultItemStyles, ...props.styles });
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
        <div
          className={css(ss.ItemSlot)}
          onDoubleClick={onDoubleClick}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <img src={iconUrl || placeholderIcon} width='100%' height='100%' />
          <div className={css(ss.slotOverlay)} />
          {props.children}
        </div>
      </Tooltip>
  ) : (
    <div
      className={css(ss.EmptyItemSlot)}
      onClick={onClick}
    >
      {useFontIcon ? <i className={iconUrl} /> : <img src={iconUrl} width='100%' height='100%' />}
      <div className={css(ss.slotOverlay)} />
      {props.children}
    </div>
  );
};

export default ItemSlot;
