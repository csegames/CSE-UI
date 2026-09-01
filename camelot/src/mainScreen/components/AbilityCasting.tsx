/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { AbilityStateFlags } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { AbilityWithActivation } from '../redux/abilitiesSlice';
import { AbilityDisplayDef } from '../dataSources/manifest/abilityDisplayManifest';
import { getTokenizedStringTableValue, StringIDGeneralTimeInSeconds } from '../helpers/stringTableHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { AbilityNetworkDef } from '../dataSources/manifest/abilityNetworkManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { FactionBorder, BorderType, BorderBackground } from './FactionBorder';

// CSS classes
const Root = 'HUD-AbilityCasting-Root';
const Icon = 'HUD-AbilityCasting-Icon';
const IconImage = 'HUD-AbilityCasting-IconImage';
const Bar = 'HUD-AbilityCasting-Bar';
const BarFilled = 'HUD-AbilityCasting-BarFilled';
const BarUnfilled = 'HUD-AbilityCasting-BarUnfilled';
const BarName = 'HUD-AbilityCasting-BarName';
const BarTime = 'HUD-AbilityCasting-BarTime';
const BarMarker = 'HUD-AbilityCasting-BarMarker';

const MarkerWidthPercent = 2.5;
const CAST_BAR_TAG = 'UI.ShowCastBar';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  abilities: Dictionary<AbilityWithActivation>;
  abilityNetworks: Dictionary<AbilityNetworkDef>;
  abilityStatus: AbilityWithActivation;
  displayData: AbilityDisplayDef;
  stringTable: Dictionary<StringTableEntryDef>;
  selectedWidgetID: string;
  abilityDisplayDefsByNumericID: Dictionary<AbilityDisplayDef>;
}

type Props = ReactProps & InjectedProps;

interface State {
  animationHandle: ListenerHandle | null;
  remaining: string;
  filledPercent: number;
}

class AAbilityCasting extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animationHandle: this.shouldAnimate() ? clientAPI.startAnimation(this.animate.bind(this)) : null,
      remaining: '',
      filledPercent: 0
    };
  }

  render(): React.ReactNode {
    const isSelected = this.props.selectedWidgetID === WIDGET_ID_ABILITY_CASTING;
    const state = isSelected ? { remaining: '4.0', filledPercent: 25 } : this.state;
    const displayData = isSelected ? this.getSelectedDisplayData() : this.props.displayData;

    if (!state.remaining || !displayData) {
      return null;
    }
    return (
      <div className={Root}>
        <FactionBorder type={BorderType.Secondary} className={Icon}>
          <img className={IconImage} src={displayData?.iconURL} />
        </FactionBorder>
        <FactionBorder type={BorderType.Secondary} background={BorderBackground.PatternLarge} className={Bar}>
          <div className={BarFilled} style={{ width: `${state.filledPercent}%` }} />
          <div className={BarUnfilled} style={{ width: `${100 - state.filledPercent}%` }} />
          <div className={BarName}>{displayData.name}</div>
          <div className={BarTime}>
            {getTokenizedStringTableValue(StringIDGeneralTimeInSeconds, this.props.stringTable, {
              TIME: state.remaining
            })}
          </div>
          <div
            className={BarMarker}
            style={{ left: `${state.filledPercent - MarkerWidthPercent}%`, width: `${MarkerWidthPercent}%` }}
          />
        </FactionBorder>
      </div>
    );
  }

  componentDidUpdate(): void {
    if (this.shouldAnimate() && !this.state.animationHandle) {
      this.setState({ animationHandle: clientAPI.startAnimation(this.animate.bind(this)) });
    }
  }

  componentWillUnmount(): void {
    this.state.animationHandle?.close();
  }

  private animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    if (!this.shouldAnimate()) {
      this.clearState(true);
      return;
    }
    const castTime = this.props.abilityStatus.castTiming.duration;
    const start = this.props.abilityStatus.castTiming.start;

    const elapsed = data.worldTime - start;
    const filledPercent = (100 * elapsed) / castTime;
    if (filledPercent < 0 || filledPercent > 100) {
      this.clearState();
      return;
    }

    const remaining = (castTime - elapsed).toFixed(1);
    if (remaining !== this.state.remaining || filledPercent - this.state.filledPercent > 0.5) {
      this.setState({ remaining, filledPercent });
    }
  }

  private shouldAnimate(): boolean {
    return (
      this.props.abilityStatus &&
      this.props.displayData &&
      this.props.displayData.tags.includes(CAST_BAR_TAG) &&
      (this.props.abilityStatus.state & AbilityStateFlags.Preparation) === AbilityStateFlags.Preparation
    );
  }

  private clearState(closeHandle: boolean = false) {
    if (!this.state.remaining && (!closeHandle || !this.state.animationHandle)) {
      return;
    }
    const updated: State = { remaining: '', filledPercent: 0, animationHandle: this.state.animationHandle };
    if (closeHandle) {
      this.state.animationHandle?.close();
      updated.animationHandle = null;
    }
    this.setState(updated);
  }

  private getSelectedDisplayData(): AbilityDisplayDef {
    return (
      this.props.displayData ??
      this.props.abilityDisplayDefsByNumericID[
        Object.values(this.props.abilities).find((ability) => {
          const display = this.props.abilityDisplayDefsByNumericID[ability.displayDefID];
          const nw = this.props.abilityNetworks[display.networkID];
          // Exclude system abilities.
          if (!nw) return false;
          return true;
        }).displayDefID
      ]
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilities, preparingAbilityID } = state.abilities;
  const abilityStatus = abilities[preparingAbilityID];
  const { abilityDisplayDefsByNumericID, abilityNetworks } = state.gameDefs;
  const displayData = abilityDisplayDefsByNumericID[abilityStatus?.displayDefID];
  const stringTable = state.stringTable.stringTable;
  const { selectedWidgetID } = state.hud.editor;
  return {
    ...ownProps,
    abilities,
    abilityNetworks,
    abilityStatus,
    displayData,
    abilityDisplayDefsByNumericID,
    stringTable,
    selectedWidgetID
  };
};

const AbilityCasting = connect(mapStateToProps)(AAbilityCasting);

export const WIDGET_ID_ABILITY_CASTING = 'Ability Casting';
export const abilityCastingRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_ABILITY_CASTING,
  nameStringID: 'HUDEditorWidgetNameAbilityCasting',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Bottom,
    yOffset: 32.5
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <AbilityCasting isDragCopy={isDragCopy} />;
  }
};
