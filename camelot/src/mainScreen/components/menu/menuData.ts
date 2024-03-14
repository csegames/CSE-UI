/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export interface MenuContentData {
  node: React.ReactNode;
  scrollable?: boolean;
}

export interface MenuTabData {
  id: string;
  title: string;
  sections?: MenuSectionData[];
  content?: MenuContentData;
}

export interface MenuSectionData {
  id: string;
  title: string;
  content?: MenuContentData;
}

export interface FooterButtonData {
  text: string;
  onClick: () => void;
}
