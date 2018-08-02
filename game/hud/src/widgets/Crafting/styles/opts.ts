/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
    WIDTH: '700px',
    HEIGHT: '550px',
    MINIMIZED_HEIGHT: '21px',
    MINIMIZED_POSITION: '0px',
    PADDING: '12px',
    BOTTOM_BORDER: '1px solid rgba(255,255,255,0.1)',
  },
  buttons: {
    FONT_SIZE: '1em',
    MIN_WIDTH: '50px',
  },
  job: {
    HIGHLIGHT: '#02C966',
    BUTTON_WIDTH: '45px',
    BUTTON_FONT_SIZE: '1em',
    BUTTON_SPACING: '5px',
  },
  properties: {
    LABEL_WIDTH: '200px',
    FIELD_WIDTH: '250px',
    LINE_SPACING: '1px',
  },
  ingredients: {
    ICON_VERTICAL_SPACING: '3px',   /* 16px + 3px * 2 + border * 2 = 24px */
    ICON_HORIZONTAL_SPACING: '3px',
    ICON_WIDTH: '16px',
    ICON_BORDER: '1px solid rgba(0,0,0,0)',
    NAME_WIDTH: '60%',
    QUANTITY_WIDTH: '15%',
    QUALITY_WIDTH: '15%',
    WEIGHT_WIDTH: '15%',
    DURABILITY_WIDTH: '15%',
    POINTS_WIDTH: '15%',
    STATS_COLUMN_FONT_SIZE: '1em',
    STATS_COLUMN_SPACING: '2px',
    DROPDOWN_HEIGHT: '270px',
  },
  output: {
    MIN_HEIGHT: '70px',
    MAX_HEIGHT: '105px',
  },
  input: {
    HEIGHT: '24px',
    COLOR: 'white',
    BACKGROUND: '#0D1B2A',
  },
  SPACE_BETWEEN_FIELDS: '5px',
};

export default opts;
