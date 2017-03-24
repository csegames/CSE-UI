/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-04 15:21:09
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-04 15:24:32
 */

import gql from 'graphql-tag';

import DamageTypeValuesFragment, { DamageTypeValues } from './DamageTypeValues';
import { ArmorPartStats } from './ArmorPartStats';

export default gql`
fragment ArmorStats on ArmorStats {
  neck {
    resistances {
      ...DamageTypeValues
    }
  }
  face {
    resistances {
      ...DamageTypeValues
    }
  }
  shoulderRightUnder{
    resistances {
      ...DamageTypeValues
    }
  }
  waist {
    resistances {
      ...DamageTypeValues
    }
  }
  back {
    resistances {
      ...DamageTypeValues
    }
  }
  thighsUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  forearmLeft {
    resistances {
      ...DamageTypeValues
    }
  }
  feetUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  feet {
    resistances {
      ...DamageTypeValues
    }
  }
  handLeft {
    resistances {
      ...DamageTypeValues
    }
  }
  chest {
    resistances {
      ...DamageTypeValues
    }
  }
  forearmRight {
    resistances {
      ...DamageTypeValues
    }
  }
  backUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  skullUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  shoulderLeft {
    resistances {
      ...DamageTypeValues
    }
  }
  waistUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  shins {
    resistances {
      ...DamageTypeValues
    }
  }
  neckUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  handRightUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  forearmLeftUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  cloak {
    resistances {
      ...DamageTypeValues
    }
  }
  shoulderLeftUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  chestUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  handRight{
    resistances {
      ...DamageTypeValues
    }
  }
  shoulderRight {
    resistances {
      ...DamageTypeValues
    }
  }
  skull {
    resistances {
      ...DamageTypeValues
    }
  }
  thighs {
    resistances {
      ...DamageTypeValues
    }
  }
  handLeftUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  shinsUnder {
    resistances {
      ...DamageTypeValues
    }
  }
  faceUnder {
    resistances {
      ...DamageTypeValues
    }
  }
}
${DamageTypeValuesFragment}`;

export interface ArmorStats {
  neck: ArmorPartStats;
  face: ArmorPartStats;
  shoulderRightUnder: ArmorPartStats;
  waist: ArmorPartStats;
  back: ArmorPartStats;
  thighsUnder: ArmorPartStats;
  forearmRightUnder: ArmorPartStats;
  forearmLeft: ArmorPartStats;
  feetUnder: ArmorPartStats;
  feet: ArmorPartStats;
  handLeft: ArmorPartStats;
  chest: ArmorPartStats;
  forearmRight: ArmorPartStats;
  backUnder: ArmorPartStats;
  skullUnder: ArmorPartStats;
  shoulderLeft: ArmorPartStats;
  waistUnder: ArmorPartStats;
  shins: ArmorPartStats;
  neckUnder: ArmorPartStats;
  handRightUnder: ArmorPartStats;
  forearmLeftUnder: ArmorPartStats;
  cloak: ArmorPartStats;
  shoulderLeftUnder: ArmorPartStats;
  chestUnder: ArmorPartStats;
  handRight: ArmorPartStats;
  shoulderRight: ArmorPartStats;
  skull: ArmorPartStats;
  thighs: ArmorPartStats;
  handLeftUnder: ArmorPartStats;
  shinsUnder: ArmorPartStats;
  faceUnder: ArmorPartStats;
}
