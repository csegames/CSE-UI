/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import {
  updateFullScreenSelectSelectedPerkLeft,
  updateFullScreenSelectSelectedPerkRight
} from '../../../redux/fullScreenSelectSlice';
import { PanelSide } from './FullScreenSelectPanel';
import { PerkDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { StarBadge } from '../../../../shared/components/StarBadge';
import { isPerkUnseen, markEquipmentSeen } from '../../../helpers/characterHelpers';
export enum PanelItemSize {
  card,
  portait
}

const Container = 'ChampionProfile-SelectPanelItem-Container';
const ImageContainer = 'ChampionProfile-SelectPanelItem-ImageContainer';
const Image = 'ChampionProfile-SelectPanelItem-Image';
const ToolTipContainer = 'ChampionProfile-SelectPanelItem-ToolTipContainer';
const Title = 'ChampionProfile-SelectPanelItem-ToolTipTitle';
const Description = 'ChampionProfile-SelectPanelItem-ToolTipDescription';
const Badge = 'ChampionProfile-SelectPanelItem-Badge';

interface ReactProps {
  imageSource: string;
  perk: PerkDefGQL;
  panelSide: PanelSide;
  size: PanelItemSize;
  equippedPerk: PerkDefGQL;
}

interface InjectedProps {
  selectedPerkLeft: PerkDefGQL;
  selectedPerkRight: PerkDefGQL;
  ownedPerks: Dictionary<number>;
  newEquipment: Dictionary<boolean>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFullScreenSelectPanelItem extends React.Component<Props> {
  render(): JSX.Element {
    if (this.props.panelSide === null || this.props.perk === null) {
      console.error(
        'attempted to create a panelItem with missing state data, here is the state that was passed in',
        this.props
      );
      return;
    }
    const size = this.props.size == PanelItemSize.card ? 'card' : 'portrait';
    const selected = this.isSelected() ? 'selected' : '';
    const equipped = this.isEquipped() ? 'equipped' : '';
    const owned =
      this.props.ownedPerks[this.props.perk.id] === undefined || this.props.ownedPerks[this.props.perk.id] < 1
        ? 'unowned'
        : '';
    const isBadged = isPerkUnseen(this.props.perk.id, this.props.newEquipment, this.props.ownedPerks);
    return (
      <div className={`${Container} ${size} ${selected} ${equipped}`}>
        <div className={`${ImageContainer} ${size} ${owned}`}>
          <img
            className={`${Image} ${owned}`}
            src={this.props.imageSource}
            onClick={this.onPanelItemClick.bind(this)}
          />
        </div>
        <div className={`${ToolTipContainer} ${size}`}>
          <span className={`${Title} ${size}`}>{this.props.perk.name}</span>
          {this.props.perk.description.length > 0 && <span className={Description}>{this.props.perk.description}</span>}
        </div>
        {isBadged && <StarBadge className={Badge} />}
      </div>
    );
  }

  private isSelected(): boolean {
    if (this.props.panelSide === PanelSide.left && this.props.selectedPerkLeft) {
      return this.props.perk.id == this.props.selectedPerkLeft.id;
    } else if (this.props.panelSide === PanelSide.right && this.props.selectedPerkRight) {
      return this.props.perk.id == this.props.selectedPerkRight.id;
    }
    return false;
  }

  private isEquipped(): boolean {
    if (this.props.panelSide === PanelSide.left && this.props.equippedPerk) {
      return this.props.perk.id == this.props.equippedPerk.id;
    } else if (this.props.panelSide === PanelSide.right && this.props.equippedPerk) {
      return this.props.perk.id == this.props.equippedPerk.id;
    }
    return false;
  }

  private onPanelItemClick() {
    // Update the corresponding panel data with the new selected perk
    if (this.props.panelSide === PanelSide.left) {
      this.props.dispatch(updateFullScreenSelectSelectedPerkLeft(this.props.perk));
    } else if (this.props.panelSide === PanelSide.right) {
      this.props.dispatch(updateFullScreenSelectSelectedPerkRight(this.props.perk));
    }

    markEquipmentSeen(this.props.perk.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectSelectedPerkLeft, selectSelectedPerkRight } = state.fullScreenSelect;
  const { ownedPerks } = state.profile;
  const { newEquipment } = state.store;
  return {
    ...ownProps,
    selectedPerkLeft: selectSelectedPerkLeft,
    selectedPerkRight: selectSelectedPerkRight,
    ownedPerks,
    newEquipment
  };
}

export const FullScreenSelectPanelItem = connect(mapStateToProps)(AFullScreenSelectPanelItem);
