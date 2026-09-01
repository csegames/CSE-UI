/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { FactionBorderSelectable } from './FactionBorderSelectable';
import { BorderBackground } from './FactionBorder';

const Root = 'HUD-FactionTabButtonsVertical-Root';
const TabRoot = 'HUD-FactionTabButtonsVertical-TabRoot';
const TabText = 'HUD-FactionTabButtonsVertical-TabText';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  labels: string[];
  selectedTabIndex: number;
  factionIDOverride?: string;
  onTabSelected?: (tabIndex: number) => void;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionTabButtonsVertical extends React.Component<Props> {
  render(): JSX.Element {
    const { factionIDOverride, labels, selectedTabIndex, dispatch, className, ...otherProps } = this.props;

    return (
      <div {...otherProps} className={`${Root} ${className}`}>
        {labels.map(this.renderTab.bind(this))}
      </div>
    );
  }

  private renderTab(label: string, index: number): React.ReactNode {
    const isSelected = index === this.props.selectedTabIndex;

    return (
      <FactionBorderSelectable
        className={TabRoot}
        background={BorderBackground.PatternSmall}
        isSelected={isSelected}
        onSelected={this.onTabClicked.bind(this, index)}
        factionIDOverride={this.props.factionIDOverride}
        includeRight={false}
      >
        <div className={`${TabText} ${isSelected ? 'selected' : ''}`}>{label}</div>
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

export const FactionTabButtonsVertical = connect(mapStateToProps)(AFactionTabButtonsVertical);
