/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export { StyleSheet, css } from 'aphrodite';
export { merge } from 'lodash';
import opts from './opts';

/*
 * General Styles: Styles used here and there, rather than for specific components
 */

export interface ButtonStyles {
  button: React.CSSProperties;
}

export const button: ButtonStyles = {
  button: {
    pointerEvents: 'auto',
    marginRight: opts.SPACE_BETWEEN_FIELDS,
    fontSize: opts.buttons.FONT_SIZE,
    minWidth: opts.buttons.MIN_WIDTH,
    padding: 0,
  },
};

export interface CloseStyles {
  close: React.CSSProperties;
}

export const close: CloseStyles = {
  close: {
    pointerEvents: 'auto',
    position: 'absolute',
    top: 0,
    right: '4px',
    cursor: 'pointer',
    height: '16px',
    lineHeight: '11px',
    fontSize: '22px',
  },
};

export interface MinimizeStyles {
  minimize: React.CSSProperties;
  minimized: React.CSSProperties;
  maximized: React.CSSProperties;
}

export const minimize: MinimizeStyles = {
  minimize: {
    pointerEvents: 'auto',
    position: 'absolute',
    top: 0,
    right: '16px',
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    opacity: 0.7,
    backgroundPosition: 'center',
    backgroundSize: '100%',
  },
  minimized: {
    backgroundImage: 'url(images/crafting/minimize.png)',
  },
  maximized: {
    backgroundImage: 'url(images/crafting/maximize.png)',
  },
};

export interface InputStyles {
  input: React.CSSProperties;
  field: React.CSSProperties;
  adjuster: React.CSSProperties;
  button: React.CSSProperties;
}

export const input: InputStyles = {
  input: {
    display: 'inline-flex',
  },
  field: {
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

export interface AppStyles {
  app: React.CSSProperties;
  loading: React.CSSProperties;
  minimized: React.CSSProperties;
  minimizedButton: React.CSSProperties;
  minimizedIcons: React.CSSProperties;
}

export const app: AppStyles = {
  app: {              // main UI window (App)
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
  minimized: {
    width: '65%',
    left: '35%',
    height: opts.ui.MINIMIZED_HEIGHT,
    marginTop: opts.ui.MINIMIZED_POSITION,
    background: 'rgba(0,0,0,0.7)',
  },
  minimizedIcons: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40px',
    height: '17px',
    margin: '2px',
  },
  minimizedButton: {
    fontSize: '10px',
    width: '30px',
    display: 'inline-block',
    margin: '2px',
    height: '16px',
    position: 'absolute',
    right: '40px',
    top: 0,
  },
  loading: {
    flex: '1 1 auto',
    textAlign: 'center',
    lineHeight: '100%',
  },
};

export interface LabelStyles {
  label: React.CSSProperties;
}

export const labelStyles: LabelStyles = { // A label (Label)
  label: {
    cursor: 'default',
    display: 'inline-block',
    flex: '0 0 auto',
    marginRight: opts.SPACE_BETWEEN_FIELDS,
  },
};

export interface VoxInfoStyles {
  voxInfo: React.CSSProperties;
  span: React.CSSProperties;
}

export const voxInfo: VoxInfoStyles = {
  voxInfo: {
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
  jobType: React.CSSProperties;
  jobButtons: React.CSSProperties;
  button: React.CSSProperties;
  buttonSelected: React.CSSProperties;
  refresh: React.CSSProperties;
  tools: React.CSSProperties;
  crafting: React.CSSProperties;
}

export const jobType: JobTypeStyles = {
  jobType: {
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
  voxMessage: React.CSSProperties;
  success: React.CSSProperties;
  error: React.CSSProperties;
  none: React.CSSProperties;
}

export const voxMessage: VoxMessageStyles = {
  voxMessage: {
    margin: '0px',
    flex: '0 1 auto',
    fontSize: '14px',
    position: 'relative',
    height: '20px',
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
  tools: React.CSSProperties;
  section: React.CSSProperties;
  sectionHeading: React.CSSProperties;
  button: React.CSSProperties;
}

export const tools: ToolsStyles = {
  tools: {
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
    height: opts.input.HEIGHT,
  },
};

export interface PossibleSlotsStyles {
  possibleSlots: React.CSSProperties;
  select: React.CSSProperties;
  select_impl: React.CSSProperties;
  select_list: React.CSSProperties;
}

export const possibleSlots: PossibleSlotsStyles = {
  possibleSlots: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  select: {
    flex: '0 1 75px',
    minWidth: '75px',
    height: opts.input.HEIGHT,
  },
  select_impl: {
    backgroundColor: opts.input.BACKGROUND,
  },
  select_list: {
    maxHeight: '175px',
  },
};

export interface PossibleIngredientsStyles {
  possibleIngredients: React.CSSProperties;
  span: React.CSSProperties;
  icon: React.CSSProperties;
  name: React.CSSProperties;
  quantity: React.CSSProperties;
  quality: React.CSSProperties;
  weight: React.CSSProperties;
  durability: React.CSSProperties;
  points: React.CSSProperties;
  select: React.CSSProperties;
  select_impl: React.CSSProperties;
  select_list: React.CSSProperties;
}

export const possibleIngredients: PossibleIngredientsStyles = {
  possibleIngredients: {
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
  durability: {
    flex: '1 1 ' + opts.ingredients.DURABILITY_WIDTH,
    textAlign: 'right',
    fontSize: opts.ingredients.STATS_COLUMN_FONT_SIZE,
    lineHeight: opts.input.HEIGHT,
    marginLeft: opts.ingredients.STATS_COLUMN_SPACING,
  },
  points: {
    flex: '1 1 ' + opts.ingredients.POINTS_WIDTH,
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
  outputItems: React.CSSProperties;
  title: React.CSSProperties;
  craftingTime: React.CSSProperties;
  item: React.CSSProperties;
  icon: React.CSSProperties;
  qty: React.CSSProperties;
  times: React.CSSProperties;
  name: React.CSSProperties;
}

export const outputItems: OutputItemsStyles = {
  outputItems: {
    flex: '0 1 120px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: opts.output.MIN_HEIGHT,
    maxHeight: opts.output.MAX_HEIGHT,
    overflow: 'auto',
  },
  title: {
    flex: '0 0 auto',
    fontSize: '100%',
    borderBottom: opts.ui.BOTTOM_BORDER,
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
  ingredients: React.CSSProperties;
  loadedIngredients: React.CSSProperties;
  remove: React.CSSProperties;
  addIngredient: React.CSSProperties;
  ingredient: React.CSSProperties;
  times: React.CSSProperties;
  add: React.CSSProperties;
  quantity: React.CSSProperties;
  message: React.CSSProperties;
}

export const ingredients: IngredientsStyles = {
  ingredients: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  loadedIngredients: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    overflowX: 'hidden',
    pointerEvents: 'auto',
    margin: 0,
  },
  remove: {
    flex: '0 0 auto',
    fontSize: '10px',
    color: 'deepskyblue',
    minHeight: '20px',
  },

  addIngredient: {
    flex: '0 0 auto',
    display: 'flex',
    borderBottom: opts.ui.BOTTOM_BORDER,
    paddingBottom: '0.5em',
  },
  ingredient: {
    display: 'flex',
    flex: '1 1 auto',
    marginLeft: '0.5em',
  },
  times: {
    flex: '0 1 auto',
    margin: '0 0.5em',
  },
  add: {
    flex: '0 1 50px',
    margin: '0 0 0 1em',
  },
  quantity: {
  },
  message: {
    paddingLeft: '1em',
  },
};

export interface IngredientItemStyles {
  ingredientItem: React.CSSProperties;
  inline: React.CSSProperties;
  icon: React.CSSProperties;
  slot: React.CSSProperties;
  qty: React.CSSProperties;
  times: React.CSSProperties;
  name: React.CSSProperties;
  pcnt: React.CSSProperties;
}

export const ingredientItem: IngredientItemStyles = {
  ingredientItem: {
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
  slot: {
    flex: '0 0 50px',
    width: '50px',
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

export interface RepairItemStyles {
  repairItem: React.CSSProperties;
  inline: React.CSSProperties;
  icon: React.CSSProperties;
  name: React.CSSProperties;
  durability: React.CSSProperties;
  points: React.CSSProperties;
}

export const repairItem: RepairItemStyles = {
  repairItem: {
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
  name: {
    flex: '1 1 auto',
    minWidth: '120px',
  },
  durability: {
    flex: '1 1 auto',
  },
  points: {
    flex: '1 1 auto',
  },
};


export interface JobDetailsStyles {
  jobDetails: React.CSSProperties;
  properties: React.CSSProperties;
  ingredients: React.CSSProperties;
  input: React.CSSProperties;
  buttons: React.CSSProperties;
  button: React.CSSProperties;
}

export const jobDetails: JobDetailsStyles = {
  jobDetails: {
    flex: '1 1 auto',
    margin: opts.ui.PADDING,
    display: 'flex',
    flexDirection: 'column',
  },
  properties: {
    display: 'block',
    flex: '0 0 auto',
  },
  ingredients: {
    display: 'flex',
    flex: '0 0 290px',
    flexDirection: 'column',
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
  qualityInput: React.CSSProperties;
  input: React.CSSProperties;
  label: React.CSSProperties;
}

export const qualityInput: QualityInputStyles = {
  qualityInput: {
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
  quantityInput: React.CSSProperties;
  input: React.CSSProperties;
  label: React.CSSProperties;
}

export const quantityInput: QuantityInputStyles = {
  quantityInput: {
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
  nameInput: React.CSSProperties;
  label: React.CSSProperties;
}

export const nameInput: NameInputStyles = {
  nameInput: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: opts.properties.LINE_SPACING,
  },
  label: {
    width: opts.properties.LABEL_WIDTH,
  },
};

export interface RecipeSelectStyles {
  recipeSelect: React.CSSProperties;
  label: React.CSSProperties;
  select: React.CSSProperties;
  select_impl: React.CSSProperties;
  select_list: React.CSSProperties;
}

export const recipeSelect: RecipeSelectStyles = {
  recipeSelect: {
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
  select: React.CSSProperties;
  impl: React.CSSProperties;
  outside: React.CSSProperties;
  outsideHidden: React.CSSProperties;
  active: React.CSSProperties;
  list: React.CSSProperties;
  listHidden: React.CSSProperties;
  listItem: any;
  listItemSelected: React.CSSProperties;
  arrow: any;
}

export const select: SelectStyles = {
  select: {
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
    flex: '0 0 auto',
    alignItems: 'center',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },
};

export interface ProgressBarStyles {
  progressBar: React.CSSProperties;
}

export const progressBar: ProgressBarStyles = {
  progressBar: {
    backgroundColor: 'lime',
    height: '21px',
    position: 'absolute',
    bottom: 0,
    opacity: 0.4,
    transition: 'all 1s linear',
  },
};
