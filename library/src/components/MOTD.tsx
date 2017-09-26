/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { utils } from '../';

export interface Style extends StyleDeclaration {
  MOTD: React.CSSProperties;
  header: React.CSSProperties;
  content: React.CSSProperties;
  footer: React.CSSProperties;
  dismiss: React.CSSProperties;
  close: React.CSSProperties;
}

export const defaultStyle: Style = {
  MOTD: {
    pointerEvents: 'all',
    userSelect: 'none',
    webkitUserSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '800px',
    height: '450px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    border: `1px solid ${utils.lightenColor('#202020', 30)}`,
    position: 'relative',
  },

  header: {
    width: '100%',
    padding: '5px 0',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#202020',
    borderBottom: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  content: {
    flex: 1,
    color: 'white',
    padding: '5px',
    overflow: 'auto',
    '::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: '#111',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: '#666',
      borderRadius: '5px',
    },
  },

  footer: {
    padding: '5px 0',
    backgroundColor: '#202020',
    textAlign: 'center',
    borderTop: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  dismiss: {
    cursor: 'pointer',
  },

  close: {
    position: 'absolute',
    top: 2,
    right: 5,
    color: '#cdcdcd',
    fontSize: '20px',
    marginRight: '5px',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: '#bbb',
    },
  },
};

export interface Props {
  styles?: Partial<Style>;
  onClose?: () => void;
  onDismiss24?: () => void;
  children?: React.ReactNode;
}

export const MOTD = (props: Props) => {
  const ss = StyleSheet.create(defaultStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.MOTD, custom.MOTD)}>
      <div className={css(ss.header, custom.header)}>
        <div className=''>Welcome to Camelot Unchained</div>
        <div className={css(ss.close, custom.close)} onClick={props.onClose}>
          <i className='fa fa-times click-effect'></i>
        </div>
      </div>
      <div className={css(ss.content, custom.content)}>
        {props.children}
      </div>
      <div className={css(ss.footer, custom.footer)}>
        <a className={css(ss.dismiss, custom.dismiss)} onClick={props.onDismiss24}>Dismiss For 24h</a>
      </div>
    </div>
  );
};

export default MOTD;
