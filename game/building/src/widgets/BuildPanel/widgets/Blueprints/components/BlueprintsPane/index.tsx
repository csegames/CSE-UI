/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
var ReactSelect = require('react-select');

import {GlobalState} from '../../services/session/reducer';
import * as blueprintService from '../../services/session/blueprints';
import {BlueprintsState} from '../../services/session/blueprints';
import {Blueprint} from '../../lib/Blueprint';

import BlueprintList from '../BlueprintList';
import BlueprintSaveView from '../BlueprintSaveView';

import {BuildingItem, BuildingItemType} from '../../../../../../lib/BuildingItem'

function select(state: GlobalState): BlueprintsPaneProps {
  return {
    blueprintsState: state.blueprints,
  }
}

export interface BlueprintsPaneProps {
  dispatch?: (action: any) => void;
  blueprintsState?: BlueprintsState;
  minimized?: boolean;
  onItemSelect?: (item: BuildingItem)=>void;
}

export interface BlueprintsPaneState {
  filter: string;
  saveMode: boolean;
  hoverItem: Blueprint;
}

class BlueprintsPane extends React.Component<BlueprintsPaneProps, BlueprintsPaneState> {

  constructor(props: BlueprintsPaneProps) {
    super(props);
    this.state = { filter: '', saveMode: false, hoverItem: null }
  }

  onBlueprintSelect = (blueprint: Blueprint) => {
    const item = {
      name: "Blueprint",
      description: blueprint.name,
      icon: 'data:image/png;base64,' + blueprint.icon,
      type: BuildingItemType.Blueprint
    } as BuildingItem;

    this.props.onItemSelect(item);
  }


  onFilterChanged = (val: any) => {
    //adding the ',' so we can find the last item in the filter
    this.setState({ filter: val + ',' } as any);
  }

  filterBlueprints(blueprints: Blueprint[]) {
    if (this.state.filter != '' && this.state.filter != null) {
      return blueprints.filter((blueprint: Blueprint): boolean => {
        return this.state.filter.indexOf(blueprint.category + ',') >= 0;
      });
    }
    return blueprints;
  }

  getBlueprintCategories(blueprints: Blueprint[]): string[] {
    let categoryMap: { [key: string]: boolean } = {};
    let categories: string[] = [];
    blueprints.forEach((bp: Blueprint) => {
      let exists: boolean = categoryMap[bp.category];
      if (!exists) {
        categoryMap[bp.category] = true;
        categories.push(bp.category);
      }
    });
    return categories;
  }

  toggleSaveBlueprint = () => {
    this.setState({ saveMode: !this.state.saveMode } as any)
  }

  triggerCancelSave = () => {
    this.setState({ saveMode: false } as any)
  }

  triggerSaveBlueprint = (name: string) => {
    blueprintService.saveBlueprint(name)
    this.setState({ saveMode: false } as any);
  }

  triggerDeleteBlueprint = () => {
    blueprintService.deleteBlueprint(this.props.blueprintsState.selected)
  }

  triggerCopyBlueprint = () => {
    blueprintService.copyBlueprint();
  }

  triggerPasteBlueprint = () => {
    blueprintService.pasteBlueprint();
  }
  
  selectBlueprint = (blueprint: Blueprint) => {
    blueprintService.selectBlueprint(blueprint);
    this.onBlueprintSelect(blueprint);
  }

  hoverBlueprint = (blueprint: Blueprint) => {
    if (blueprint != null && blueprint.icon == null)
      blueprintService.loadBlueprintIcon(blueprint);

    this.setState({ hoverItem: blueprint } as BlueprintsPaneState);
  }
  
  render() {
    let bpState: BlueprintsState = this.props.blueprintsState;
    /*
      let categories = this.getBlueprintCategories(bpState.blueprints);
      let options = categories.map((cat: string) => {
        return { value: cat, label: cat }
      });
        <div className='BlueprintsPane__filter'>
          <div className='BlueprintsPane__filter__select'>
            <ReactSelect name='form-field-name'
              placeholder='filter...'
              value={this.state.filter}
              options={options}
              onChange={this.onFilterChanged}
              multi
              simpleValue
              />
          </div>
        </div>
    */

    let saveView: JSX.Element = null;
    if (this.state.saveMode) {
      let blueprintNames: string[] = bpState.blueprints.map((bp: Blueprint) => { return bp.id })
      saveView = (<BlueprintSaveView
        onSave={(name: string) => this.triggerSaveBlueprint(name) }
        onCancel={() => this.triggerCancelSave() }
        reservedNames={blueprintNames}/>)
    }

    let hoverView: JSX.Element = null;
    if (this.state.hoverItem != null && this.state.hoverItem.icon != null) {
      hoverView = <div className="blueprint-preview-panel"><img src={`data:image/png;base64, ${this.state.hoverItem.icon}`} /></div>
    }    

    return (
      <div className='BlueprintsPane'>

        <BlueprintList blueprints={this.filterBlueprints(bpState.blueprints) }
          selected={bpState.selected}
          selectBlueprint={this.selectBlueprint}
          hoverBlueprint={this.hoverBlueprint}
          />

        <button onClick={this.toggleSaveBlueprint} disabled={!bpState.copyable}>Save</button>
        <button onClick={this.triggerDeleteBlueprint} disabled={bpState.selected == null}>Delete</button>

        <button onClick={this.triggerCopyBlueprint} disabled={!bpState.copyable}>Copy</button>
        <button onClick={this.triggerPasteBlueprint} disabled={!bpState.pastable}>Paste</button>
        {saveView}
        {hoverView}
      </div >
    )
  }
}

export default connect(select)(BlueprintsPane);

