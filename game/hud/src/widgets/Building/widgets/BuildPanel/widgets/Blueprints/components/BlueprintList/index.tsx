/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface BlueprintListProps {
  blueprints: Blueprint[];
  selected: Blueprint;
  selectBlueprint: (blueprint: Blueprint) => void;
  hoverBlueprint: (blueprint: Blueprint) => void;
}

export interface BlueprintListState {
}

class BlueprintList extends React.Component<BlueprintListProps, BlueprintListState> {

  constructor(props: BlueprintListProps) {
    super(props);
    this.state = { hoverIcon: null };
  }

  public render() {
    // const categorizedBlueprints:
    //  { [key: string]: BuildingBlueprint[] } = this.categorizeBlueprints(this.props.blueprints);

    return (
      <div className='blueprints__list'>
        <ul>
          {this.props.blueprints.map(this.generateBlueprintItem) }
        </ul>
      </div>
    );
  }

  private generateBlueprintItem = (bp: Blueprint) => {
    return (
      <li key={bp.name}
        onClick={() => this.props.selectBlueprint(bp) }
        onMouseOver={() => this.props.hoverBlueprint(bp) }
        onMouseOut={() => this.props.hoverBlueprint(null) }
        className={this.props.selected === bp ? 'active' : ''}
        >{bp.name}</li>
    );
  }
/*
  generateCategories(categorizedBlueprints: { [key: string]: BuildingBlueprint[] }): JSX.Element[] {
    const elements: JSX.Element[] = [];
    for (let category in categorizedBlueprints) {
      elements.push(this.generateBlueprintList(category, categorizedBlueprints[category]));
    }
    return elements;
  }

  categorizeBlueprints(blueprints: BuildingBlueprint[]): { [key: string]: BuildingBlueprint[] } {
    const categorized: { [key: string]: BuildingBlueprint[] } = {};
    this.props.blueprints.forEach((bp: BuildingBlueprint) => {
      let categoryBps = categorized[bp.category];
      if (categoryBps == null) {
        categoryBps = [];
        categorized[bp.category] = categoryBps;
      }
      categoryBps.push(bp);
    });
    return categorized;
  }
*/
}

export default BlueprintList;
