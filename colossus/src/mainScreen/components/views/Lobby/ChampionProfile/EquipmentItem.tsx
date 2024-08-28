/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { PerkGQL, PerkDefGQL, PerkRarity, PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';

const Container = 'ChampionProfile-EquipmentItem-Container';
const Image = 'ChampionProfile-EquipmentItem-Image';
const BackgroundImage = 'ChampionProfile-EquipmentItem-BackgroundImage';
const LockedIcon = 'ChampionProfile-EquipmentItem-LockedIcon';
const LockedOverlay = 'ChampionProfile-EquipmentItem-LockedOverlay';
const CheckIcon = 'ChampionProfile-EquipmentItem-CheckIcon';

interface ReactProps {
  perk: PerkDefGQL;
  overrideBackgroundURL?: string;

  styles?: string;
  isSelected?: boolean;
  shouldShowStatus?: boolean;
  className?: string;
  onClick?: (perk: PerkDefGQL) => void;
  onDoubleClick?: (perk: PerkDefGQL) => void;
  onMouseEnter?: (perk: PerkDefGQL) => void;
  onMouseLeave?: () => void;
  children?: JSX.Element | JSX.Element[];
  disabled?: boolean;
}

interface InjectedProps {
  ownedPerks: PerkGQL[];
}

type Props = ReactProps & InjectedProps;

class AEquipmentItem extends React.Component<Props> {
  render(): JSX.Element {
    const disabledClass = this.props.disabled ? 'disabled' : 'not-disabled';
    const rarityClass = this.props.perk ? `Rarity${PerkRarity[this.props.perk.rarity]}` : '';

    // TODO: Once we build out a system for ComingSoon, we can hook this into it.
    const isComingSoonClass = false ? 'isComingSoon' : '';

    // An item is locked if we don't own any of it.
    const isLocked =
      this.props.ownedPerks.find((p) => {
        return p.id == this.props.perk.id;
      }) == undefined;

    const styleClass = this.props.styles || '';
    const growsOnHover = this.props.perk.perkType == PerkType.QuestXP ? '' : 'GrowsOnHover';

    return (
      <div
        className={`${Container} ${this.props.className} ${rarityClass} ${disabledClass} ${isComingSoonClass} ${styleClass}`}
        onClick={this.onClick.bind(this)}
        onDoubleClick={this.onDoubleClick.bind(this)}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.props.onMouseLeave}
      >
        {this.getBackgroundImage()}
        {this.props.perk && <img className={`${Image} ${growsOnHover}`} src={this.getPerkImageURL()} />}
        {this.props.shouldShowStatus && isLocked && (
          <>
            <div className={LockedOverlay} />
            <span className={`${LockedIcon} fs-icon-misc-lock`} />
          </>
        )}
        {this.props.shouldShowStatus && this.props.isSelected && <span className={`${CheckIcon} fs-icon-misc-check`} />}
        {this.props.children}
      </div>
    );
  }

  private getPerkImageURL(): string {
    if (this.props.overrideBackgroundURL && this.props.overrideBackgroundURL.length > 0) {
      return this.props.overrideBackgroundURL;
    }

    return this.props.perk?.iconURL;
  }

  private getBackgroundImage(): JSX.Element {
    if (!this.props.perk || !this.props.perk.backgroundURL) {
      return null;
    }

    let bgURL = this.props.perk.backgroundURL;

    if (bgURL.length === 0) {
      return null;
    } else {
      return <img className={BackgroundImage} src={bgURL} />;
    }
  }

  private onClick() {
    if (this.props.onClick) {
      this.props.onClick(this.props.perk);
    }

    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CLICK);
  }

  private onDoubleClick() {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(this.props.perk);
    }
  }

  private onMouseEnter() {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.props.perk);
    }

    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const ownedPerks = state.profile?.perks ?? [];

  return {
    ...ownProps,
    ownedPerks
  };
}

export const EquipmentItem = connect(mapStateToProps)(AEquipmentItem);
