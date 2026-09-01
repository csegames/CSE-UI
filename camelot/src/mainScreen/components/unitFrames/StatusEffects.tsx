/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StatusDef } from '../../dataSources/manifest/statusManifest';
import { StatusState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/StatusState';
import { getNewestStatusInstances, getStatusInstanceKey, isStatusBuff, StatusData } from '../../helpers/statusHelpers';
import { StatusEffectsIcon } from './StatusEffectsIcon';
import { getIsEntityNPC } from '../../helpers/characterHelpers';
import { hasStatusInstanceCounts } from '../../redux/entitiesSlice';

const HIDDEN_STATUS_TAG = 'UI.Hidden';

// CSS classes
const Root = 'HUD-StatusEffects-Root';
const StatusSection = 'HUD-StatusEffects-StatusSection';

interface ReactProps {
  statuses: Dictionary<StatusState>;
  entityID: string;
}

interface InjectedProps {
  statusesByNumericID: Record<number, StatusDef>;
  isNPC: boolean;
  statusInstanceCounts: Record<number, number>;
}

type Props = ReactProps & InjectedProps;

class StatusEffects extends React.Component<Props> {
  render(): React.ReactNode {
    const entries = Object.entries(this.props.statuses);
    if (entries.length === 0) {
      return null;
    }

    const [buffs, debuffs] = this.getBuffsAndDebuffs();

    return (
      <div className={`${Root} ${this.props.isNPC ? 'npc' : ''}`}>
        <div className={StatusSection}>
          {buffs.map((buff) => (
            <StatusEffectsIcon statusData={buff} entityID={this.props.entityID} key={getStatusInstanceKey(buff)} />
          ))}
        </div>
        <div className={StatusSection}>
          {debuffs.map((debuff) => (
            <StatusEffectsIcon statusData={debuff} entityID={this.props.entityID} key={getStatusInstanceKey(debuff)} />
          ))}
        </div>
      </div>
    );
  }

  private getBuffsAndDebuffs(): [StatusData[], StatusData[]] {
    const buffs: StatusData[] = [];
    const debuffs: StatusData[] = [];

    const statusInstances = getNewestStatusInstances(
      Object.values(this.props.statuses),
      this.props.statusInstanceCounts
    );
    statusInstances.forEach((state) => {
      const def = this.props.statusesByNumericID[state.id];
      if (!def) {
        return;
      }

      // If this status shouldn't be shown, skip it.
      if (!def.showInHUD && !def.showOnAdd && !def.showOnInactive && !def.showOnRemove) {
        return;
      }
      if (def.statusTags.includes(HIDDEN_STATUS_TAG)) {
        return;
      }

      const data: StatusData = { ...def, ...state };

      if (data.isDisabled) return;

      if (isStatusBuff(def)) {
        buffs.push(data);
      } else {
        debuffs.push(data);
      }
    });

    return [buffs, debuffs];
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { statusesByNumericID } = state.gameDefs;
  const entity = state.entities.entities[ownProps.entityID];

  return {
    ...ownProps,
    statusesByNumericID,
    isNPC: getIsEntityNPC(entity),
    statusInstanceCounts: hasStatusInstanceCounts(entity) ? entity.statusInstanceCounts : {}
  };
}

export default connect(mapStateToProps)(StatusEffects);
