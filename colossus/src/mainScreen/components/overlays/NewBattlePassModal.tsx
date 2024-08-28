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
import { LobbyView, hideAllOverlays, navigateTo } from '../../redux/navigationSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { QuestDefGQL, QuestGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { StringIDGeneralClose, getStringTableValue } from '../../helpers/stringTableHelpers';
import { ensureBattlePassIsInitialized } from '../views/Lobby/BattlePass/BattlePassUtils';

const Container = 'NewBattlePassModal-Container';
const Background = 'NewBattlePassModal-Background';
const Logo = 'NewBattlePassModal-Logo';
const Title = 'NewBattlePassModal-Title';
const ButtonRow = 'NewBattlePassModal-ButtonRow';
const ViewButton = 'NewBattlePassModal-ViewButton';
const CloseButton = 'NewBattlePassModal-CloseButton';

//StringIDGeneralClose
const StringIDViewBattlePass = 'BattlePassViewBattlePass';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  currentBattlePass: QuestDefGQL;
  lobbyView: LobbyView;
  quests: QuestGQL[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ANewBattlePassModal extends React.Component<Props> {
  public render() {
    // Should only be possible to get here when a currentBattlePass exists, but we check anyway to handle debug scenarios.
    const splashImageURL =
      (this.props.currentBattlePass?.startedSplashImage?.length ?? 0) > 0
        ? this.props.currentBattlePass?.startedSplashImage
        : 'images/fullscreen/loadingscreen/bg-connect.jpg';

    const title =
      (this.props.currentBattlePass?.name?.length ?? 0) > 0
        ? this.props.currentBattlePass?.name
        : 'No Current BattlePass';

    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride={'80vmin'}>
        <img className={Background} src={splashImageURL} />
        <div className={Container}>
          <div className={Logo} />
          <div className={Title}>{title}</div>
          <div className={ButtonRow}>
            <Button
              type='primary'
              text={getStringTableValue(StringIDViewBattlePass, this.props.stringTable)}
              styles={ViewButton}
              onClick={this.onViewClick.bind(this)}
            />
            {this.props.lobbyView !== LobbyView.BattlePass ? (
              <Button
                type='blue'
                text={getStringTableValue(StringIDGeneralClose, this.props.stringTable)}
                styles={CloseButton}
                onClick={this.onClose.bind(this)}
              />
            ) : null}
          </div>
        </div>
      </MiddleModalDisplay>
    );
  }

  private async onClose(): Promise<void> {
    this.props.dispatch(hideAllOverlays());
  }

  componentWillUnmount(): void {
    ensureBattlePassIsInitialized(this.props.currentBattlePass, this.props.quests, this.props.dispatch);
  }

  private async onViewClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP_YES);

    this.props.dispatch(navigateTo(LobbyView.BattlePass));

    this.onClose();
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { quests } = state.profile;
  const { stringTable } = state.stringTable;
  const { currentBattlePass } = state.quests;
  const lobbyView = state.navigation.lobbyView;
  return {
    ...ownProps,
    stringTable,
    currentBattlePass,
    lobbyView,
    quests
  };
}

export const NewBattlePassModal = connect(mapStateToProps)(ANewBattlePassModal);
