/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 16:11:24
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-16 21:04:25
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';
import { Recipe } from '../../services/types';

export interface RecipeSelectReduxProps {
  dispatch?: (action: any) => void;
  type?: string;
  items?: Recipe[];
  selected?: Recipe;
}

export interface RecipeSelectProps extends RecipeSelectReduxProps {
  onSelect: (recipe: Recipe) => void;
}

interface RecipeSelectState {}

const select = (state: GlobalState, props: RecipeSelectProps) : RecipeSelectReduxProps => {
  return {
    type: state.job.type,
    items: state.recipes[state.job.type],
    selected: state.job.recipe,
  };
};

class RecipeSelect extends React.Component<RecipeSelectProps, RecipeSelectState>{
  constructor(props: RecipeSelectProps) {
    super(props);
  }
  public render() {
    if (!this.props.items) return null;    // no items, don't render
    const i = this.props.selected ? this.props.items.findIndex((i: Recipe) => this.props.selected.id === i.id) : -1;
    const selectedItem = i > -1 ? this.props.items[i] : null;
    const type = this.props.type;
    return (
      <div className={['select-recipe', type].join(' ')}>
        <Label>{type[0].toUpperCase() + type.substr(1)} Recipe</Label>
        <Select
          items={this.props.items}
          renderListItem={this.renderItem}
          renderActiveItem={this.renderActive}
          onSelectedItemChanged={this.onSelect}
          selectedItem={selectedItem}
          />
      </div>
    );
  }
  private renderActive = (item: Recipe) => item && <span key={item.id} value={item.id}>{item.name}</span>;
  private renderItem = (item: Recipe) => item && <span key={item.id} value={item.id}>{item.name}</span>;
  private onSelect = (item: Recipe) => this.props.onSelect(item);
}

export default connect(select)(RecipeSelect);
