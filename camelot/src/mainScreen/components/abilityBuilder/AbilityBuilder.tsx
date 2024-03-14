/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  HUDHorizontalAnchor,
  HUDLayer,
  HUDVerticalAnchor,
  HUDWidgetRegistration,
  addMenuWidgetExiting
} from '../../redux/hudSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { AbilityNetworkDefData, FactionData, AbilityDisplayData } from '../../redux/gameDefsSlice';
import Escapable from '../Escapable';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { AbilityBuilderTypeSelector } from './AbilityBuilderTypeSelector';
import { BarHeader } from '../BarHeader';
import { AbilityBuilderCreate } from './AbilityBuilderCreate';
import { CSETransition } from '../../../shared/components/CSETransition';
import { AbilityBuilderNewAbility } from './AbilityBuilderNewAbility';
import { CloseButton } from '../../../shared/components/CloseButton';
import { setNowEditingAbilityId } from '../../redux/abilitiesSlice';
import { InitTopic } from '../../redux/initializationSlice';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import BackgroundChooseTypeURL from '../../../images/abilitybuilder/classes-bg-texture.jpg';
import BackgroundGenericURL from '../../../images/abilitybuilder/classes-bg-generic.jpg';
import { UserClassesData } from '@csegames/library/dist/_baseGame/clientFunctions/AssetFunctions';

const Root = 'HUD-AbilityBuilder-Root';
const Header = 'HUD-AbilityBuilder-Header';
const HeaderOverlay = 'HUD-AbilityBuilder-HeaderOverlay';
const Content = 'HUD-AbilityBuilder-Content';
const Background = 'HUD-AbilityBuilder-Background';
const RestartButton = 'HUD-AbilityBuilder-RestartButton';
const AnimatedTransition = 'HUD-AbilityBuilder-Transition';
const SavingVeil = 'HUD-AbilityBuilderCreate-SavingVeil';
const TopRightCloseButton = 'HUD-TopRightCloseButton';

const transitionDurationMS = 1000;

interface State {
  selectedAbilityType: string;
  newAbilityId: number | null;
  isSaving: boolean;
}

interface ReactProps {}

interface InjectedProps {
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  abilityDisplayData: Dictionary<AbilityDisplayData>;
  characterClass: UserClassesData;
  myFaction: FactionData;
  nowEditingAbilityId: number | null;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBuilder extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedAbilityType: '',
      newAbilityId: null,
      isSaving: false
    };
  }

  render(): JSX.Element {
    let hueRotation: string = `hue-rotate(${this.props.characterClass?.AbilityBuilderHueRotation ?? '0deg'})`;
    if (this.state.selectedAbilityType.length > 0 && this.props.abilityNetworks[this.state.selectedAbilityType]) {
      hueRotation = `hue-rotate(${
        this.props.abilityNetworks[this.state.selectedAbilityType].AbilityBuilderHueRotation
      })`;
    }

    const shouldShowTypeSelector = this.state.selectedAbilityType.length === 0;
    const shouldShowAbilityOptions = this.state.selectedAbilityType.length > 0 && this.state.newAbilityId === null;
    const shouldShowNewAbility = this.state.newAbilityId !== null;

    return (
      <div className={Root}>
        <Escapable escapeID={WIDGET_NAME_ABILITY_BUILDER} onEscape={this.closeSelf.bind(this)} />
        <CloseButton className={TopRightCloseButton} onClick={this.closeSelf.bind(this)} />
        <BarHeader
          className={Header}
          overlayClassName={HeaderOverlay}
          textStyle={{ filter: hueRotation }}
          overlayStyle={{ filter: hueRotation }}
        >
          {this.getHeaderTitle()}
          <CSETransition
            show={this.state.selectedAbilityType.length > 0}
            className={AnimatedTransition}
            entryDurationMS={transitionDurationMS}
            exitDurationMS={transitionDurationMS}
          >
            <div className={RestartButton} style={{ filter: hueRotation }} onClick={this.onRestartClicked.bind(this)}>
              Start Over
            </div>
          </CSETransition>
        </BarHeader>
        <div className={Content}>
          <img className={Background} src={this.getBackgroundSource()} />
          <CSETransition
            show={shouldShowTypeSelector}
            className={AnimatedTransition}
            entryDurationMS={transitionDurationMS}
            exitDurationMS={transitionDurationMS}
          >
            <AbilityBuilderTypeSelector
              onTypeSelected={(selectedAbilityType) => {
                this.setState({ selectedAbilityType });
              }}
            />
          </CSETransition>
          <CSETransition
            show={shouldShowAbilityOptions}
            className={AnimatedTransition}
            entryDurationMS={transitionDurationMS}
            exitDurationMS={transitionDurationMS}
            removeWhenHidden={true} // Otherwise the tooltips stick around when they shouldn't.
          >
            <AbilityBuilderCreate
              selectedAbilityType={this.state.selectedAbilityType}
              onReset={this.onReset.bind(this)}
              isSaving={this.state.isSaving}
              onSaveBegun={this.onSaveBegun.bind(this)}
              onSaveEnded={this.onNewAbilityIdChanged.bind(this)}
            />
          </CSETransition>
          <CSETransition
            show={shouldShowNewAbility}
            className={AnimatedTransition}
            entryDurationMS={transitionDurationMS}
            exitDurationMS={transitionDurationMS}
            removeWhenHidden={true} // Otherwise the tooltips stick around when they shouldn't.
          >
            <AbilityBuilderNewAbility
              selectedAbilityType={this.state.selectedAbilityType}
              newAbilityId={this.state.newAbilityId}
              onReset={this.onReset.bind(this)}
            />
          </CSETransition>
        </div>
        <CSETransition show={this.state.isSaving} className={AnimatedTransition} removeWhenHidden={true}>
          <div className={SavingVeil}>Saving...</div>
        </CSETransition>
      </div>
    );
  }

  componentDidMount(): void {
    if (this.props.nowEditingAbilityId !== null) {
      // Select the matching ability type so we show the Create/Edit UI.
      this.selectTypeForAbilityEditing();
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.nowEditingAbilityId !== null && prevProps.nowEditingAbilityId !== this.props.nowEditingAbilityId) {
      // Select the matching ability type so we show the Create/Edit UI.
      this.selectTypeForAbilityEditing();
    } else if (this.props.nowEditingAbilityId == null && prevProps.nowEditingAbilityId != null) {
      this.setState({ selectedAbilityType: '', newAbilityId: null });
    }
  }

  private closeSelf(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_ABILITY_BUILDER));
  }

  private onSaveBegun(): void {
    this.setState({ isSaving: true });
  }

  private onNewAbilityIdChanged(newAbilityId: number): void {
    this.setState({ selectedAbilityType: '', newAbilityId: newAbilityId, isSaving: false });
  }

  private onRestartClicked(): void {
    if (this.state.selectedAbilityType.length > 0) {
      this.onReset();
    }
  }

  private selectTypeForAbilityEditing(): void {
    const abilityData = this.props.abilityDisplayData[this.props.nowEditingAbilityId];
    const networkID = abilityData ? abilityData.abilityNetworkId : '';
    this.setState({
      selectedAbilityType: networkID
    });
  }

  private onReset(): void {
    this.props.dispatch(setNowEditingAbilityId(null));
    this.setState({ selectedAbilityType: '', newAbilityId: null });
  }

  private getHeaderTitle(): string {
    if (this.state.selectedAbilityType?.length > 0) {
      if (this.props.nowEditingAbilityId !== null) {
        return `Ability Builder | Edit Mode`;
      } else {
        return `Ability Builder | ${this.state.selectedAbilityType}`;
      }
    } else {
      return 'Ability Builder | Choose an Ability Type';
    }
  }

  private getBackgroundSource(): string {
    if (this.state.selectedAbilityType?.length > 0) {
      if (this.props.characterClass?.AbilityBuilderBackgroundImage?.length > 0) {
        // First choice is a class-specific background.
        return this.props.characterClass.AbilityBuilderBackgroundImage;
      } else if (this.props.myFaction?.abilityBuilderBackgroundURL?.length > 0) {
        // Second choice is a faction-specific background.
        return this.props.myFaction.abilityBuilderBackgroundURL;
      } else {
        // If all else fails, we have a generic background we can use.
        return BackgroundGenericURL;
      }
    } else {
      // No ability type.
      return BackgroundChooseTypeURL;
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityNetworks, abilityDisplayData } = state.gameDefs;
  const characterClass = state.gameDefs.classDynamicAssets[state.player.classID];
  const myFaction = state.gameDefs.factions[Faction[state.player.faction]];
  const { nowEditingAbilityId } = state.abilities;
  return {
    ...ownProps,
    abilityNetworks,
    abilityDisplayData,
    characterClass,
    myFaction,
    nowEditingAbilityId
  };
};

const AbilityBuilder = connect(mapStateToProps)(AAbilityBuilder);

export const WIDGET_NAME_ABILITY_BUILDER = 'Ability Builder';
export const abilityBuilderRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_ABILITY_BUILDER,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 3,
    yOffset: 4.5
  },
  initTopics: [InitTopic.Abilities, InitTopic.GameDefs],
  layer: HUDLayer.Menus,
  render: () => {
    return <AbilityBuilder />;
  }
};
