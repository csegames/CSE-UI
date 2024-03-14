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
import { ProfileModel, startProfileRefresh } from '../../../redux/profileSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { webConf } from '../../../dataSources/networkConfiguration';
import { StarBadge } from '../../../../shared/components/StarBadge';
import { PerkMultiButton } from './PerkMultiButton';
import { isPerkUnseen, markEquipmentSeen } from '../../../helpers/characterHelpers';
import { StringIDGeneralBack, getStringTableValue } from '../../../helpers/stringTableHelpers';

const FullscreenContainer = 'ChampionProfile-SelectSkin-Container';
const Centerer = 'ChampionProfile-SelectSkin-Centerer';

const TopContainer = 'ChampionProfile-SelectSkin-TopContainer';
const TopLeftPanel = 'ChampionProfile-SelectSkin-TopLeftPanel';
const TopRightPanel = 'ChampionProfile-SelectSkin-TopRightPanel';

const ButtonContainer = 'ChampionProfile-SelectSkin-ButtonContainer';

const SlotName = 'ChampionProfile-SelectSkin-SlotName';
const BackButton = 'ChampionProfile-SelectSkin-BackButton';
const SkinsContainer = 'ChampionProfile-SelectSkin-SkinsContainer';

const Cell = 'ChampionProfile-SelectSkin-Cell';
const CellIcon = 'ChampionProfile-SelectSkin-CellIcon';

const PreviewIcon = 'ChampionProfile-SelectSkin-PreviewIcon';
const PreviewInfoContainer = 'ChampionProfile-SelectSkin-PreviewInfoContainer';
const PreviewInfoTitle = 'ChampionProfile-SelectSkin-PreviewInfoTitle';
const PreviewInfoDescription = 'ChampionProfile-SelectSkin-PreviewInfoDescription';

const Badge = 'ChampionProfile-SelectSkin-Badge';

const StringIDChampionInfoDisplaySkinsTitle = 'ChampionInfoDisplaySkinsTitle';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  profile: ProfileModel;
  perks: PerkDefGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  ownedPerks: Dictionary<number>;
  newEquipment: Dictionary<boolean>;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  selectedSkin: PerkDefGQL;
  prevSelectedSkin: PerkDefGQL;
  previewIconIndex: number;
  isSaving: boolean;
}

class AFullscreenSelectSkin extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedSkin: this.getEquippedSkin(),
      prevSelectedSkin: null,
      previewIconIndex: 0,
      isSaving: false
    };
  }

  render(): JSX.Element {
    const equippedSkin = this.getEquippedSkin();
    let selectedSkinIconURL: string = '';
    if (this.state.selectedSkin) {
      selectedSkinIconURL =
        this.state.selectedSkin.iconURL && this.state.selectedSkin.iconURL.length > 0
          ? this.state.selectedSkin.iconURL
          : 'images/MissingAsset.png';
    }
    let prevSelectedSkinIconURL: string = '';
    if (this.state.prevSelectedSkin) {
      prevSelectedSkinIconURL =
        this.state.prevSelectedSkin.iconURL && this.state.prevSelectedSkin.iconURL.length > 0
          ? this.state.prevSelectedSkin.iconURL
          : 'images/MissingAsset.png';
    }
    return (
      <div className={FullscreenContainer}>
        <div className={Centerer}>
          <div className={TopContainer}>
            <div className={TopLeftPanel}>
              <div className={SlotName}>
                {getStringTableValue(StringIDChampionInfoDisplaySkinsTitle, this.props.stringTable)}
              </div>
              <div className={SkinsContainer}>
                {this.getSortedSkins().map((skin) => {
                  return this.renderSkinCell(equippedSkin, skin);
                })}
              </div>
            </div>
            <div className={TopRightPanel}>
              {this.state.selectedSkin && (
                <>
                  <img
                    id={'SkinSelect-PreviewIcon0'}
                    className={`${PreviewIcon} ${this.state.previewIconIndex === 0 ? 'Visible' : ''}`}
                    src={this.state.previewIconIndex === 0 ? selectedSkinIconURL : prevSelectedSkinIconURL}
                  />
                  <img
                    id={'SkinSelect-PreviewIcon1'}
                    className={`${PreviewIcon} ${this.state.previewIconIndex === 1 ? 'Visible' : ''}`}
                    src={this.state.previewIconIndex === 1 ? selectedSkinIconURL : prevSelectedSkinIconURL}
                  />
                  <div className={PreviewInfoContainer}>
                    <div className={PreviewInfoTitle}>{this.state.selectedSkin.name}</div>
                    <div className={PreviewInfoDescription}>{this.state.selectedSkin.description}</div>
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
            {this.state.selectedSkin && // Something is selected.
              this.state.selectedSkin.id !== equippedSkin?.id && ( // And it's not already equipped.
                <PerkMultiButton
                  isSaving={this.state.isSaving}
                  perk={this.state.selectedSkin}
                  onEquip={this.onEquipClick.bind(this)}
                />
              )}
          </div>
        </div>
      </div>
    );
  }

  private renderSkinCell(equipped: PerkDefGQL, skin: PerkDefGQL): JSX.Element {
    const ownedClass =
      this.props.ownedPerks[skin.id] === undefined || this.props.ownedPerks[skin.id] < 1 ? 'Unowned' : '';
    const selectedClass = this.state.selectedSkin && this.state.selectedSkin.id === skin.id ? 'Selected' : '';
    const equippedClass = equipped?.id === skin.id ? 'Equipped' : '';
    const isBadged = isPerkUnseen(skin.id, this.props.newEquipment, this.props.ownedPerks);
    return (
      <div
        className={`${Cell} ${ownedClass} ${selectedClass} ${equippedClass}`}
        onClick={this.onSkinClick.bind(this, skin)}
      >
        <img
          className={CellIcon}
          src={skin.iconURL && skin.iconURL.length > 0 ? skin.iconURL : 'images/MissingAsset.png'}
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
    const res = await ProfileAPI.SetChampionCostume(
      webConf,
      this.props.selectedChampion.id,
      this.state.selectedSkin.id
    );
    if (res.ok) {
      // The server says the skin was successfully equipped, so refetch to update all local state.
      this.props.dispatch(startProfileRefresh());
    } else {
      this.props.dispatch(showError(res));
    }
    this.setState({ isSaving: false });
  }

  private onSkinClick(skin: PerkDefGQL): void {
    this.setState({
      selectedSkin: skin,
      prevSelectedSkin: this.state.selectedSkin,
      // Switches between the two preview icons so we can do a crossfade.
      previewIconIndex: (this.state.previewIconIndex + 1) % 2
    });

    // When the user clicks onto a "new" item, unbadge it.
    markEquipmentSeen(skin.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
  }

  private getEquippedSkin(): PerkDefGQL {
    const equippedChampion = this.props.profile.champions.find((c) => c.championID == this.props.selectedChampion?.id);
    return equippedChampion ? this.props.perksByID[equippedChampion.costumePerkID] : null;
  }

  private getSortedSkins(): PerkDefGQL[] {
    // We only want skins that match the currently selected champion.
    const skins = this.props.perks.filter((p) => {
      return (
        p.perkType === PerkType.Costume &&
        p.champion &&
        p.champion.id === this.props.selectedChampion.id &&
        (p.showIfUnowned || this.props.ownedPerks[p.id])
      );
    });

    skins.sort((pa, pb) => {
      const aIsDefault = pa.id.indexOf('default') !== -1;
      const bIsDefault = pb.id.indexOf('default') !== -1;

      // Default is always first.
      // There should only be one default per champion, so this check can be a little simpler.
      if (aIsDefault) {
        return -1;
      }
      if (bIsDefault) {
        return 1;
      }

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

    return skins;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const { perks, perksByID, newEquipment } = state.store;
  const { ownedPerks } = state.profile;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    selectedChampion,
    profile: state.profile,
    perks,
    perksByID,
    ownedPerks,
    newEquipment,
    stringTable
  };
}

export const FullscreenSelectSkin = connect(mapStateToProps)(AFullscreenSelectSkin);
