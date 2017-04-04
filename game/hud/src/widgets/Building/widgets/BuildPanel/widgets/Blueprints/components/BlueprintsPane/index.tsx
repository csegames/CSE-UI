/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
const ReactSelect = require('react-select');

import {BuildingBlueprint} from 'camelot-unchained';

import {GlobalState} from '../../services/session/reducer';
import blueprintService from '../../services/session/requester';
import {BlueprintsState} from '../../services/session/blueprints';

import BlueprintList from '../BlueprintList';
import BlueprintSaveView from '../BlueprintSaveView';

import {BuildingItem, BuildingItemType} from '../../../../../../lib/BuildingItem';
import {fireBuildingItemSelected} from '../../../../../../services/events';

function select(state: GlobalState): BlueprintsPaneProps {
  return {
    blueprintsState: state.blueprints,
  }
}

export interface BlueprintsPaneStateToPropsInfo {
  blueprintsState?: BlueprintsState;
}

export interface BlueprintsPanePropsInfo {
  dispatch?: (action: any) => void;
  minimized?: boolean;
  handlePreviewIcon?: (icon: string) => void;
}

export type BlueprintsPaneProps = BlueprintsPaneStateToPropsInfo & BlueprintsPanePropsInfo;

export interface BlueprintsPaneState {
  filter: string;
  saveMode: boolean;
}

class BlueprintsPane extends React.Component<BlueprintsPaneProps, BlueprintsPaneState> {

  constructor(props: BlueprintsPaneProps) {
    super(props);
    this.state = { filter: '', saveMode: false }
  }

  onBlueprintSelect = (blueprint: BuildingBlueprint) => {
    if (blueprint != null && blueprint.icon == null)
      blueprintService.loadIcon(blueprint);

    const item = {
      name: "Blueprint",
      description: blueprint.name,
      element: (<img src={'data:image/png;base64,' + blueprint.icon}/>),
      id: blueprint.index + '-' + BuildingItemType.Blueprint,
      type: BuildingItemType.Blueprint,
      select: () => { this.selectBlueprint(blueprint) }

    } as BuildingItem;

    fireBuildingItemSelected(item);
  }


  onFilterChanged = (val: any) => {
    //adding the ',' so we can find the last item in the filter
    this.setState((state, props) => ({ filter: val + ',' } as any));
  }

  toggleSaveBlueprint = () => {
    this.setState((state, props) => ({ saveMode: !state.saveMode } as any));
  }

  triggerCancelSave = () => {
    this.setState((state, props) => ({ saveMode: false } as any));
  }

  triggerSaveBlueprint = (name: string) => {
    blueprintService.save(name);
    this.setState((state, props) => ({ saveMode: false } as any));
  }

  triggerDeleteBlueprint = () => {
    blueprintService.remove(this.props.blueprintsState.selected)
  }

  triggerCopyBlueprint = () => {
    blueprintService.copy();
  }

  triggerPasteBlueprint = () => {
    blueprintService.paste();
  }

  selectBlueprint = (blueprint: BuildingBlueprint) => {
    blueprintService.select(blueprint);
    this.onBlueprintSelect(blueprint);
  }

  hoverBlueprint = (blueprint: BuildingBlueprint) => {
    if (blueprint != null && blueprint.icon == null)
      blueprintService.loadIcon(blueprint);

    this.props.handlePreviewIcon( blueprint? blueprint.icon: null);
  }

  createSaveView(bpState: BlueprintsState) {
    if (this.state.saveMode) {
      const blueprintNames: string[] = bpState.blueprints.map((bp: BuildingBlueprint) => { return bp.name })
      return (<BlueprintSaveView
        onSave={(name: string) => this.triggerSaveBlueprint(name) }
        onCancel={() => this.triggerCancelSave() }
        reservedNames={blueprintNames}/>)
    }
    return null;
  }

  /*
    createFilterPane(bpState: BlueprintsState) {
      const categories = this.getBlueprintCategories(bpState.blueprints);
      const options = categories.map((cat: string) => {
        return { value: cat, label: cat }
      });
  
      return (
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
      );
    }
  
    filterBlueprints(blueprints: BuildingBlueprint[]) {
      if (this.state.filter != '' && this.state.filter != null) {
        return blueprints.filter((blueprint: BuildingBlueprint): boolean => {
          return this.state.filter.indexOf(blueprint.category + ',') >= 0;
        });
      }
      return blueprints;
    }
  
    getBlueprintCategories(blueprints: BuildingBlueprint[]): string[] {
      const categoryMap: { [key: string]: boolean } = {};
      const categories: string[] = [];
      blueprints.forEach((bp: BuildingBlueprint) => {
        const exists: boolean = categoryMap[bp.category];
        if (!exists) {
          categoryMap[bp.category] = true;
          categories.push(bp.category);
        }
      });
      return categories;
    }
  */


  createSaveAndDeleteButtons(bpState: BlueprintsState) {
    return (
      <div className="save">
        <button onClick={this.toggleSaveBlueprint} disabled={!bpState.copyable}>Save</button>
        <button onClick={this.triggerDeleteBlueprint} disabled={bpState.selected == null}>Delete</button>
      </div>
    );
  }

  createCopyPasteButtons(bpState: BlueprintsState) {
    return (
      <div className="copy">
        <button onClick={this.triggerCopyBlueprint} disabled={!bpState.copyable}>Copy</button>
        <button onClick={this.triggerPasteBlueprint} disabled={!bpState.pastable}>Paste</button>
      </div>
    );
  }

  render() {
    const bpState: BlueprintsState = this.props.blueprintsState;

    return (
      <div className= 'BlueprintsPane' >
        <div className="item">
          <div className="list">
            <BlueprintList blueprints={bpState.blueprints}
              selected={bpState.selected}
              selectBlueprint={this.selectBlueprint}
              hoverBlueprint={this.hoverBlueprint}
              />
          </div>
        </div>
        <div className="item">
          {this.createSaveAndDeleteButtons(bpState) }
        </div>
        <div className="item">
          {this.createCopyPasteButtons(bpState) }
        </div>

        {this.createSaveView(bpState) }
      </div>
    )
  }
}

export default connect<BlueprintsPaneStateToPropsInfo, {}, BlueprintsPanePropsInfo>(select)(BlueprintsPane);
