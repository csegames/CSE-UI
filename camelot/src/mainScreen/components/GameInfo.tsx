/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration, addMenuWidgetExiting } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { MenuSectionData, MenuTabData } from './menu/menuData';
import { Menu } from './menu/Menu';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

const Root = 'HUD-GameInfo-Root';
const Frame = 'HUD-GameInfo-Frame';

interface ReactProps {}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

enum GameInfoTab {
  News = 'news',
  GameInfo = 'game-info',
  Design = 'design',
  Beta1 = 'beta-1'
}

enum GameInfoSection {
  Latest = 'latest',
  Newsletter = 'newsletter',
  About = 'about',
  Realms = 'realms',
  Lore = 'lore',
  Foundational = 'foundational',
  CUBE = 'cube',
  StatSystem = 'stat-system',
  Magic = 'magic',
  Combat = 'combat',
  Crafting = 'crafting',
  Crafting2 = 'crafting-2',
  RVRMap = 'rvr-map',
  Progression = 'progression',
  UIModding = 'ui-modding'
}

class AGameInfo extends React.Component<Props> {
  render(): JSX.Element {
    const latestSection: MenuSectionData = {
      id: GameInfoSection.Latest,
      title: 'Latest',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/category/news?embedded=1' />
      }
    };
    const newsletterSection: MenuSectionData = {
      id: GameInfoSection.Newsletter,
      title: 'Newsletter',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/newsletter?embedded=1' />
      }
    };
    const aboutSection: MenuSectionData = {
      id: GameInfoSection.About,
      title: 'About',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/camelot-unchained?embedded=1' />
      }
    };
    const realmsSection: MenuSectionData = {
      id: GameInfoSection.Realms,
      title: 'Realms',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/realms?embedded=1' />
      }
    };
    const loreSection: MenuSectionData = {
      id: GameInfoSection.Lore,
      title: 'Lore',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/lore?embedded=1' />
      }
    };
    const foundationalSection: MenuSectionData = {
      id: GameInfoSection.Foundational,
      title: 'Foundational',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/foundational-principles?embedded=1' />
      }
    };
    const cubeSection: MenuSectionData = {
      id: GameInfoSection.CUBE,
      title: 'C.U.B.E.',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/c-u-b-e?embedded=1' />
      }
    };
    const statSystemSection: MenuSectionData = {
      id: GameInfoSection.StatSystem,
      title: 'Stat System',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/bsc-design-docs/stat-system?embedded=1' />
      }
    };
    const magicSection: MenuSectionData = {
      id: GameInfoSection.Magic,
      title: 'Magic',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/bsc-design-docs/magic-system?embedded=1' />
      }
    };
    const combatSection: MenuSectionData = {
      id: GameInfoSection.Combat,
      title: 'Combat',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/bsc-design-docs/combat?embedded=1' />
      }
    };
    const craftingSection: MenuSectionData = {
      id: GameInfoSection.Crafting,
      title: 'Crafting',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/bsc-design-docs/crafting?embedded=1' />
      }
    };
    const crafting2Section: MenuSectionData = {
      id: GameInfoSection.Crafting2,
      title: 'Crafting Pt.2',
      content: {
        node: (
          <iframe
            className={Frame}
            src='https://camelotunchained.com/v3/bsc-design-docs/crafting-part-deux?embedded=1'
          />
        )
      }
    };
    const rvrMapSection: MenuSectionData = {
      id: GameInfoSection.RVRMap,
      title: 'RVR Map',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/bsc-design-docs/rvr-map?embedded=1' />
      }
    };
    const progressionSection: MenuSectionData = {
      id: GameInfoSection.Progression,
      title: 'Progression',
      content: {
        node: (
          <iframe
            className={Frame}
            src='https://camelotunchained.com/v3/bsc-design-docs/progression-system?embedded=1'
          />
        )
      }
    };
    const uiModdingSection: MenuSectionData = {
      id: GameInfoSection.UIModding,
      title: 'UI Modding',
      content: {
        node: <iframe className={Frame} src='https://camelotunchained.com/v3/bsc-design-docs/ui-modding?embedded=1' />
      }
    };
    const tabs: MenuTabData[] = [
      {
        id: GameInfoTab.News,
        title: 'News',
        sections: [latestSection, newsletterSection]
      },
      {
        id: GameInfoTab.GameInfo,
        title: 'Game Info',
        sections: [aboutSection, realmsSection, loreSection, foundationalSection, cubeSection]
      },
      {
        id: GameInfoTab.Design,
        title: 'Design',
        sections: [
          statSystemSection,
          magicSection,
          combatSection,
          craftingSection,
          crafting2Section,
          rvrMapSection,
          progressionSection,
          uiModdingSection
        ]
      },
      {
        id: GameInfoTab.Beta1,
        title: 'Beta 1',
        content: {
          node: <iframe className={Frame} src='https://camelotunchained.com/v3/beta-1?embedded=1' />
        }
      }
    ];
    return (
      <div className={Root}>
        <Menu
          title='Game Info'
          menuID={WIDGET_NAME_GAME_INFO}
          closeSelf={this.closeSelf.bind(this)}
          tabs={tabs}
          escapable
        />
      </div>
    );
  }
  closeSelf(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_GAME_INFO));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

const GameInfo = connect(mapStateToProps)(AGameInfo);

export const WIDGET_NAME_GAME_INFO = 'Game Info';
export const gameInfoRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_GAME_INFO,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  layer: HUDLayer.Menus,
  render: () => {
    return <GameInfo />;
  }
};
