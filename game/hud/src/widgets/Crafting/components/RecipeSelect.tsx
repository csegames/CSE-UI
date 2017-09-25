/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 16:11:24
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-31 20:52:21
 */

import * as React from 'react';
import {connect} from 'react-redux';
import Select from './Select';
import Label from './Label';
import {GlobalState} from '../services/session/reducer';
import {Recipe} from '../services/types';
import {StyleSheet, css, merge, recipeSelect, RecipeSelectStyles} from '../styles';

export interface RecipeSelectReduxProps {
  type?: string;
  items?: Recipe[];
  selected?: Recipe;
  status?: string;
  style?: Partial<RecipeSelectStyles>;
}

export interface RecipeSelectProps extends RecipeSelectReduxProps {
  onSelect: (recipe: Recipe) => void;
  dispatch: (action: any) => void;
}

interface RecipeSelectState {}

const select = (state: GlobalState, props: RecipeSelectProps): RecipeSelectReduxProps => {
  return {
    type: state.job.type,
    items: state.recipes[state.job.type],
    selected: state.job.recipe,
    status: state.job.status,
  };
};

class RecipeSelect extends React.Component<RecipeSelectProps, RecipeSelectState>{
  constructor(props: RecipeSelectProps) {
    super(props);
  }
  public render() {
    const ss = StyleSheet.create(merge({}, recipeSelect, this.props.style));
    if (!this.props.items) return null;    // no items, don't render
    const i = this.props.selected ? this.props.items.findIndex((i: Recipe) => this.props.selected.id === i.id) : -1;
    const selectedItem = i > -1 ? this.props.items[i] : null;
    const type = this.props.type;
    return (
      <div className={css(ss.recipeSelect)}>
        <Label style={{label: recipeSelect.label}}>
          {type[0].toUpperCase() + type.substr(1)} Recipe
        </Label>
        <Select
          disabled={this.props.status !== 'Configuring'}
          style={{select: recipeSelect.select, impl: recipeSelect.select_impl, list: recipeSelect.select_list}}
          items={this.props.items}
          renderListItem={this.renderItem}
          renderActiveItem={this.renderActive}
          onSelectedItemChanged={this.onSelect}
          selectedItem={selectedItem}
          />
      </div>
    );
  }
  private renderActive = (item: Recipe) => item && <span key={item.id}>{item.name}</span>;
  private renderItem = (item: Recipe) => item && <span key={item.id}>{item.name}</span>;
  private onSelect = (item: Recipe) => this.props.onSelect(item);
}

export default connect(select)(RecipeSelect);
