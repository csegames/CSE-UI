/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { HUDLayer, HUDWidgetRegistration, addMenuWidgetExiting } from '../../redux/hudSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { AbilityDisplayData, AbilityNetworkDefData } from '../../redux/gameDefsSlice';
import { AbilityBookPage } from './AbilityBookPage';
import Escapable from '../Escapable';
import { BarHeader } from '../BarHeader';
import { AbilityBookTabsData } from '@csegames/library/dist/_baseGame/clientFunctions/AssetFunctions';
import { CloseButton } from '../../../shared/components/CloseButton';
import { InitTopic } from '../../redux/initializationSlice';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

const Root = 'HUD-AbilityBook-Root';
const Header = 'HUD-AbilityBook-Header';
const Content = 'HUD-AbilityBook-Content';
const SideNav = 'HUD-AbilityBook-SideNav';
const RouteButton = 'HUD-AbilityBook-RouteButton';
const RouteDivider = 'HUD-AbilityBook-RouteDivider';
const RouteIcon = 'HUD-AbilityBook-RouteIcon';
const AbilityPane = 'HUD-AbilityBook-AbilityPane';
const TopRightCloseButton = 'HUD-TopRightCloseButton';

interface State {
  currentRoute: string;
}

interface ReactProps {}

interface InjectedProps {
  abilityBookTabs: AbilityBookTabsData[];
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  abilityDisplayData: Dictionary<AbilityDisplayData>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBook extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentRoute: ''
    };
  }

  render(): JSX.Element {
    return (
      <div className={Root}>
        <Escapable escapeID={WIDGET_NAME_ABILITY_BOOK} onEscape={this.closeSelf.bind(this)} />
        <CloseButton className={TopRightCloseButton} onClick={this.closeSelf.bind(this)} />
        <BarHeader className={Header}>{this.getHeaderTitle()}</BarHeader>
        <div className={Content}>
          <div className={SideNav}>{this.getSortedRoutes().map(this.renderRouteButton.bind(this))}</div>
          <div className={AbilityPane}>
            <AbilityBookPage bookTab={this.state.currentRoute} />
          </div>
        </div>
      </div>
    );
  }

  private renderRouteButton(route: string, index: number): React.ReactNode {
    // Figure out which icon to use.
    const bookTab = this.props.abilityBookTabs.find((tab) => {
      return tab.ID === route;
    });
    const routeIcon = bookTab?.IconClass ?? 'icon-misc-tab';

    const notActiveClass = this.state.currentRoute !== route ? 'not-active' : 'active';

    return (
      <>
        {index !== 0 && <div className={RouteDivider} />}
        <div className={`${RouteButton} ${notActiveClass}`} onClick={this.onTabClick.bind(this, route)}>
          <div className={`${RouteIcon} ${routeIcon} ${notActiveClass}`} />
        </div>
      </>
    );
  }

  private closeSelf(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_ABILITY_BOOK));
  }

  private onTabClick(route: string): void {
    if (this.state.currentRoute !== route) {
      this.setState({ currentRoute: route });
    }
  }

  private getSortedRoutes(): string[] {
    // Identify the BookTabs that we should include.
    const bookTabSet: Set<string> = new Set();
    Object.values(this.props.abilityDisplayData).forEach((add) => {
      if (add.abilityNetworkId) {
        const abilityNetwork = this.props.abilityNetworks[add.abilityNetworkId];
        // If the matching network exists and is assigned to an AbilityBook tab, add
        // that tab to the set we will be showing.
        if (abilityNetwork?.AbilityBookTab?.length > 0) {
          bookTabSet.add(abilityNetwork.AbilityBookTab);
        }
      }
    });

    const routes: string[] = [];
    this.props.abilityBookTabs.forEach((tab) => {
      if (bookTabSet.has(tab.ID)) {
        routes.push(tab.ID);
      }
    });

    // And if we don't have a selected route yet, pick the first one.
    if (this.state.currentRoute?.length < 1) {
      requestAnimationFrame(() => {
        this.setState({ currentRoute: routes[0] });
      });
    }

    return routes;
  }

  private getHeaderTitle(): string {
    if (this.state.currentRoute?.length > 0) {
      return `Abilities | ${this.state.currentRoute}`;
    } else {
      return 'Abilities';
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityBookTabs, abilityNetworks, abilityDisplayData } = state.gameDefs;
  return {
    ...ownProps,
    abilityBookTabs,
    abilityNetworks,
    abilityDisplayData
  };
};

const AbilityBook = connect(mapStateToProps)(AAbilityBook);

export const WIDGET_NAME_ABILITY_BOOK = 'Ability Book';
export const abilityBookRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_ABILITY_BOOK,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 3,
    yOffset: 4.5
  },
  initTopics: [InitTopic.Abilities, InitTopic.GameDefs, InitTopic.MyCharacterAbilities],
  layer: HUDLayer.Menus,
  render: () => {
    return <AbilityBook />;
  }
};
