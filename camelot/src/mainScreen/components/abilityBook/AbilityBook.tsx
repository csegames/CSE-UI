/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import TradeskillTabIconURL from '../../../images/icons/components/Crafting/trade-skill-icon.png';
import RealmProgressionTabIconTDDURL from '../../../images/icons/components/realm_progression/realm-progression-icon-tdd.png';
import RealmProgressionTabIconVikingURL from '../../../images/icons/components/realm_progression/realm-progression-icon-viking.png';
import RealmProgressionTabIconArthurianURL from '../../../images/icons/components/realm_progression/realm-progression-icon-arthurian.png';

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import { HUDLayer, HUDWidgetRegistration, addConditionalWidgetExiting } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { LoadingTopic } from '../../redux/loadingSlice';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { AbilityWithActivation } from '../../redux/abilitiesSlice';
import { AbilityDisplayDef } from '../../dataSources/manifest/abilityDisplayManifest';
import { TooltipSource } from '../TooltipSource';
import { FactionTabBadge } from '../FactionTabBadge';
import {
  findRealmProgressionTrack,
  getAvailableAbilityPoints,
  getAvailableRealmProgressionPoints,
  StringIDAbilityBookClassProgression,
  StringIDAbilityBookRealmProgression,
  StringIDAbilityBookTradeskillProgression
} from '../../helpers/abilityBookHelpers';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { FactionBorderSelectable } from '../FactionBorderSelectable';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { requestAddImagesToCache, requestRemoveImagesFromCache } from '../../dataSources/imageCacheService';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { AbilityPageTradeskills } from './AbilityPageTradeskills';
import { AbilityPageClass } from './AbilityPageClass';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { AbilityPageRealmProgression } from './AbilityPageRealmProgression';

// CSS classes
const Root = 'HUD-AbilityBook-Root';
const Border = 'HUD-AbilityBook-Border';
const Page = 'HUD-AbilityBook-Page';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const Tabs = 'HUD-AbilityBook-Tabs';
const Tab = 'HUD-AbilityBook-Tab';
const TabIcon = 'HUD-AbilityBook-TabIcon';
const TabTooltipArea = 'HUD-AbilityBook-TabTooltipArea';
const TooltipRoot = 'HUD-AbilityBook-TooltipRoot';
const TooltipHeader = 'HUD-AbilityBook-TooltipHeader';
const TooltipDescription = 'HUD-AbilityBook-TooltipDescription';

// String IDs
const StringIDAbilityBookTitle = 'AbilityBookTitle';

const TRADESKILL_TAB_ID = 'Tradeskills';
const REALM_PROGRESSION_TAB_ID = 'RealmProgression';

const RealmProgressionTabIconByFactionID: Record<string, string> = {
  [Faction.TDD]: RealmProgressionTabIconTDDURL,
  [Faction.Viking]: RealmProgressionTabIconVikingURL,
  [Faction.Arthurian]: RealmProgressionTabIconArthurianURL
};

enum TradeskillTab {
  // In display order.
  Gathering = 'Gathering',
  Refining = 'Refining',
  Crafting = 'Crafting'
}

export interface AbilityBookAbilityDisplayData {
  ability: AbilityWithActivation | undefined;
  displayDef: AbilityDisplayDef;
  progressionTrackID: string;
  unlockedAtLevel: number;
}

interface SideTabDef {
  tabID: string;
  iconURL: string;
  iconModifierClass?: string;
  title: string;
  description?: string;
  isDisabled?: boolean;
  badgeCount?: number;
}

interface State {
  tabID: string;
  tradeskillTab: TradeskillTab;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  uiFactionID: string;
  isEditingHUD: boolean;
  myClass: ClassDef;
  stringTable: Record<string, StringTableEntryDef>;
  self: PlayerEntityStateModel;
  defs: GameDefsState;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AAbilityBook extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tabID: props.myClass?.id,
      tradeskillTab: TradeskillTab.Gathering
    };
  }

  render(): React.ReactNode {
    return (
      <div className={Root}>
        {this.renderSideTabs()}
        <FactionBorder
          className={Border}
          type={BorderType.FancyHeader}
          background={BorderBackground.Leather}
          titleText={getStringTableValue(StringIDAbilityBookTitle, this.props.stringTable)}
          cornerButtons={[
            <FactionCornerButton
              type={CornerButtonType.Close}
              onClick={() => {
                this.closeSelf();
              }}
            />
          ]}
        >
          {!this.props.isDragCopy && (
            <Escapable escapeID={WIDGET_ID_ABILITY_BOOK} onEscape={this.closeSelf.bind(this)} />
          )}
          <div className={Page}>
            {this.state.tabID === this.props.myClass.id ? <AbilityPageClass /> : null}
            {this.state.tabID === TRADESKILL_TAB_ID ? <AbilityPageTradeskills /> : null}
            {this.state.tabID === REALM_PROGRESSION_TAB_ID ? <AbilityPageRealmProgression /> : null}
          </div>
        </FactionBorder>
        <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_ABILITY_BOOK} />
      </div>
    );
  }

  private getProgressionIconURLs(): string[] {
    let urls: string[] = [];

    Object.values(this.props.self.progression).forEach((progress) => {
      const track = this.props.defs.progressionTracks[progress.id];
      if (track) {
        urls.push(track.iconURL);

        Object.keys(track.abilityUnlocks).forEach((abilityID) => {
          const def = this.props.defs.abilityDisplayDefsByStringID[abilityID];
          if (def) {
            urls.push(def.iconURL);
          }
        });
      }
    });

    return urls;
  }

  componentDidMount(): void {
    // Early out for the drag copy, since it is intended to be non-functional.
    if (this.props.isDragCopy) return;

    requestAddImagesToCache(Root, this.getProgressionIconURLs());
    clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_WINDOW_OPEN);
    clientAPI.requestEditMode(true);
  }

  componentWillUnmount(): void {
    // Early out for the drag copy, since it is intended to be non-functional.
    if (this.props.isDragCopy) return;

    requestRemoveImagesFromCache(Root, this.getProgressionIconURLs());
    clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_WINDOW_CLOSED);
    if (!this.props.isEditingHUD) {
      clientAPI.requestEditMode(false);
    }
  }

  private renderSideTabs(): React.ReactNode {
    const classDef = this.props.myClass;

    return (
      <div className={Tabs}>
        {this.renderSideTab({
          tabID: classDef.id,
          iconURL: classDef.unitFrameIconTransparencySmallImage,
          iconModifierClass: ' emblem',
          title: getStringTableValue(StringIDAbilityBookClassProgression, this.props.stringTable),
          badgeCount: getAvailableAbilityPoints(classDef, this.props.defs, this.props.self)
        })}
        {this.renderSideTab({
          tabID: REALM_PROGRESSION_TAB_ID,
          iconURL: RealmProgressionTabIconByFactionID[this.props.uiFactionID],
          title: getStringTableValue(StringIDAbilityBookRealmProgression, this.props.stringTable),
          badgeCount: getAvailableRealmProgressionPoints(
            findRealmProgressionTrack(classDef, this.props.defs.progressionTracks),
            this.props.self.progression
          )
        })}
        {this.renderSideTab({
          tabID: TRADESKILL_TAB_ID,
          iconURL: TradeskillTabIconURL,
          title: getStringTableValue(StringIDAbilityBookTradeskillProgression, this.props.stringTable)
        })}
      </div>
    );
  }

  private renderSideTab(tab: SideTabDef): React.ReactNode {
    return (
      <FactionBorderSelectable
        key={tab.tabID}
        className={Tab}
        isSelected={this.state.tabID === tab.tabID}
        isDisabled={tab.isDisabled}
        onSelected={this.onTabSelected.bind(this, tab.tabID)}
        includeLeft={false}
        background={BorderBackground.PatternSmall}
      >
        <img className={`${TabIcon}${tab.iconModifierClass ?? ''}`} src={tab.iconURL} />
        <FactionTabBadge count={tab.badgeCount ?? 0} />
        <TooltipSource
          className={TabTooltipArea}
          tooltipID={tab.tabID}
          content={() => (
            <div className={TooltipRoot}>
              <div className={TooltipHeader}>{tab.title}</div>
              {tab.description && <div className={TooltipDescription}>{tab.description}</div>}
            </div>
          )}
          positionType='mouse'
        />
      </FactionBorderSelectable>
    );
  }

  private onTabSelected(tabID: string): void {
    clientAPI.playGameSound(SoundEvents.PLAY_CP_ABILITY_TAB);
    this.setState({ tabID });
  }

  private closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_ABILITY_BOOK));
    if (!this.props.isEditingHUD) {
      clientAPI.requestEditMode(false);
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { isEditingHUD } = state.hud;

  return {
    ...ownProps,
    myClass: state.gameDefs.classesByNumericID[state.entities.self.classID],
    stringTable: state.stringTable.stringTable,
    isEditingHUD,
    uiFactionID: state.hud.uiFactionID,
    self: state.entities.self,
    defs: state.gameDefs
  };
};

const AbilityBook = connect(mapStateToProps)(AAbilityBook);

export const WIDGET_ID_ABILITY_BOOK = 'Ability Book';
export const abilityBookRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_ABILITY_BOOK,
  nameStringID: 'HUDEditorWidgetNameAbilityBook',
  nativeWidgetID: 'ability-book',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 5,
    yOffset: 7
  },
  initTopics: [LoadingTopic.Abilities],
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <AbilityBook isDragCopy={isDragCopy} />;
  }
};
