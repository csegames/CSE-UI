/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDHorizontalAnchor,
  HUDLayer,
  HUDVerticalAnchor,
  HUDWidgetRegistration,
  addMenuWidgetExiting
} from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import Escapable from '../Escapable';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { ItemIcon } from '../items/ItemIcon';
import {
  ClassDefGQL,
  EquippedItem,
  GearSlotDefRef,
  GenderDefGQL,
  Item,
  RaceDefGQL
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { FactionData } from '../../redux/gameDefsSlice';
import { refreshItems } from '../items/itemUtils';
import { CloseButton } from '../../../shared/components/CloseButton';
import { InitTopic } from '../../redux/initializationSlice';
import { UserClassesData } from '@csegames/library/dist/_baseGame/clientFunctions/AssetFunctions';

const Root = 'HUD-Equipped-Root';
const Character = 'HUD-Equipped-Character';
const CharacterBase = 'HUD-Equipped-CharacterBase';
const CharacterFigure = 'HUD-Equipped-CharacterFigure';
const Name = 'HUD-Equipped-Name';
const NameText = 'HUD-Equipped-NameText';
const Slots = 'HUD-Equipped-Slots';
const OuterSlots = 'HUD-Equipped-OuterSlots';
const UnderSlots = 'HUD-Equipped-UnderSlots';
const OrnamentMid = 'HUD-Equipped-OrnamentMid';
const OrnamentMidLeft = 'HUD-Equipped-OrnamentMidLeft';
const OrnamentMidRight = 'HUD-Equipped-OrnamentMidRight';
const SlotsLabel = 'HUD-Equipped-SlotsLabel';
const ItemIconFrame = 'HUD-Equipped-ItemIconFrame';
const ItemIconFrameReadied = 'HUD-Equipped-ItemIconFrameReadied';
const ItemIconFrameVertical = 'HUD-Equipped-ItemIconFrameVertical';
const ItemIconFrameHorizontal = 'HUD-Equipped-ItemIconFrameHorizontal';
const WeaponSlots = 'HUD-Equipped-WeaponSlots';
const OrnamentGradient = 'HUD-Equipped-OrnamentGradient';
const OrnamentGradientTop = 'HUD-Equipped-OrnamentGradientTop';
const OrnamentGradientBottom = 'HUD-Equipped-OrnamentGradientBottom';
const OrnamentWeapons = 'HUD-Equipped-OrnamentWeapons';
const TopRightCloseButton = 'HUD-TopRightCloseButton';

interface ReactProps {}

interface InjectedProps {
  name: string;
  gender: number;
  race: number;
  faction: Faction;
  classID: number;
  equippedItems: EquippedItem[];
  readiedGearSlots: GearSlotDefRef[];
  classDynamicAssets: Dictionary<UserClassesData>;
  classesByNumericID: Dictionary<ClassDefGQL>;
  racesByNumericID: Dictionary<RaceDefGQL>;
  gendersByNumericID: Dictionary<GenderDefGQL>;
  factions: Dictionary<FactionData>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AEquipped extends React.Component<Props> {
  render(): JSX.Element {
    const backgroundImage = this.props.factions[Faction[this.props.faction]]?.paperdollBackgroundImage;
    const baseImage = this.props.factions[Faction[this.props.faction]]?.paperdollBaseImage;
    const classDef = this.props.classesByNumericID[this.props.classID];
    const racedef = this.props.racesByNumericID[this.props.race];
    const genderDef = this.props.gendersByNumericID[this.props.gender];
    const figureImage = this.props.classDynamicAssets[classDef?.id]?.PaperdollImage[racedef?.id]?.[genderDef?.id];
    return (
      <div style={{ backgroundImage: `url(${backgroundImage})` }} className={Root}>
        <Escapable escapeID={WIDGET_NAME_EQUIPPED} onEscape={this.closeSelf.bind(this)} />
        <CloseButton className={TopRightCloseButton} onClick={this.closeSelf.bind(this)} />
        <div className={Name}>
          <span className={NameText}>{this.props.name}</span>
        </div>
        <div className={Character}>
          <div style={{ backgroundImage: `url(${baseImage})` }} className={CharacterBase} />
          <img className={CharacterFigure} src={figureImage} />
        </div>
        <div className={`${Slots} ${OuterSlots}`}>
          <>
            <span className={SlotsLabel}>Outer</span>
            <div className={`${OrnamentMid} ${OrnamentMidLeft}`} />
            {['Head', 'Torso', 'Cloak', 'Arms', 'Hands', 'Legs', 'Feet'].map((gearSlotID) =>
              this.renderGearSlot(gearSlotID, ItemIconFrameVertical)
            )}
          </>
        </div>
        <div className={`${Slots} ${UnderSlots}`}>
          <>
            <span className={SlotsLabel}>Inner</span>
            <div className={`${OrnamentMid} ${OrnamentMidRight}`} />
            {['HeadUnder', 'TorsoUnder', 'ArmsUnder', 'HandsUnder', 'LegsUnder', 'FeetUnder'].map((gearSlotID) =>
              this.renderGearSlot(gearSlotID, ItemIconFrameVertical)
            )}
          </>
        </div>
        <div className={WeaponSlots}>
          <div className={`${OrnamentGradient} ${OrnamentGradientTop}`} />
          <svg className={OrnamentWeapons} fill='#6A6767' viewBox='0 0 68.59 87.74'>
            <g>
              <path
                d='M68.59,47.1h-0.5H51.06c-5.67-0.03-11.35,0.05-17.02,0.12L0,47.6l34.04,0.38c5.67,0.07,11.35,0.14,17.02,0.12h10.67
		l5.84,5.84l0,3.69c-0.01,3.35,0.1,6.69,0.15,10.04l0.36,20.07l0.36-20.07c0.04-3.35,0.15-6.69,0.15-10.04l0-10.04L68.59,47.1z
		 M63.15,48.1h4.43l0,4.43L63.15,48.1z'
              />
              <path
                d='M51.06,40.64h17.02h0.5l0-0.5l0-10.04c0.01-3.35-0.1-6.69-0.15-10.04L68.09,0l-0.36,20.07c-0.04,3.35-0.15,6.69-0.15,10.04
		l0,3.69l-5.84,5.84H51.06c-5.67-0.03-11.35,0.05-17.02,0.12L0,40.14l34.04,0.38C39.72,40.59,45.39,40.67,51.06,40.64z M67.58,35.21
		l0,4.43h-4.43L67.58,35.21z'
              />
            </g>
          </svg>
          {['OneHandedWeaponLeft', 'OneHandedWeaponRight', 'TwoHandedWeapon'].map((gearSlotID) =>
            this.renderGearSlot(gearSlotID, ItemIconFrameHorizontal)
          )}
          <svg className={OrnamentWeapons} fill='#6A6767' viewBox='0 0 68.59 87.74'>
            <g>
              <path
                d='M17.53,47.1H0.5H0l0,0.5l0,10.04c-0.01,3.35,0.1,6.69,0.15,10.04L0.5,87.74l0.36-20.07c0.04-3.35,0.15-6.69,0.15-10.04
		l0-3.69l5.84-5.84h10.67c5.67,0.03,11.35-0.05,17.02-0.12l34.04-0.38l-34.04-0.38C28.87,47.15,23.2,47.07,17.53,47.1z M1.01,52.53
		l0-4.43h4.43L1.01,52.53z'
              />
              <path
                d='M0,40.64h0.5h17.02c5.67,0.03,11.35-0.05,17.02-0.12l34.04-0.38l-34.04-0.38c-5.67-0.07-11.35-0.14-17.02-0.12H6.85
		L1.01,33.8l0-3.69c0.01-3.35-0.1-6.69-0.15-10.04L0.5,0L0.15,20.07C0.1,23.42-0.01,26.76,0,30.11l0,10.04L0,40.64z M5.44,39.64H1
		l0-4.43L5.44,39.64z'
              />
            </g>
          </svg>
          <div className={`${OrnamentGradient} ${OrnamentGradientBottom}`} />
        </div>
      </div>
    );
  }

  renderGearSlot(gearSlotID: string, className: string): JSX.Element {
    const isReadied: boolean = this.props.readiedGearSlots.some((readiedGearSlot) => readiedGearSlot.id === gearSlotID);
    const classNames = [ItemIconFrame, className];
    if (isReadied) {
      classNames.push(ItemIconFrameReadied);
    }
    const items: Item[] = [];
    const item = this.props.equippedItems.find((equippedItem) =>
      equippedItem.item.location.equipped.gearSlots.some((gearSlot) => gearSlot.id === gearSlotID)
    )?.item;
    if (item) {
      items.push(item);
    }
    return (
      <div className={classNames.join(' ')} key={gearSlotID}>
        <ItemIcon items={items} equippedGearSlotID={gearSlotID} size={isReadied ? '5.5vmin' : '6.5vmin'} />
      </div>
    );
  }

  componentDidMount(): void {
    refreshItems(this.props.dispatch);
  }

  closeSelf(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_EQUIPPED));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    name: state.player.name,
    gender: state.player.gender,
    race: state.player.race,
    faction: state.player.faction,
    classID: state.player.classID,
    equippedItems: state.equippedItems.items ?? [],
    readiedGearSlots: state.equippedItems.readiedGearSlots,
    classDynamicAssets: state.gameDefs.classDynamicAssets,
    classesByNumericID: state.gameDefs.classesByNumericID,
    racesByNumericID: state.gameDefs.racesByNumericID,
    gendersByNumericID: state.gameDefs.gendersByNumericID,
    factions: state.gameDefs.factions
  };
};

const Equipped = connect(mapStateToProps)(AEquipped);

export const WIDGET_NAME_EQUIPPED = 'Equipped Items';
export const equippedRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_EQUIPPED,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 3,
    yOffset: 4.5
  },
  initTopics: [InitTopic.GameDefs, InitTopic.EquippedItems, InitTopic.Inventory],
  layer: HUDLayer.Menus,
  render: () => {
    return <Equipped />;
  }
};
