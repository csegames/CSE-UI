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
import { getStringTableValue, StringIDGeneralComingSoon } from '../../helpers/stringTableHelpers';
import { AbilityWithActivation } from '../../redux/abilitiesSlice';
import { AbilityDisplayDef } from '../../dataSources/manifest/abilityDisplayManifest';
import TooltipSource from '../TooltipSource';
import { getFactionData } from '../../gameData/factionData';
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

// CSS classes
const Root = 'HUD-AbilityBook-Root';
const Border = 'HUD-AbilityBook-Border';
const ClassIconContainer = 'HUD-AbilityBook-ClassIconContainer';
const ClassIconArrow = 'HUD-AbilityBook-ClassIconArrow';
const ClassIcon = 'HUD-AbilityBook-ClassIcon';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const Tabs = 'HUD-AbilityBook-Tabs';
const Tab = 'HUD-AbilityBook-Tab';
const TabIcon = 'HUD-AbilityBook-TabIcon';
const TooltipRoot = 'HUD-AbilityBook-TooltipRoot';
const TooltipHeader = 'HUD-AbilityBook-TooltipHeader';
const TooltipDescription = 'HUD-AbilityBook-TooltipDescription';

// String IDs
const StringIDAbilityBookTitle = 'AbilityBookTitle';
const StringIDTradeskillTabName = 'TradeskillTabName';
const StringIDRealmProgressionTabName = 'RealmProgressionTabName';

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
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Root}>
        <div className={Tabs}>
          {this.renderClassSkillsTab()}
          {this.renderTradeskillTab()}
          {this.renderRealmProgressionTab()}
        </div>
        <FactionBorder
          className={Border}
          type={BorderType.FancyHeader}
          background={factionData.backgroundBookImage}
          titleText={getStringTableValue(StringIDAbilityBookTitle, this.props.stringTable)}
          titleCenterOverride={'51.2%'}
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
            <Escapable
              escapeID={WIDGET_ID_ABILITY_BOOK}
              onEscape={this.closeSelf.bind(this)}
              sound={SoundEvents.PLAY_UI_ABILITY_WINDOW_OPEN}
            />
          )}
          {this.state.tabID === TRADESKILL_TAB_ID ? <AbilityPageTradeskills /> : <AbilityPageClass />}
        </FactionBorder>
        <img className={ClassIconArrow} src={factionData.hudnavEndImage} />
        <FactionBorder
          className={`${ClassIconContainer} ${this.props.uiFactionID}`}
          type={BorderType.Decorative}
          background={factionData.backgroundClassIconImage}
          cornerSize={'4vmin'}
          borderSize={'4vmin'}
        >
          <img className={ClassIcon} src={this.props.myClass.abilityBookIconImage} />
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
    requestAddImagesToCache(Root, this.getProgressionIconURLs());
  }

  componentWillUnmount(): void {
    requestRemoveImagesFromCache(Root, this.getProgressionIconURLs());
  }

  private renderClassSkillsTab(): React.ReactNode {
    const classDef = this.props.myClass;

    return (
      <FactionBorderSelectable
        key={classDef.id}
        className={Tab}
        isSelected={this.state.tabID === classDef.id}
        onSelected={() => this.setState({ tabID: classDef.id })}
        includeLeft={false}
        background={BorderBackground.PatternSmall}
      >
        <img className={TabIcon} src={classDef.combatAbilitiesIconImage} />
        <TooltipSource
          className={TabIcon}
          tooltipID={classDef.id}
          content={() => (
            <div className={TooltipRoot}>
              <div className={TooltipHeader}>{getStringTableValue(classDef.name, this.props.stringTable)}</div>
            </div>
          )}
          positionType='mouse'
        />
      </FactionBorderSelectable>
    );
  }

  private renderTradeskillTab(): React.ReactNode {
    return (
      <FactionBorderSelectable
        key={TRADESKILL_TAB_ID}
        className={Tab}
        isSelected={this.state.tabID === TRADESKILL_TAB_ID}
        onSelected={() => this.setState({ tabID: TRADESKILL_TAB_ID })}
        includeLeft={false}
        background={BorderBackground.PatternSmall}
      >
        <img className={TabIcon} src={TradeskillTabIconURL} />
        <TooltipSource
          className={TabIcon}
          tooltipID={TRADESKILL_TAB_ID}
          content={() => (
            <div className={TooltipRoot}>
              <div className={TooltipHeader}>{getStringTableValue(StringIDTradeskillTabName, this.props.stringTable)}</div>
            </div>
          )}
          positionType='mouse'
        />
      </FactionBorderSelectable>
    );
  }

  private renderRealmProgressionTab(): React.ReactNode {
    return (
      <FactionBorderSelectable
        key={REALM_PROGRESSION_TAB_ID}
        className={Tab}
        isSelected={false}
        isDisabled
        onSelected={() => {}}
        includeLeft={false}
        background={BorderBackground.PatternSmall}
      >
        <img className={TabIcon} src={RealmProgressionTabIconByFactionID[this.props.uiFactionID]} />
        <TooltipSource
          className={TabIcon}
          tooltipID={REALM_PROGRESSION_TAB_ID}
          content={() => (
            <div className={TooltipRoot}>
              <div className={TooltipHeader}>
                {getStringTableValue(StringIDRealmProgressionTabName, this.props.stringTable)}
              </div>
              <div className={TooltipDescription}>
                {getStringTableValue(StringIDGeneralComingSoon, this.props.stringTable)}
              </div>
            </div>
          )}
          positionType='mouse'
        />
      </FactionBorderSelectable>
    );
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
