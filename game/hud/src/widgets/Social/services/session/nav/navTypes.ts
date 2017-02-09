/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 14:36:31
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 15:02:20
 */
import { utils, ql } from 'camelot-unchained';
import { Map } from 'immutable';

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
  id : string;
  displayName : string;
  icon : JSX.Element | string;
  address : LinkAddress;
  enabled : boolean;
  display: (social: ql.MySocialQuery) => boolean;
}

export interface NavSection extends utils.FetchStatus {id: string;
  displayName: string;
  links: NavLink[];
  collapsed: boolean;}

export interface PersonalCategory extends NavSection {
  category : SocialCategory.Personal;
  address : CategoryAddress;
}

export interface OrderCategory extends NavSection {
  category : SocialCategory.Order;
  address : CategoryAddress;
}

export interface AllianceCategory extends NavSection {
  category : SocialCategory.Alliance;
  address : CategoryAddress;
}

export interface WarbandCategory extends NavSection {
  category : SocialCategory.Warband;
  address : CategoryAddress;
}

export interface CampaignCategory extends NavSection {
  category : SocialCategory.Campaign;
  address : CategoryAddress;
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
  campaigns: Map<string,CampaignCategory>;
  collapsed: boolean;
  address: CategoryAddress;
  displayName: string;
}

export type CategoryNav = PersonalCategory | OrderCategory | AllianceCategory | WarbandCategory | CampaignCategory | WarbandsCategory | CampaignsCategory;

export interface PrimaryLinkAddress {
  kind : 'Primary';
  category : SocialCategory;
  id : string;
}

export interface SubLinkAddress {
  kind : 'Sub';
  category : SocialCategory;
  subKey : string;
  id : string;
}

export type LinkAddress = PrimaryLinkAddress | SubLinkAddress;

export interface PrimaryCategoryAddress {
  kind : 'Primary';
  category : SocialCategory;
}

export interface SubCategoryAddress {
  kind : 'Sub';
  category : SocialCategory;
  subKey : string;
}

export type CategoryAddress = PrimaryCategoryAddress | SubCategoryAddress;

export function defaultCategoryNav() {
  return {id: '', displayName: '', links: []as any, collapsed: false}
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
