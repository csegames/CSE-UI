/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 15:18:16
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 18:22:01
 */
import * as React from 'react';
import { Map } from 'immutable';
import { utils, ql } from 'camelot-unchained';
import { LinkAddress,
         SocialCategory,
         CategoryNav,
         NavSection,
         CategoryAddress,
         categoryAddressEquals,
         linkAddressEquals,
         PrimaryLinkAddress } from './navTypes';

export default function() {
  return {
    currentView: {
      kind: 'Primary',
      category: SocialCategory.Order,
      id: 'create',
    } as LinkAddress,
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
              display: (social: ql.MySocialQuery) => false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Personal,
                id: 'overview',
              }
            },
            {
              id: 'invites',
              displayName: 'Invites',
              icon: <i className='fa fa-envelope-o'></i>,
              enabled: true,
              display: (social: ql.MySocialQuery) => true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Personal,
                id: 'invites',
              }
            },
            {
              id: 'contacts',
              displayName: 'Contacts',
              icon: <i className='fa fa-address-book-o'></i>,
              enabled: true,
              display: (social: ql.MySocialQuery) => false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Personal,
                id: 'contacts',
              }
            },
            {
              id: 'privacy',
              displayName: 'Privacy Settings',
              icon: <i className='fa fa-shield'></i>,
              enabled: true,
              display: (social: ql.MySocialQuery) => false,
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
              id: 'list',
              displayName: 'Browse',
              icon: <i className='fa fa-bars'></i>,
              enabled: true,
              display: (social: ql.MySocialQuery) => true,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'list',
              }
            },
            {
              id: 'create',
              displayName: 'Create',
              icon: <i className='fa fa-newspaper-o'></i>,
              enabled: true,
              display: (social: ql.MySocialQuery) => !(social.myOrder || false),
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'create',
              }
            },
            {
              id: 'overview',
              displayName: 'Overview',
              icon: <i className='fa fa-th'></i>,
              enabled: true,
              display: (social: ql.MySocialQuery) => social.myOrder || false,
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
              display: (social: ql.MySocialQuery) => social.myOrder || false,
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
              display: (social: ql.MySocialQuery) => social.myOrder || false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'ranks',
              }
            },
            // {
            //   id: 'assets',
            //   displayName: 'Assets',
            //   icon: <i className='fa fa-bank'></i>,
            //   enabled: true,
            //   address: {
            //     kind: 'Primary',
            //     category: SocialCategory.Order,
            //     id: 'assets',
            //   }
            // }, {
            //   id: 'contracts',
            //   displayName: 'Contracts',
            //   icon: <i className='fa fa-file-text-o'></i>,
            //   enabled: true,
            //   address: {
            //     kind: 'Primary',
            //     category: SocialCategory.Order,
            //     id: 'contracts',
            //   }
            // },
            {
              id: 'admin',
              displayName: 'Administration',
              icon: <i className='fa fa-cogs'></i>,
              enabled: true,
              display: (social: ql.MySocialQuery) => social.myOrder || false,
              address: {
                kind: 'Primary',
                category: SocialCategory.Order,
                id: 'admin',
              }
            },
          ],
          ...utils.defaultFetchStatus
        }
      ]//,
      // ALLIANCE
      // [
      //   SocialCategory.Alliance, {
      //     category: SocialCategory.Alliance,
      //     id: 'alliance',
      //     displayName: 'Alliance',
      //     collapsed: false,
      //     address: {
      //       kind: 'Primary',
      //       category: SocialCategory.Alliance,
      //     },
      //     links: [
      //       {
      //         id: 'overview',
      //         displayName: 'Overview',
      //         icon: <i className='fa fa-th'></i>,
      //         enabled: false,
      //         address: {
      //           kind: 'Primary',
      //           category: SocialCategory.Alliance,
      //           id: 'overview',
      //         }
      //       }, {
      //         id: 'members',
      //         displayName: 'Members',
      //         icon: <i className='fa fa-users'></i>,
      //         enabled: false,
      //         address: {
      //           kind: 'Primary',
      //           category: SocialCategory.Alliance,
      //           id: 'members',
      //         }
      //       }, {
      //         id: 'ranks',
      //         displayName: 'Ranks',
      //         icon: <i className='fa fa-star'></i>,
      //         enabled: false,
      //         address: {
      //           kind: 'Primary',
      //           category: SocialCategory.Alliance,
      //           id: 'ranks',
      //         }
      //       },// {
      //       //   id: 'assets',
      //       //   displayName: 'Assets',
      //       //   icon: <i className='fa fa-bank'></i>,
      //       //   enabled: false,
      //       //   address: {
      //       //     kind: 'Primary',
      //       //     category: SocialCategory.Alliance,
      //       //     id: 'assets',
      //       //   }
      //       // }, {
      //       //   id: 'contracts',
      //       //   displayName: 'Contracts',
      //       //   icon: <i className='fa fa-file-text-o'></i>,
      //       //   enabled: false,
      //       //   address: {
      //       //     kind: 'Primary',
      //       //     category: SocialCategory.Alliance,
      //       //     id: 'contracts',
      //       //   }
      //       //},
      //       {
      //         id: 'admin',
      //         displayName: 'Administration',
      //         icon: <i className='fa fa-cogs'></i>,
      //         enabled: false,
      //         address: {
      //           kind: 'Primary',
      //           category: SocialCategory.Alliance,
      //           id: 'admin',
      //         }
      //       },
      //     ],
      //     ...utils.defaultFetchStatus
      //   }
      // ],
      // WARBANDS
      // [
      //   SocialCategory.Warbands, {
      //     category: SocialCategory.Warbands,
      //     id: 'warbands',
      //     displayName: 'Warbands',
      //     collapsed: false,
      //     address: {
      //       kind: 'Primary',
      //       category: SocialCategory.Warbands,
      //     },
      //     warbands: Map<string, NavSection>([
      //       [
      //         'Big Blue Beef', {
      //           id: 'Big Blue Beef',
      //           displayName: 'Big Blue Beef',
      //           collapsed: false,
      //           address: {
      //             kind: 'Sub',
      //             category: SocialCategory.Warbands,
      //             subKey: 'Big Blue Beef',
      //           },
      //           links: [
      //             {
      //               id: 'overview',
      //               displayName: 'Overview',
      //               icon: <i className='fa fa-th'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Big Blue Beef',
      //                 id: 'overview',
      //               }
      //             }, {
      //               id: 'members',
      //               displayName: 'Members',
      //               icon: <i className='fa fa-users'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Big Blue Beef',
      //                 id: 'members',
      //               }
      //             }, {
      //               id: 'ranks',
      //               displayName: 'Ranks',
      //               icon: <i className='fa fa-star'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Big Blue Beef',
      //                 id: 'ranks',
      //               }
      //             }, {
      //               id: 'assets',
      //               displayName: 'Assets',
      //               icon: <i className='fa fa-bank'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Big Blue Beef',
      //                 id: 'assets',
      //               }
      //             }, {
      //               id: 'contracts',
      //               displayName: 'Contracts',
      //               icon: <i className='fa fa-file-text-o'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Big Blue Beef',
      //                 id: 'contracts',
      //               }
      //             }, {
      //               id: 'admin',
      //               displayName: 'Administration',
      //               icon: <i className='fa fa-cogs'></i>,
      //               enabled: false,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Big Blue Beef',
      //                 id: 'admin',
      //               }
      //             },
      //           ]
      //         }
      //       ], [
      //         'Lunchorpan Destroyers', {
      //           id: 'Lunchorpan Destroyers',
      //           displayName: 'Lunchorpan Destroyers',
      //           collapsed: false,
      //           address: {
      //             kind: 'Sub',
      //             category: SocialCategory.Warbands,
      //             subKey: 'Lunchorpan Destroyers',
      //           },
      //           links: [
      //             {
      //               id: 'overview',
      //               displayName: 'Overview',
      //               icon: <i className='fa fa-th'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Lunchorpan Destroyers',
      //                 id: 'overview',
      //               }
      //             }, {
      //               id: 'members',
      //               displayName: 'Members',
      //               icon: <i className='fa fa-users'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Lunchorpan Destroyers',
      //                 id: 'members',
      //               }
      //             }, {
      //               id: 'ranks',
      //               displayName: 'Ranks',
      //               icon: <i className='fa fa-star'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Lunchorpan Destroyers',
      //                 id: 'ranks',
      //               }
      //             }, {
      //               id: 'assets',
      //               displayName: 'Assets',
      //               icon: <i className='fa fa-bank'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Lunchorpan Destroyers',
      //                 id: 'assets',
      //               }
      //             }, {
      //               id: 'contracts',
      //               displayName: 'Contracts',
      //               icon: <i className='fa fa-file-text-o'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Lunchorpan Destroyers',
      //                 id: 'contracts',
      //               }
      //             }, {
      //               id: 'admin',
      //               displayName: 'Administration',
      //               icon: <i className='fa fa-cogs'></i>,
      //               enabled: true,
      //               display: (social: ql.MySocialQuery) => true,
      //               address: {
      //                 kind: 'Sub',
      //                 category: SocialCategory.Warbands,
      //                 subKey: 'Lunchorpan Destroyers',
      //                 id: 'admin',
      //               }
      //             },
      //           ]
      //         }
      //       ]
        //   ]),
        //   ...utils.defaultFetchStatus
        // }
      //],
    ]),
  }
}
