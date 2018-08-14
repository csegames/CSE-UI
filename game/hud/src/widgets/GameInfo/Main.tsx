/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import {
  TabbedDialogWithSideMenu,
  DialogDefinition,
  DialogButton,
  MenuOption,
} from '../../components/UI';

interface Link {
  option: MenuOption;
  uri: string;
}

const Iframe = styled('iframe')`
  flex: 1;
  border: 0;
  pointer-events: all;
  position: absolute;
  left: 201px;
  width: 822px;
  height: 679px;
  &.full-width {
    left: 0;
    top: 60px;
    width: 1022px;
    height: 692px;
  }
`;

/* Nav Buttons */
const NEWS: DialogButton = { label: 'News' };
const INFO: DialogButton = { label: 'Game Info' };
const DESIGN: DialogButton = { label: 'Design' };
const BETA: DialogButton = { label: 'Beta 1' };

/* News Links */
const LATEST: MenuOption = { label: 'Latest' };
const NEWSLETTER: MenuOption = { label: 'Newsletter' };

/* Game Info Options */
const ABOUT: MenuOption = { label: 'About' };
const REALMS: MenuOption = { label: 'Realms' };
const LORE: MenuOption = { label: 'Lore' };
const CRAFTINGII: MenuOption = { label: 'Crafting pt.2' };
const FPS: MenuOption = { label: 'Foundational' };
const CUBE: MenuOption = { label: 'C.U.B.E' };

/* Design Options */
const STATS: MenuOption = { label: 'Stat System' };
const MAGIC: MenuOption = { label: 'Magic' };
const COMBAT: MenuOption = { label: 'Combat' };
const CRAFTING: MenuOption = { label: 'Crafting' };
const RVRMAP: MenuOption = { label: 'RvR Map' };
const PROGRESSION: MenuOption = { label: 'Progression' };
const UIMODDING: MenuOption = { label: 'UI Modding' };

/* Describe our tabbed dialog */
const DIALOG_DEFINITION: DialogDefinition = {
  name: 'gameinfo',
  title: 'game info',
  tabs: [
    { id: 'news', tab: NEWS, options: [LATEST, NEWSLETTER] },
    { id: 'info', tab: INFO, options: [ABOUT, REALMS, LORE, FPS, CUBE] },
    { id: 'design', tab: DESIGN, options: [STATS, MAGIC, COMBAT, CRAFTING, CRAFTINGII, RVRMAP, PROGRESSION, UIMODDING] },
    { id: 'beta', tab: BETA },
  ],
};

/* Option links */
const BASE = 'http://camelotunchained.com/v3/';
const BSC_BASE = BASE + 'bsc-design-docs/';
const E = '/?embedded=1';

const links: Link[] = [
  { option: LATEST, uri: BASE + 'category/news' + E },
  { option: NEWSLETTER, uri: BASE + 'newsletter' + E },

  { option: ABOUT, uri: BASE + 'camelot-unchained' + E },
  { option: REALMS, uri: BASE + 'realms' + E },
  { option: LORE, uri: BASE + 'lore' + E },
  { option: FPS, uri: BASE + 'foundational-principles' + E },
  { option: CUBE, uri: BASE + 'c-u-b-e' + E },

  { option: STATS, uri: BSC_BASE + 'stat-system' + E },
  { option: MAGIC, uri: BSC_BASE + 'magic-system' + E },
  { option: COMBAT, uri: BSC_BASE + 'combat' + E },
  { option: CRAFTING, uri: BSC_BASE + 'crafting' + E },
  { option: CRAFTINGII, uri: BSC_BASE + 'crafting-part-deux' + E },
  { option: RVRMAP, uri: BSC_BASE + 'rvr-map' + E },
  { option: PROGRESSION, uri: BSC_BASE + 'progression-system' + E },
  { option: UIMODDING, uri: BSC_BASE + 'ui-modding' + E },
];

interface MainProps {
  onClose?: () => void;
}

/* tslint:disable:function-name */
export function Main(props: MainProps) {
  return (
    <TabbedDialogWithSideMenu definition={DIALOG_DEFINITION} onClose={props.onClose}>
      {(option: MenuOption, tab: DialogButton) => {
        switch (tab) {
          case BETA: return <Iframe className='full-width' src={BASE + 'beta-1' + E}/>;
        }
        return links.filter(link => link.option === option).map(link => <Iframe src={link.uri}/>)[0];
      }}
    </TabbedDialogWithSideMenu>
  );
}

export default Main;
