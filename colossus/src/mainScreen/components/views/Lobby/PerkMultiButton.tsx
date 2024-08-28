import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  PerkDefGQL,
  PurchaseDefGQL,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getChampionPerkUnlockQuestIndex } from '../../../helpers/characterHelpers';
import { Button } from '../../shared/Button';
import { ChampionInfo } from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../../redux/questSlice';
import { isFreeReward, isPurchaseable } from '../../../helpers/storeHelpers';
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
  additionalClassNames?: string;
  perk: PerkDefGQL;
  isSaving: boolean;
  onEquip: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface InjectedProps extends FeatureFlags.Source {
  ownedPerks: Dictionary<number>;
  selectedChampion: ChampionInfo;
  questsByType: QuestsByType;
  purchases: PurchaseDefGQL[];
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDefGQL>;
  progressionNodes: string[];
  quests: QuestGQL[];
  serverTimeDeltaMS: number;
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
          styles={`${ButtonStyle} ${this.props.additionalClassNames}`}
          onClick={this.props.onEquip.bind(this)}
          disabled={this.props.isSaving}
        />
      );
    }

    const unlockIndex: number = getChampionPerkUnlockQuestIndex(
      this.props.selectedChampion,
      this.props.questsByType.Champion,
      this.props.perk.id
    );
    if (unlockIndex >= 0) {
      const tokens = { LEVEL: (unlockIndex + 1).toString() };
      return (
        <span className={`${UnlockLevel} ${this.props.additionalClassNames}`}>
          {getTokenizedStringTableValue(StringIDGeneralUnlockedAt, this.props.stringTable, tokens)}
        </span>
      );
    }

    if (FeatureFlags.Store.isEnabled(this.props)) {
      const purchaseDef = this.getPurchaseDef();
      if (
        purchaseDef &&
        isPurchaseable(
          purchaseDef,
          this.props.perksByID,
          this.props.ownedPerks,
          this.props.progressionNodes,
          this.props.quests,
          this.props.serverTimeDeltaMS
        )
      ) {
        const buttonText = isFreeReward(purchaseDef)
          ? getStringTableValue(StringIDGeneralClaim, this.props.stringTable)
          : getStringTableValue(StringIDGeneralPurchase, this.props.stringTable);
        return (
          <Button
            type={'primary'}
            text={buttonText}
            styles={`${ButtonStyle} ${this.props.additionalClassNames}`}
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
  const { ownedPerks, quests, progressionNodes } = state.profile;
  const { serverTimeDeltaMS } = state.clock;
  const questsByType = state.quests.quests;
  const { purchases, perksByID } = state.store;
  const { stringTable } = state.stringTable;
  const featureFlags = state.featureFlags;

  return {
    ...ownProps,
    ownedPerks,
    selectedChampion,
    questsByType,
    purchases,
    stringTable,
    featureFlags,
    perksByID,
    quests,
    progressionNodes,
    serverTimeDeltaMS
  };
}

export const PerkMultiButton = connect(mapStateToProps)(APerkMultiButton);
