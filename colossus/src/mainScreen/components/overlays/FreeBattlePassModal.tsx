/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { hideAllOverlays, showError } from '../../redux/navigationSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { PurchaseDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { webConf } from '../../dataSources/networkConfiguration';
import { startProfileRefresh } from '../../redux/profileSlice';
import { QuestsByType } from '../../redux/questSlice';
import { getCurrentBattlePassPremiumPurchaseDef } from '../views/Lobby/BattlePass/BattlePassUtils';

const Container = 'FreeBattlePassModal-Container';
const Title = 'FreeBattlePassModal-Title';
const Message = 'FreeBattlePassModal-Message';
const ButtonRow = 'FreeBattlePassModal-ButtonRow';
const ClaimButton = 'FreeBattlePassModal-ClaimButton';

const StringIDTitle = 'BattlePassFreeModalTitle';
const StringIDMessage = 'BattlePassFreeModalMessage';
const StringIDClaimPremiumButton = 'BattlePassClaimPremiumButton';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  questDefs: QuestsByType;
  purchases: PurchaseDefGQL[];
  serverTimeDeltaMS: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFreeBattlePassModal extends React.Component<Props> {
  private onClose() {
    this.props.dispatch(hideAllOverlays());
  }

  public render() {
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)}>
        <div className={Container}>
          <div className={Title}>{getStringTableValue(StringIDTitle, this.props.stringTable)}</div>
          <div className={Message}>{getStringTableValue(StringIDMessage, this.props.stringTable)}</div>
          <div className={ButtonRow}>
            <Button
              type='primary'
              text={getStringTableValue(StringIDClaimPremiumButton, this.props.stringTable)}
              styles={ClaimButton}
              onClick={this.onClaimClick.bind(this)}
            />
          </div>
        </div>
      </MiddleModalDisplay>
    );
  }

  private async onClaimClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);

    // Attempt to claim the BattlePass key.
    const purchase = getCurrentBattlePassPremiumPurchaseDef(
      this.props.questDefs.BattlePass,
      this.props.purchases,
      this.props.serverTimeDeltaMS
    );
    const res = await ProfileAPI.Purchase(webConf, purchase.id, 1);
    if (!res.ok) {
      this.props.dispatch(showError(res));
    } else {
      this.props.dispatch(startProfileRefresh());
    }

    this.onClose();
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const questDefs = state.quests.quests;
  const { purchases } = state.store;
  const { serverTimeDeltaMS } = state.clock;

  return { ...ownProps, stringTable, questDefs, purchases, serverTimeDeltaMS };
}

export const FreeBattlePassModal = connect(mapStateToProps)(AFreeBattlePassModal);
