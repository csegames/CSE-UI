/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Property } from 'react/node_modules/csstype';

const Outer = 'Shared-Box-Outer';
const Border = 'Shared-Box-Border';

const Inner = 'Shared-Box-Inner';

interface BoxProps {
  id?: string;
  align?: string;
  justify?: string;
  uppercase?: boolean;
  children?: any;
  padding?: boolean; // inner padding
  style?: any; // outer custom styles
  innerClassName?: string;
  onClick?: (id: string) => void;
}

/* tslint:disable:function-name */
export function Box(props: BoxProps) {
  const classNames: string[] = [Inner];

  if (props.padding === false) {
    classNames.push('no-pad');
  }

  if (props.uppercase) {
    classNames.push('uppercase');
  }

  if (props.innerClassName) {
    classNames.push(props.innerClassName);
  }

  const borderInnerStyle: React.CSSProperties = {
    justifyContent: props.justify,
    textAlign: props.align as Property.TextAlign
  };

  return (
    <div
      className={Outer}
      style={props.style}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (props.onClick) {
          props.onClick(props.id);
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <div className={Border}>
        <div style={borderInnerStyle} className={classNames.join(' ')}>
          {props.children}
        </div>
      </div>
    </div>
  );
}
