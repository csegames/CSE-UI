/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { utils, Input } from '@csegames/camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import { colors } from '../../../lib/constants';

export interface StatListContainerStyles extends StyleDeclaration {
  StatListContainer: React.CSSProperties;
  statListContainerContent: React.CSSProperties;
  searchInput: React.CSSProperties;
}

const defaultStatListContainerStyle: StatListContainerStyles = {
  StatListContainer: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    borderRight: `2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    borderBottom: `2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
  },

  statListContainerContent: {
    flex: 1,
    overflow: 'auto',
  },

  searchInput: {
    fontSize: '20px',
  },
};

export interface StatListContainerProps {
  styles?: Partial<StatListContainerStyles>;
  renderContent: () => JSX.Element;
  searchValue: string;
  onSearchChange: (searchValue: string) => void;
}

const StatListContainer = (props: StatListContainerProps) => {
  const ss = StyleSheet.create(defaultStatListContainerStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.StatListContainer, custom.StatListContainer)}>
      <Input
        placeholder='Filter'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onSearchChange(e.target.value)}
        value={props.searchValue}
        styles={{
          input: defaultStatListContainerStyle.searchInput,
        }}
      />
      <div className={css(ss.statListContainerContent, custom.statListContainerContent)}>
        {props.renderContent()}
      </div>
    </div>
  );
};

export default StatListContainer;
