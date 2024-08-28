/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  ChampionInfo,
  Group,
  Member,
  PerkDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';

import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { ProfileModel } from '../../../../redux/profileSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';

const Container = 'StartScreen-Play-PlayerView-Container';
const PlayerPosition = 'StartScreen-Play-PlayerView-PlayerPosition';
const PlayerContainer = 'StartScreen-Play-PlayerView-PlayerContainer';
const PlayerImageContainer = 'StartScreen-Play-PlayerView-PlayerImageContainer';
const PlayerImage = 'StartScreen-Play-PlayerView-PlayerImage';
const PlayerInfoContainer = 'StartScreen-Play-PlayerView-PlayerInfoContainer';
const ProfileBox = 'StartScreen-Play-PlayerView-ProfileBox';
const TextContainer = 'StartScreen-Play-PlayerView-TextContainer';
const PlayerNameText = 'StartScreen-Play-PlayerView-PlayerNameText';

const PlayerLabelText = 'StartScreen-Play-PlayerView-PlayerLabelText';

const StringIDGroupsLeader = 'GroupsLeader';
const StringIDPlayDefaultDisplayName = 'PlayDefaultDisplayName';

export interface Champion extends ChampionInfo {
  costumes: ChampionCostumeInfo[];
}

interface PlayerPortraitProps {
  isLeader: boolean;
  isSelf: boolean;
  isSelected?: boolean;
  standingImage: string;
  thumbnailImage: string;
  displayName: string;
  className?: string;
  index: number;
  stringTable: Dictionary<StringTableEntryDef>;
}

class PlayerPortrait extends React.Component<PlayerPortraitProps> {
  constructor(props: PlayerPortraitProps) {
    super(props);
  }

  private makeTransform(): string {
    const row = Math.ceil(this.props.index / 2);
    const multiplier = this.props.index % 2 == 1 ? -19 : 19;
    const vmax = row * multiplier;
    const scale = 1.1 - row * 0.2;
    const translate = -40 - row * 10;

    return `translateX(calc(-50% + ${vmax.toFixed(2)}vmax)) translateY(${translate}%) scale(${scale.toFixed(4)})`;
  }

  public render(): JSX.Element {
    const leaderClass = this.props.isLeader ? 'leader' : '';
    const containerClassName = this.props.className ? this.props.className : '';
    const selfClass = this.props.isSelf ? 'self' : '';
    const selectedClass = this.props.isSelected ? 'selected' : '';

    const playerLabel: JSX.Element = this.props.isLeader ? (
      <div className={PlayerLabelText}>{getStringTableValue(StringIDGroupsLeader, this.props.stringTable)}</div>
    ) : null;

    return (
      <div className={`${PlayerContainer} ${containerClassName}`}>
        <div
          className={`${PlayerPosition} playerPos`}
          style={{
            position: 'absolute',
            zIndex: -this.props.index,
            transform: this.makeTransform()
          }}
        >
          <div className={PlayerImageContainer}>
            <img className={PlayerImage} src={this.props.standingImage} />
          </div>
          <div className={`${PlayerInfoContainer} ${selfClass}`}>
            <div
              className={`${ProfileBox} ${leaderClass} ${selectedClass}`}
              style={{ backgroundImage: `url(${this.props.thumbnailImage})` }}
            />
            <div className={`${TextContainer}  ${selectedClass}`}>
              <div className={PlayerNameText}>{this.props.displayName}</div>
              {playerLabel}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

interface ReactProps {}

interface InjectedProps {
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  group: Group;
  selectedGroupMemberIndex: number;
  userID: string;
  displayName: string;
  profile: ProfileModel;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class APlayerView extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    // This enormous Consumer tree will vanish as we move the individual contexts into Redux.
    let defaultChampion: ChampionGQL = null;
    let defaultChampionCostume: ChampionCostumeInfo = null;
    if (this.props.profile && this.props.profile.defaultChampionID) {
      defaultChampion = this.props.profile.champions.find((c) => c.championID == this.props.profile.defaultChampionID);
      if (defaultChampion) {
        const costumePerk = this.props.perksByID[defaultChampion.costumePerkID];
        if (costumePerk) {
          defaultChampionCostume = this.props.championCostumes.find((costume) => costume.id == costumePerk.costume.id);
        }
      }
    }
    const standingImage = defaultChampionCostume
      ? defaultChampionCostume.standingImageURL
      : 'images/hud/champions/berserker.png';
    const thumbnailImage = this.getChampionThumbnailURL(defaultChampion?.portraitPerkID, defaultChampionCostume);
    const displayName = this.props.displayName
      ? this.props.displayName
      : getStringTableValue(StringIDPlayDefaultDisplayName, this.props.stringTable);

    const portraits: JSX.Element[] = [];

    let selfSelected = false;
    if (this.props.group) {
      const selfIdx = this.props.group.members.findIndex((v) => v.id == this.props.userID);
      selfSelected = this.props.selectedGroupMemberIndex >= 0 && this.props.selectedGroupMemberIndex == selfIdx;
    }

    // always add a portait for the current logged in player
    portraits.push(
      <PlayerPortrait
        isSelf={true}
        isLeader={this.props.userID === this.props.group?.leader.id}
        isSelected={selfSelected}
        standingImage={standingImage}
        thumbnailImage={thumbnailImage}
        displayName={displayName}
        className='self'
        stringTable={this.props.stringTable}
        index={0}
      />
    );

    // show the selected group member and the next group member after that, if available
    if (this.props.group) {
      for (let groupMemberPortrait of this.getExtraGroupMemberPortraits(this.props.userID)) {
        portraits.push(groupMemberPortrait);
      }
    }

    return <div className={Container}>{portraits}</div>;
  }

  private getChampionThumbnailURL(portraitID: string, costume: ChampionCostumeInfo): string {
    if (portraitID) {
      const portraitPerk = this.props.perksByID[portraitID];
      if (portraitPerk) {
        return portraitPerk.portraitThumbnailURL;
      }
    }

    return costume ? costume.thumbnailURL : 'images/hud/champions/berserker-profile.png';
  }

  // returns an array of group member indices
  private getExtraGroupMemberPortraits(selfPlayerID: string, maxNumPortraits: number = 2): JSX.Element[] {
    const members = this.props.group?.members;

    if (!members || members.length == 0) {
      return [];
    }

    // first determine which group members we want to show
    let groupMemberIndices: number[] = [];

    let selectedIdx = this.props.selectedGroupMemberIndex;
    if (selectedIdx < 0 || selectedIdx >= members.length) {
      selectedIdx = 0;
    }

    for (let i = 0; i < members.length; i++) {
      const offsetIdx = (selectedIdx + i) % members.length;
      // don't include the player
      if (members[offsetIdx].id != selfPlayerID) {
        groupMemberIndices.push(offsetIdx);
      }
    }

    if (groupMemberIndices.length == 0) {
      return [];
    }

    // limit number of portraits to show
    if (maxNumPortraits > 0 && groupMemberIndices.length > maxNumPortraits) {
      groupMemberIndices = groupMemberIndices.slice(0, maxNumPortraits);
    }

    // now determine where to show them and create their jsx elements
    let portraits: JSX.Element[] = [];
    for (let groupMemberIdx of groupMemberIndices) {
      const portrait: JSX.Element = this.getGroupMemberPlayerPortrait(groupMemberIdx, portraits.length + 1);
      if (portrait != null) {
        portraits.push(portrait);
      }
    }

    return portraits;
  }

  private getGroupMemberPlayerPortrait(groupIndex: number, imageIndex: number, className: string = ''): JSX.Element {
    const members = this.props.group?.members;
    if (!members || !(groupIndex in members)) {
      return null;
    }

    const player: Member = members[groupIndex];
    if (!player) {
      return null;
    }

    let standingImage = 'images/hud/champions/berserker.png';
    let thumbnailImage = 'images/hud/champions/berserker-profile.png';

    const costume: ChampionCostumeInfo = player.champion
      ? this.getCostumeInfo(player.champion.costumeID, player.champion.championID)
      : null;
    if (costume != null) {
      standingImage = costume.standingImageURL;
      thumbnailImage = this.getChampionThumbnailURL(player.champion.portraitID, costume);
    }

    const isSelected = this.props.selectedGroupMemberIndex >= 0 && this.props.selectedGroupMemberIndex == groupIndex;

    return (
      <PlayerPortrait
        isSelf={false}
        isLeader={player.id === this.props.group?.leader.id}
        isSelected={isSelected}
        standingImage={standingImage}
        thumbnailImage={thumbnailImage}
        displayName={player.displayName}
        className={className}
        stringTable={this.props.stringTable}
        index={imageIndex}
      />
    );
  }

  private getCostumeInfo(costumeID: string, championID: string = ''): ChampionCostumeInfo {
    if (costumeID && costumeID.length > 0) {
      const costumeInfo = this.props.championCostumes.find((costume) => costume.id == costumeID);
      if (costumeInfo && (championID.length == 0 || costumeInfo.requiredChampionID == championID)) {
        return costumeInfo;
      }
    }

    if (this.props.championCostumes.length > 0) {
      return this.props.championCostumes[0];
    }

    return null;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { champions, championCostumes } = state.championInfo;
  const { selectedGroupMemberIndex, group } = state.teamJoin;
  const { displayName, id } = state.user;
  const { perksByID } = state.store;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    championCostumes,
    champions,
    selectedGroupMemberIndex,
    group,
    userID: id,
    displayName,
    profile: state.profile,
    perksByID,
    stringTable
  };
}

export const PlayerView = connect(mapStateToProps)(APlayerView);
