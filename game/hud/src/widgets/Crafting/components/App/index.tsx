/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 22:12:17
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-13 23:11:02
 */

import * as React from 'react';
import {connect} from 'react-redux';

import { slash } from '../../services/game/slash';
import { JobState, setJobType, addIngredient, setMessage } from '../../services/session/job';
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
  };
};

interface AppProps {
  dispatch?: (action: any) => void;
  job: JobState;
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
          set={this.setJob} start={this.startJob} collect={this.collectJob} cancel={this.clearJob}
          setQuality={this.setQuality} setName={this.setName} setRecipe={this.setRecipe}
          setTemplate={this.setTemplate}
          addIngredient={this.addIngredient}
          />
      </div>
    );
  }

  private selectType = (type: string) => {
    let error: string;
    const props = this.props;
    props.dispatch(setMessage(''));
    slash('cr vox setjob ' + type, (response: any) : boolean => {
      console.log('CRAFTING: cr vox setjob: ' + JSON.stringify(response));
      if (response.type === 'error') {
        error = response.text;
      }
      if (response.type === 'complete') {
        if (error) {
          console.log('CRAFTING: send error message: ' + error);
          props.dispatch(setMessage(error));
        } else {
          props.dispatch(setJobType(type));
          loadLists();
        }
        return false;
      }
    });
    function loadLists() {
      switch (type) {
        case 'make':
          getAllTemplates((type: string, templates: Template[]) => {
            props.dispatch(gotTemplate(type, templates));
          });
          break;
        default:
          getRecipeFor(type, (type: string, recipes: Recipe[]) => {
            props.dispatch(gotRecipe(type, recipes));
          });
      }
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
  private setRecipe = (recipe: Recipe) => this.props.dispatch(setRecipe(recipe));
  private setTemplate = (template: Template) => this.props.dispatch(setTemplate(template));

  // Ingredients
  private addIngredient = (item: InventoryItem, qty: number) => {
    this.props.dispatch(addIngredient(item, qty));
  }
}

export default connect(select)(App);
