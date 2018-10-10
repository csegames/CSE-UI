/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';

import { GlobalState } from '../../services/session/reducer';
import blueprintService from '../../services/session/requester';
import { BlueprintsState } from '../../services/session/blueprints';

import BlueprintList from '../BlueprintList';
import BlueprintSaveView from '../BlueprintSaveView';

import { BuildingItem, BuildingItemType } from '../../../../../../lib/BuildingItem';
import { fireBuildingItemSelected } from '../../../../../../services/events';

function select(state: GlobalState, ownProps: BlueprintsPaneOwnProps) {
  return {
    blueprintsState: state.blueprints,
  };
}

export interface BlueprintsPaneOwnProps {
  minimized: boolean;
  handlePreviewIcon: (icon: string) => void;
}

export interface BlueprintsPaneProps extends BlueprintsPaneOwnProps {
  dispatch: (action: any) => void;
  blueprintsState: BlueprintsState;
  minimized: boolean;
  handlePreviewIcon: (icon: string) => void;
}

export interface BlueprintsPaneState {
  filter: string;
  saveMode: boolean;
}

class BlueprintsPane extends React.Component<BlueprintsPaneProps, BlueprintsPaneState> {

  constructor(props: BlueprintsPaneProps) {
    super(props);
    this.state = { filter: '', saveMode: false };
  }

  public render() {
    const bpState: BlueprintsState = this.props.blueprintsState;

    return (
      <div className= 'BlueprintsPane' >
        <div className='item'>
          <div className='list'>
            <BlueprintList blueprints={bpState.blueprints}
              selected={bpState.selected}
              selectBlueprint={this.selectBlueprint}
              hoverBlueprint={this.hoverBlueprint}
              />
          </div>
        </div>
        <div className='item'>
          {this.createSaveAndDeleteButtons(bpState) }
        </div>
        <div className='item'>
          {this.createCopyPasteButtons(bpState) }
        </div>

        {this.createSaveView(bpState) }
      </div>
    );
  }

  private onBlueprintSelect = (blueprint: Blueprint) => {
    if (blueprint != null && blueprint.icon == null) {
      blueprintService.loadIcon(blueprint);
    }

    const item = {
      name: 'Blueprint',
      description: blueprint.name,
      element: (<img src={'data:image/png;base64,' + blueprint.icon}/>),
      id: blueprint.id + '-' + BuildingItemType.Blueprint,
      type: BuildingItemType.Blueprint,
      select: () => { this.selectBlueprint(blueprint); },

    } as BuildingItem;

    fireBuildingItemSelected(item);
  }

  private toggleSaveBlueprint = () => {
    this.setState((state, props) => ({ saveMode: !state.saveMode } as any));
  }

  private triggerCancelSave = () => {
    this.setState((state, props) => ({ saveMode: false } as any));
  }

  private triggerSaveBlueprint = (name: string) => {
    blueprintService.save(name);
    this.setState((state, props) => ({ saveMode: false } as any));
  }

  private triggerDeleteBlueprint = () => {
    blueprintService.remove(this.props.blueprintsState.selected);
  }

  private triggerCopyBlueprint = () => {
    blueprintService.copy();
  }

  private triggerPasteBlueprint = () => {
    blueprintService.paste();
  }

  private selectBlueprint = (blueprint: Blueprint) => {
    blueprintService.select(blueprint);
    this.onBlueprintSelect(blueprint);
  }

  private hoverBlueprint = (blueprint: Blueprint) => {
    if (blueprint != null && blueprint.icon == null) {
      blueprintService.loadIcon(blueprint);
    }

    this.props.handlePreviewIcon(blueprint ? blueprint.icon : null);
  }

  private createSaveView(bpState: BlueprintsState) {
    if (this.state.saveMode) {
      const blueprintNames: string[] = bpState.blueprints.map((bp: Blueprint) => { return bp.name; });
      return (<BlueprintSaveView
        onSave={(name: string) => this.triggerSaveBlueprint(name) }
        onCancel={() => this.triggerCancelSave() }
        reservedNames={blueprintNames}/>);
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


  private createSaveAndDeleteButtons(bpState: BlueprintsState) {
    return (
      <div className='save'>
        <button onClick={this.toggleSaveBlueprint} disabled={!bpState.copyable}>Save</button>
        <button onClick={this.triggerDeleteBlueprint} disabled={bpState.selected == null}>Delete</button>
      </div>
    );
  }

  private createCopyPasteButtons(bpState: BlueprintsState) {
    return (
      <div className='copy'>
        <button onClick={this.triggerCopyBlueprint} disabled={!bpState.copyable}>Copy</button>
        <button onClick={this.triggerPasteBlueprint} disabled={!bpState.pastable}>Paste</button>
      </div>
    );
  }
}

export default connect(select)(BlueprintsPane);
