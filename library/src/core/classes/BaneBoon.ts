/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import channelId from '../constants/channelId';
import baneBoonCategory from '../constants/baneBoonCategory';

class BaneBoon  {

  id: string;
  channelId: channelId;
  name: string;
  description: string;
  category: baneBoonCategory;
  categoryId: number;
  icon: string;
  costPerRank: number;
  maxRanks: number;
  prerequisite: string;
  x: number;
  y: number;


  constructor(boonbane = <BaneBoon>{}) {
    this.id = boonbane.id || "";
    this.channelId = boonbane.channelId || channelId.NONE;
    this.name = boonbane.name || "";
    this.description = boonbane.description || "";
    this.category = boonbane.category ||  baneBoonCategory.NONE;
    this.categoryId = boonbane.categoryId || 0;
    this.icon = boonbane.icon || "";
    this.costPerRank = boonbane.costPerRank || 0;
    this.maxRanks = boonbane.maxRanks || 0;
    this.prerequisite = boonbane.prerequisite || "";
    this.x = boonbane.x || 0;
    this.y = boonbane.y || 0;
  }

  static create() {
    let a = new BaneBoon();
    return a;
  }

}

export default BaneBoon;
