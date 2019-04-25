/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { utils } from '@csegames/camelot-unchained';

import Nav from 'hud/Nav';
import { LayoutMode } from 'utils/HUDDrag';
import HUDZOrder from '../HUDZOrder';

const { Orientation } = utils;

const hideClientControlledUI = () => {
  game.trigger('navigate', 'lockui');
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
  component: Nav,
  props: {
    orientation: Orientation.HORIZONTAL,
    items: [
      {
        name: 'console',
        tooltip: 'Console',
        iconClass: 'fa-terminal',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'console');
        },
      },
      {
        name: 'gamemenu',
        tooltip: 'Game Menu',
        iconClass: 'fa-cog',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'gamemenu'),
          hideClientControlledUI();
        },
      },
      {
        name: 'building',
        tooltip: 'Toggle Building Mode',
        iconClass: 'fa-cube',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'building');
          game.triggerKeyAction(game.keyActions.UIToggleBuildingMode);
        },
      },
      {
        name: 'character',
        tooltip: 'Character',
        iconClass: 'fa-user',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'character');
          hideClientControlledUI();
        },
      },
      {
        name: 'equippedgear',
        tooltip: 'Equipped Items',
        iconClass: 'fa-shield',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'equippedgear-left');
          game.trigger('navigate', 'inventory-right');
          hideClientControlledUI();
        },
      },
      {
        name: 'inventory',
        tooltip: 'Inventory',
        iconClass: 'fa-briefcase',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'equippedgear-left');
          game.trigger('navigate', 'inventory-right');
          hideClientControlledUI();
        },
      },
      // {
      //   name: 'spellbook',
      //   tooltip: 'Spellbook',
      //   iconClass: 'fa-book',
      //   hidden: false,
      //   onClick: () => {
      //     game.trigger('navigate', 'spellbook');
      //     client.PlaySoundEvent(soundEvents.PLAY_UI_SPELLBOOK_OPEN);
      //     client.ShowUI('spellbook');
      //   },
      // },
      // {
      //   name: 'skillbuilder',
      //   tooltip: 'Skill Builder',
      //   iconClass: 'fa-rotate-270 fa-sitemap',
      //   hidden: false,
      //   onClick: () => {
      //     game.trigger('navigate', 'skillbuilder');
      //     client.ShowUI('ability-builder');
      //   },
      // },
      {
        name: 'crafting',
        tooltip: 'Crafting',
        iconClass: 'fa-flask',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'crafting');
        },
      },
      {
        name: 'nearby-plot',
        tooltip: 'Nearby Plot',
        iconClass: 'fa-map-signs',
        hidden: false,
        onClick: () => {
          game.sendSlashCommand('plot showui --nearby');
        },
      },
      {
        name: 'gameinfo',
        tooltip: 'Game Info',
        iconClass: 'fa-tasks',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'gameinfo');
        },
      },
      {
        name: 'owned-plot',
        tooltip: 'Owned Plot',
        iconClass: 'fa-home',
        hidden: false,
        onClick: () => {
          game.sendSlashCommand('plot showui --owned');
        },
      },
      {
        name: 'map',
        tooltip: 'World Map',
        iconClass: 'fa-map',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'map');
        },
      },
      // {
      //   name: 'social',
      //   tooltip: 'Social',
      //   iconClass: 'fa-users',
      //   hidden: false,
      //   onClick: () => {
      //     game.trigger('navigate', 'social');
      //     hideClientControlledUI();
      //   },
      // },
      // {
      //   name: 'plotcontrol',
      //   tooltip: 'Plot Controller',
      //   iconClass: 'fa-map-signs',
      //   hidden: true,
      //   onClick: () => {
      //     game.trigger('navigate', 'plotcontrol');
      //   },
      // },
      {
        name: 'scenario-join',
        tooltip: 'Join Scenario',
        iconClass: 'icon-scenario',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'scenario-join');
        },
      },
      {
        name: 'scenario',
        tooltip: 'Scenario Management',
        iconClass: 'fa-gamepad',
        hidden: false,
        onClick: () => {
          game.sendSlashCommand('showscenarioui');
        },
      },
      {
        name: 'scenario-results',
        tooltip: 'Scenario Results',
        iconClass: 'fa-star',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'scenario-results');
        },
      },
      {
        name: 'progression',
        tooltip: 'Progression',
        iconClass: 'fa-chart-line',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'progression');
        },
      },
      {
        name: 'ability-builder',
        tooltip: 'Ability Builder',
        iconClass: 'fa-toolbox',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'ability-builder');
        },
      },
      {
        name: 'ability-book',
        tooltip: 'Ability Book',
        iconClass: 'fa-book-open',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'ability-book');
        },
      },
      // {
      //   name: 'chat',
      //   tooltip: 'Show/Hide Chat',
      //   iconClass: 'fa-comment',
      //   hidden: false,
      //   onClick: () => {
      //     game.trigger('navigate', 'chat');
      //   }
      // },
      {
        name: 'ui',
        tooltip: 'Toggle UI Edit Mode',
        iconClass: 'fa-lock',
        hidden: false,
        onClick: () => {
          game.trigger('navigate', 'ui');
        },
      },
      // {
      //   name: 'reset',
      //   tooltip: 'Reset UI layout',
      //   iconClass: 'fa-clone',
      //   hidden: false,
      //   onClick: () => {
      //     game.trigger('navigate', 'reset');
      //   },
      // },
      {
        name: 'reloadui',
        tooltip: 'Reload UI',
        iconClass: 'fa-sync',
        hidden: false,
        onClick: () => {
          game.reloadUI();
        },
      },
    ],
  },
};
