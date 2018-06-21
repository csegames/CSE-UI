import * as React from 'react';
import styled, { css } from 'react-emotion';
import Tooltip from './Tooltip';

export interface IconButtonStyle {
  IconButton: React.CSSProperties;
  buttonIcon: React.CSSProperties;
  disabled: React.CSSProperties;
}

const Container = styled('div')`
  display: inline-block;
  margin-right: 10px;
`;

const ButtonIcon = styled('span')`
  font-size: 0.9em;
  cursor: pointer;
  text-shadow
`;

const Disabled = css`
  cursor: not-allowed;
  text-shadow: 0;
`;

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
  const customStyles = props.styles || {};
  const { tooltipContent, disabled, iconClass, onClick, color, disabledColor, active, activeColor } = props;

  return (
    <Container onClick={!disabled ? onClick : null} style={customStyles.IconButton}>
      {tooltipContent ?
        <Tooltip content={tooltipContent}>
          <ButtonIcon
            style={{
              color: !color ? 'white' :
                disabled && disabledColor ? disabledColor :
                  active && activeColor ? activeColor :
                    color,
            }}
            className={`fa ${iconClass} ${!disabled ? 'click-effect' : ''} ${disabled && Disabled}`}
          />
        </Tooltip> :
        <ButtonIcon
          style={{ color }}
          className={`fa ${iconClass} ${!disabled ? 'click-effect' : ''} ${disabled && Disabled}`}
        />
      }
    </Container>
  );
};

export default IconButton;
