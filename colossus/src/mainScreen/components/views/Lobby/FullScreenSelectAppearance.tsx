/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ChampionGQL, ChampionInfo, PerkDefGQL, PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { FullScreenSelectPanel, PanelSide } from './FullScreenSelectPanel';
import { FullScreenSelectPanelItem, PanelItemSize } from './FullScreenSelectPanelItem';
import { ProfileModel } from '../../../redux/profileSlice';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';

const FullscreenContainer = 'ChampionProfile-SelectAppearance-Container';

const StringIDSprintTrails = 'AppearanceMenuSprintTrailsTitle';
const StringIDChampionCard = 'AppearanceMenuChampionCardTitle';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  champions: ChampionGQL[];
  perks: PerkDefGQL[];
  ownedPerks: Dictionary<number>;
  profile: ProfileModel;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFullScreenSelectAppearance extends React.Component<Props> {
  // need to make mock data and then we can get going into STYLLLLLE BABY
  render(): JSX.Element {
    const sprintFXMap: JSX.Element[] = this.getPanelItemMap(PerkType.SprintFX, PanelItemSize.card, PanelSide.left);
    const portaitMap: JSX.Element[] = this.getPanelItemMap(PerkType.Portrait, PanelItemSize.portait, PanelSide.right);
    return (
      <div className={FullscreenContainer}>
        <FullScreenSelectPanel
          title={getStringTableValue(StringIDSprintTrails, this.props.stringTable)}
          side={PanelSide.left}
          items={sprintFXMap}
          perkType={PerkType.SprintFX}
          underMaintenance={false}
        />
        <FullScreenSelectPanel
          title={getStringTableValue(StringIDChampionCard, this.props.stringTable)}
          side={PanelSide.right}
          items={portaitMap}
          perkType={PerkType.Portrait}
          underMaintenance={false}
        />
      </div>
    );
  }

  private getPanelItemMap(perkType: PerkType, size: PanelItemSize, panelSide: PanelSide): JSX.Element[] {
    const panelItemMap: JSX.Element[] = [];
    const equippedPerk: PerkDefGQL = this.getEquippedPerk(perkType);
    this.getSortedPerkList(perkType).map((perk) => {
      if (perkType === PerkType.SprintFX) {
        panelItemMap.push(
          <FullScreenSelectPanelItem
            imageSource={perk.iconURL}
            perk={perk}
            panelSide={panelSide}
            size={size}
            equippedPerk={equippedPerk}
          />
        );
      } else {
        panelItemMap.push(
          <FullScreenSelectPanelItem
            imageSource={perk.portraitChampionSelectImageUrl}
            perk={perk}
            panelSide={panelSide}
            size={size}
            equippedPerk={equippedPerk}
          />
        );
      }
    });
    return panelItemMap;
  }

  private getEquippedPerk(perkType: PerkType): PerkDefGQL {
    const equippedChampion = this.props.profile.champions.find((c) => c.championID == this.props.selectedChampion?.id);
    if (!equippedChampion) {
      return null;
    }
    if (perkType === PerkType.Costume) {
      return this.props.perksByID[equippedChampion.costumePerkID];
    } else if (perkType === PerkType.Portrait) {
      return this.props.perksByID[equippedChampion.portraitPerkID];
    } else if (perkType === PerkType.SprintFX) {
      return this.props.perksByID[equippedChampion.sprintFXPerkID];
    } else if (perkType === PerkType.Weapon) {
      return this.props.perksByID[equippedChampion.weaponPerkID];
    }
    return null;
  }

  private getSortedPerkList(perkType: PerkType): PerkDefGQL[] {
    // We only want items that match the currently selected champion.
    const perks = this.props.perks.filter((p) => {
      return (
        p.perkType === perkType &&
        p.champion &&
        p.champion.id === this.props.selectedChampion.id &&
        (p.showIfUnowned || this.props.ownedPerks[p.id])
      );
    });

    perks.sort((pa, pb) => {
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

    return perks;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const { champions, ownedPerks } = state.profile;
  const { perks, perksByID } = state.store;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    selectedChampion,
    champions,
    perks,
    ownedPerks,
    profile: state.profile,
    perksByID,
    stringTable
  };
}

export const FullScreenSelectAppearance = connect(mapStateToProps)(AFullScreenSelectAppearance);
