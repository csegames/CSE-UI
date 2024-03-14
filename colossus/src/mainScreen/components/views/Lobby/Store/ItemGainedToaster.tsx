/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { PerkDefGQL, PerkType, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { getPerkTypeLocalizedName, isChampionEquipmentPerk } from '../../../../helpers/perkUtils';

const Container = 'StartScreen-Store-ItemGainedToaster-Container';
const TextContainer = 'StartScreen-Store-ItemGainedToaster-TextContainer';
const IconContainer = 'StartScreen-Store-ItemGainedToaster-IconContainer';
const Icon = 'StartScreen-Store-ItemGainedToaster-Icon';
const IconBackground = 'StartScreen-Store-ItemGainedToaster-IconBackground';
const Title = 'StartScreen-Store-ItemGainedToaster-Title';
const Description = 'StartScreen-Store-ItemGainedToaster-Description';

const StringIDStoreGainedTitleCurrency = 'StoreGainedTitleCurrency';
const StringIDStoreGainedTitleOther = 'StoreGainedTitleOther';
const StringIDStoreGainedTitleChampionReward = 'StoreGainedTitleChampionReward';
const StringIDStoreGainedDescriptionCurrency = 'StoreGainedDescriptionCurrency';
const StringIDStoreGainedDescriptionChampionReward = 'StoreGainedDescriptionChampionReward';
const StringIDStoreGainedDescriptionOther = 'StoreGainedDescriptionOther';
const StringIDStoreGainedQuestXP = 'StoreGainedTitleQuestXP';

interface ReactProps {
  perk: PerkDefGQL;
  perkCount: number;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = InjectedProps & ReactProps;

export class AItemGainedToaster extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Container}>
        <div className={TextContainer}>
          <div className={Title}>{this.getTitleText()}</div>
          <div className={Description}>{this.getDescriptionText()}</div>
        </div>
        <div className={IconContainer}>
          <img className={IconBackground} src={this.getIconBackgroundSourceURL()} />
          <img className={Icon} src={this.getIconSourceURL()} />
        </div>
      </div>
    );
  }

  private getTitleText(): string {
    if (this.props.perk.perkType == PerkType.Currency || this.props.perk.perkType == PerkType.CurrentBattlePassXP) {
      return getTokenizedStringTableValue(StringIDStoreGainedTitleCurrency, this.props.stringTable, {
        REWARD_NAME: this.props.perk.name.toUpperCase()
      });
    } else if (this.props.perk.perkType == PerkType.QuestXP) {
      return getTokenizedStringTableValue(StringIDStoreGainedQuestXP, this.props.stringTable, {
        REWARD_NAME: this.props.perk.name.toUpperCase(),
        COUNT: this.props.perkCount.toString()
      });
    } else if (isChampionEquipmentPerk(this.props.perk.perkType)) {
      return getTokenizedStringTableValue(StringIDStoreGainedTitleChampionReward, this.props.stringTable, {
        REWARD_TYPE: getPerkTypeLocalizedName(this.props.perk.perkType, this.props.stringTable).toUpperCase()
      });
    } else {
      return getStringTableValue(StringIDStoreGainedTitleOther, this.props.stringTable);
    }
  }

  private getDescriptionText(): string {
    if (this.props.perk.perkType == PerkType.Currency || this.props.perk.perkType == PerkType.CurrentBattlePassXP) {
      return getTokenizedStringTableValue(StringIDStoreGainedDescriptionCurrency, this.props.stringTable, {
        COUNT: this.props.perkCount.toString(),
        REWARD_NAME: this.props.perk.name
      });
    } else if (isChampionEquipmentPerk(this.props.perk.perkType)) {
      return getTokenizedStringTableValue(StringIDStoreGainedDescriptionChampionReward, this.props.stringTable, {
        REWARD_NAME: this.props.perk.name,
        REWARD_TYPE: getPerkTypeLocalizedName(this.props.perk.perkType, this.props.stringTable).toLowerCase()
      });
    } else {
      return getStringTableValue(StringIDStoreGainedDescriptionOther, this.props.stringTable);
    }
  }

  private getIconSourceURL(): string {
    if (this.props.perk.iconURL && this.props.perk.iconURL.length > 0) {
      return this.props.perk.iconURL;
    } else {
      return 'images/MissingAsset.png';
    }
  }

  private getIconBackgroundSourceURL(): string {
    switch (this.props.perk.perkType) {
      case PerkType.Weapon:
      case PerkType.Costume: {
        return this.props.perk.backgroundURL;
      }
      default: {
        return null;
      }
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const ItemGainedToaster = connect(mapStateToProps)(AItemGainedToaster);
