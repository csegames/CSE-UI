/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-13 18:10:57
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-11 17:55:01
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';
import { Template } from '../../services/types';
import { StyleSheet, css, merge, templateSelect, TemplateSelectStyles } from '../../styles';

export interface TemplateSelectReduxProps {
  dispatch?: (action: any) => void;
  items?: Template[];
  selected?: Template;
  status?: string;
}

export interface TemplateSelectProps extends TemplateSelectReduxProps {
  onSelect: (template: Template) => void;
  style?: Partial<TemplateSelectStyles>;
}

interface TemplateSelectState {}

const select = (state: GlobalState, props: TemplateSelectProps) : TemplateSelectReduxProps => {
  const items = state.templates.templates;
  return {
    items,
    selected: state.job.template,
    status: state.job.status,
  };
};

class TemplateSelect extends React.Component<TemplateSelectProps, TemplateSelectState>{
  constructor(props: TemplateSelectProps) {
    super(props);
  }
  public render() {
    const ss = StyleSheet.create(merge({}, templateSelect, this.props.style));
    const i = this.props.selected ? this.props.items.findIndex((i: Template) => this.props.selected.id === i.id) : -1;
    const selectedItem = i > -1 ? this.props.items[i] : null;
    return (
      <div className={'template-select ' + css(ss.container)}>
        <Label style={{container: templateSelect.label}}>Template</Label>
        <Select
          disabled={this.props.status !== 'Configuring'}
          style={{container: templateSelect.select, impl: templateSelect.select_impl, list: templateSelect.select_list}}
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
