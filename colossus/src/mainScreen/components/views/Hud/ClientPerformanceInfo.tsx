/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { game } from '@csegames/library/dist/_baseGame';
import { ClientPerformanceStats } from '@csegames/library/dist/_baseGame/types/ClientPerformanceStats';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';

const RootContainer = 'ClientPerfInfo-Root';

const StatsContainer = 'ClientPerfInfo-StatContainer';
const IconsContainer = 'ClientPerfInfo-IconContainer';

const PerfStat = 'ClientPerfInfo-Stat';
const PerfStatNameValuePair = 'ClientPerfInfo-NameValuePair';
const PerfStatName = 'ClientPerfInfo-StatName';
const PerfStatValue = 'ClientPerfInfo-StatValue';
const PerfStatHelpMessage = 'ClientPerfInfo-HelpMessage';

const ClientPerfIcon = 'ClientPerfInfo-Icon';

const Icon_LowFPS = 'low-fps';
const Icon_HighLatency = 'high-latency';
const Icon_WorldDesync = 'world-desync';
const Icon_PlayerDesync = 'player-desync';
const Icon_ZeroNetworkTraffic = 'zero-net-traffic';

const StringIDHUDHelpAVGFramesPerSec = 'HUDHelpAVGFramesPerSec';
const StringIDHUDHelpLatencyAvgMS = 'HUDHelpLatencyAvgMS';
const StringIDHUDHelpTimeDelayMS = 'HUDHelpTimeDelayMS';
const StringIDHUDHelpSyncsPerSec = 'HUDHelpSyncsPerSec';
const StringIDHUDHelpSelfUpdatesPerSec = 'HUDHelpSelfUpdatesPerSec';
const StringIDHUDHelpZeroTrafficWarning = 'HUDHelpZeroTrafficWarning';
const StringIDHUDHelpTCPBytesPerSec = 'HUDHelpTCPBytesPerSec';
const StringIDHUDHelpUDPBytesPerSec = 'HUDHelpUDPBytesPerSec';

// if true, debug stats are always shown, even when game.debug is not enabled
const ForceShowDebugStats: boolean = false;

function formatDebugStatValue(value: number | boolean | string, precision: number = 2): string {
  if (typeof value === 'number') {
    if (precision === 0) {
      return `${Math.round(value)}`;
    } else if (precision > 0) {
      let valueStr: string = value.toFixed(precision);
      while (valueStr.length >= 2 && valueStr.endsWith('0')) {
        valueStr = valueStr.substring(0, valueStr.length - 1);
      }
      if (valueStr.length >= 2 && valueStr.endsWith('.')) {
        valueStr = valueStr.substring(0, valueStr.length - 1);
      }
      return valueStr;
    }
  } else if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  } else if (typeof value === 'string') {
    return value;
  }
  return `${value}`;
}

interface State {
  activePerfIcons: Dictionary<boolean>;
}

interface ReactProps {}

interface InjectedProps extends ClientPerformanceStats {
  haveClientData: boolean; // have we ever received data from the client?
  zeroTrafficWarning: boolean; // have tcp and udp bytes/sec both been zero for a few seconds?
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AClientPerformanceInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      activePerfIcons: {}
    };
  }

  public render(): JSX.Element {
    if (!this.props.haveClientData) {
      return null;
    }

    return (
      <div id='ClientPerformance_HUD' className={RootContainer}>
        {this.renderWarningIcons()}
        {this.renderDebugStats()}
      </div>
    );
  }

  componentDidMount(): void {
    this.updateIconState();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    this.updateIconState();
  }

  private updateIconState(): void {
    const newIcons: Dictionary<boolean> = {};

    if (this.props.avgFramesPerSec > 0 && this.props.avgFramesPerSec < 30) {
      newIcons[Icon_LowFPS] = true;
    }
    if (this.props.latencyAvgMS > 175) {
      newIcons[Icon_HighLatency] = true;
    }
    if (this.props.timeDelayMS < -2000 || this.props.timeDelayMS > 2000) {
      newIcons[Icon_WorldDesync] = true;
    }
    if (this.props.syncsPerSec > 0) {
      newIcons[Icon_PlayerDesync] = true;
    }
    if (this.props.zeroTrafficWarning) {
      newIcons[Icon_ZeroNetworkTraffic] = true;
    }

    const newKeys = Object.keys(newIcons);
    const oldKeys = Object.keys(this.state.activePerfIcons);

    let isChanged: boolean = false;
    // If newKeys has it but previous state doesn't, report ADDED.
    newKeys.forEach((icon) => {
      if (!this.state.activePerfIcons[icon]) {
        console.log(`PerfIcons: ${icon} added.`);
        isChanged = true;
      }
    });

    // If previous state has it but newIcons doesn't, report REMOVED.
    oldKeys.forEach((icon) => {
      if (!newIcons[icon]) {
        console.log(`PerfIcons: ${icon} removed.`);
        isChanged = true;
      }
    });

    if (isChanged) {
      this.setState({ activePerfIcons: newIcons });
    }
  }

  public renderDebugStats(): JSX.Element {
    if (!ForceShowDebugStats && !game.debug) {
      return null;
    }

    const stats: JSX.Element[] = [];

    const addStat = (name: string, value: number | boolean | string, helpMessage: string, precision: number = 2) => {
      stats.push(
        <div className={PerfStat} key={stats.length}>
          <div className={PerfStatNameValuePair}>
            <div className={PerfStatName}>{name}</div>
            <div className={PerfStatValue}>{formatDebugStatValue(value, precision)}</div>
          </div>
          <div className={PerfStatHelpMessage}>{helpMessage}</div>
        </div>
      );
    };

    addStat(
      'avgFramesPerSec',
      this.props.avgFramesPerSec,
      getStringTableValue(StringIDHUDHelpAVGFramesPerSec, this.props.stringTable)
    );
    addStat(
      'latencyAvgMS',
      this.props.latencyAvgMS,
      getStringTableValue(StringIDHUDHelpLatencyAvgMS, this.props.stringTable)
    );
    addStat(
      'timeDelayMS',
      this.props.timeDelayMS,
      getStringTableValue(StringIDHUDHelpTimeDelayMS, this.props.stringTable)
    );
    addStat(
      'syncsPerSec',
      this.props.syncsPerSec,
      getStringTableValue(StringIDHUDHelpSyncsPerSec, this.props.stringTable)
    );
    addStat(
      'selfUpdatesPerSec',
      this.props.selfUpdatesPerSec,
      getStringTableValue(StringIDHUDHelpSelfUpdatesPerSec, this.props.stringTable)
    );
    addStat(
      'zeroTrafficWarning',
      this.props.zeroTrafficWarning,
      getStringTableValue(StringIDHUDHelpZeroTrafficWarning, this.props.stringTable)
    );
    addStat(
      'tcpBytesPerSec',
      this.props.tcpBytesPerSec,
      getStringTableValue(StringIDHUDHelpTCPBytesPerSec, this.props.stringTable)
    );
    addStat(
      'udpBytesPerSec',
      this.props.udpBytesPerSec,
      getStringTableValue(StringIDHUDHelpUDPBytesPerSec, this.props.stringTable)
    );

    return <div className={StatsContainer}>{stats}</div>;
  }

  public renderWarningIcons(): JSX.Element {
    const icons: JSX.Element[] = [];

    const addIcon = (imageCls: string) =>
      icons.push(<div className={`${ClientPerfIcon} ${imageCls}`} key={imageCls} />);

    Object.keys(this.state.activePerfIcons).forEach(addIcon);

    return <div className={IconsContainer}>{icons}</div>;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  const { haveClientData, zeroTrafficWarning, stats } = state.performanceData;
  const { stringTable } = state.stringTable;
  return {
    ...ownProps,
    haveClientData,
    zeroTrafficWarning,
    stringTable,
    ...stats
  };
}

export const ClientPerformanceInfo = connect(mapStateToProps)(AClientPerformanceInfo);
