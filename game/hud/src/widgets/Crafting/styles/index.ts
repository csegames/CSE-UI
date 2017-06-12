/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-23 19:38:35
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-12 22:35:24
 */

export { StyleSheet, css } from 'aphrodite';
export { merge } from 'lodash';
import opts from './opts';

/*
 * General Styles: Styles used here and there, rather than for specific components
 */

export interface ButtonStyles {
  container: React.CSSProperties;
  inherited: React.CSSProperties;
}

export const button = {
  container: {
    pointerEvents: 'auto',
    marginRight: opts.SPACE_BETWEEN_FIELDS,
    fontSize: opts.buttons.FONT_SIZE,
    minWidth: opts.buttons.MIN_WIDTH,
    padding: 0,
  },
  /*
  inherited: {
    // don't actually use these atm, they are inherited from #hud button CSS styles
    // just added them here for future reference.
    display: 'inline-block',
    margin: '5px 5px 0px 0px',
    border: '1px solid #4b4642',
    color: '#756c67',
    background: 'linear-gradient(to top, black, #2C2C2C)',
    boxShadow: 'inset black 0px 0px 20px',
    textAlign: 'center',
    textTransform: 'uppercase',
    position: 'relative',
    '-webkit-filter': 'brightness(0.8)',
    transition: 'all 0.2s ease-in-out',
  },
  */
};

export interface CloseStyles {
  container: React.CSSProperties;
}

export const close = {
  container: {
    pointerEvents: 'auto',
    position: 'absolute',
    right: '4px',
    cursor: 'pointer',
  },
};

export interface InputStyles {
  container: React.CSSProperties;
  input: React.CSSProperties;
  adjuster: React.CSSProperties;
  button: React.CSSProperties;
}

export const input = {
  container: {
    display: 'inline-flex',
  },
  input: {
    pointerEvents: 'auto',
    marginRight: opts.SPACE_BETWEEN_FIELDS,
    width: 'auto',    /* TODO: WTF IS THE GAME CLIENT PLAYING AT */
    height: opts.input.HEIGHT,
    margin: '0',
    padding: '0 5px',
    border: '0',
    color: opts.input.COLOR,
    backgroundColor: opts.input.BACKGROUND,
  },
  adjuster: {
    display: 'inline-block',
    height: opts.input.HEIGHT,
  },
  button: {
    cursor: 'pointer',
    height: '12px',
    fontSize: '10px',
    width: '8px',
    textAlign: 'center',
    lineHeight: '10px',
    border: '1px solid ' + opts.input.BACKGROUND,
    boxSizing: 'border-box',
  },
};

/*
 * Component Styles: Styles for specific components
 */

export interface CraftingStyles {
  container: React.CSSProperties;
  loading: React.CSSProperties;
}

export const craftingStyles: CraftingStyles = {
  container: {              // main UI window (App)
    pointerEvents: 'auto',
    backgroundImage: 'url(images/crafting/crafting-bg.png)',
    color: 'white',
    width: opts.ui.WIDTH,
    height: opts.ui.HEIGHT,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    userSelect: 'none',
  },
  loading: {
    flex: '1 1 auto',
    textAlign: 'center',
    lineHeight: '100%',
  },
};

export interface LabelStyles {
  container: React.CSSProperties;
}

export const labelStyles: LabelStyles = { // A label (Label)
  container: {
    cursor: 'default',
    display: 'inline-block',
    flex: '0 0 auto',
    marginRight: opts.SPACE_BETWEEN_FIELDS,
  },
};

export interface VoxInfoStyles {
  container: React.CSSProperties;
  span: React.CSSProperties;
}

export const voxInfo: VoxInfoStyles = {
  container: {
    fontSize: '8px',
    color: 'silver',
    margin: '0 ' + opts.ui.PADDING,
    position: 'absolute',
    top: '2px',
    left: '0',
  },
  span: {
    marginRight: '1em',
  },
};

export interface JobTypeStyles {
  container: React.CSSProperties;
  jobButtons: React.CSSProperties;
  button: React.CSSProperties;
  buttonSelected: React.CSSProperties;
  refresh: React.CSSProperties;
  tools: React.CSSProperties;
  crafting: React.CSSProperties;
}

export const jobType: JobTypeStyles = {
  container: {
    flex: '0 1 auto',
    margin: opts.ui.PADDING,
    marginBottom: 0,
  },
  jobButtons: {
    display: 'inline-block',
  },
  button: {
    fontSize: opts.job.BUTTON_FONT_SIZE,
    minWidth: opts.job.BUTTON_WIDTH,
    letterSpacing: opts.job.BUTTON_LETTER_SPACING,
    marginRight: opts.job.BUTTON_SPACING,
  },
  buttonSelected: {
    fontWeight: 'bold',
    color: opts.job.HIGHLIGHT,
  },
  refresh: {
    minWidth: '20px',
  },
  tools: {
    float: 'right',
    padding: '0 0.5em',
  },
  crafting: {
    padding: '0 0.5em',
  },
};

export interface VoxMessageStyles {
  container: React.CSSProperties;
  success: React.CSSProperties;
  error: React.CSSProperties;
  none: React.CSSProperties;
}

export const voxMessage: VoxMessageStyles = {
  container: {
    margin: '0px',
    flex: '0 1 auto',
    fontSize: '14px',
  },
  success: {
    color: 'lime',
  },
  error: {
    color: 'red',
  },
  none: {
  },
};

export interface ToolsStyles {
  container: React.CSSProperties;
  section: React.CSSProperties;
  sectionHeading: React.CSSProperties;
  button: React.CSSProperties;
}

export const tools: ToolsStyles = {
  container: {
    flex: '1 1 auto',
    lineHeight: '100%',
    padding: '0 1em',
  },
  section: {
    marginBottom: '0.5em',
  },
  sectionHeading: {
    marginTop: '0.5em',
    fontSize: '100%',
    borderBottom: opts.ui.BOTTOM_BORDER,
  },
  button: {
    padding: '2px 0.5em',
  },
};

export interface PossibleIngredientsStyles {
  container: React.CSSProperties;
  span: React.CSSProperties;
  icon: React.CSSProperties;
  name: React.CSSProperties;
  quantity: React.CSSProperties;
  quality: React.CSSProperties;
  weight: React.CSSProperties;
  select: React.CSSProperties;
  select_impl: React.CSSProperties;
  select_list: React.CSSProperties;
}

export const possibleIngredients: PossibleIngredientsStyles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    height: opts.input.HEIGHT,
  },
  span: {
    display: 'inline-block',
  },
  icon: {
    flex: '0 0 ' + opts.ingredients.ICON_WIDTH,
    border: opts.ingredients.ICON_BORDER,
    height: opts.ingredients.ICON_WIDTH,
    width: opts.ingredients.ICON_WIDTH,
    margin: opts.ingredients.ICON_VERTICAL_SPACING + ' ' + opts.ingredients.ICON_HORIZONTAL_SPACING,
    marginLeft: 0,
  },
  name: {
    flex: '2 1 ' + opts.ingredients.NAME_WIDTH,
    overflow: 'hidden',
    height: '100%',
  },
  quantity: {
    flex: '1 1 ' + opts.ingredients.QUANTITY_WIDTH,
    textAlign: 'right',
    fontSize: opts.ingredients.STATS_COLUMN_FONT_SIZE,
    lineHeight: opts.input.HEIGHT,
    marginLeft: opts.ingredients.STATS_COLUMN_SPACING,
  },
  quality: {
    flex: '1 1 ' + opts.ingredients.QUALITY_WIDTH,
    textAlign: 'right',
    fontSize: opts.ingredients.STATS_COLUMN_FONT_SIZE,
    lineHeight: opts.input.HEIGHT,
    marginLeft: opts.ingredients.STATS_COLUMN_SPACING,
  },
  weight: {
    flex: '1 1 ' + opts.ingredients.WEIGHT_WIDTH,
    textAlign: 'right',
    fontSize: opts.ingredients.STATS_COLUMN_FONT_SIZE,
    lineHeight: opts.input.HEIGHT,
    marginLeft: opts.ingredients.STATS_COLUMN_SPACING,
  },
  select: {
    flex: '2 1 auto',
    minWidth: '250px',
    height: opts.input.HEIGHT,
  },
  select_impl: {
    backgroundColor: opts.input.BACKGROUND,
  },
  select_list: {
    maxHeight: '175px',
  },
};

export interface OutputItemsStyles {
  container: React.CSSProperties;
  title: React.CSSProperties;
  craftingTime: React.CSSProperties;
  item: React.CSSProperties;
  icon: React.CSSProperties;
  qty: React.CSSProperties;
  times: React.CSSProperties;
  name: React.CSSProperties;
}

export const outputItems: OutputItemsStyles = {
  container: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flex: '0 0 auto',
    fontSize: '100%',
    borderBottom: opts.ui.BOTTOM_BORDER,
    marginTop: '0.5em',
  },
  craftingTime: {
    float: 'right',
    display: 'inline-block',
  },
  item: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    flex: '0 0 ' + opts.ingredients.ICON_WIDTH,
    border: opts.ingredients.ICON_BORDER,
    height: opts.ingredients.ICON_WIDTH,
    width: opts.ingredients.ICON_WIDTH,
    margin: opts.ingredients.ICON_VERTICAL_SPACING + ' ' + opts.ingredients.ICON_HORIZONTAL_SPACING,
  },
  qty: {
    flex: '0 0 50px',
    width: '50px',
    textAlign: 'right',
  },
  times: {
    flex: '0 0 auto',
    margin: '0 0.5em',
  },
  name: {
    flex: '1 1 auto',
    minWidth: '120px',
  },
};

export interface IngredientsStyles {
  container: React.CSSProperties;
  title: React.CSSProperties;

  loadedIngredients: React.CSSProperties;
  remove: React.CSSProperties;

  addIngredient: React.CSSProperties;
  times: React.CSSProperties;
  add: React.CSSProperties;
  quantity: React.CSSProperties;
}

export const ingredients: IngredientsStyles = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    flex: '0 1 auto',
    fontSize: '100%',
    borderBottom: opts.ui.BOTTOM_BORDER,
    fontWeight: 'normal',
    marginTop: '0.5em',
  },

  loadedIngredients: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    marginTop: '5px',
    overflow: 'auto',
    overflowX: 'hidden',
    pointerEvents: 'auto',
    marginBottom: '0.5em',
  },
  remove: {
    flex: '0 1 auto',
    fontSize: '10px',
    color: 'deepskyblue',
  },

  addIngredient: {
    flex: '0 1 auto',
    display: 'flex',
    borderBottom: opts.ui.BOTTOM_BORDER,
    paddingBottom: '0.5em',
  },
  times: {
    flex: '0 1 auto',
    margin: '0 0.5em',
  },
  add: {
    flex: '0 1 150px',
    margin: '0 0 0 1em',
  },
  quantity: {
  },
};

export interface IngredientItemStyles {
  container: React.CSSProperties;
  inline: React.CSSProperties;
  icon: React.CSSProperties;
  qty: React.CSSProperties;
  times: React.CSSProperties;
  name: React.CSSProperties;
  pcnt: React.CSSProperties;
}

export const ingredientItem: IngredientItemStyles = {
  container: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
  },
  inline: {
    display: 'inline-block',
  },
  icon: {
    flex: '0 0 ' + opts.ingredients.ICON_WIDTH,
    border: opts.ingredients.ICON_BORDER,
    height: opts.ingredients.ICON_WIDTH,
    width: opts.ingredients.ICON_WIDTH,
    margin: opts.ingredients.ICON_VERTICAL_SPACING + ' ' + opts.ingredients.ICON_HORIZONTAL_SPACING,
  },
  qty: {
    flex: '0 0 50px',
    width: '50px',
    textAlign: 'right',
  },
  times: {
    flex: '0 0 auto',
    margin: '0 0.5em',
  },
  name: {
    flex: '1 1 auto',
    minWidth: '120px',
  },
  pcnt: {
    flex: '0 0 50px',
    width: '50px',
    margin: '0 0.5em 0 0.2em',
    color: 'rgba(255,255,255,0.3)',
  },
};

export interface JobDetailsStyles {
  container: React.CSSProperties;
  properties: React.CSSProperties;
  input: React.CSSProperties;
  buttons: React.CSSProperties;
  button: React.CSSProperties;
}

export const jobDetails: JobDetailsStyles = {
  container: {
    flex: '1 1 auto',
    margin: opts.ui.PADDING,
    display: 'flex',
    flexDirection: 'column',
  },
  properties: {
    display: 'block',
    flex: '0 1 auto',
  },
  input: {
    height: opts.input.HEIGHT,
    display: 'flex',
    flexDirection: 'row',
  },
  buttons: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    marginTop: opts.SPACE_BETWEEN_FIELDS,
  },
  button: {
    flex: '0 0 auto',
    margin: '0 0 0 ' + opts.SPACE_BETWEEN_FIELDS,
    minWidth: '75px',
  },
};


export interface QualityInputStyles {
  container: React.CSSProperties;
  input: React.CSSProperties;
  label: React.CSSProperties;
}

export const qualityInput: QualityInputStyles = {
  container: {
    height: opts.input.HEIGHT,
    display: 'flex',
    flexDirection: 'row',
    flex: '0 0 auto',
    marginRight: '10px',
  },
  input: {
    textAlign: 'right',
  },
  label: {
  },
};

export interface QuantityInputStyles {
  container: React.CSSProperties;
  input: React.CSSProperties;
  label: React.CSSProperties;
}

export const quantityInput: QuantityInputStyles = {
  container: {
    height: opts.input.HEIGHT,
    display: 'flex',
    flexDirection: 'row',
    flex: '0 0 auto',
    marginRight: '10px',
  },
  input: {
    textAlign: 'right',
  },
  label: {
  },
};

export interface NameInputStyles {
  container: React.CSSProperties;
  label: React.CSSProperties;
}

export const nameInput: NameInputStyles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: opts.properties.LINE_SPACING,
  },
  label: {
    width: opts.properties.LABEL_WIDTH,
  },
};

export interface RecipeSelectStyles {
  container: React.CSSProperties;
  label: React.CSSProperties;
  select: React.CSSProperties;
  select_impl: React.CSSProperties;
  select_list: React.CSSProperties;
}

export const recipeSelect: RecipeSelectStyles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: opts.properties.LINE_SPACING,
  },
  label: {
    width: opts.properties.LABEL_WIDTH,
  },
  select: {
    flex: '0 0 auto',
    minWidth: opts.properties.FIELD_WIDTH,
    height: opts.input.HEIGHT,
  },
  select_impl: {
    backgroundColor: opts.input.BACKGROUND,
  },
  select_list: {
    maxHeight: '175px',
  },
};

export interface TemplateSelectStyles {
  container: React.CSSProperties;
  label: React.CSSProperties;
  select: React.CSSProperties;
  select_impl: React.CSSProperties;
  select_list: React.CSSProperties;
}

export const templateSelect: TemplateSelectStyles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: opts.properties.LINE_SPACING,
  },
  label: {
    width: opts.properties.LABEL_WIDTH,
  },
  select: {
    flex: '0 0 auto',
    minWidth: opts.properties.FIELD_WIDTH,
    height: opts.input.HEIGHT,
  },
  select_impl: {
    backgroundColor: opts.input.BACKGROUND,
  },
  select_list: {
    maxHeight: '175px',
  },
};

export interface SelectStyles {
  container: React.CSSProperties;
  impl: React.CSSProperties;
  outside: React.CSSProperties;
  outsideHidden: React.CSSProperties;
  active: React.CSSProperties;
  list: React.CSSProperties;
  listHidden: React.CSSProperties;
  listItem: React.CSSProperties;
  listItemSelected: React.CSSProperties;
  arrow: React.CSSProperties;
}

export const select: SelectStyles = {
  container: {
    display: 'inline-block',
    minWidth: '200px',
  },
  impl: {
    width: '100%',
    height: '100%',
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row',
    backgroundColor: opts.input.BACKGROUND,
    pointerEvents: 'auto',
  },
  outside: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    zIndex: -1,
  },
  outsideHidden: {
    visibility: 'hidden',
  },
  active: {
    width: '100%',
    flex: '1 1 auto',
    color: '#ececec',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '0 0.5em',
  },
  list: {
    minWidth: '100%',
    position: 'absolute',
    left: 0,
    top: '100%',
    marginTop: '1px',
    color: '#ececec',
    backgroundColor: '#3a3a3a',
    cursor: 'pointer',
    overflow: 'auto',
    overflowX: 'hidden',
    maxHeight: opts.ingredients.DROPDOWN_HEIGHT,
    transition: 'max-height .1s ease-out',
  },
  listItem: {
    padding: '0 0.5em',
    height: '1.5em',
    position: 'relative',
    overflow: 'hidden',
    color: '#ececec',
    borderBottom: '1px solid #0a0a0a',
    ':hover': {
      backgroundColor: 'lighten(#3a3a3a, 10%)',
    },
  },
  listItemSelected: {
    background: '#5F5F5F',
  },
  listHidden: {
    maxHeight: '0px',
    overflow: 'hidden',
  },
  arrow: {
    padding: '0.1em',
    fontSize: '1.2em',
    lineHeight: '1.2em',
    textAlign: 'center',
    color: 'rgba(150, 150, 150, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
};
