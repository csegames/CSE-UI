/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 22:12:17
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-04 23:13:28
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {events, client, jsKeyCodes} from 'camelot-unchained';

import { slash } from '../../services/game/slash';
import { setLoading, setJobType, setMessage,
         addIngredient, removeIngredient } from '../../services/session/job';
import { getAllTemplates, gotTemplate } from '../../services/session/templates';
import { InventoryItem, Recipe, Template, SlashVoxStatus } from '../../services/types';
import { startJob, collectJob, clearJob, cancelJob,
        setQuality, setCount, setName, setRecipe, setTemplate } from '../../services/session/job';
import { setUIMode, setCountdown } from '../../services/session/ui';

// To Be Phasing out / Obsolete - remove eventually
import { updateStatus } from '../../services/session/job';

// Updated Game API - Using GraphQL and WebAPI
import { voxGetStatus, voxGetPossibleIngredients, VoxIngredient,
        voxGetTemplates, VoxTemplate, voxGetRecipesFor, VoxRecipe } from '../../services/game/crafting';
import { gotVoxStatus, gotVoxPossibleIngredients } from '../../services/session/job';
import { gotVoxTemplates } from '../../services/session/templates';
import { gotVoxRecipes } from '../../services/session/recipes';

import JobType from '../../components/JobType';
import JobDetails from '../../components/JobDetails';
import VoxMessage from '../VoxMessage';
import VoxInfo from '../VoxInfo';
import Tools from '../Tools';
import Close from '../Close';

import { StyleSheet, css, merge, craftingStyles, CraftingStyles } from '../../styles';

import { UIState, JobState, TemplatesState, RecipesState, GlobalState } from '../../services/session/reducer';

const select = (state: GlobalState): AppProps => {
  return {
    uiMode: state.ui.mode,
    job: state.job,
  };
};

interface AppProps {
  dispatch?: (action: any) => void;
  job: JobState;
  uiMode: string;
  style?: Partial<CraftingStyles>;
}

interface AppState {
  open: boolean;
}

class App extends React.Component<AppProps,AppState> {

  constructor(props: AppProps) {
    super(props);
    this.state = { open: true };
  }

  public render() {
    if (!this.state.open) {
      console.warn('Crafting UI not open, render null');
      return null;
    }
    const ss = StyleSheet.create(merge({}, craftingStyles, this.props.style));
    const props = this.props;
    const type = props.job && props.job.type;

    let jobUI;
    let toolsUI;

    switch (this.props.uiMode) {
      case 'crafting':
        jobUI = this.props.job.loading
          ? <div className={css(ss.loading)}>Preparing for your performance ...</div>
          : <JobDetails job={props.job}
              start={this.startJob}
              collect={this.collectJob}
              cancel={this.cancelJob}
              setQuality={this.setQuality}
              setCount={this.setCount}
              setName={this.setName} setRecipe={this.setRecipe}
              setTemplate={this.setTemplate}
              addIngredient={this.addIngredient}
              removeIngredient={this.removeIngredient}
            />;
        break;
      case 'tools':
        toolsUI = (
          <Tools harvest={this.harvest} harvestInfo={this.harvestInfo} nearby={this.nearby}/>
        );
        break;
    }

    return (
      <div ref='crafting' className={css(ss.container)}>
        <Close onClose={this.close}/>
        <VoxInfo/>
        <JobType
          mode={this.props.uiMode}
          job={type}
          changeType={this.selectType}
          clearJob={this.clearJob}
          refresh={this.refresh}
          toggle={this.toggle}
        />
        <VoxMessage/>
        {jobUI}
        {toolsUI}
      </div>
    );
  }

  public componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    // Captureing input on mouseover gives a terrible user interface,
    // its bloody annoying
    // const div: HTMLDivElement = this.refs['crafting'] as HTMLDivElement;
    // div.addEventListener('mouseenter', this.capture);
    // div.addEventListener('mouseleave', this.release);
  }

  private componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    // Captureing input on mouseover gives a terrible user interface,
    // its bloody annoying
    // const div: HTMLDivElement = this.refs['crafting'] as HTMLDivElement;
    // div.removeEventListener('mouseenter', this.capture);
    // div.removeEventListener('mouseleave', this.release);
  }

  private close = () => {
    events.fire('hudnav--navigate', 'crafting');
    this.release();
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.which === jsKeyCodes.ESC) {
      this.close();
    }
  }

  private capture = () => {
    // console.log('CRAFTING: request input ownership');
    // client.RequestInputOwnership();
  }

  private release = () => {
    // console.log('CRAFTING: release input ownership');
    // client.ReleaseInputOwnership();
  }

  private refresh = () => {
    const props = this.props;

    // GraphQL: get vox status
    voxGetStatus().then((status: any) => {
      props.dispatch(gotVoxStatus(status));
      props.dispatch(setMessage({ type: 'success', message: 'VOX Status: ' + status.jobState }));
      if (status.jobType) {
        this.loadLists(status.jobType);
      }
    }).catch((message: string) => {
        props.dispatch(setMessage({ type: 'error', message }));
    });
  }

  private toggle = () => {
    this.props.dispatch(setUIMode(this.props.uiMode === 'tools' ? 'crafting' : 'tools'));
    this.props.dispatch(setMessage({ type: 'success', message: '' }));
  }

  private selectType = (type: string) => {
    const props = this.props;
    props.dispatch(setLoading(true));
    props.dispatch(setMessage({ type: '', message: '' }));
    slash('cr vox setjob ' + type, (response: any) => {
      if (response.errors) {
        const errors = response.errors.join('\n');
        props.dispatch(setMessage({ type: 'error', message: errors }));
        props.dispatch(setLoading(false));
      } else {
        props.dispatch(setJobType(type));
        if (response.status) props.dispatch(updateStatus(response.status));
        props.dispatch(setMessage({ type: 'success', message: 'Job type selected' }));
        this.loadLists(type);
      }
    });
  }

  private loadLists = (job: string) => {
    const props = this.props;

    function getRecipes() {
      switch (job) {
        case 'make':
          voxGetTemplates()
            .then((templates: VoxTemplate[]) => {
              props.dispatch(gotVoxTemplates(templates));
              props.dispatch(setLoading(false));
            })
            .catch(() => {
              props.dispatch(setMessage({ type: 'error', message: 'Could not load templates' }));
              props.dispatch(setLoading(false));
            });
          break;
        default:
          voxGetRecipesFor(job)
            .then((recipes: VoxRecipe[]) => {
              props.dispatch(gotVoxRecipes(job, recipes));
              props.dispatch(setLoading(false));
            })
            .catch(() => {
              props.dispatch(setMessage({ type: 'error', message: `Could not load ${job} recipes` }));
              props.dispatch(setLoading(false));
            });
      }
    }

    voxGetPossibleIngredients()
      .then((ingredients: VoxIngredient[]) => {
        props.dispatch(gotVoxPossibleIngredients(ingredients));
        getRecipes();
      })
      .catch(() => {
        props.dispatch(setMessage({ type: 'error', message: 'Failed to get vox ingredients' }));
      });
  }

  // Generic, issue a / command, deal with response
  private slash(command: string, success: string, getAction?: () => any, errorAction?: () => any) {
    const props = this.props;
    slash(command, (response: any) => {
      if (response.errors) {
        if (errorAction) props.dispatch(errorAction());
        props.dispatch(setMessage({ type: 'error', message: response.errors[0] }));
      } else {
        if (getAction) props.dispatch(getAction());
        if (response.status) props.dispatch(updateStatus(response.status));
        props.dispatch(setMessage({ type: 'success', message: success }));
      }
    });
  }

  // Crafting job modes
  private startJob = () => {
    setTimeout(() => {
      this.slash('cr vox startjob', 'Job Started', () => startJob());
    }, 500);
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
    this.slash('cr vox setquality ' + quality, 'Quality set to: ' + quality,
      () => setQuality(quality),
      () => setQuality(undefined),
    );
  }

  private setCount = (count: number) => {
    this.slash('cr vox setitemcount ' + count, 'Item Count set to: ' + count,
      () => setCount(count),
      () => setCount(undefined),
    );
  }

  private setName = (name: string) => {
    this.slash('cr vox setname "' + name + '"', 'Name set to: ' + name,
      () => setName(name),
      () => setName(undefined),
    );
  }

  private setRecipe = (recipe: Recipe) => {
    this.slash('cr vox setrecipe ' + recipe.id, 'Recipe set to: ' + recipe.name,
      () => setRecipe(recipe),
      () => setRecipe(undefined),
    );
  }

  private setTemplate = (template: Template) => {
    this.slash('cr vox settemplate ' + template.id, 'Template set to: ' + template.name,
      () => setTemplate(template),
      () => setTemplate(undefined),
    );
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

  private nearby = (range: number) => {
    this.slash('cr nearby ' + range, 'Check the System Tab!');
  }

  private harvest = () => {
    this.slash('harvest', 'Check your Inventory!');
    let countdown = 10;
    const tick = () => {
      this.props.dispatch(setCountdown(countdown));
      if (countdown > 0) {
        setTimeout(() => { countdown--; tick(); }, 1000);
      }
    };
    tick();
  }
  private harvestInfo = () => {
    this.slash('harvestdetails', 'Check the System Tab!');
  }
}

export default connect(select)(App);
