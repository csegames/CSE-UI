/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {Blueprint} from '../../lib/Blueprint';

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

  generateBlueprintItem = (bp: Blueprint) => {
    return (
      <li key={bp.id}
        onClick={() => this.props.selectBlueprint(bp) }
        onMouseOver={() => this.props.hoverBlueprint(bp) }
        onMouseOut={() => this.props.hoverBlueprint(null) }
        className={this.props.selected == bp ? 'active' : ''}
        >{bp.name}</li>
    )
  }
  generateBlueprintList(category: string, blueprints: Blueprint[]) {
    return (
      <div>
        <div className="category">{category}</div>
        <ul>
          {blueprints.map(this.generateBlueprintItem) }
        </ul>
      </div>
    );
  }

  generateCategories(categorizedBlueprints: { [key: string]: Blueprint[] }): JSX.Element[] {
    let elements: JSX.Element[] = [];
    for (let category in categorizedBlueprints)
      elements.push(this.generateBlueprintList(category, categorizedBlueprints[category]));
    return elements;
  }

  categorizeBlueprints(blueprints: Blueprint[]): { [key: string]: Blueprint[] } {
    let categorized: { [key: string]: Blueprint[] } = {};
    this.props.blueprints.forEach((bp: Blueprint) => {
      let categoryBps = categorized[bp.category];
      if (categoryBps == null) {
        categoryBps = [];
        categorized[bp.category] = categoryBps;
      }
      categoryBps.push(bp);
    });
    return categorized;
  }

  render() {
    //let categorizedBlueprints: { [key: string]: Blueprint[] } = this.categorizeBlueprints(this.props.blueprints);

    return (
      <div className='blueprints__list'>
        <ul>
          {this.props.blueprints.map(this.generateBlueprintItem) }
        </ul>
      </div>
    )
  }
}

export default BlueprintList;
