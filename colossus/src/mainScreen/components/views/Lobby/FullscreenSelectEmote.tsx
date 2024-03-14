import * as React from 'react';
import {
  ChampionInfo,
  PerkDefGQL,
  PerkType,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { LobbyView, navigateTo, showError } from '../../../redux/navigationSlice';
import { RootState } from '../../../redux/store';
import { Button } from '../../shared/Button';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { updateSelectedEmoteIndex } from '../../../redux/championInfoSlice';
import { LocalVideoPlayer } from '../../shared/LocalVideoPlayer';
import { ProfileModel, startProfileRefresh } from '../../../redux/profileSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { webConf } from '../../../dataSources/networkConfiguration';
import { StarBadge } from '../../../../shared/components/StarBadge';
import { PerkMultiButton } from './PerkMultiButton';
import { isPerkUnseen, markEquipmentSeen } from '../../../helpers/characterHelpers';
import { StringIDGeneralBack, getStringTableValue } from '../../../helpers/stringTableHelpers';

const FullscreenContainer = 'ChampionProfile-SelectEmote-Container';
const Centerer = 'ChampionProfile-SelectEmote-Centerer';

const TopContainer = 'ChampionProfile-SelectEmote-TopContainer';
const TopLeftPanel = 'ChampionProfile-SelectEmote-TopLeftPanel';
const TopRightPanel = 'ChampionProfile-SelectEmote-TopRightPanel';

const ButtonContainer = 'ChampionProfile-SelectEmote-ButtonContainer';

const SlotName = 'ChampionProfile-SelectEmote-SlotName';
const EquippedEmotesContainer = 'ChampionProfile-SelectEmote-EquippedEmotesContainer';
const EquippedEmoteCell = 'ChampionProfile-SelecteEmote-EquippedEmoteCell';
const BackButton = 'ChampionProfile-SelectEmote-BackButton';
const EmotesContainer = 'ChampionProfile-SelectEmote-EmotesContainer';

const Cell = 'ChampionProfile-SelectEmote-Cell';
const CellIcon = 'ChampionProfile-SelectEmote-CellIcon';

const PreviewIcon = 'ChampionProfile-SelectEmote-PreviewIcon';
const PreviewVideoContainer = 'ChampionProfile-SelectEmote-PreviewVideoContainer';
const PreviewVideo = 'ChampionProfile-SelectEmote-PreviewVideo';
const PreviewInfoContainer = 'ChampionProfile-SelectEmote-PreviewInfoContainer';
const PreviewInfoTitle = 'ChampionProfile-SelectEmote-PreviewInfoTitle';
const PreviewInfoDescription = 'ChampionProfile-SelectEmote-PreviewInfoDescription';

const Badge = 'ChampionProfile-SelectEmote-Badge';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  selectedEmoteIndex: number;
  profile: ProfileModel;
  perks: PerkDefGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  ownedPerks: Dictionary<number>;
  newEquipment: Dictionary<boolean>;
  maxEmoteCount: number;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  selectedEmote: PerkDefGQL;
  prevSelectedEmote: PerkDefGQL;
  previewIconIndex: number;
  isSaving: boolean;
}

class AFullscreenSelectEmote extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const selectedEmote = this.getEquippedAtIndex(this.getAllEquippedEmotes(), this.props.selectedEmoteIndex);
    this.state = {
      selectedEmote,
      prevSelectedEmote: null,
      previewIconIndex: 0,
      isSaving: false
    };
  }

  render(): JSX.Element {
    const allEquippedEmotes = this.getAllEquippedEmotes();
    const equippedEmote = this.getEquippedAtIndex(allEquippedEmotes, this.props.selectedEmoteIndex);

    let selectedEmoteIconURL: string = null;
    if (this.state.selectedEmote) {
      selectedEmoteIconURL =
        this.state.selectedEmote.iconURL && this.state.selectedEmote.iconURL.length > 0
          ? this.state.selectedEmote.iconURL
          : 'images/MissingAsset.png';
    }
    let prevSelectedEmoteIconURL: string = null;
    if (this.state.prevSelectedEmote) {
      prevSelectedEmoteIconURL =
        this.state.prevSelectedEmote.iconURL && this.state.prevSelectedEmote.iconURL.length > 0
          ? this.state.prevSelectedEmote.iconURL
          : 'images/MissingAsset.png';
    }

    let selectedEmoteVideoURL: string = null;
    if (this.state.selectedEmote) {
      selectedEmoteVideoURL =
        this.state.selectedEmote.videoURL &&
        this.state.selectedEmote.videoURL.length > 0 &&
        this.state.selectedEmote.videoURL;
    }
    let prevSelectedEmoteVideoURL: string = null;
    if (this.state.prevSelectedEmote) {
      prevSelectedEmoteVideoURL =
        this.state.prevSelectedEmote.videoURL &&
        this.state.prevSelectedEmote.videoURL.length > 0 &&
        this.state.prevSelectedEmote.videoURL;
    }

    const slot0iconURL = this.state.previewIconIndex === 0 ? selectedEmoteIconURL : prevSelectedEmoteIconURL;
    const slot0videoURL = this.state.previewIconIndex === 0 ? selectedEmoteVideoURL : prevSelectedEmoteVideoURL;
    const slot1iconURL = this.state.previewIconIndex === 1 ? selectedEmoteIconURL : prevSelectedEmoteIconURL;
    const slot1videoURL = this.state.previewIconIndex === 1 ? selectedEmoteVideoURL : prevSelectedEmoteVideoURL;

    const shouldShowMultiButton =
      this.state.selectedEmote && // Something is selected.
      equippedEmote?.id !== this.state.selectedEmote.id; // It's not already equipped.

    const emoteSlots: number[] = [];
    for (let i = 0; i < this.props.maxEmoteCount; ++i) {
      emoteSlots.push(i);
    }

    return (
      <div className={FullscreenContainer}>
        <div className={Centerer}>
          <div className={TopContainer}>
            <div className={TopLeftPanel}>
              <div className={SlotName}>Emotes</div>
              <div className={EquippedEmotesContainer}>
                {emoteSlots.map((_, index) => {
                  // Perk may be null if nothing is assigned.
                  const perk = this.getEquippedAtIndex(allEquippedEmotes, index);
                  const selectedClass = index === this.props.selectedEmoteIndex ? 'Selected' : '';
                  // If there is a perk, it should have an icon.  If no perk, no icon.
                  const perkIconURL = perk
                    ? perk.iconURL?.length > 0
                      ? perk.iconURL
                      : 'images/MissingAsset.png'
                    : null;
                  return (
                    <div
                      className={`${EquippedEmoteCell} ${selectedClass}`}
                      onClick={this.onEmoteSlotClick.bind(this, allEquippedEmotes, index)}
                    >
                      <img className={CellIcon} src={perkIconURL} />
                    </div>
                  );
                })}
              </div>
              <div className={EmotesContainer}>
                {this.getSortedEmotes().map((emote) => {
                  return this.renderEmoteCell(equippedEmote, emote);
                })}
              </div>
            </div>
            <div className={TopRightPanel}>
              {this.state.selectedEmote && (
                <>
                  <div className={`${PreviewVideoContainer} ${this.state.previewIconIndex === 0 ? 'Visible' : ''}`}>
                    {slot0videoURL && (
                      <LocalVideoPlayer
                        src={slot0videoURL}
                        styles={PreviewVideo}
                        forceStop={this.state.previewIconIndex !== 0}
                      />
                    )}
                  </div>
                  <img
                    className={`${PreviewIcon} ${!slot0videoURL && this.state.previewIconIndex === 0 ? 'Visible' : ''}`}
                    src={slot0iconURL}
                  />
                  <div className={`${PreviewVideoContainer} ${this.state.previewIconIndex === 1 ? 'Visible' : ''}`}>
                    {slot1videoURL && (
                      <LocalVideoPlayer
                        src={slot1videoURL}
                        styles={PreviewVideo}
                        forceStop={this.state.previewIconIndex !== 1}
                      />
                    )}
                  </div>
                  <img
                    className={`${PreviewIcon} ${!slot1videoURL && this.state.previewIconIndex === 1 ? 'Visible' : ''}`}
                    src={slot1iconURL}
                  />
                  <div className={PreviewInfoContainer}>
                    <div className={PreviewInfoTitle}>{this.state.selectedEmote.name}</div>
                    <div className={PreviewInfoDescription}>{this.state.selectedEmote.description}</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={ButtonContainer}>
            <Button
              type={'blue-outline'}
              text={getStringTableValue(StringIDGeneralBack, this.props.stringTable)}
              styles={BackButton}
              onClick={this.onBackClick.bind(this)}
              disabled={false}
            />
            {shouldShowMultiButton && (
              <PerkMultiButton
                isSaving={this.state.isSaving}
                perk={this.state.selectedEmote}
                onEquip={this.onEquipClick.bind(this)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  private renderEmoteCell(equipped: PerkDefGQL, emote: PerkDefGQL): JSX.Element {
    const ownedClass =
      this.props.ownedPerks[emote.id] === undefined || this.props.ownedPerks[emote.id] < 1 ? 'Unowned' : '';
    const selectedClass = this.state.selectedEmote?.id === emote.id ? 'Selected' : '';
    const equippedClass = equipped?.id == emote.id ? 'Equipped' : '';
    const isBadged = isPerkUnseen(emote.id, this.props.newEquipment, this.props.ownedPerks);
    return (
      <div
        className={`${Cell} ${ownedClass} ${selectedClass} ${equippedClass}`}
        onClick={this.onEmoteClick.bind(this, emote)}
        onDoubleClick={this.onEmoteDoubleClick.bind(this, emote)}
      >
        <img
          className={CellIcon}
          src={emote.iconURL && emote.iconURL.length > 0 ? emote.iconURL : 'images/MissingAsset.png'}
        />
        {isBadged && <StarBadge className={Badge} />}
      </div>
    );
  }

  private onBackClick(): void {
    this.props.dispatch(navigateTo(LobbyView.Champions));
  }

  private async onEquipClick(): Promise<void> {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
    this.setState({ isSaving: true });
    const res = await ProfileAPI.SetChampionEmote(
      webConf,
      this.props.selectedChampion.id,
      this.state.selectedEmote.id,
      this.props.selectedEmoteIndex
    );
    if (res.ok) {
      this.props.dispatch(startProfileRefresh());
    } else {
      this.props.dispatch(showError(res));
    }
    this.setState({ isSaving: false });
  }

  private onEmoteClick(emote: PerkDefGQL): void {
    // Are we going to the same emote (or from no emote to no emote)?
    if (this.state.selectedEmote?.id === emote?.id) {
      return;
    }

    this.setState({
      selectedEmote: emote,
      prevSelectedEmote: this.state.selectedEmote,
      // Switches between the two preview icons so we can do a crossfade.
      previewIconIndex: (this.state.previewIconIndex + 1) % 2
    });

    // When the user clicks onto a "new" item, unbadge it.
    if (emote) {
      markEquipmentSeen(emote.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
    }
  }

  private onEmoteDoubleClick(emote: PerkDefGQL): void {
    // do the normal selection stuff
    this.onEmoteClick(emote);

    // also equip if owned
    const ownedCount = this.props.ownedPerks[emote.id] ?? 0;
    if (ownedCount > 0) {
      this.onEquipClick();
    }
  }

  private onEmoteSlotClick(equipped: PerkDefGQL[], index: number): void {
    if (index != this.props.selectedEmoteIndex) {
      this.props.dispatch(updateSelectedEmoteIndex(index));

      // Switch the current selection to the emote equipped in this slot.
      this.onEmoteClick(this.getEquippedAtIndex(equipped, index));
    }
  }

  private getAllEquippedEmotes(): PerkDefGQL[] {
    const equippedChampion = this.props.profile.champions.find((c) => c.championID == this.props.selectedChampion?.id);
    return equippedChampion?.emotePerkIDs
      ? equippedChampion.emotePerkIDs.map((perkID) => this.props.perksByID[perkID] ?? null)
      : [];
  }

  private getEquippedAtIndex(equipped: PerkDefGQL[], index: number): PerkDefGQL {
    return index in equipped ? equipped[index] : null;
  }

  private getSortedEmotes(): PerkDefGQL[] {
    // We only want emotes that match the currently selected champion.
    const emotes = this.props.perks.filter((p) => {
      return (
        p.perkType === PerkType.Emote &&
        p.champion &&
        p.champion.id === this.props.selectedChampion.id &&
        (p.showIfUnowned || this.props.ownedPerks[p.id])
      );
    });

    emotes.sort((pa, pb) => {
      // Owned comes before unowned.
      const aIsOwned = this.props.ownedPerks[pa.id] !== undefined && this.props.ownedPerks[pa.id] > 0 ? 1 : 0;
      const bIsOwned = this.props.ownedPerks[pb.id] !== undefined && this.props.ownedPerks[pb.id] > 0 ? 1 : 0;
      const ownedSort = bIsOwned - aIsOwned;
      if (ownedSort !== 0) {
        return ownedSort;
      }

      // Sort by ID at the end to make sure we maintain a consistent order.
      if (pa.id < pb.id) {
        return -1;
      } else if (pa.id > pb.id) {
        return 1;
      }

      return 0;
    });

    return emotes;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion, selectedEmoteIndex } = state.championInfo;
  const { perks, perksByID, newEquipment } = state.store;
  const { ownedPerks } = state.profile;
  const { maxEmoteCount } = state.gameSettings;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    selectedChampion,
    selectedEmoteIndex,
    profile: state.profile,
    perks,
    perksByID,
    ownedPerks,
    newEquipment,
    maxEmoteCount,
    stringTable
  };
}

export const FullscreenSelectEmote = connect(mapStateToProps)(AFullscreenSelectEmote);
