/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';

const KilledByContainer = 'Announcements-KilledBy-Container';
const KilledByIcon = 'Announcements-KilledBy-Icon';
const DeathStatContainer = 'Announcements-DeathStatContainer';
const DeathStatLabel = 'Announcements-KilledBy-KillerLabel';
const DeathStatValue = 'Announcements-DeathStatValue';

const StringIDAnnouncementKilledBy = 'AnnouncementKilledBy';

interface ReactProps {}

interface InjectedProps {
  killersName: string;
  killersRaceDef: CharacterRaceDef;
  playerIcon: string;
  lifeState: LifeState;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = InjectedProps & ReactProps;

class AKilledBy extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    const haveKnownKiller = !!this.props.killersRaceDef;
    const killedByIconSrc = this.props.killersRaceDef ? this.props.killersRaceDef.thumbnailURL : '';
    if (haveKnownKiller && this.props.lifeState == LifeState.Downed) {
      return (
        <div className={KilledByContainer}>
          <div className={`${DeathStatLabel}`}>
            {getStringTableValue(StringIDAnnouncementKilledBy, this.props.stringTable)}
          </div>
          <img className={KilledByIcon} src={killedByIconSrc} />
          <div className={`${DeathStatContainer}`}>
            <div className={DeathStatValue}>{this.getKillersName()}</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  private getKillersName(): string {
    if (this.props.killersName) {
      return this.props.killersName;
    }

    if (this.props.killersRaceDef) {
      return this.props.killersRaceDef.name;
    }

    return '';
  }
}

function mapStateToProps(state: RootState) {
  const killersName: string = state.player.killersName;
  const killersRaceDef: CharacterRaceDef = state.game.characterRaceDefs[state.player.killersRace];
  const playerIcon: string = state.player.portraitURL;
  const lifeState: LifeState = state.player.lifeState;
  const { stringTable } = state.stringTable;
  return {
    killersName,
    killersRaceDef,
    playerIcon,
    lifeState,
    stringTable
  };
}

export const KilledBy = connect(mapStateToProps)(AKilledBy);
