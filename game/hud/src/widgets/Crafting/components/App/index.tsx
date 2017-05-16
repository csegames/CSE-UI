/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 22:12:17
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-16 22:44:31
 */

import * as React from 'react';
import {connect} from 'react-redux';

import { slash } from '../../services/game/slash';
import { JobState, setLoading, setJobType, addIngredient, removeIngredient, setMessage } from '../../services/session/job';
import { getRecipeFor, gotRecipe } from '../../services/session/recipes';
import { getAllTemplates, gotTemplate } from '../../services/session/templates';
import { InventoryItem, Recipe, Template, VoxStatus } from '../../services/types';
import { startJob, collectJob, clearJob, cancelJob,
        setQuality, setCount, setName, setRecipe, setTemplate, getStatus, gotStatus } from '../../services/session/job';
import JobType from '../../components/JobType';
import JobDetails from '../../components/JobDetails';
import VoxMessage from '../VoxMessage';
import VoxInfo from '../VoxInfo';

import { TemplatesState, RecipesState, GlobalState } from '../../services/session/reducer';

const select = (state: GlobalState): AppProps => {
  console.log('CRAFTING: select job from state: ' + JSON.stringify(state.job));
  return {
    job: state.job,
  };
};

interface AppProps {
  dispatch?: (action: any) => void;
  job: JobState;
}

class App extends React.Component<AppProps,{}> {

  public componentDidMount() {
    this.refresh();
  }

  public render() {
    const props = this.props;
    console.log('CRAFTING: render App: props=', props);
    const type = props.job && props.job.type;
    return (
      <div className='crafting-ui'>
        <VoxInfo/>
        <JobType job={type} changeType={this.selectType} clearJob={this.clearJob} refresh={this.refresh} />
        <VoxMessage/>
        { this.props.job.loading
          ? <div className='loading'>Preparing for your performance ...</div>
          : <JobDetails job={props.job}
              set={this.setJob} start={this.startJob}
              collect={this.collectJob}
              cancel={this.cancelJob}
              setQuality={this.setQuality}
              setCount={this.setCount}
              setName={this.setName} setRecipe={this.setRecipe}
              setTemplate={this.setTemplate}
              addIngredient={this.addIngredient}
              removeIngredient={this.removeIngredient}
            />
        }
      </div>
    );
  }

  private refresh = () => {
    const props = this.props;
    getStatus((response: any) => {
      if (response.errors) {
        const errors = response.errors.join('\n');
        props.dispatch(setMessage({ type: 'error', message: errors }));
      } else if (response.status) {
        props.dispatch(gotStatus(response.status));
        if (response.status.type) {
          this.loadLists(response.status.type);
        }
      }
    });
  }

  private selectType = (type: string) => {
    const props = this.props;
    props.dispatch(setLoading(true));
    props.dispatch(setMessage({ type: '', message: '' }));
    slash('cr vox setjob ' + type, (response: any) => {
      console.log('CRAFTING: cr vox setjob: ' + JSON.stringify(response));
      if (response.errors) {
        const errors = response.errors.join('\n');
        console.log('CRAFTING: send error message: ' + errors);
        props.dispatch(setMessage({ type: 'error', message: errors }));
        props.dispatch(setLoading(false));
      } else {
        props.dispatch(setJobType(type));
        props.dispatch(setMessage({ type: 'success', message: 'Job type selected' }));
        this.loadLists(type);
      }
    });
  }

  private loadLists = (job: string) => {
    const props = this.props;
    switch (job) {
      case 'make':
        getAllTemplates((type: string, templates: Template[]) => {
          props.dispatch(gotTemplate(type, templates));
          props.dispatch(setLoading(false));
        });
        break;
      default:
        getRecipeFor(job, (type: string, recipes: Recipe[]) => {
          props.dispatch(gotRecipe(type, recipes));
          props.dispatch(setLoading(false));
        });
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

  // Clear current crafting job
  private cancelJob = () => {
    this.slash('cr vox cancel', 'Job Cancelled', () => cancelJob());
  }

  // Job properties
  private setQuality = (quality: number) => {
    this.slash('cr vox setquality ' + quality, 'Quality set to: ' + quality, () => setQuality(quality));
  }

  private setCount = (count: number) => {
    this.slash('cr vox setitemcount ' + count, 'Item Count set to: ' + count, () => setCount(count));
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
      'cr vox addingredientbyid ' + item.id + ' ' + qty,
      'Added ingredient: ' + qty + ' x ' + item.name,
      () => addIngredient(item, qty),
      );
  }
  private removeIngredient = (item: InventoryItem) => {
    this.slash(
      'cr vox removeingredient',
      'Ingredient: ' + item.name + ' removed',
      () => removeIngredient(item),
      );
  }

}

export default connect(select)(App);
