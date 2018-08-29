/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { client, soundEvents } from '@csegames/camelot-unchained';
import { GlobalState } from '../services/session/reducer';
import { Ingredient, Recipe } from '../services/types';
import { setMessage } from '../services/session/job';
import IngredientItem from './IngredientItem';
import RepairItem from './RepairItem';
import PossibleIngredients from './PossibleIngredients';
import PossibleSlots from './PossibleSlots';
import Input from './Input';
import Button from './Button';
import { StyleSheet, cssAphrodite, merge, ingredients as ingredientsStyles, IngredientsStyles } from '../styles';

export interface IngredientsPropsRedux {
  dispatch?: (action: any) => void;
  job?: string;
  status?: string;
  ingredients?: Ingredient[];
  recipe?: Recipe;
  possibleSlots?: string[];
  selectedSlot?: string;
  possibleIngredients?: Ingredient[];
}

export interface IngredientsProps extends IngredientsPropsRedux {
  selectSlot: (slot: string) => void;
  add: (ingredient: Ingredient, qty: number) => void;
  remove: (ingredient: Ingredient) => void;
  style?: Partial<IngredientsStyles>;
  dispatch: (action: any) => void;
}

const select = (state: GlobalState, props: IngredientsProps): IngredientsPropsRedux => {
  const job = state.job;
  return {
    job: job.type,
    status: job.status,
    recipe: job.recipe,
    ingredients: job.ingredients,
    possibleSlots: job.possibleItemSlots,
    selectedSlot: job.slot,
    possibleIngredients: job.possibleIngredientsForSlot,
  };
};

export interface IngredientsState {
  selectedIngredient: Ingredient;
  qty: number;
}

class Ingredients extends React.Component<IngredientsProps, IngredientsState> {
  constructor(props: IngredientsProps) {
    super(props);
    this.state = {
      selectedIngredient: null,
      qty: 1,
    };
  }

  public render() {
    const ss = StyleSheet.create(merge({}, ingredientsStyles, this.props.style));
    const props = this.props;

    if (!props.job) return null;
    const ingredients = {};
    const isRepair = this.props.job === 'repair';

    let totalQty = 0;
    props.ingredients.forEach((ingredient: Ingredient) => {
      totalQty += ingredient.qty;
    });

    // show already loaded ingredients
    const loaded = props.ingredients.map((ingredient: Ingredient, i: number) => {
      ingredients[ingredient.id] = ingredient;
      return isRepair
        ? <RepairItem key={i} ingredient={ingredient} />
        : <IngredientItem key={i} ingredient={ingredient} qty={ingredient.qty} total={totalQty} />;
    });

    const last = props.ingredients.length && props.ingredients[props.ingredients.length - 1];

    const { selectedIngredient, qty } = this.state;
    const ready = selectedIngredient && qty > 0 && qty <= selectedIngredient.stats.unitCount;
    const qtyok = selectedIngredient && selectedIngredient.stats.unitCount > 0;
    const configuring = this.props.status === 'Configuring';

    let addIngredients;
    if (!props.possibleSlots) {
      // If no recipe selected, thats why we have no slots, so only
      // display loading message if we have a recipe selected.
      if (props.recipe) {
        // waiting for slots to load
        addIngredients = (
          <div className={cssAphrodite(ss.addIngredient)}>
            {/* loading possible ingredients... */}
          </div>
        );
      }
    } else {
      let possible;
      if (!props.possibleIngredients) {
        if (props.selectedSlot) {
          // no ingredients, but slot selected, ingredients are being loaded
          possible = (
            <div className={cssAphrodite(ss.message) + ' ingredients-searching'}>
              {/* Searching bags for possible ingredients ... */}
            </div>
          );
        } else {
          possible = (
            <div className={cssAphrodite(ss.message) + ' ingredients-pick-a-slot'}>
              { '<< pick a slot' }
            </div>
          );
        }
      } else {
        if (props.possibleIngredients.length) {
          possible = (
            <div className={cssAphrodite(ss.ingredient) + ' ingredients-select-ingredient'}>
              <PossibleIngredients
                dispatch={this.props.dispatch}
                disabled={!configuring}
                selectedItem={selectedIngredient}
                onSelect={this.select}
              />
              <span className={cssAphrodite(ss.times)}>x</span>
              <span style={ !qtyok ? { opacity: 0.3 } : {} }>
                <Input
                  name='add-qty'
                  style={{ input: ingredientsStyles.quantity }}
                  numeric={true} min={1}
                  disabled={!qtyok}
                  onChange={this.onChange}
                  size={3}
                  value={this.state.qty.toString()}
                />
              </span>
              <Button disabled={!ready} style={{ button: ingredientsStyles.add }} onClick={this.addIngredient}>Add</Button>
            </div>
          );
        } else {
          props.dispatch(setMessage({ type: 'error', message: 'could not find any suitable ingredients for this slot' }));
        }
      }
      addIngredients = (
        <div className={cssAphrodite(ss.addIngredientWrapper)}>
          <div>Select ingredients to load into Vox</div>
          <div className={cssAphrodite(ss.addIngredient) + ' ingredients-add'}>
            <PossibleSlots
              dispatch={this.props.dispatch}
              disabled={!configuring}
              selectedItem={props.selectedSlot}
              onSelect={this.selectSlot}
            />
            {possible}
          </div>
        </div>
      );
    }

    return (
      <div className={cssAphrodite(ss.ingredients) + ' ingredients'}>
        {addIngredients}
        <div className={cssAphrodite(ss.loadedIngredients) + ' ingreadients-already-loaded'}>
          <div>Loaded Ingredients</div>
          <div>{loaded}</div>
          { last
            ? <Button
                style={{ button: ingredientsStyles.remove }}
                disabled={!configuring}
                onClick={() => this.removeIngredient(last)}
              >
                <i className='remove fa fa-times'></i> Remove Last
              </Button>
            : undefined }
        </div>
      </div>
    );
  }

  private addIngredient = () => {
    const { selectedIngredient, qty } = this.state;
    client.PlaySoundEvent(soundEvents.PLAY_UI_VOX_ADDINGREDIENT);
    this.props.add(selectedIngredient, qty);
    this.setState({ selectedIngredient: null, qty: 1 });
  }

  private removeIngredient = (last: Ingredient) => {
    this.props.remove(last);
    client.PlaySoundEvent(soundEvents.PLAY_UI_VOX_REMOVELAST);
  }

  private select = (ingredient: Ingredient) => {
    // Select inventory item
    this.setState({ selectedIngredient: ingredient });
  }

  private selectSlot = (slot: string) => {
    // Selected slot.  Selecting a slot first clears the current ingredients
    this.props.selectSlot(slot);
  }

  private onChange = (value: string) => {
    // ingredient qty
    this.setState({ qty: ((value as any) | 0) || 1 });
  }
}

export default connect(select)(Ingredients);
