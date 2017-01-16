/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-20 18:08:12
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-26 10:46:06
 */
import * as React from 'react';
import { Module } from 'redux-typed-modules'
import { Map } from 'immutable';
import { utils } from 'camelot-unchained';

export enum SocialCategory {
  Personal,
  Order,
  Alliance,
  Warbands,
  Warband,
  Campaigns,
  Campaign
}

export interface NavLink {
  id: string;
  displayName: string;
  icon: JSX.Element | string;
  address: LinkAddress;
  enabled: boolean;
}

export interface NavSection extends utils.FetchStatus {
  id: string;
  displayName: string;
  links: NavLink[];
  collapsed: boolean;
}

export interface PersonalCategory extends NavSection {
  category: SocialCategory.Personal;
  address: CategoryAddress;
}

export interface OrderCategory extends NavSection {
  category: SocialCategory.Order;
  address: CategoryAddress;
}

export interface AllianceCategory extends NavSection {
  category: SocialCategory.Alliance;
  address: CategoryAddress;
}

export interface WarbandCategory extends NavSection {
  category: SocialCategory.Warband;
  address: CategoryAddress;
}

export interface CampaignCategory extends NavSection {
  category: SocialCategory.Campaign;
  address: CategoryAddress;
}

export interface WarbandsCategory extends utils.FetchStatus {
  category: SocialCategory.Warbands;
  warbands: Map<string, WarbandCategory>;
  collapsed: boolean;
  address: CategoryAddress;
  displayName: string;
}

export interface CampaignsCategory extends utils.FetchStatus {
  category: SocialCategory.Campaigns;
  campaigns: Map<string, CampaignCategory>;
  collapsed: boolean;
  address: CategoryAddress;
  displayName: string;
}

export type CategoryNav = PersonalCategory | OrderCategory | AllianceCategory | WarbandCategory | CampaignCategory | WarbandsCategory | CampaignsCategory;


export interface PrimaryLinkAddress {
  kind: 'Primary';
  category: SocialCategory;
  id: string;
}

export interface SubLinkAddress {
  kind: 'Sub';
  category: SocialCategory;
  subKey: string;
  id: string;
}

export type LinkAddress = PrimaryLinkAddress | SubLinkAddress;

export interface PrimaryCategoryAddress {
  kind: 'Primary';
  category: SocialCategory;
}

export interface SubCategoryAddress {
  kind: 'Sub';
  category: SocialCategory;
  subKey: string;
}
export type CategoryAddress = PrimaryCategoryAddress | SubCategoryAddress;

/*
 * STATE
 */
export interface NavigationState {
  currentView: LinkAddress;
  categories: Map<SocialCategory, CategoryNav>;
}

function initialState(): NavigationState {
  return {
    currentView: {
      kind: 'Primary',
      category: SocialCategory.Order,
      id: 'overview',
    },
    categories: Map<SocialCategory, CategoryNav>([
      // Personal
      [
        SocialCategory.Personal, {
          category: SocialCategory.Personal,
          id: 'personal',
          displayName: 'Personal',
          collapsed: false,
          address: {
            kind: 'Primary',
            category: SocialCategory.Personal,
          },
          links: [
            {
              id: 'overview',
              displayName: 'Overview',
              icon: <i className='fa fa-th'></i>,
              enabled: true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Personal,
                id: 'overview',
              }
            }, {
              id: 'contacts',
              displayName: 'Contacts',
              icon: <i className='fa fa-address-book-o'></i>,
              enabled: true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Personal,
                id: 'contacts',
              }
            }, {
              id: 'privacy',
              displayName: 'Privacy Settings',
              icon: <i className='fa fa-shield'></i>,
              enabled: true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Personal,
                id: 'privacy',
              }
            },
          ],
          ...utils.defaultFetchStatus
        }
      ],
      // ORDER
      [
        SocialCategory.Order, {
          category: SocialCategory.Order,
          id: 'order',
          displayName: 'Order',
          collapsed: false,
          address: {
            kind: 'Primary',
            category: SocialCategory.Order,
          },
          links: [
            {
              id: 'overview',
              displayName: 'Overview',
              icon: <i className='fa fa-th'></i>,
              enabled: true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'overview',
              }
            }, {
              id: 'members',
              displayName: 'Members',
              icon: <i className='fa fa-users'></i>,
              enabled: true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'members',
              }
            }, {
              id: 'ranks',
              displayName: 'Ranks',
              icon: <i className='fa fa-star'></i>,
              enabled: true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'ranks',
              }
            }, {
              id: 'assets',
              displayName: 'Assets',
              icon: <i className='fa fa-bank'></i>,
              enabled: true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'assets',
              }
            }, {
              id: 'contracts',
              displayName: 'Contracts',
              icon: <i className='fa fa-file-text-o'></i>,
              enabled: true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'contracts',
              }
            }, {
              id: 'admin',
              displayName: 'Administration',
              icon: <i className='fa fa-cogs'></i>,
              enabled: false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'admin',
              }
            },
          ],
          ...utils.defaultFetchStatus
        }
      ],
      // ALLIANCE
      [
        SocialCategory.Alliance, {
          category: SocialCategory.Alliance,
          id: 'alliance',
          displayName: 'Alliance',
          collapsed: false,
          address: {
            kind: 'Primary',
            category: SocialCategory.Alliance,
          },
          links: [
            {
              id: 'overview',
              displayName: 'Overview',
              icon: <i className='fa fa-th'></i>,
              enabled: false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Alliance,
                id: 'overview',
              }
            }, {
              id: 'members',
              displayName: 'Members',
              icon: <i className='fa fa-users'></i>,
              enabled: false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Alliance,
                id: 'members',
              }
            }, {
              id: 'ranks',
              displayName: 'Ranks',
              icon: <i className='fa fa-star'></i>,
              enabled: false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Alliance,
                id: 'ranks',
              }
            }, {
              id: 'assets',
              displayName: 'Assets',
              icon: <i className='fa fa-bank'></i>,
              enabled: false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Alliance,
                id: 'assets',
              }
            }, {
              id: 'contracts',
              displayName: 'Contracts',
              icon: <i className='fa fa-file-text-o'></i>,
              enabled: false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Alliance,
                id: 'contracts',
              }
            }, {
              id: 'admin',
              displayName: 'Administration',
              icon: <i className='fa fa-cogs'></i>,
              enabled: false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Alliance,
                id: 'admin',
              }
            },
          ],
          ...utils.defaultFetchStatus
        }
      ],
      // WARBANDS
      [
        SocialCategory.Warbands, {
          category: SocialCategory.Warbands,
          id: 'warbands',
          displayName: 'Warbands',
          collapsed: false,
          address: {
            kind: 'Primary',
            category: SocialCategory.Warbands,
          },
          warbands: Map<string, NavSection>([
            [
              'Big Blue Beef', {
                id: 'Big Blue Beef',
                displayName: 'Big Blue Beef',
                collapsed: false,
                address: {
                  kind: 'Sub',
                  category: SocialCategory.Warbands,
                  subKey: 'Big Blue Beef',
                },
                links: [
                  {
                    id: 'overview',
                    displayName: 'Overview',
                    icon: <i className='fa fa-th'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Big Blue Beef',
                      id: 'overview',
                    }
                  }, {
                    id: 'members',
                    displayName: 'Members',
                    icon: <i className='fa fa-users'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Big Blue Beef',
                      id: 'members',
                    }
                  }, {
                    id: 'ranks',
                    displayName: 'Ranks',
                    icon: <i className='fa fa-star'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Big Blue Beef',
                      id: 'ranks',
                    }
                  }, {
                    id: 'assets',
                    displayName: 'Assets',
                    icon: <i className='fa fa-bank'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Big Blue Beef',
                      id: 'assets',
                    }
                  }, {
                    id: 'contracts',
                    displayName: 'Contracts',
                    icon: <i className='fa fa-file-text-o'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Big Blue Beef',
                      id: 'contracts',
                    }
                  }, {
                    id: 'admin',
                    displayName: 'Administration',
                    icon: <i className='fa fa-cogs'></i>,
                    enabled: false,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Big Blue Beef',
                      id: 'admin',
                    }
                  },
                ]
              }
            ], [
              'Lunchorpan Destroyers', {
                id: 'Lunchorpan Destroyers',
                displayName: 'Lunchorpan Destroyers',
                collapsed: false,
                address: {
                  kind: 'Sub',
                  category: SocialCategory.Warbands,
                  subKey: 'Lunchorpan Destroyers',
                },
                links: [
                  {
                    id: 'overview',
                    displayName: 'Overview',
                    icon: <i className='fa fa-th'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Lunchorpan Destroyers',
                      id: 'overview',
                    }
                  }, {
                    id: 'members',
                    displayName: 'Members',
                    icon: <i className='fa fa-users'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Lunchorpan Destroyers',
                      id: 'members',
                    }
                  }, {
                    id: 'ranks',
                    displayName: 'Ranks',
                    icon: <i className='fa fa-star'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Lunchorpan Destroyers',
                      id: 'ranks',
                    }
                  }, {
                    id: 'assets',
                    displayName: 'Assets',
                    icon: <i className='fa fa-bank'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Lunchorpan Destroyers',
                      id: 'assets',
                    }
                  }, {
                    id: 'contracts',
                    displayName: 'Contracts',
                    icon: <i className='fa fa-file-text-o'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Lunchorpan Destroyers',
                      id: 'contracts',
                    }
                  }, {
                    id: 'admin',
                    displayName: 'Administration',
                    icon: <i className='fa fa-cogs'></i>,
                    enabled: true,
                    address: {
                      kind: 'Sub',
                      category: SocialCategory.Warbands,
                      subKey: 'Lunchorpan Destroyers',
                      id: 'admin',
                    }
                  },
                ]
              }
            ]
          ]),
          ...utils.defaultFetchStatus
        }
      ],
    ]),
  }
}

function toggleCollapsed(state: Readonly<NavigationState>, address: CategoryAddress): Partial<NavigationState> {
  return {
    categories: state.categories.update(address.category, value => {
      switch (address.kind) {
        case 'Primary':
          value.collapsed = !value.collapsed;
          return value;
        case 'Sub':
          switch (value.category) {
            case SocialCategory.Warbands:
              value.warbands = value.warbands.update(address.subKey, subValue => {
                subValue.collapsed = !subValue.collapsed;
                return subValue;
              });
              return value;
            case SocialCategory.Campaigns:
              value.campaigns = value.campaigns.update(address.subKey, subValue => {
                subValue.collapsed = !subValue.collapsed;
                return subValue;
              });
              return value;
          }
        // should never hit this!!
        default: return value;
      }
    })
  };
}

export function linkAddressEquals(a: LinkAddress, b: LinkAddress) {
  switch (a.kind) {
    case 'Primary':
      if (b.kind === 'Sub') return false;
      return a.category === b.category && a.id === b.id;
    case 'Sub':
      if (b.kind === 'Primary') return false;
      return a.category === b.category && a.subKey === b.subKey && a.id === b.id;
  }
}

export function categoryAddressEquals(a: CategoryAddress, b: CategoryAddress) {
  switch (a.kind) {
    case 'Primary':
      if (b.kind === 'Sub') return false;
      return a.category === b.category;
    case 'Sub':
      if (b.kind === 'Primary') return false;
      return a.category === b.category && a.subKey === b.subKey
  }
}

/*
 * MODULE ACTIONS
 */
var module = new Module({
  initialState: initialState(),
  actionExtraData: () => {
    return {
      when: new Date(),
    };
  },
});

export const selectLink = module.createAction({
  type: 'social/navigation/selectLink',
  action: (address: LinkAddress) => {
    return {
      address: address
    };
  },
  reducer: (s, a) => {
    return {
      currentView: a.address
    };
  }
});

export const toggleCollapsedCategory = module.createAction({
  type: 'social/navigation/toggleCollapsedCategory',
  action: (address: CategoryAddress) => {
    return {
      address: address
    };
  },
  reducer: (s, a) => {
    return toggleCollapsed(s, a.address);
  }
});

export default module.createReducer();
