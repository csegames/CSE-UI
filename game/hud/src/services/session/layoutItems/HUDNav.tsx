/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, utils } from '@csegames/camelot-unchained';
import * as events from '@csegames/camelot-unchained/lib/events';

import HUDNav from '../../../components/HUDNav';
import { LayoutMode } from '../../../components/HUDDrag';
import HUDZOrder from '../HUDZOrder';

const { Orientation } = utils;

const hideClientControlledUI = () => {
  client.HideUI('spellbook');
  client.HideUI('ability-builder');
  client.HideUI('inventory');
  client.HideUI('equippedgear');
  client.HideUI('plotcontrol');
};

export default {
  position: {
    x: {
      anchor: 0,
      offset: 0,
    },
    y: {
      anchor: 0,
      offset: 0,
    },
    size: {
      width: 900,
      height: 200,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.HUDNav,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: HUDNav,
  props: {
    orientation: Orientation.HORIZONTAL,
    items: [
      {
        name: 'console',
        tooltip: 'Console',
        iconClass: 'fa-terminal',
        icon: (
          <span>
            <i className='fa fa-terminal fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'console');
        },
      },
      {
        name: 'gamemenu',
        tooltip: 'Game Menu',
        iconClass: 'fa-cog',
        icon: (
          <span>
            <i className='fa fa-cog fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'gamemenu'),
          hideClientControlledUI();
        },
      },
      {
        name: 'character',
        tooltip: 'Character',
        iconClass: 'fa-user',
        icon: (
          <span>
            <i className='fa fa-user fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'character');
          hideClientControlledUI();
        },
      },
      // {
      //   name: 'social',
      //   tooltip: 'Social',
      //   iconClass: 'fa-users',
      //   icon: (
      //     <span>
      //       <i className='fa fa-users fa-stack-1x fa-inverse'></i>
      //     </span>
      //   ),
      //   hidden: false,
      //   onClick: () => {
      //     events.fire('hudnav--navigate', 'social');
      //     hideClientControlledUI();
      //   },
      // },
      // {
      //   name: 'spellbook',
      //   tooltip: 'Spellbook',
      //   iconClass: 'fa-book',
      //   icon: (
      //     <span>
      //       <i className='fa fa-book fa-stack-1x fa-inverse'></i>
      //     </span>
      //   ),
      //   hidden: false,
      //   onClick: () => {
      //     events.fire('hudnav--navigate', 'spellbook');
      //     client.PlaySoundEvent(soundEvents.PLAY_UI_SPELLBOOK_OPEN);
      //     client.ShowUI('spellbook');
      //   },
      // },
      // {
      //   name: 'skillbuilder',
      //   tooltip: 'Skill Builder',
      //   iconClass: 'fa-rotate-270 fa-sitemap',
      //   icon: (
      //     <span>
      //       <i className='fa fa-rotate-270 fa-sitemap fa-stack-1x fa-inverse'></i>
      //     </span>
      //   ),
      //   hidden: false,
      //   onClick: () => {
      //     events.fire('hudnav--navigate', 'skillbuilder');
      //     client.ShowUI('ability-builder');
      //   },
      // },
      {
        name: 'building',
        tooltip: 'Toggle Building Mode',
        iconClass: 'fa-cube',
        icon: (
          <span>
            <i className='fa fa-cube fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'building');
          client.ToggleBuildingMode();
        },
      },
      {
        name: 'crafting',
        tooltip: 'Crafting',
        iconClass: 'fa-tasks',
        icon: (
          <span>
            <i className='fa fa-tasks fa-rotate-270 fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'crafting');
        },
      },
      {
        name: 'inventory',
        tooltip: 'Inventory',
        iconClass: 'fa-list',
        icon: (
          <span>
            <i className='fa fa-list fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'equippedgear-left');
          events.fire('hudnav--navigate', 'inventory-right');
        },
      },
      {
        name: 'equippedgear',
        tooltip: 'Equipped Items',
        iconClass: 'fa-user',
        icon: (
          <span>
            <i className='fa fa-user fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'equippedgear-left');
          events.fire('hudnav--navigate', 'inventory-right');
        },
      },
      // {
      //   name: 'plotcontrol',
      //   tooltip: 'Plot Controller',
      //   iconClass: 'fa-map-signs',
      //   icon: (
      //     <span>
      //       <i className='fa fa-map-signs fa-stack-1x fa-inverse'></i>
      //     </span>
      //   ),
      //   hidden: true,
      //   onClick: () => {
      //     events.fire('hudnav--navigate', 'plotcontrol');
      //   },
      // },
      {
        name: 'map',
        tooltip: 'World Map',
        iconClass: 'fa-map',
        icon: (
          <span>
            <i className='fa fa-map fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'map');
        },
      },
      {
        name: 'scenario-results',
        tooltip: 'Scenario Results',
        iconClass: 'fa-star',
        icon: (
          <span>
            <i className='fa fa-star fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'scenario-results');
        },
      },
      {
        name: 'progression',
        tooltip: 'Progression',
        iconClass: 'fa-line-chart',
        icon: (
          <span>
            <i className='fa fa-line-chart fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'progression');
        },
      },
      // {
      //   name: 'chat',
      //   tooltip: 'Show/Hide Chat',
      //   iconClass: 'fa-comment',
      //   icon: (
      //     <span>
      //       <i className='fa fa-comment fa-stack-1x fa-inverse'></i>
      //     </span>
      //   ),
      //   hidden: false,
      //   onClick: () => {
      //     events.fire('hudnav--navigate', 'chat');
      //   }
      // },
      {
        name: 'ui',
        tooltip: 'Toggle UI Edit Mode',
        iconClass: 'fa-lock',
        icon: (
          <span>
            <i className='fa fa-lock fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'ui');
        },
      },
      {
        name: 'reset',
        tooltip: 'Reset UI layout',
        iconClass: 'fa-retweet',
        icon: (
          <span>
            <i className='fa fa-retweet fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          events.fire('hudnav--navigate', 'reset');
        },
      },
      {
        name: 'reloadui',
        tooltip: 'Reload UI',
        iconClass: 'fa-refresh',
        icon: (
          <span>
            <i className='fa fa-refresh fa-stack-1x fa-inverse'></i>
          </span>
        ),
        hidden: false,
        onClick: () => {
          client.ReloadAllUI();
        },
      },
    ],
  },
};
