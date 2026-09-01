/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { FactionData } from '../../gameData/factionData';

// CSS classes
export const ClassIcon = 'HUD-PlayerUnitFrame-ClassIcon';
export const FrameForeground = 'HUD-PlayerUnitFrame-FrameForeground';
const SimpleForegroundRight = 'HUD-PlayerUnitFrame-SimpleForegroundRight';
export const LevelForeground = 'HUD-PlayerUnitFrame-LevelForeground';
export const NameForeground = 'HUD-PlayerUnitFrame-NameForeground';
const SimpleClassIcon = 'HUD-PlayerUnitFrame-SimpleClassIcon';
const SimpleRealmIcon = 'HUD-PlayerUnitFrame-SimpleRealmIcon';
const SimpleNPCTierIcon = 'HUD-PlayerUnitFrame-SimpleNPCTierIcon';
const NPCTierIcon = 'HUD-PlayerUnitFrame-NPCTierIcon';
const RealmIcon = 'HUD-PlayerUnitFrame-RealmIcon';
const TargetClassIcon = 'HUD-PlayerUnitFrame-TargetClassIcon';

function getRealmIconURL(faction: Faction): string {
  return `/dynamic/userclasses/assets/${Faction[faction]}-transparency-Realm.png`;
}

interface Props {
  isSimple: boolean;
  isParty: boolean;
  isLeader: boolean;
  hasCompass: boolean;
  faction: Faction;
  factionData: FactionData;
  isFactionless: boolean;
  isNPC: boolean;
  isRealmNPC: boolean;
  classID: number | undefined;
  classIconImage: string | undefined;
  name: string;
  levelString: string;
  npcTierIconSource: string;
}

// Static for the lifetime of a mount (frame art, icon selection) or changes far less often than the resource
// bars/pips (name, level). PureComponent so an entity update that only touches resources/statuses skips this.
export class PlayerUnitFrameChrome extends React.PureComponent<Props> {
  render(): JSX.Element {
    return this.props.isSimple ? this.renderSimple() : this.renderFancy();
  }

  private renderFancy(): JSX.Element {
    const { factionData } = this.props;
    const hasTargetClassIcon =
      !this.props.isParty && !this.props.isNPC && !!this.props.classID && !!this.props.classIconImage;

    return (
      <>
        {this.props.isParty && this.props.classID && (
          <img className={ClassIcon} src={this.props.classIconImage} />
        )}
        <img
          className={FrameForeground}
          src={
            this.props.isRealmNPC
              ? factionData.universalUnitFrameForegroundImage
              : !this.props.isParty
              ? this.props.hasCompass && factionData.unitFrameForegroundTargetImage
                ? factionData.unitFrameForegroundTargetImage
                : factionData.unitFrameForegroundImage
              : this.props.isLeader
              ? factionData.unitFrameForegroundPartyLeaderImage
              : factionData.unitFrameForegroundPartyMemberImage
          }
        />
        <div className={LevelForeground}>{this.props.levelString}</div>
        <div className={NameForeground}>{this.props.name}</div>
        {this.props.isFactionless && <img className={NPCTierIcon} src={this.props.npcTierIconSource} />}
        {this.props.isRealmNPC && <img className={RealmIcon} src={getRealmIconURL(this.props.faction)} />}
        {hasTargetClassIcon && (
          <img
            className={TargetClassIcon}
            src={this.props.classIconImage.replace('unit-frame-icon-', 'unit-frame-icon-transparency-')}
          />
        )}
      </>
    );
  }

  // Note: intentionally excludes SimpleNameForeground. SimplePanicContainer (hot, updates on every resource
  // tick) sits between the icons and the name in PlayerUnitFrame's JSX (so the panic overlay paints over the
  // icon but not the name), so the name stays inline in the parent rather than living in this memoized piece.
  private renderSimple(): JSX.Element {
    const { factionData } = this.props;
    const hasClassIcon = !this.props.isNPC && !!this.props.classID && !!this.props.classIconImage;

    return (
      <>
        <img
          className={FrameForeground}
          src={
            !this.props.isParty
              ? factionData.simpleUnitFrameForegroundImage
              : this.props.isLeader
              ? factionData.simpleUnitFrameForegroundPartyLeaderImage
              : factionData.simpleUnitFrameForegroundPartyMemberImage
          }
        />
        {this.props.hasCompass && factionData.simpleUnitFrameForegroundRightImage && (
          <img className={SimpleForegroundRight} src={factionData.simpleUnitFrameForegroundRightImage} />
        )}
        {hasClassIcon && (
          <img
            className={SimpleClassIcon}
            src={this.props.classIconImage.replace('unit-frame-icon-', 'unit-frame-icon-transparency-')}
          />
        )}
        {this.props.isFactionless && <img className={SimpleNPCTierIcon} src={this.props.npcTierIconSource} />}
        {!this.props.isFactionless && this.props.isNPC && (
          <img className={SimpleRealmIcon} src={getRealmIconURL(this.props.faction)} />
        )}
      </>
    );
  }
}
