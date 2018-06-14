/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { utils, IconButton } from '@csegames/camelot-unchained';
import { colors } from '../../../lib/constants';

export interface InventoryRowActionButtonStyle {
  InventoryRowActionButton: React.CSSProperties;
}

export const defaultInventoryRowActionButtonStyle: InventoryRowActionButtonStyle = {
  InventoryRowActionButton: {
    display: 'inline-block',
    marginRight: '10px',
  },
};

export interface InventoryRowActionButtonProps {
  styles?: Partial<InventoryRowActionButtonStyle>;
  disabled?: boolean;
  tooltipContent: string;
  iconClass: string;
  onClick: () => void;
}

export const InventoryRowActionButton = (props: InventoryRowActionButtonProps) => {
  const defaultColor = utils.lightenColor(colors.filterBackgroundColor, 100);
  const disabledColor = utils.lightenColor(colors.filterBackgroundColor, 30);
  return (
    <IconButton
      tooltipContent={props.tooltipContent}
      iconClass={props.iconClass}
      onClick={props.onClick}
      disabled={props.disabled}
      color={defaultColor}
      disabledColor={disabledColor}
      styles={{
        IconButton: defaultInventoryRowActionButtonStyle.InventoryRowActionButton,
      }}
    />
  );
};

export default InventoryRowActionButton;
