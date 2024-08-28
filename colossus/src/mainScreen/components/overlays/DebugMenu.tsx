/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Button } from '../shared/Button';
import { game } from '@csegames/library/dist/_baseGame';
import { GenericToaster } from '../GenericToaster';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { currentFormatVersion } from '@csegames/library/dist/hordetest/game/constants/StoreConstants';
import { ExplainedValueDisplay } from '../shared/ExplainedValueDisplay';
import {
  detectNewProgressionNodeUnlocks,
  getIsBadgedForAnyChampion,
  getIsBadgedForBattlePass,
  getIsBadgedForStore
} from '../../helpers/badgingUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  ChampionInfo,
  PerkDefGQL,
  PerkGQL,
  ProgressionNodeDef,
  PurchaseDefGQL,
  QuestDefGQL,
  QuestGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../redux/questSlice';
import {
  updateSeenProgressionNodesForChampion,
  updateUnseenUnlockedProgressionNodesForChampion
} from '../../redux/profileSlice';
import { OverlayInstance } from '../../redux/navigationSlice';

// Styles.
const Root = 'DebugMenu-Root';
const Column = 'DebugMenu-Column';
const SectionHeader = 'DebugMenu-SectionHeader';
const ScrollingSection = 'DebugMenu-ScrollingSection';
const ButtonStyle = 'DebugMenu-Button';

interface ReactProps {}

interface InjectedProps {
  champions: ChampionInfo[];
  newEquipment: Dictionary<boolean>;
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  quests: QuestGQL[];
  purchases: PurchaseDefGQL[];
  newPurchases: Dictionary<boolean>;
  progressionNodes: string[];
  serverTimeDeltaMS: number;
  perks: PerkGQL[];
  questDefs: QuestsByType;
  currentBattlePass: QuestDefGQL;
  progressionNodeDefsByChampionID: Dictionary<ProgressionNodeDef[]>;
  overlays: OverlayInstance[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ADebugMenu extends React.Component<Props> {
  public render(): React.ReactNode {
    return (
      <div className={Root}>
        <div className={Column}>
          <div className={SectionHeader}>{'Local Storage'}</div>
          <Button
            styles={ButtonStyle}
            type={'blue'}
            text={'Erase BattlePass Data'}
            onClick={this.onEraseBattlePassDataClicked.bind(this)}
          />
          <Button
            styles={ButtonStyle}
            type={'blue'}
            text={'Erase Progression Data'}
            onClick={this.onEraseProgressionDataClicked.bind(this)}
          />
          <Button
            styles={ButtonStyle}
            type={'blue'}
            text={'Erase RuneMods Data'}
            onClick={this.onEraseRuneModsDataClicked.bind(this)}
          />
          <Button
            styles={ButtonStyle}
            type={'blue'}
            text={'Erase Store Data'}
            onClick={this.onEraseStoreDataClicked.bind(this)}
          />
          <Button
            styles={ButtonStyle}
            type={'blue'}
            text={'Erase mute data'}
            onClick={this.onEraseMuteDataClicked.bind(this)}
          />
        </div>
        <div className={Column} style={{ width: '35vmin' }}>
          <div className={SectionHeader}>{'Badging'}</div>
          <div className={ScrollingSection} style={{ flexGrow: '1' }}>
            <ExplainedValueDisplay
              value={getIsBadgedForBattlePass(
                this.props.currentBattlePass,
                this.props.questDefs,
                this.props.perks,
                this.props.quests
              )}
            />
            <ExplainedValueDisplay
              value={getIsBadgedForAnyChampion(
                this.props.champions,
                this.props.newEquipment,
                this.props.ownedPerks,
                this.props.perksByID,
                this.props.quests
              )}
            />
            <ExplainedValueDisplay
              value={getIsBadgedForStore(
                this.props.purchases,
                this.props.newPurchases,
                this.props.perksByID,
                this.props.ownedPerks,
                this.props.progressionNodes,
                this.props.quests,
                this.props.serverTimeDeltaMS
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  private showGenericToaster(title: string, description: string): void {
    game.trigger('show-bottom-toaster', <GenericToaster title={title} description={description} />);
  }

  private onEraseBattlePassDataClicked(): void {
    clientAPI.setLastSeenBattlePassID('');
    clientAPI.setLastSeenFreeBattlePassID('');
    clientAPI.setLastSplashedBattlePassID('');
    clientAPI.setLastEndedBattlePassID('');

    this.showGenericToaster('', 'Battle Pass Local Storage data has been erased.');
  }

  private onEraseProgressionDataClicked(): void {
    this.props.champions.forEach((champion) => {
      clientAPI.setSeenProgressionNodesForChampion(champion.id, []);
      this.props.dispatch(updateSeenProgressionNodesForChampion(champion.id, []));

      clientAPI.setUnseenUnlockedProgressionNodesForChampion(champion.id, []);
      this.props.dispatch(updateUnseenUnlockedProgressionNodesForChampion(champion.id, []));

      detectNewProgressionNodeUnlocks(
        this.props.progressionNodeDefsByChampionID,
        this.props.ownedPerks,
        this.props.progressionNodes,
        this.props.quests,
        this.props.serverTimeDeltaMS,
        this.props.overlays,
        this.props.dispatch
      );
    });
  }

  private onEraseRuneModsDataClicked(): void {
    clientAPI.setHasSeenRuneModsTutorial(false);
  }

  private onEraseStoreDataClicked(): void {
    clientAPI.setSeenPurchases({});
    clientAPI.setUnseenEquipment({});

    this.showGenericToaster('', 'Store Local Storage data has been erased.');
  }

  private onEraseMuteDataClicked(): void {
    clientAPI.setTextChatBlocks({ base64AccountIDs: [], formatVersion: currentFormatVersion });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID, newEquipment, purchases, newPurchases } = state.store;
  const { perks, ownedPerks, quests, progressionNodes } = state.profile;
  const { champions, progressionNodeDefsByChampionID } = state.championInfo;
  const { serverTimeDeltaMS } = state.clock;
  const { currentBattlePass, quests: questDefs } = state.quests;
  const { overlays } = state.navigation;
  return {
    ...ownProps,
    champions,
    newEquipment,
    ownedPerks,
    perksByID,
    quests,
    purchases,
    newPurchases,
    progressionNodes,
    serverTimeDeltaMS,
    currentBattlePass,
    questDefs,
    perks,
    progressionNodeDefsByChampionID,
    overlays
  };
}

export const DebugMenu = connect(mapStateToProps)(ADebugMenu);
