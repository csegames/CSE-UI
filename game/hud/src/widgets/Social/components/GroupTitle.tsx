/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-16 12:28:59
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-27 11:39:02
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export interface GroupTitleStyle extends StyleDeclaration {
  title: React.CSSProperties;
  refresh: React.CSSProperties;
}

export const defaultGroupTitleStyle: GroupTitleStyle = {
  title: {
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.19)',
    backgroundColor: '#4d573e',
    fontSize: '2em',
    position: 'relative',
  },

  refresh: {
    position: 'absolute',
    bottom: '0px',
    right: '10px',
    fontSize: '0.8em',
    userSelect: 'non',
  },
}

export interface GroupTitleProps {
  children?: React.ReactNode;
  refetch: () => void;
  styles?: Partial<GroupTitleStyle>;
}

export default(props: GroupTitleProps) => {
  const ss = StyleSheet.create(defaultGroupTitleStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.title, custom.title)}>
      {props.children}
      {/*<a className={css(ss.refresh, custom.refresh)}
         onClick={props.refetch}>
        <i className='fa fa-refresh'></i> refresh
      </a>*/}
    </div>
  );
}
