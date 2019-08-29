/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export interface FactionColorsInterface {
  [id: string]: {
    textColor: string;
    backgroundColor: string;
    flatBackgroundColor: string;
  };
}

export const FactionColors: FactionColorsInterface = {
  Arthurian: {
    textColor: '#F43835',
    backgroundColor: 'rgba(237, 81, 81, 0.15)',
    flatBackgroundColor: '#ED5151',
  },
  Tuatha: {
    textColor: '#8FC971',
    backgroundColor: 'rgba(125, 237, 81, 0.15)',
    flatBackgroundColor: '#7DED51',
  },
  Viking: {
    textColor: '#63D7FF',
    backgroundColor: 'rgba(80, 157, 235, 0.15)',
    flatBackgroundColor: '#509DEB',
  },
};
