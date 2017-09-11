import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import * as utils from '../util';
import Tooltip from './Tooltip';

export interface IconButtonStyle extends StyleDeclaration {
  IconButton: React.CSSProperties;
  buttonIcon: React.CSSProperties;
  disabled: React.CSSProperties;
}

export const defaultIconButtonStyle: IconButtonStyle = {
  IconButton: {
    display: 'inline-block',
    marginRight: '10px',
  },
  buttonIcon: {
    fontSize: '0.9em',
    cursor: 'pointer',
    textShadow: '1px 1px rgba(0, 0, 0, 0.7)',
  },
  disabled: {
    cursor: 'not-allowed',
    textShadow: '0',
  },
};

export interface IconButtonProps {
  styles?: Partial<IconButtonStyle>;
  tooltipContent?: string;
  disabled?: boolean;
  active?: boolean;
  color?: string;
  disabledColor?: string;
  activeColor?: string;
  iconClass: string;
  onClick: (e: any) => void;
}

export const IconButton = (props: IconButtonProps) => {
  const ss = StyleSheet.create(defaultIconButtonStyle);
  const custom = StyleSheet.create(props.styles || {});

  const { tooltipContent, disabled, iconClass, onClick, color, disabledColor, active, activeColor } = props;

  return (
    <div onClick={!disabled ? onClick : null} className={css(ss.IconButton, custom.IconButton)}>
      {tooltipContent ?
        <Tooltip content={tooltipContent}>
          <span
            style={{
              color: !color ? 'white' :
                disabled && disabledColor ? disabledColor :
                  active && activeColor ? activeColor :
                    color,
            }}
            className={`fa ${iconClass} ${!disabled ? 'click-effect' : ''} \
              ${css(ss.buttonIcon, custom.buttonIcon, disabled && ss.disabled, disabled && custom.disabled)}`}
          />
        </Tooltip> :
        <span
          style={{ color }}
          className={`fa ${iconClass} ${!disabled ? 'click-effect' : ''} \
            ${css(ss.buttonIcon, custom.buttonIcon, disabled && ss.disabled, disabled && custom.disabled)}`}
        />}
    </div>
  );
};

export default IconButton;
