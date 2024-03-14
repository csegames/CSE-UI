import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { PerkDefGQL, PurchaseDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getChampionPerkUnlockQuestIndex } from '../../../helpers/characterHelpers';
import { Button } from '../../shared/Button';
import { ChampionInfo } from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../../redux/questSlice';
import { isFreeReward } from '../../../helpers/storeHelpers';
import { showRightPanel } from '../../../redux/navigationSlice';
import { ConfirmPurchase } from '../../rightPanel/ConfirmPurchase';
import { Dispatch } from 'redux';
import {
  StringIDGeneralClaim,
  StringIDGeneralEquip,
  StringIDGeneralPurchase,
  StringIDGeneralUnlockedAt,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../helpers/stringTableHelpers';
import { FeatureFlags } from '../../../redux/featureFlagsSlice';

const ButtonStyle = 'ChampionProfile-MultiButton-ButtonStyle';
const UnlockLevel = 'ChampionProfile-MultiButton-UnlockLevel';

interface ReactProps {
  perk: PerkDefGQL;
  isSaving: boolean;
  onEquip: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface InjectedProps extends FeatureFlags.Source {
  ownedPerks: Dictionary<number>;
  selectedChampion: ChampionInfo;
  quests: QuestsByType;
  purchases: PurchaseDefGQL[];
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class APerkMultiButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    if (this.isSelectedItemOwned()) {
      return (
        <Button
          type={'blue'}
          text={getStringTableValue(StringIDGeneralEquip, this.props.stringTable)}
          styles={ButtonStyle}
          onClick={this.props.onEquip.bind(this)}
          disabled={this.props.isSaving}
        />
      );
    }

    const unlockIndex: number = getChampionPerkUnlockQuestIndex(
      this.props.selectedChampion,
      this.props.quests.Champion,
      this.props.perk.id
    );
    if (unlockIndex >= 0) {
      const tokens = { LEVEL: (unlockIndex + 1).toString() };
      return (
        <span className={UnlockLevel}>
          {getTokenizedStringTableValue(StringIDGeneralUnlockedAt, this.props.stringTable, tokens)}
        </span>
      );
    }

    if (FeatureFlags.Store.isEnabled(this.props)) {
      const purchaseDef = this.getPurchaseDef();
      if (purchaseDef) {
        const buttonText = isFreeReward(purchaseDef)
          ? getStringTableValue(StringIDGeneralClaim, this.props.stringTable)
          : getStringTableValue(StringIDGeneralPurchase, this.props.stringTable);
        return (
          <Button
            type={'blue'}
            text={buttonText}
            styles={ButtonStyle}
            onClick={this.openStorePanel.bind(this)}
            disabled={false}
          />
        );
      }
    }

    return null;
  }

  private openStorePanel(): void {
    this.props.dispatch(
      showRightPanel(
        <ConfirmPurchase purchase={this.getPurchaseDef()} suppressAlertStar={true} confirmPurchaseForHighCost={true} />
      )
    );
  }

  private isSelectedItemOwned(): boolean {
    return this.props.ownedPerks[this.props.perk.id] > 0;
  }

  private getPurchaseDef(): PurchaseDefGQL {
    return this.props.purchases.find((purchase) => {
      return purchase.perks.length === 1 && purchase.perks[0].perkID === this.props.perk.id;
    });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const { ownedPerks } = state.profile;
  const { quests } = state.quests;
  const { purchases } = state.store;
  const { stringTable } = state.stringTable;
  const featureFlags = state.featureFlags;

  return {
    ...ownProps,
    ownedPerks,
    selectedChampion,
    quests,
    purchases,
    stringTable,
    featureFlags
  };
}

export const PerkMultiButton = connect(mapStateToProps)(APerkMultiButton);
