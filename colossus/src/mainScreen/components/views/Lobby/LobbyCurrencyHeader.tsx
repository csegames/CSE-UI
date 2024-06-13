/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import {
  PerkDefGQL,
  PerkType,
  RMTPurchaseDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { PerkGQL, QuestType } from '@csegames/library/dist/hordetest/graphql/schema';
import { navigateTo, LobbyView, showOverlay, Overlay } from '../../../redux/navigationSlice';
import { updateStoreCurrentRoute, StoreRoute } from '../../../redux/storeSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { BUX_PERK_ID } from '../../../helpers/storeHelpers';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import TooltipSource from '../../../../shared/components/TooltipSource';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';

const Container = 'Lobby-CurrencyHeader-Container';
const CurrencyContainer = 'Lobby-CurrencyHeader-CurrencyContainer';
const CurrencyIcon = 'Lobby-CurrencyHeader-CurrencyIcon';
const CurrencyCount = 'Lobby-CurrencyHeader-CurrencyCount';
const QuestXPContainer = 'Lobby-CurrencyHeader-QuestXPContainer';
const ToolTipContainer = 'Lobby-CurrencyHeader-ToolTipContainer';
const ToolTipCurrencyContainer = 'Lobby-CurrencyHeader-ToolTipCurrencyContainer';
const ToolTipCurrencyIcon = 'Lobby-CurrencyHeader-ToolTipCurrencyIcon';
const TooltipCurrencyTextContainer = 'Lobby-CurrencyHeader-TooltipCurrencyTextContainer';
const TooltipCurrencyName = 'Lobby-CurrencyHeader-TooltipCurrencyName';
const TooltipCurrencyDescription = 'Lobby-CurrencyHeader-TooltipCurrencyDescription';

const StringIDLobbyCurrencyTooltipHardCurrencyDescription = 'LobbyCurrencyTooltipHardCurrencyDescription';
const StringIDLobbyCurrencyTooltipChampionXPDescription = 'LobbyCurrencyTooltipChampionXPDescription';
const StringIDLobbyCurrencyTooltipBattlePassXPDescription = 'LobbyCurrencyTooltipBattlePassXPDescription';

interface ReactProps {}

interface InjectedProps {
  perksByID: Dictionary<PerkDefGQL>;
  rmtPurchases: RMTPurchaseDefGQL[];
  stringTable: Dictionary<StringTableEntryDef>;
  ownedPerks: PerkGQL[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ALobbyCurrencyHeader extends React.Component<Props> {
  render(): React.ReactNode {
    const hardCurrencyCount = this.props.ownedPerks.find((p) => p.id == BUX_PERK_ID)?.qty ?? 0;

    return (
      <TooltipSource tooltipParams={{ id: `LobbyCurrencyHeader`, content: this.renderTooltip.bind(this) }}>
        <div className={Container}>
          {this.getCurrency(this.getHardCurrencyIconURL(), hardCurrencyCount, this.onHardCurrencyClick.bind(this))}
          <div className={QuestXPContainer}>
            {this.getQuestXPPotions(QuestType.BattlePass)}
            {this.getQuestXPPotions(QuestType.Champion)}
          </div>
        </div>
      </TooltipSource>
    );
  }

  private getQuestXPPotions(questType: QuestType): JSX.Element {
    const perk: PerkDefGQL = Object.values(this.props.perksByID).find((perkDef) => {
      return perkDef.perkType == PerkType.QuestXP && perkDef.questType == questType;
    });

    if (!perk) {
      return null;
    }

    const currencyCount = this.props.ownedPerks.find((p) => p.id == perk.id)?.qty ?? 0;
    return this.getCurrency(perk.iconURL, currencyCount, this.onQuestXPClick.bind(this));
  }

  private getCurrency(iconURL: string, count: number, onClick: () => void): JSX.Element {
    return (
      <div className={CurrencyContainer} onClick={onClick}>
        <img className={CurrencyIcon} src={iconURL} />
        <span className={CurrencyCount}>{addCommasToNumber(count)}</span>
      </div>
    );
  }

  private onHardCurrencyClick(): void {
    // Only open the PurchaseGems overlay if there are actually gems available to purchase!
    if ((this.props.rmtPurchases?.length ?? 0) > 0) {
      this.props.dispatch(showOverlay(Overlay.PurchaseGems));
      game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_STORE_OPEN);
    }
  }

  private onQuestXPClick(): void {
    this.props.dispatch(updateStoreCurrentRoute(StoreRoute.QuestXP));
    this.props.dispatch(navigateTo(LobbyView.Store));
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_STORE_OPEN);
  }

  private getHardCurrencyIconURL(): string {
    if (this.props.perksByID && this.props.perksByID[BUX_PERK_ID]) {
      return this.props.perksByID[BUX_PERK_ID].iconURL;
    } else {
      return 'images/MissingAsset.png';
    }
  }

  private currencyTooltipDetails(iconURL: string, name: string, description: string): JSX.Element {
    if (!iconURL) {
      return null;
    }

    return (
      <div className={ToolTipCurrencyContainer}>
        <img className={ToolTipCurrencyIcon} src={iconURL} />
        <div className={TooltipCurrencyTextContainer}>
          <span className={TooltipCurrencyName}>{name}</span>
          <span className={TooltipCurrencyDescription}>{description}</span>
        </div>
      </div>
    );
  }

  private questXPTooltipDetails(questType: QuestType, descriptionStringID: string): JSX.Element {
    const perk: PerkDefGQL = Object.values(this.props.perksByID).find((perkDef) => {
      return perkDef.perkType == PerkType.QuestXP && perkDef.questType == questType;
    });

    if (!perk) {
      return null;
    }

    return this.currencyTooltipDetails(
      perk.iconURL,
      perk.name,
      getStringTableValue(descriptionStringID, this.props.stringTable)
    );
  }

  private renderTooltip(): JSX.Element {
    const hardCurrencyName = this.props.perksByID[BUX_PERK_ID]?.name ?? '';
    const hardCurrencyDescription = getStringTableValue(
      StringIDLobbyCurrencyTooltipHardCurrencyDescription,
      this.props.stringTable
    );

    return (
      <div className={ToolTipContainer}>
        {this.currencyTooltipDetails(this.getHardCurrencyIconURL(), hardCurrencyName, hardCurrencyDescription)}
        {this.questXPTooltipDetails(QuestType.BattlePass, StringIDLobbyCurrencyTooltipChampionXPDescription)}
        {this.questXPTooltipDetails(QuestType.Champion, StringIDLobbyCurrencyTooltipBattlePassXPDescription)}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID, rmtPurchases } = state.store;
  const ownedPerks = state.profile?.perks ?? [];
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    ownedPerks,
    rmtPurchases,
    perksByID,
    stringTable
  };
}

export const LobbyCurrencyHeader = connect(mapStateToProps)(ALobbyCurrencyHeader);
