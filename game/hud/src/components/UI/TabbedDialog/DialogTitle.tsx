import * as React from 'react';
import styled from 'react-emotion';
import * as CONFIG from '../config';

interface DialogTitleProps {
  children?: any;
  title?: string;
  titleIcon?: string;
}

const DialogTitleContainer = styled('div')`
  position: absolute;
  top: 7px;
  text-transform: uppercase;
  color: ${CONFIG.NORMAL_TEXT_COLOR};
  text-align: center;
  font-size: 9px;
  letter-spacing: 2px;
  width: 100%;
  z-index: 2;
`;

/* tslint:disable:function-name */
export default function DialogTitle(props: DialogTitleProps) {
  if (typeof props.children === 'function') {
    return this.props.children(props.title, props.titleIcon);
  }
  return (
    <DialogTitleContainer>
      { props.titleIcon && <span className={props.titleIcon}></span> }
      { props.title && <span>{props.title}</span> }
    </DialogTitleContainer>
  );
}
