/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-04-12 19:39:57
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-04-13 16:28:12
 */

import * as React from 'react';
import {StyleSheet, css, StyleDeclaration} from 'aphrodite';

interface RefillButtonStyle extends StyleDeclaration {
  container: React.CSSProperties;
}

interface RefillButtonProps {
  styles?: Partial<RefillButtonStyle>;
  className?: string;
  refill: () => void;
}

export const defaultRefillButtonStyle: RefillButtonStyle = {
  container: {
    width: '120px',
    height: '35px',
    lineHeight: '35px',
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#444',
    cursor: 'pointer',
    opacity: 0.7,
    userSelect: 'none',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    pointerEvents: 'auto',
    ':hover': {
      backgroundColor: '#888',
      transform: 'ease .2s',
    },
    ':active': {
      backgroundColor: '#0c0',
      transform: 'ease',
    },
  },
};

const RefillButton = (props: RefillButtonProps) => {

  const ss = StyleSheet.create(defaultRefillButtonStyle);
  const custom = StyleSheet.create(props.styles || {});

  return (
    <div className={[css(ss.container, custom.container), props.className].join(' ')} onClick={() => props.refill()}>
      <i className='fa fa-bullseye fa-inverse'/> Refill Ammo
    </div>
  );
};

export default RefillButton;
