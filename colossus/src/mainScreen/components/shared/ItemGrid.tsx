/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { PerkDefGQL, PerkRewardDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import TooltipSource from '../../../shared/components/TooltipSource';
import { StringIDGeneralQty, getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';

const Root = 'ItemGrid-Root';
const ItemsContainer = 'ItemGrid-ItemsContainer';
const ItemsContainerBackground = 'ItemGrid-ItemsContainerBackground';
const ItemContainer = 'ItemGrid-ItemContainer';
const RewardIcon = 'ItemGrid-RewardIcon';
const RewardIconBorder = 'BattlePass-Tier-RewardIconBorder';
const RewardCount = 'ItemGrid-RewardCount';
const TooltipRoot = 'ItemGrid-TooltipRoot';
const TooltipTitle = 'BattlePass-Tier-TooltipTitle';
const TooltipText = 'BattlePass-Tier-TooltipText';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  items: PerkRewardDefGQL[];
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDefGQL>;
}

type Props = ReactProps & InjectedProps;

export class AItemGrid extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    const { className, ...otherProps } = this.props;
    return (
      <div className={`${Root} ${className}`} {...otherProps}>
        <div className={ItemsContainerBackground} />
        <div className={ItemsContainer}>{this.props.items.map(this.renderItemCell.bind(this))}</div>
      </div>
    );
  }

  private renderItemCell(data: PerkRewardDefGQL, index: number): React.ReactNode {
    const perkDef = this.props.perksByID[data.perkID];
    const iconURL = perkDef?.iconURL.length > 0 ? perkDef?.iconURL : '';
    return (
      <>
        <TooltipSource
          className={ItemContainer}
          key={`${data.perkID}_${index}`}
          tooltipParams={{ id: `${data.perkID}_${index}`, content: this.renderRewardTooltip.bind(this, data) }}
        >
          <div className={`${RewardIconBorder} PerkType${perkDef?.perkType}`} />
          <img className={`${RewardIcon} PerkType${perkDef?.perkType}`} src={iconURL} />
          {data.qty > 1 ? (
            <div className={RewardCount}>
              {getTokenizedStringTableValue(StringIDGeneralQty, this.props.stringTable, { QTY: String(data.qty) })}
            </div>
          ) : null}
        </TooltipSource>
      </>
    );
  }

  private renderRewardTooltip(data: PerkRewardDefGQL): React.ReactNode {
    const perkDef = this.props.perksByID[data.perkID];
    return (
      <div className={TooltipRoot}>
        <div className={TooltipTitle}>{perkDef.name}</div>
        <div className={TooltipText}>{perkDef.description}</div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    stringTable,
    perksByID
  };
}

export const ItemGrid = connect(mapStateToProps)(AItemGrid);
