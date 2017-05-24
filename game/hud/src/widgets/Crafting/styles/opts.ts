/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-24 20:16:31
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-24 20:57:54
 */

/*
 * Style Options (expand as see fit).
 *
 * The basic structure is to group options into meaningful groups, such
 * as buttons: defines the options relating to buttons (in general) and
 * properties: to the properties section of the UI etc.
 */

export const opts = {
  ui: {
    WIDTH: '600px',
    HEIGHT: '450px',
  },
  job: {
    HIGHLIGHT: 'green',
  },
  properties: {
    LABEL_WIDTH: '200px',
    LINE_SPACING: '1px',
  },
  ingredients: {
    NAME_WIDTH: '60%',
    QUANTITY_WIDTH: '20%',
    QUALITY_WIDTH: '20%',
  },
  buttons: {
    FONT_SIZE: '12px',
    MIN_WIDTH: '45px',
  },
  input: {
    HEIGHT: '24px',
    COLOR: 'white',
    BACKGROUND: 'rgba(40,40,40,0.5)',
  },
  SPACE_BETWEEN_FIELDS: '5px',
};

export default opts;
