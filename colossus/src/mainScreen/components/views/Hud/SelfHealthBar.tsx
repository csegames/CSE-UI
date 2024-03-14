/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { StatusBar } from './StatusBar';
import { HealthBar } from './HealthBar';
import { ActionButtons } from './ActionButtons';

import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { RuneType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { hordetest } from '@csegames/library/dist/hordetest';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { RuneGauge } from './RuneGauge';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';

const Container = 'SelfHealthBar-Container';
const ColumnContainer = 'SelfHealthBar-ColumnContainer';
const GeneralInfoContainer = 'SelfHealthBar-GeneralInfoContainer';
const ExtrasContainer = 'SelfHealthBar-ExtrasContainer';
const HeartsContainer = 'SelfHealthBar-HeartsContainer';
const Heart = 'SelfHealthBar-Heart';
const RunesContainer = 'SelfHealthBar-RunesContainer';
const RuneItem = 'SelfHealthBar-RuneItem';
const RuneColor = 'SelfHealthBar-RuneColor';
const RuneBoldNumber = 'SelfHealthBar-RuneBoldNumber';
const RuneCount = 'SelfHealthBar-RuneCount';

const VOICE_CHAT_ICON_SIZE_VMIN = 2.4;

interface Runes<T> {
  [runeType: number]: T;
}

interface RuneCssData {
  colorClass: string;
  iconClass: string;
}

const PerRuneCssData: Runes<RuneCssData> = {
  [RuneType.Protection]: { colorClass: 'Protection', iconClass: 'fs-icon-rune-barrier' },
  [RuneType.Health]: { colorClass: 'Health', iconClass: 'fs-icon-rune-health' },
  [RuneType.Weapon]: { colorClass: 'Weapon', iconClass: 'fs-icon-rune-damage' }
};

interface ComponentProps {}

interface InjectedProps {
  accountID: string;
  isAlive?: boolean;
  resources?: ArrayMap<EntityResource>;
  name?: string;
  currentDeaths: number;
  maxDeaths: number;
  lifeState: LifeState;
  deathStartTime: number;
  downedStateEndTime: number;
  portraitURL: string;

  // Use RuneType enum as key
  collectedRunes?: { [key in RuneType]: number };
  runeBonuses?: { [key in RuneType]: number };
  maxRunesAllowed?: { [key in RuneType]: number };
}

type Props = InjectedProps & ComponentProps;

class ASelfHealthBar extends React.Component<Props, {}> {
  //private evh: ListenerHandle[] = [];
  //private runeGlowTimeout: any;
  private runesGlowing: boolean;
  constructor(props: Props) {
    super(props);
    //this.runeGlowTimeout = null;
    this.runesGlowing = false;
  }

  public render() {
    const hearts = Array.from(Array(Math.max(0, this.props.maxDeaths - this.props.currentDeaths)));
    const maxRunesAllowed = this.props.maxRunesAllowed;
    const collectedRunes = this.props.collectedRunes;

    let runes = [];
    for (let runeType of [RuneType.Protection, RuneType.Health, RuneType.Weapon]) {
      const iconClass = PerRuneCssData[runeType].iconClass;
      const colorClass = PerRuneCssData[runeType].colorClass;
      const isFull = maxRunesAllowed[runeType] > 0 && collectedRunes[runeType] >= maxRunesAllowed[runeType];
      runes.push(
        <div id={`RuneItem_${[runeType]}`} className={RuneItem} key={runes.length}>
          <span className={`${RuneColor} ${iconClass} ${colorClass}`} />
          <div className={isFull ? `${RuneBoldNumber} IsFull ${colorClass}` : RuneBoldNumber}>
            <span className={RuneCount}>{collectedRunes[runeType]}</span>
            <span style={{ margin: '0px 0.25vmin' }}>/</span>
            <span className={`${RuneColor} ${colorClass}`}>{maxRunesAllowed[runeType]}</span>
          </div>
          {/* JuddC: Temporarily hiding total bonus percentage in a way that makes it easy to turn back on later */}
          {/* NB. If you re-enable this, reduce the font size in RuneItem slightly */}
          {/*<Padded>({runeBonuses[runeType]}%)</Padded>*/}
        </div>
      );
    }

    const generalInfoClasses: string = `${GeneralInfoContainer} ${this.runesGlowing ? 'glow' : ''}`;

    return (
      <div id='SelfHealthBarContainer' className={Container}>
        <RuneGauge />
        <div id='SelfHealthBarColumnContainer' className={ColumnContainer}>
          <StatusBar />
          <HealthBar
            accountID={this.props.accountID}
            id='HealthBar_Self'
            style={{ marginBottom: '0.46vmin', marginTop: '0.92vmin' }}
            isAlive={this.props.isAlive}
            resourcesWidthVmin={31}
            resources={this.props.resources}
            collectedRunes={this.props.collectedRunes}
            runeBonuses={this.props.runeBonuses}
            raceID={hordetest.game.selfPlayerEntityState.race}
            name={this.props.name}
            voiceChatIconSizeVmin={VOICE_CHAT_ICON_SIZE_VMIN}
            lifeState={this.props.lifeState}
            deathStartTime={this.props.deathStartTime}
            downedStateEndTime={this.props.downedStateEndTime}
            isSelfHealthBar={true}
            portraitURL={this.props.portraitURL}
          />

          <div id='ExtrasContainer' className={ExtrasContainer}>
            <div id='GeneralInfoContainer' className={generalInfoClasses}>
              <div id='HeartsContainer' className={HeartsContainer}>
                {hearts.map((_, i) => {
                  return <span className={`${Heart} fs-icon-misc-heart`} key={i} />;
                })}
              </div>

              <div id='RunesContainer' className={RunesContainer}>
                {runes}
              </div>
            </div>
            <ActionButtons />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    accountID: state.user.id,
    isAlive: state.player.isAlive,
    resources: state.player.resources,
    collectedRunes: state.runes.collectedRunes,
    runeBonuses: state.runes.runeBonuses,
    maxRunesAllowed: state.runes.maxRunesAllowed,
    name: state.player.name,
    currentDeaths: isNaN(state.player.currentDeaths) ? 0 : state.player.currentDeaths,
    maxDeaths: isNaN(state.player.maxDeaths) ? 0 : state.player.maxDeaths,
    lifeState: state.player.lifeState,
    deathStartTime: state.player.deathStartTime,
    downedStateEndTime: state.player.downedStateEndTime,
    portraitURL: state.player.portraitURL
  };
}

export const SelfHealthBar = connect(mapStateToProps)(ASelfHealthBar);
