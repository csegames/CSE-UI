/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 18:10:57
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-16 21:04:34
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';
import { Template } from '../../services/types';

export interface TemplateSelectReduxProps {
  dispatch?: (action: any) => void;
  items?: Template[];
  selected?: Template;
}

export interface TemplateSelectProps extends TemplateSelectReduxProps {
  onSelect: (template: Template) => void;
  type: string;
}

interface TemplateSelectState {}

const select = (state: GlobalState, props: TemplateSelectProps) : TemplateSelectReduxProps => {
  const items = state.templates[props.type];
  return {
    items,
    selected: state.job.template,
  };
};

class TemplateSelect extends React.Component<TemplateSelectProps, TemplateSelectState>{
  constructor(props: TemplateSelectProps) {
    super(props);
  }
  public render() {
    const i = this.props.selected ? this.props.items.findIndex((i: Template) => this.props.selected.id === i.id) : -1;
    const selectedItem = i > -1 ? this.props.items[i] : null;
    const type = this.props.type;
    return (
      <div className={['select-template', type].join(' ')}>
        <Label>{type[0].toUpperCase() + type.substr(1)} Template</Label>
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
  private renderActive = (item: Template) => item && <span key={item.id} value={item.id}>{item.name}</span>;
  private renderItem = (item: Template) => item && <span key={item.id} value={item.id}>{item.name}</span>;
  private onSelect = (item: Template) => this.props.onSelect(item);
}

export default connect(select)(TemplateSelect);
