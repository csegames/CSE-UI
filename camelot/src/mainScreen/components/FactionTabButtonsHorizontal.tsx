/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { BorderBackground } from './FactionBorder';
import { FactionBorderSelectable } from './FactionBorderSelectable';

const Root = 'HUD-FactionTabButtonsHorizontal-Root';
const TabRoot = 'HUD-FactionTabButtonsHorizontal-TabRoot';
const TabButtonContent = 'HUD-FactionTabButtonsHorizontal-TabButtonContent';
const TabText = 'HUD-FactionTabButtonsHorizontal-TabText';

export interface TabParams {
  id: string;
  content: string | ((isSelected: boolean) => React.ReactNode);
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabParams[];
  selectedTabIndex: number;
  factionIDOverride?: string;
  minTabWidth?: string;
  onTabSelected?: (tabIndex: number) => void;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionTabButtonsHorizontal extends React.Component<Props> {
  render(): JSX.Element {
    const { factionIDOverride, tabs, selectedTabIndex, dispatch, className, ...otherProps } = this.props;

    return (
      <div {...otherProps} className={`${Root} ${className}`}>
        {tabs.map(this.renderTab.bind(this))}
      </div>
    );
  }

  private renderTab(params: TabParams, index: number): React.ReactNode {
    const isSelected = index === this.props.selectedTabIndex;

    return (
      <FactionBorderSelectable
        className={TabRoot}
        factionIDOverride={this.props.factionIDOverride}
        background={BorderBackground.PatternSmall}
        includeBottom={false}
        isSelected={isSelected}
        onSelected={this.onTabClicked.bind(this, index)}
        style={this.props.minTabWidth?.length > 0 ? { minWidth: this.props.minTabWidth } : {}}
      >
        <div className={`${TabButtonContent}${isSelected ? ' selected' : ''}`}>
          {typeof params.content === 'function' ? (
            params.content(isSelected)
          ) : (
            <div className={TabText}>{params.content}</div>
          )}
        </div>
      </FactionBorderSelectable>
    );
  }

  private onTabClicked(tabIndex: number): void {
    this.props.onTabSelected(tabIndex);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const FactionTabButtonsHorizontal = connect(mapStateToProps)(AFactionTabButtonsHorizontal);
