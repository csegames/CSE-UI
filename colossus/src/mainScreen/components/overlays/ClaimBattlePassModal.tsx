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
import {
  ChampionInfo,
  PerkDefGQL,
  PerkGQL,
  QuestDefGQL,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import {
  getAllPendingBattlePassRewards,
  getBattlePassesWithUnclaimedRewards
} from '../views/Lobby/BattlePass/BattlePassUtils';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { GenericToaster } from '../GenericToaster';
import { createAlertsForCollectedQuestProgress } from '../../helpers/perkUtils';
import { ItemGrid } from '../shared/ItemGrid';
import { webConf } from '../../dataSources/networkConfiguration';
import { refreshProfile } from '../../dataSources/profileNetworking';

const Container = 'ClaimBattlePassModal-Container';
const Title = 'ClaimBattlePassModal-Title';
const Message = 'ClaimBattlePassModal-Message';
const ClaimButton = 'ClaimBattlePassModal-CloseButton';
const RewardsContainerWrapper = 'ClaimBattlePassModal-RewardsContainerWrapper';

const StringIDClaimMissedRewards = 'BattlePassClaimMissedRewards';
const StringIDClaimMissedRewardsMessage = 'BattlePassClaimMissedRewardsMessage';
const StringIDClaimNowButton = 'BattlePassClaimNowButton';
const StringIDBattlePassRewardsClaimedTitle = 'BattlePassRewardsClaimedTitle';
const StringIDBattlePassRewardsClaimedDescription = 'BattlePassRewardsClaimedDescription';

interface State {
  isClaimingRewards: boolean;
}

interface ReactProps {}

interface InjectedProps {
  perks: PerkGQL[];
  quests: QuestGQL[];
  battlePassQuests: QuestDefGQL[];
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDefGQL>;
  champions: ChampionInfo[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AClaimBattlePassModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { isClaimingRewards: false };
  }

  public render() {
    const rewards = getAllPendingBattlePassRewards(this.props.battlePassQuests, this.props.perks, this.props.quests);

    return (
      // Unsetting the height lets the modal calculate its size based on content.
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride='unset'>
        <div className={Container}>
          <div className={Title}>{getStringTableValue(StringIDClaimMissedRewards, this.props.stringTable)}</div>
          <div className={Message}>
            {getStringTableValue(StringIDClaimMissedRewardsMessage, this.props.stringTable)}
          </div>
          <ItemGrid className={RewardsContainerWrapper} items={rewards} />
          <Button
            type='blue'
            text={getStringTableValue(StringIDClaimNowButton, this.props.stringTable)}
            styles={ClaimButton}
            onClick={this.onClaimClick.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }

  private async onClose(): Promise<void> {
    this.props.dispatch(hideAllOverlays());
  }

  private async onClaimClick() {
    if (this.state.isClaimingRewards) {
      return;
    }

    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES);

    this.setState({ isClaimingRewards: true });

    const quests: QuestDefGQL[] = getBattlePassesWithUnclaimedRewards(
      this.props.battlePassQuests,
      this.props.perks,
      this.props.quests
    );

    const requests = quests.map(({ id: questId }) => ProfileAPI.CollectQuestReward(webConf, questId));

    Promise.all(requests).then((results) => {
      const error = results.find((res) => !res.ok);
      if (error) {
        this.props.dispatch(showError(error));
        this.setState({ isClaimingRewards: false });
      } else {
        quests.forEach((q) =>
          createAlertsForCollectedQuestProgress(
            q,
            this.props.quests.find((q) => q.id == q.id),
            this.props.perksByID,
            this.props.champions,
            this.props.dispatch
          )
        );

        // A summation toaster, rather than one for each item.
        game.trigger(
          'show-bottom-toaster',
          <GenericToaster
            title={getStringTableValue(StringIDBattlePassRewardsClaimedTitle, this.props.stringTable)}
            description={getStringTableValue(StringIDBattlePassRewardsClaimedDescription, this.props.stringTable)}
          />
        );
        // Get the new data.
        refreshProfile(() => {
          this.setState({ isClaimingRewards: false });
          this.onClose();
        }, this.props.dispatch);
      }
    });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { quests, perks } = state.profile;
  const battlePassQuests = state.quests.quests?.BattlePass;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;
  const { champions } = state.championInfo;

  return {
    ...ownProps,
    perks,
    quests,
    battlePassQuests,
    champions,
    stringTable,
    perksByID
  };
}

export const ClaimBattlePassModal = connect(mapStateToProps)(AClaimBattlePassModal);
