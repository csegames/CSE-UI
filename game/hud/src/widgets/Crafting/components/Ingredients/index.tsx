/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-06 16:09:59
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-15 21:48:51
 */

import * as React from 'react';
import {connect} from 'react-redux';
import { GlobalState } from '../../services/session/reducer';
import { Ingredient } from '../../services/types';
import IngredientItem from '../IngredientItem';
import RepairItem from '../RepairItem';
import PossibleIngredients from '../PossibleIngredients';
import Select from '../Select';
import Input from '../Input';
import Label from '../Label';
import Button from '../Button';
import { StyleSheet, css, merge, ingredients as ingredientsStyles, IngredientsStyles} from '../../styles';

import { InventoryItem } from '../../services/types';

export interface IngredientsPropsRedux {
  dispatch?: any;
  ingredients?: Ingredient[];
  havePossibleIngredients?: boolean;
  status?: string;
  job?: string;
  loading?: boolean;
}

export interface IngredientsProps extends IngredientsPropsRedux{
  add: (ingredient: Ingredient, qty: number) => void;
  remove: (ingredient: Ingredient) => void;
  style?: Partial<IngredientsStyles>;
}

const select = (state: GlobalState, props: IngredientsProps): IngredientsPropsRedux => {
  const job = state.job;
  const possibleIngredients = job.possibleIngredients;
  return {
    job: job.type,
    status: job.status,
    ingredients: job.ingredients,
    havePossibleIngredients: !!(possibleIngredients && possibleIngredients.length),
    loading: state.job.loading,
  };
};

export interface IngredientsState {
  selectedIngredient: Ingredient;
  qty: number;
}

class Ingredients extends React.Component<IngredientsProps, IngredientsState> {
  constructor(props: IngredientsProps) {
    super(props);
    this.state = { selectedIngredient: null, qty: 1 };
  }

  public render() {
    const ss = StyleSheet.create(merge({}, ingredientsStyles, this.props.style));
    const props = this.props;

    if (!props.job) return null;
    const ingredients = {};
    const isRepair = this.props.job === 'repair';

    // Select inventory item
    const select = (ingredient: Ingredient) => {
      this.setState({ selectedIngredient: ingredient });
    };

    // Render inventory item
    const render = (item: InventoryItem) => <div>{item.name}</div>;

    // ingredient qty
    const onChange = (value: string) => {
      this.setState({ qty: ((value as any) | 0) || 1 });
    };

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
    const ready = this.state.selectedIngredient && this.state.qty > 0
                  && this.state.qty <= this.state.selectedIngredient.stats.unitCount;
    const qtyok = this.state.selectedIngredient && this.state.selectedIngredient.stats.unitCount > 0;
    const configuring = this.props.status === 'Configuring';

    let addIngredients;
    if (props.loading) {
      addIngredients = (
        <div className={'add-ingredient ' + css(ss.addIngredient)}>
          ... loading
        </div>
      );
    } else {
      if (props.havePossibleIngredients) {
        addIngredients = (
          <div className={'add-ingredient ' + css(ss.addIngredient)}>
            <PossibleIngredients disabled={!configuring} selectedItem={this.state.selectedIngredient} onSelect={select}/>
            <span className={css(ss.times)}>x</span>
            <Input style={{input: ingredientsStyles.quantity}}
              numeric={true} min={1}
              disabled={!qtyok} onChange={onChange} size={3} value={this.state.qty.toString()} />
            <Button disabled={!ready} style={{container: ingredientsStyles.add}}
              onClick={this.addIngredient}>Add</Button>
          </div>
        );
      }
    }

    return (
      <div className={'ingredients ' + css(ss.container)}>
        <h1 className={css(ss.title)}>Ingredients...</h1>
        {addIngredients}
        <div className={'loaded-ingredients ' + css(ss.loadedIngredients)}>
          <div>{loaded}</div>
          { last
            ? <Button style={{container: ingredientsStyles.remove}}
                disabled={!configuring} onClick={() => props.remove(last)}>
                <i className='remove fa fa-times'></i> Remove Last
              </Button>
            : undefined }
        </div>
      </div>
    );
  }

  private addIngredient = () => {
    const { selectedIngredient, qty } = this.state;
    this.props.add(selectedIngredient, qty);
    this.setState({ selectedIngredient: null, qty: 1 });
  }
}

export default connect(select)(Ingredients);
