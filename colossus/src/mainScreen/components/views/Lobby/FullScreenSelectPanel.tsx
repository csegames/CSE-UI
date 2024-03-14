/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  ChampionInfo,
  PerkDefGQL,
  PerkType
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { LobbyView, navigateTo, showError } from '../../../redux/navigationSlice';
import { RootState } from '../../../redux/store';
import { Button } from '../../shared/Button';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { webConf } from '../../../dataSources/networkConfiguration';
import { startProfileRefresh } from '../../../redux/profileSlice';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import {
  StringIDGeneralBack,
  StringIDGeneralUnderMaintenace,
  getStringTableValue
} from '../../../helpers/stringTableHelpers';
import { PerkMultiButton } from './PerkMultiButton';

const Panel = 'ChampionProfile-SelectPanel-Panel';
const Title = 'ChampionProfile-SelectPanel-Title';
const ItemContainer = 'ChampionProfile-SelectPanel-ItemContainer';
const ButtonContainer = 'ChampionProfile-SelectPanel-ButtonContainer';
const BackButton = 'ChampionProfile-SelectPanel-BackButton';

const UnderMaintenanceContainer = 'ChampionProfile-SelectPanel-UnderMaintenaceContainer';
const UnderMaintenance = 'ChampionProfile-SelectPanel-UnderMaintenaceMessage';
const UnderMaintenanceNails = 'ChampionProfile-SelectPanel-UnderMaintenaceNails';

export enum PanelSide {
  left = 'left',
  right = 'right'
}

interface ReactProps {
  title: string;
  side: PanelSide;
  items: JSX.Element[];
  perkType: PerkType;
  underMaintenance?: boolean;
}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionGQL[];
  championGQLs: ChampionGQL[];
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  selectedPerkLeft: PerkDefGQL;
  selectedPerkRight: PerkDefGQL;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isSaving: boolean;
}

class AFullScreenSelectPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isSaving: false
    };
  }

  render(): JSX.Element {
    if (this.props.underMaintenance) {
      return this.getUnderMaintenace();
    }
    const isLeftSide = this.props.side === PanelSide.left;
    const side = isLeftSide ? 'left' : 'right';
    return (
      <div className={Panel}>
        <div className={Title}>{this.props.title}</div>
        <div className={ItemContainer}>{this.props.items}</div>
        <div className={`${ButtonContainer} ${side}`}>
          {isLeftSide && (
            <Button
              type={'blue-outline'}
              text={getStringTableValue(StringIDGeneralBack, this.props.stringTable)}
              styles={BackButton}
              onClick={this.onBackClick.bind(this)}
              disabled={false}
            />
          )}
          {this.getSelectedItem() && (
            <PerkMultiButton
              isSaving={this.state.isSaving}
              perk={this.getSelectedItem()}
              onEquip={this.onEquipClick.bind(this)}
            />
          )}
        </div>
      </div>
    );
  }

  private onBackClick(): void {
    // clear out the toolTipSlice data so it doesn't persist into other championSubTabs
    this.props.dispatch(navigateTo(LobbyView.Champions));
  }

  // TODO: support emotes and rune mods, multiple items at once
  private async onEquipClick(): Promise<void> {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
    this.setState({ isSaving: true });
    const selectedPerkID =
      this.props.side === PanelSide.left ? this.props.selectedPerkLeft.id : this.props.selectedPerkRight.id;
    if (this.props.perkType === PerkType.Costume) {
      const res = await ProfileAPI.SetChampionCostume(webConf, this.props.selectedChampion.id, selectedPerkID);
      if (res.ok) {
        // The server says the skin was successfully equipped, so refetch to update all local state.
        this.props.dispatch(startProfileRefresh());
      } else {
        this.props.dispatch(showError(res));
      }
    } else if (this.props.perkType === PerkType.Portrait) {
      const res = await ProfileAPI.SetChampionPortrait(webConf, this.props.selectedChampion.id, selectedPerkID);
      if (res.ok) {
        // The server says the skin was successfully equipped, so refetch to update all local state.
        this.props.dispatch(startProfileRefresh());
      } else {
        this.props.dispatch(showError(res));
      }
    } else if (this.props.perkType === PerkType.SprintFX) {
      const res = await ProfileAPI.SetChampionSprintFX(webConf, this.props.selectedChampion.id, selectedPerkID);
      if (res.ok) {
        // The server says the skin was successfully equipped, so refetch to update all local state.
        this.props.dispatch(startProfileRefresh());
      } else {
        this.props.dispatch(showError(res));
      }
    } else if (this.props.perkType === PerkType.Weapon) {
      const res = await ProfileAPI.SetChampionWeapon(webConf, this.props.selectedChampion.id, selectedPerkID);
      if (res.ok) {
        // The server says the skin was successfully equipped, so refetch to update all local state.
        this.props.dispatch(startProfileRefresh());
      } else {
        this.props.dispatch(showError(res));
      }
    }
    this.setState({ isSaving: false });
  }

  private getSelectedItem(): PerkDefGQL {
    if (this.props.side === PanelSide.left) {
      return this.props.selectedPerkLeft;
    } else if (this.props.side === PanelSide.right) {
      return this.props.selectedPerkRight;
    }

    return null;
  }

  private getUnderMaintenace(): JSX.Element {
    return (
      <div className={Panel}>
        <div className={Title}>{this.props.title}</div>
        <div className={ItemContainer} />
        <div className={UnderMaintenanceContainer}>
          <span className={UnderMaintenanceNails}>•</span>
          <span className={UnderMaintenance}>
            {getStringTableValue(StringIDGeneralUnderMaintenace, this.props.stringTable)}
          </span>
          <span className={UnderMaintenanceNails}>•</span>
        </div>
        <div className={ButtonContainer}>
          <Button
            type={'blue-outline'}
            text={getStringTableValue(StringIDGeneralBack, this.props.stringTable)}
            styles={BackButton}
            onClick={this.onBackClick.bind(this)}
            disabled={false}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion, championCostumes } = state.championInfo;
  const { champions, ownedPerks } = state.profile;
  const championGQLs = champions;
  const { perksByID } = state.store;
  const { selectSelectedPerkLeft, selectSelectedPerkRight } = state.fullScreenSelect;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    selectedChampion,
    championCostumes,
    champions,
    championGQLs,
    ownedPerks,
    perksByID,
    selectedPerkLeft: selectSelectedPerkLeft,
    selectedPerkRight: selectSelectedPerkRight,
    stringTable
  };
}

export const FullScreenSelectPanel = connect(mapStateToProps)(AFullScreenSelectPanel);
