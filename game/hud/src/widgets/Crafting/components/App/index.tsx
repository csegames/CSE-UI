/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 22:12:17
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-14 22:53:47
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
import VoxMessage from '../VoxMessage';

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
        <JobType job={type} changeType={this.selectType} clearJob={this.clearJob}/>
        <VoxMessage/>
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
    const props = this.props;
    props.dispatch(setMessage({ type: '', message: '' }));
    slash('cr vox setjob ' + type, (response: any) => {
      console.log('CRAFTING: cr vox setjob: ' + JSON.stringify(response));
      if (response.errors) {
        const errors = response.errors.join('\n');
        console.log('CRAFTING: send error message: ' + errors);
        props.dispatch(setMessage({ type: 'error', message: errors }));
      } else {
        props.dispatch(setJobType(type));
        props.dispatch(setMessage({ type: 'success', message: 'Job type selected' }));
        loadLists();
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

  // Generic, issue a / command, deal with response
  private slash(command: string, success: string, getAction?: () => any) {
    const props = this.props;
    slash(command, (response: any) => {
      if (response.errors) {
        const errors = response.errors.join('\n');
        props.dispatch(setMessage({ type: 'error', message: errors }));
      } else {
        if (getAction) props.dispatch(getAction());
        props.dispatch(setMessage({ type: 'success', message: success }));
      }
    });
  }

  // Crafting job modes
  private setJob = () => {
    this.props.dispatch(setMessage({ type: 'error', message: 'TODO: Dont think we need this!' }));
  }

  private startJob = () => {
    this.slash('cr vox startjob', 'Job Started', () => startJob());
  }

  private collectJob = () => {
    this.slash('cr vox collect', 'Job Collected', () => collectJob());
  }

  // Clear current crafting job
  private clearJob = () => {
    this.slash('cr vox clearjob', 'Job Cleared', () => clearJob());
  }

  // Job properties
  private setQuality = (quality: number) => {
    this.slash('cr vox setquality ' + quality, 'Quality set to: ' + quality, () => setQuality(quality));
  }

  private setName = (name: string) => {
    this.slash('cr vox setname ' + name, 'Name set to: ' + name, () => setName(name));
  }

  private setRecipe = (recipe: Recipe) => {
    this.slash('cr vox setrecipe ' + recipe.id, 'Recipe set to: ' + recipe.name, () => setRecipe(recipe));
  }

  private setTemplate = (template: Template) => {
    this.slash('cr vox settemplate ' + template.id, 'Template set to: ' + template.name, () => setTemplate(template));
  }

  // Ingredients
  private addIngredient = (item: InventoryItem, qty: number) => {
    this.slash(
      'cr vox addingredient ' + item.id + ' #' + qty,
      'Add ingredient: ' + qty + ' x ' + item.name,
      () => addIngredient(item, qty),
      );
  }
}

export default connect(select)(App);
