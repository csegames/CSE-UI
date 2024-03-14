/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { RuneType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { RuneAlertBox } from '../../../redux/runesSlice';
import { Dictionary } from '@reduxjs/toolkit';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';

const IconSizeVmin = 4.65;
const IconBackgroundCircleRadiusVmin = 1.86;
const RuneAlertsContainer = 'RuneAlerts-RuneAlertsContainer';
const RuneAlertOuter = 'RuneAlerts-RuneAlertOuter';
const RuneAlertCount = 'RuneAlerts-RuneAlertCount';
const RuneAlertIconWrap = 'RuneAlerts-RuneAlertIconWrap';
const RuneAlertIconOverlay = 'RuneAlerts-RuneAlertIconOverlay';
const RuneAlertIcon = 'RuneAlerts-RuneAlertIcon';
const Icon = 'RuneAlerts-Icon';

const RuneAlertDescription = 'RuneAlerts-RuneAlertDescription';

interface RuneAlertProps {
  type: RuneType;
  count: string;
  desc: string;
  visible: boolean;
}

function RuneAlert(props: RuneAlertProps) {
  let runeColorClassName = '';
  let runeFsIcon = '';
  switch (props.type) {
    case RuneType.Weapon: {
      runeColorClassName = 'damage';
      runeFsIcon = 'fs-icon-rune-damage';
      break;
    }
    case RuneType.Health: {
      runeColorClassName = 'health';
      runeFsIcon = 'fs-icon-rune-health';
      break;
    }
    case RuneType.Protection: {
      runeColorClassName = 'protection';
      runeFsIcon = 'fs-icon-rune-barrier';
      break;
    }
    case RuneType.CharacterMod: {
      runeColorClassName = 'characterMod';
      runeFsIcon = 'fs-icon-misc-rune-mods';
      break;
    }
    default:
      break;
  }

  const visibilityClass = props.visible ? '' : 'rune-alert-fade-out';

  // need to define the SVG image in pixels, which then gets scaled to its vmin size
  const iconSizePx = 50;
  const iconBackgroundCircleRadiusPx = iconSizePx * (IconBackgroundCircleRadiusVmin / IconSizeVmin);

  return (
    <div className={`${RuneAlertOuter} ${runeColorClassName} ${visibilityClass}`}>
      <div className={RuneAlertCount}>{props.count}</div>
      <div className={RuneAlertIconWrap}>
        <div className={RuneAlertIconOverlay}>
          <svg className='circle-background-wrap' viewBox={`0 0 ${iconSizePx} ${iconSizePx}`}>
            <circle
              className='circle-background'
              cx={iconSizePx / 2}
              cy={iconSizePx / 2}
              r={iconBackgroundCircleRadiusPx}
            />
          </svg>
          <div className={RuneAlertIcon}>
            <span className={`${Icon} ${runeFsIcon} ${runeColorClassName}`} />
          </div>
        </div>
      </div>
      <div className={RuneAlertDescription}>{props.desc}</div>
    </div>
  );
}

export interface Props {
  collectedRunes: { [key in RuneType]: number };
  runeBonuses: { [key in RuneType]: number };
  alertBoxes: { [key in RuneType]: RuneAlertBox };
  stringTable: Dictionary<StringTableEntryDef>;
}

class ARuneAlerts extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    let alerts: JSX.Element[] = [];

    for (let runeTypeStr in Object.keys(this.props.alertBoxes)) {
      const runeType = +runeTypeStr as RuneType;
      const alert = this.props.alertBoxes[runeType];
      if (alert) {
        const countPrefix = alert.newCount > 0 ? '+' : '';
        const bonusPrefix = alert.newBonus > 0 ? '+' : '';
        const countDisplay = alert.newCount ? alert.newCount.toString() : ''; // dont show the number if it's a 0, just the percent change
        const bonusText = runeType != RuneType.CharacterMod ? `${bonusPrefix}${alert.newBonus}% ` : '';

        alerts.push(
          <RuneAlert
            type={runeType}
            count={`${countPrefix}${countDisplay}`}
            desc={`${bonusText}${this.getRuneName(runeType)}`}
            visible={alert.visibleTimeout !== null}
            key={runeType}
          />
        );
      }
    }

    return (
      <div id='RuneAlertsContainer_HUD' className={RuneAlertsContainer}>
        {alerts}
      </div>
    );
  }

  private getRuneName(runeType: RuneType): string {
    return getStringTableValue(`RuneTypes${RuneType[runeType]}`, this.props.stringTable);
  }
}

function mapStateToProps(state: RootState) {
  return {
    collectedRunes: state.runes.collectedRunes,
    runeBonuses: state.runes.runeBonuses,
    alertBoxes: state.runes.alertBoxes,
    stringTable: state.stringTable.stringTable
  };
}

export const RuneAlerts = connect(mapStateToProps)(ARuneAlerts);
