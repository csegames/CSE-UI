/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Round } from '../../redux/matchSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { ConnectionStatus } from '@csegames/library/dist/_baseGame/types/ConnectionStatus';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { LifecyclePhase } from '../../redux/navigationSlice';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { ScenarioDef } from '../../dataSources/manifest/scenarioManifest';

const Background = 'LoadingScreen-ScenarioBackgroundImage';
const Container = 'LoadingScreen-Container';
const Logo = 'LoadingScreen-Logo';
const LoadingTextPosition = 'LoadingScreen-LoadingTextPosition';
const Text = 'LoadingScreen-Text';
const HintContainer = 'LoadingScreen-HintContainer';
const HintText = 'LoadingScreen-HintText';
const Sprite = 'LoadingScreen-Sprite';

const DEFAULT_IMAGE = 'images/fullscreen/loadingScreen/bg-battle.jpg';
const TITLE_IMAGE = 'images/fullscreen/loadingScreen/bg-launch.jpg';
const LOADING_ANIM = 'images/fullscreen/loadingScreen/loading-anim.gif';

// see also LoadingPhase.cpp for C++ defined strings
export const LoadingPhase_FindingServer = 'LoadingPhaseFindingServer';

interface InjectedProps {
  currentRound: Round;
  connectionStatus: ConnectionStatus;
  initCompleted: boolean;
  lifecyclePhase: LifecyclePhase;
  loadingPhase: string;
  loadingHint?: string;
  scenarioDefs: Dictionary<ScenarioDef>;
  stringTable: Dictionary<StringTableEntryDef>;
}

interface ReactProps {}

type Props = ReactProps & InjectedProps;

export class ALoadingScreen extends React.Component<Props> {
  public render() {
    if (!this.props.initCompleted) {
      return (
        <div id='loadingScreen' className={Container}>
          <img className={Background} src={TITLE_IMAGE} />
          <div className={LoadingTextPosition}>
            <img className={Sprite} src={LOADING_ANIM} />
          </div>
        </div>
      );
    }

    const { phaseName, image } = this.getPhaseInfo();
    if (phaseName == null) {
      return null;
    }

    const phaseText = getStringTableValue(phaseName, this.props.stringTable);

    const hints = this.props.loadingHint ? (
      <div className={HintContainer}>
        <span className={HintText}>{this.props.loadingHint}</span>
      </div>
    ) : null;

    return (
      <div id='loadingScreen' className={Container}>
        <img className={Background} src={image} />
        {this.props.children}
        <div className={Logo}></div>
        <div className={LoadingTextPosition}>
          <div className={Text}>{phaseText}</div>
          <img className={Sprite} src={LOADING_ANIM} />
        </div>
        {hints}
      </div>
    );
  }

  private getPhaseInfo(): { phaseName: string; image: string } {
    const image = this.props.scenarioDefs[this.props.currentRound?.scenarioID]?.loadingBackgroundImage ?? DEFAULT_IMAGE;
    if (this.props.loadingPhase) {
      return { phaseName: this.props.loadingPhase, image };
    }
    if (
      this.props.lifecyclePhase == LifecyclePhase.Playing &&
      (this.props.connectionStatus == ConnectionStatus.Disconnected ||
        this.props.connectionStatus == ConnectionStatus.Connecting)
    ) {
      return { phaseName: LoadingPhase_FindingServer, image };
    }
    return { phaseName: null, image: null };
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentRound, connectionStatus } = state.match;
  const { scenarioDefs } = state.scenarios;
  const { initCompleted, loadingPhase, loadingHint } = state.loading;
  const { lifecyclePhase } = state.navigation;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    currentRound,
    connectionStatus,
    initCompleted,
    lifecyclePhase,
    loadingPhase,
    loadingHint,
    scenarioDefs,
    stringTable
  };
}

export const LoadingScreen = connect(mapStateToProps)(ALoadingScreen);
