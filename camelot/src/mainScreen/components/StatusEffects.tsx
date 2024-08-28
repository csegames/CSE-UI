/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { StatusState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import TooltipSource from './TooltipSource';
import { Theme } from '../themes/themeConstants';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StatusDef } from '../dataSources/manifest/statusManifest';

// Styles.
const Root = 'HUD-StatusEffects-Root';
const StatusSection = 'HUD-StatusEffects-StatusSection';
const StatusContainer = 'HUD-StatusEffects-StatusContainer';
const StatusIcon = 'HUD-StatusEffects-StatusIcon';
const TooltipContainer = 'HUD-StatusEffects-TooltipContainer';
const TooltipName = 'HUD-StatusEffects-TooltipName';
const TooltipText = 'HUD-StatusEffects-TooltipText';

// Not sure why, but the StatusData type doesn't resolve correctly if
// I try to do this in one line.
type StatusDefMinus = Omit<StatusDef, 'id'>;
type StatusData = StatusState & StatusDefMinus & { warning?: string };

interface ReactProps {
  statuses: Dictionary<StatusState>;
}

interface InjectedProps {
  currentTheme: Theme;
  statusesByNumericID: Dictionary<StatusDef>;
}

type Props = ReactProps & InjectedProps;

class StatusEffects extends React.Component<Props> {
  render(): JSX.Element {
    const entries = Object.entries(this.props.statuses);
    if (entries.length === 0) {
      return null;
    }

    const [buffs, debuffs] = this.getBuffsAndDebuffs();

    return (
      <div className={Root}>
        <div className={StatusSection}>
          {buffs.map((buff) => {
            const id = `Buff${buff.numericID}`;
            return (
              <>
                <TooltipSource
                  className={StatusContainer}
                  key={id}
                  tooltipParams={{ id, content: this.renderTooltip.bind(this, buff) }}
                >
                  <img className={StatusIcon} src={buff.iconURL} />
                </TooltipSource>
              </>
            );
          })}
        </div>
        <div className={StatusSection}>
          {debuffs.map((debuff) => {
            return (
              <TooltipSource
                className={StatusContainer}
                tooltipParams={{ id: `Debuff${debuff.numericID}`, content: this.renderTooltip.bind(this, debuff) }}
              >
                <img className={StatusIcon} src={debuff.iconURL} />
              </TooltipSource>
            );
          })}
        </div>
      </div>
    );
  }

  private renderTooltip(status: StatusData): React.ReactNode {
    const ttType = isBuff(status) ? 'Positive' : 'Negative';
    return (
      <div className={TooltipContainer}>
        <div className={TooltipName}>{status.name}</div>
        <div className={`${TooltipText} ${ttType}`}>{ttType}</div>
        <div className={TooltipText}>{status.description}</div>
        {status.warning && <div className={`${TooltipText} warning`}>WARNING: {status.warning}</div>}
      </div>
    );
  }

  private getBuffsAndDebuffs(): [StatusData[], StatusData[]] {
    const buffs: StatusData[] = [];
    const debuffs: StatusData[] = [];

    Object.values(this.props.statuses).forEach((state) => {
      const def = this.props.statusesByNumericID[state.id];
      if (!def) {
        return;
      }

      // If this status shouldn't be shown, skip it.
      if (!def.showInHUD && !def.showOnAdd && !def.showOnInactive && !def.showOnRemove) {
        return;
      }

      const data: StatusData = { ...def, ...state };
      if (isBuff(def)) {
        buffs.push(data);
      } else {
        if (!data.statusTags.includes('hostile')) {
          data.warning = 'This status does not have a "friendly" or "hostile" tag. Defaulting to "hostile".';
        }
        debuffs.push(data);
      }
    });

    return [buffs, debuffs];
  }
}

function isBuff(def: StatusDef | StatusData): boolean {
  return def?.statusTags?.includes('friendly') ?? false;
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentTheme } = state.themes;
  const { statusesByNumericID } = state.gameDefs;
  return {
    ...ownProps,
    currentTheme,
    statusesByNumericID
  };
}

export default connect(mapStateToProps)(StatusEffects);
