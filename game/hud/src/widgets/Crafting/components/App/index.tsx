/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 22:12:17
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-12 00:22:14
 */

import * as React from 'react';
import {connect} from 'react-redux';

import { JobState, selectJobType, addIngredient } from '../../services/session/job';
import { gotRecipe } from '../../services/session/recipes';
import { gotTemplate } from '../../services/session/templates';
import { InventoryItem, Recipe, Template } from '../../services/types';
import { startJob, collectJob, clearJob,
        setQuality, setName, setRecipe, setTemplate } from '../../services/session/job';
import { getRecipeFor } from '../../services/session/recipes';
import { getAllTemplates } from '../../services/session/templates';

import JobType from '../../components/JobType';
import JobDetails from '../../components/JobDetails';

import { TemplatesState, RecipesState, GlobalState } from '../../services/session/reducer';

const select = (state: GlobalState): AppProps => {
  console.log('CRAFTING: select ui from state: ', state);
  return {
    job: state.job,
    recipes: state.recipes,
    templates: state.templates,
  };
};

interface AppProps {
  dispatch?: (action: any) => void;
  job: JobState;
  recipes: RecipesState;
  templates: TemplatesState;
}

class App extends React.Component<AppProps,{}> {
  public render() {
    const props = this.props;
    console.log('CRAFTING: render App: props=', props);
    const type = props.job && props.job.type;
    return (
      <div className='crafting-ui'>
        <JobType job={type} changeType={this.selectType}/>
        <JobDetails job={props.job}
          recipes={props.recipes}
          templates={props.templates}
          set={this.setJob} start={this.startJob} collect={this.collectJob} cancel={this.clearJob}
          setQuality={this.setQuality} setName={this.setName} setRecipe={this.setRecipe}
          setTemplate={this.setTemplate}
          addIngredient={this.addIngredient}
          />
      </div>
    );
  }

  private selectType = (type: string) => {
    this.props.dispatch(selectJobType(type));
    switch (type) {
      case 'make':
        getAllTemplates((type: string, templates: Template[]) => {
          this.props.dispatch(gotTemplate(type, templates));
        });
        break;
      default:
        getRecipeFor(type, (type: string, recipes: Recipe[]) => {
          this.props.dispatch(gotRecipe(type, recipes));
        });
    }
  }

  // Crafting job modes
  private setJob = () => { /* done when selecting type */ };
  private startJob = () => this.props.dispatch(startJob());
  private collectJob = () => this.props.dispatch(collectJob());
  private clearJob = () => this.props.dispatch(clearJob());

  // Job properties
  private setQuality = (quality: number) => this.props.dispatch(setQuality(quality));
  private setName = (name: string) => this.props.dispatch(setName(name));
  private setRecipe = (id: string) => this.props.dispatch(setRecipe(id));
  private setTemplate = (id: string) => this.props.dispatch(setTemplate(id));

  // Ingredients
  private addIngredient = (item: InventoryItem, qty: number) => {
    this.props.dispatch(addIngredient(item, qty));
  }
}

export default connect(select)(App);
