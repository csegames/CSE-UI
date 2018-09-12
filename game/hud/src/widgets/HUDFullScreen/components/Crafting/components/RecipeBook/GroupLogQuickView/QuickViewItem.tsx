/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { isEqual } from 'lodash';

import { showTooltip, hideTooltip } from 'actions/tooltips';
import { CraftingContext } from '../../../CraftingContext';
import CraftingDefTooltip from '../../CraftingDefTooltip';

import { GroupLogData } from '../index';
import GeneralQuickViewItem from './GeneralQuickViewItem';
import { VoxJobType, ItemDefRef } from 'gql/interfaces';

export interface ComponentProps {
  shouldTransform: boolean;
  groupLog: GroupLogData;
  onClick: (groupLog: GroupLogData) => void;
}

export interface InjectedProps {
  onToggleFavoriteVoxJobGroupLog: (jobIdentifier: string, jobType: VoxJobType) => void;
}

export type Props = ComponentProps & InjectedProps;

class QuickViewItem extends React.Component<Props> {
  public render() {
    const { groupLog, shouldTransform } = this.props;
    return (
      <GeneralQuickViewItem
        shouldTransform={shouldTransform}
        groupLog={groupLog}
        onClick={this.onClick}
        onFavoriteClick={this.onFavoriteClick}
        onOutputMouseOver={this.onOutputMouseOver}
        onOutputMouseLeave={this.onOutputMouseLeave}
      />
    );
  }

  public shouldComponentUpdate(nextProps: Props) {
    return !isEqual(this.props.groupLog, nextProps.groupLog) ||
      this.props.shouldTransform !== nextProps.shouldTransform;
  }

  private onFavoriteClick = () => {
    const { groupLog } = this.props;
    this.props.onToggleFavoriteVoxJobGroupLog(groupLog.log.jobIdentifier, groupLog.log.jobType);
  }

  private onOutputMouseOver = (event: MouseEvent, recipeItem: ItemDefRef.Fragment) => {
    showTooltip({
      event,
      content: <CraftingDefTooltip recipeDef={recipeItem} recipeData={null} />,
    });
  }

  private onClick = (groupLog: GroupLogData) => {
    hideTooltip();
    this.props.onClick(groupLog);
  }

  private onOutputMouseLeave = () => {
    hideTooltip();
  }
}

class QuickViewItemWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({ onToggleFavoriteVoxJobGroupLog }) => (
          <QuickViewItem
            {...this.props}
            onToggleFavoriteVoxJobGroupLog={onToggleFavoriteVoxJobGroupLog}
          />
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default QuickViewItemWithInjectedContext;
