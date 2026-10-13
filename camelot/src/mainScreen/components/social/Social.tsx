/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../redux/store';
import { addConditionalWidgetExiting, HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import Escapable from '../Escapable';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { FactionBorderSelectable } from '../FactionBorderSelectable';
import { TooltipSource } from '../TooltipSource';
import { FactionData, getFactionData } from '../../gameData/factionData';
import { BaseHUDWidgetDraggableHandle } from '../BaseHUDWidgetDraggableHandle';
import { Guild } from './Guild';
import { FriendFoeList } from './FriendFoeList';

// CSS classes
const Root = 'HUD-Social-Root';
const RootBorder = 'HUD-Social-RootBorder';
const Tabs = 'HUD-Social-Tabs';
const TabButton = 'HUD-Social-TabButton';
const TabIcon = 'HUD-Social-TabIcon';
const TabContent = 'HUD-Social-TabContent';

const Handle = 'HUD-FancyBorder-HeaderHandle';

// String IDs
const StringIDSocialTitle = 'SocialTitle';
const StringIDSocialTabTitlePrefix = 'SocialTabTitle_';

enum SocialTab {
  Guild = 'Guild',
  FriendsFoes = 'FriendsFoes'
}

const tabIconKeys: Record<SocialTab, string> = {
  [SocialTab.Guild]: 'hudnavIconGuildImage',
  [SocialTab.FriendsFoes]: 'hudnavIconFriendsImage'
};

interface State {
  primaryTab: SocialTab;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps;

class ASocial extends React.Component<Props & DispatchProp, State> {
  constructor(props: Props & DispatchProp) {
    super(props);

    this.state = {
      primaryTab: SocialTab.Guild
    };
  }

  render(): React.ReactNode {
    if (Object.keys(this.props.stringTable).length <= 0) {
      return null;
    }

    return (
      <div className={Root}>
        <div className={Tabs}>{Object.values(SocialTab).map(this.renderTabButton.bind(this))}</div>
        <FactionBorder
          className={RootBorder}
          type={BorderType.FancyHeader}
          background={BorderBackground.Leather}
          titleText={getStringTableValue(StringIDSocialTitle, this.props.stringTable)}
          cornerButtons={[<FactionCornerButton type={CornerButtonType.Close} onClick={this.closeSelf.bind(this)} />]}
        >
          {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_SOCIAL} onEscape={this.closeSelf.bind(this)} />}
          <div className={TabContent}>{this.renderTabContent()}</div>
          <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_SOCIAL} />
        </FactionBorder>
      </div>
    );
  }

  private renderTabButton(tab: SocialTab): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <FactionBorderSelectable
        key={tab}
        className={TabButton}
        isSelected={tab === this.state.primaryTab}
        onSelected={() => {
          this.setState({ primaryTab: tab });
        }}
        includeLeft={false}
        background={BorderBackground.Leather}
      >
        <img className={TabIcon} src={factionData[tabIconKeys[tab] as keyof FactionData] as string} />
        <TooltipSource
          className={TabIcon}
          tooltipID={tab}
          content={() => getStringTableValue(StringIDSocialTabTitlePrefix + tab, this.props.stringTable)}
          positionType='mouse'
        />
      </FactionBorderSelectable>
    );
  }

  private renderTabContent(): React.ReactNode {
    switch (this.state.primaryTab) {
      case SocialTab.Guild:
        return <Guild />;
      case SocialTab.FriendsFoes:
        return <FriendFoeList />;
    }
  }

  private closeSelf(): void {
    this.props.dispatch!(addConditionalWidgetExiting(WIDGET_ID_SOCIAL));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID
  };
};

const Social = connect(mapStateToProps)(ASocial);

export const WIDGET_ID_SOCIAL = 'Social';
export const socialRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_SOCIAL,
  nameStringID: 'HUDEditorWidgetNameSocial',
  nativeWidgetID: 'social',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: -6
  },
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Social isDragCopy={isDragCopy} />;
  }
};
