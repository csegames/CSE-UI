/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { IconButton } from '@csegames/camelot-unchained';

export interface InventoryRowActionButtonStyle {
  InventoryRowActionButton: React.CSSProperties;
  UHDInventoryRowActionButton: React.CSSProperties;
}

export const defaultInventoryRowActionButtonStyle: InventoryRowActionButtonStyle = {
  InventoryRowActionButton: {
    display: 'inline-block',
    marginRight: '10px',
    fontSize: '16px',
  },
  UHDInventoryRowActionButton: {
    display: 'inline-block',
    marginRight: '20px',
    fontSize: '32px',
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
  const defaultColor = '#998675';
  const disabledColor = 'rgba(153, 134, 117, 0.7)';
  return (
    <UIContext.Consumer>
      {(uiContext: UIContext) => (
        <IconButton
          tooltipContent={props.tooltipContent}
          iconClass={props.iconClass}
          onClick={props.onClick}
          disabled={props.disabled}
          color={defaultColor}
          disabledColor={disabledColor}
          styles={{
            IconButton: uiContext.isUHD() ? defaultInventoryRowActionButtonStyle.UHDInventoryRowActionButton :
              defaultInventoryRowActionButtonStyle.InventoryRowActionButton,
          }}
        />
      )}
    </UIContext.Consumer>
  );
};

export default InventoryRowActionButton;
