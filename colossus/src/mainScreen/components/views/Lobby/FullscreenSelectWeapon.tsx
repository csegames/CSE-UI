import * as React from 'react';
import { ChampionInfo, PerkDefGQL, PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
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
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { StringIDGeneralBack, getStringTableValue } from '../../../helpers/stringTableHelpers';

const FullscreenContainer = 'ChampionProfile-SelectWeapon-Container';
const Centerer = 'ChampionProfile-SelectWeapon-Centerer';

const TopContainer = 'ChampionProfile-SelectWeapon-TopContainer';
const TopLeftPanel = 'ChampionProfile-SelectWeapon-TopLeftPanel';
const TopRightPanel = 'ChampionProfile-SelectWeapon-TopRightPanel';

const ButtonContainer = 'ChampionProfile-SelectWeapon-ButtonContainer';

const SlotName = 'ChampionProfile-SelectWeapon-SlotName';
const BackButton = 'ChampionProfile-SelectWeapon-BackButton';
const WeaponsContainer = 'ChampionProfile-SelectWeapon-WeaponsContainer';

const Cell = 'ChampionProfile-SelectWeapon-Cell';
const CellIcon = 'ChampionProfile-SelectWeapon-CellIcon';

const PreviewIcon = 'ChampionProfile-SelectWeapon-PreviewIcon';
const PreviewInfoContainer = 'ChampionProfile-SelectWeapon-PreviewInfoContainer';
const PreviewInfoTitle = 'ChampionProfile-SelectWeapon-PreviewInfoTitle';
const PreviewInfoDescription = 'ChampionProfile-SelectWeapon-PreviewInfoDescription';

const Badge = 'ChampionProfile-SelectWeapon-Badge';

const StringIDChampionInfoDisplayWeaponsTitle = 'ChampionInfoDisplayWeaponsTitle';

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
  selectedWeapon: PerkDefGQL;
  prevSelectedWeapon: PerkDefGQL;
  previewIconIndex: number;
  isSaving: boolean;
}

class AFullscreenSelectWeapon extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedWeapon: this.getEquippedWeapon(),
      prevSelectedWeapon: null,
      previewIconIndex: 0,
      isSaving: false
    };
  }

  render(): JSX.Element {
    const equippedWeapon = this.getEquippedWeapon();
    let selectedWeaponIconURL: string = '';
    if (this.state.selectedWeapon) {
      selectedWeaponIconURL =
        this.state.selectedWeapon.iconURL && this.state.selectedWeapon.iconURL.length > 0
          ? this.state.selectedWeapon.iconURL
          : 'images/MissingAsset.png';
    }
    let prevSelectedWeaponIconURL: string = '';
    if (this.state.prevSelectedWeapon) {
      prevSelectedWeaponIconURL =
        this.state.prevSelectedWeapon.iconURL && this.state.prevSelectedWeapon.iconURL.length > 0
          ? this.state.prevSelectedWeapon.iconURL
          : 'images/MissingAsset.png';
    }
    return (
      <div className={FullscreenContainer}>
        <div className={Centerer}>
          <div className={TopContainer}>
            <div className={TopLeftPanel}>
              <div className={SlotName}>
                {getStringTableValue(StringIDChampionInfoDisplayWeaponsTitle, this.props.stringTable)}
              </div>
              <div className={WeaponsContainer}>
                {this.getSortedWeapons().map((weapon) => {
                  return this.renderWeaponCell(equippedWeapon, weapon);
                })}
              </div>
            </div>
            <div className={TopRightPanel}>
              {this.state.selectedWeapon && (
                <>
                  <img
                    id={'WeaponSelect-PreviewIcon0'}
                    className={`${PreviewIcon} ${this.state.previewIconIndex === 0 ? 'Visible' : ''}`}
                    src={this.state.previewIconIndex === 0 ? selectedWeaponIconURL : prevSelectedWeaponIconURL}
                  />
                  <img
                    id={'WeaponSelect-PreviewIcon1'}
                    className={`${PreviewIcon} ${this.state.previewIconIndex === 1 ? 'Visible' : ''}`}
                    src={this.state.previewIconIndex === 1 ? selectedWeaponIconURL : prevSelectedWeaponIconURL}
                  />
                  <div className={PreviewInfoContainer}>
                    <div className={PreviewInfoTitle}>{this.state.selectedWeapon.name}</div>
                    <div className={PreviewInfoDescription}>{this.state.selectedWeapon.description}</div>
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
            {this.state.selectedWeapon && // Something is selected.
              this.state.selectedWeapon.id !== equippedWeapon?.id && ( // And it's not already equipped.
                <PerkMultiButton
                  isSaving={this.state.isSaving}
                  perk={this.state.selectedWeapon}
                  onEquip={this.onEquipClick.bind(this)}
                />
              )}
          </div>
        </div>
      </div>
    );
  }

  private renderWeaponCell(equipped: PerkDefGQL, weapon: PerkDefGQL): JSX.Element {
    const ownedClass =
      this.props.ownedPerks[weapon.id] === undefined || this.props.ownedPerks[weapon.id] < 1 ? 'Unowned' : '';
    const selectedClass = this.state.selectedWeapon && this.state.selectedWeapon.id === weapon.id ? 'Selected' : '';
    const equippedClass = equipped?.id === weapon.id ? 'Equipped' : '';
    const isBadged = isPerkUnseen(weapon.id, this.props.newEquipment, this.props.ownedPerks);
    return (
      <div
        className={`${Cell} ${ownedClass} ${selectedClass} ${equippedClass}`}
        onClick={this.onWeaponClick.bind(this, weapon)}
      >
        <img
          className={CellIcon}
          src={weapon.iconURL && weapon.iconURL.length > 0 ? weapon.iconURL : 'images/MissingAsset.png'}
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
    const res = await ProfileAPI.SetChampionWeapon(
      webConf,
      this.props.selectedChampion.id,
      this.state.selectedWeapon.id
    );
    if (res.ok) {
      this.props.dispatch(startProfileRefresh());
    } else {
      this.props.dispatch(showError(res));
    }
    this.setState({ isSaving: false });
  }

  private onWeaponClick(weapon: PerkDefGQL): void {
    this.setState({
      selectedWeapon: weapon,
      prevSelectedWeapon: this.state.selectedWeapon,
      // Switches between the two preview icons so we can do a crossfade.
      previewIconIndex: (this.state.previewIconIndex + 1) % 2
    });

    // When the user clicks onto a "new" item, unbadge it.
    markEquipmentSeen(weapon.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
  }

  private getEquippedWeapon(): PerkDefGQL {
    const equippedChampion = this.props.profile.champions.find((c) => c.championID == this.props.selectedChampion?.id);
    return equippedChampion ? this.props.perksByID[equippedChampion.weaponPerkID] : null;
  }

  private getSortedWeapons(): PerkDefGQL[] {
    // We only want weapons that match the currently selected champion.
    const weapons = this.props.perks.filter((p) => {
      return (
        p.perkType === PerkType.Weapon &&
        p.champion &&
        p.champion.id === this.props.selectedChampion?.id &&
        (p.showIfUnowned || this.props.ownedPerks[p.id])
      );
    });

    weapons.sort((pa, pb) => {
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

    return weapons;
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

export const FullscreenSelectWeapon = connect(mapStateToProps)(AFullscreenSelectWeapon);
