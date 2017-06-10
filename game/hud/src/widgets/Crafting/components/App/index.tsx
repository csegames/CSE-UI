/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 22:12:17
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-10 22:35:49
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {events, client, jsKeyCodes, webAPI} from 'camelot-unchained';

// Types
import { InventoryItem, Recipe, Template, SlashVoxStatus, Ingredient } from '../../services/types';
import { VoxIngredient, VoxTemplate, VoxRecipe, VoxResponse } from '../../services/game/crafting';
import { UIState, JobState, TemplatesState, RecipesState, GlobalState } from '../../services/session/reducer';

// Helpers
import { slash } from '../../services/game/slash';

// Actions
import {
  setLoading, setJobType, setMessage, addIngredient, removeIngredient,
  startJob, collectJob, clearJob, cancelJob, setQuality, setStatus, setCount,
  setName, setRecipe, setTemplate, gotVoxStatus, gotVoxPossibleIngredients,
  gotOutputItems,
} from '../../services/session/job';
import { setUIMode, setCountdown } from '../../services/session/ui';
import { gotVoxTemplates } from '../../services/session/templates';
import { gotVoxRecipes } from '../../services/session/recipes';

// Updated Game API - Using GraphQL and WebAPI
import {
  voxGetStatus, voxGetPossibleIngredients, voxGetTemplates, voxGetRecipesFor,
  setVoxJob, startVoxJob, collectVoxJob, clearVoxJob, cancelVoxJob,
  setVoxQuality, setVoxItemCount, setVoxName, setVoxRecipe, setVoxTemplate,
  addVoxIngredient, removeVoxIngredient,
} from '../../services/game/crafting';

// Components
import JobType from '../JobType';
import JobDetails from '../JobDetails';
import VoxInfo from '../VoxInfo';
import Tools from '../Tools';
import Close from '../Close';

// Styles
import { StyleSheet, css, merge, craftingStyles, CraftingStyles } from '../../styles';

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

  private waitTimer: any;

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
      <div ref='crafting' className={'app ' + css(ss.container)}>
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
        {jobUI}
        {toolsUI}
      </div>
    );
  }

  public componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    // Captureing input on mouseover gives a terrible user experience,
    // const div: HTMLDivElement = this.refs['crafting'] as HTMLDivElement;
    // div.addEventListener('mouseenter', this.capture);
    // div.addEventListener('mouseleave', this.release);
    this.refresh();
  }

  private componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    // Captureing input on mouseover gives a terrible user experience,
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
    client.RequestInputOwnership();
  }

  private release = () => {
    client.ReleaseInputOwnership();
  }

  private refresh = () => {
    const props = this.props;

    // GraphQL: get vox status
    voxGetStatus().then((status: any) => {
      props.dispatch(gotVoxStatus(status));
      props.dispatch(setMessage({ type: 'success', message: 'VOX Status: ' + status.jobState }));
      props.dispatch(gotOutputItems(status.outputItems));
      if (status.jobType) {
        this.loadLists(status.jobType);
      }
    }).catch((message: string) => {
        props.dispatch(setMessage({ type: 'error', message }));
    });
  }

  private updateStatus = (callback?: (status: any) => void) => {
    const props = this.props;
    voxGetStatus().then((status: any) => {
      props.dispatch(gotVoxStatus(status));
      if (callback) callback(status);
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

    setVoxJob(type)
      .then((resonse: any) => {
        props.dispatch(setJobType(type));
        props.dispatch(setStatus('Configuring'));
        props.dispatch(setLoading(false));
        this.loadLists(type);
      })
      .catch((error: any) => {
        this.handleError(error);
        props.dispatch(setLoading(false));
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
  // being deprecated
  private slash(command: string, success: string, getAction?: () => any, errorAction?: () => any) {
    const props = this.props;
    slash(command, (response: any) => {
      if (response.errors) {
        if (errorAction) props.dispatch(errorAction());
        props.dispatch(setMessage({ type: 'error', message: response.errors[0] }));
      } else {
        if (getAction) props.dispatch(getAction());
        props.dispatch(setMessage({ type: 'success', message: success }));
      }
    });
  }

  // Handle webAPI error
  private handleError = (error: any) => {
    const props = this.props;
    if (error.FieldCodes) {
      props.dispatch(setMessage({
        type: 'error',
        message: error.FieldCodes[0].Code + ': ' + error.FieldCodes[0].Message,
      }));
    } else {
      props.dispatch(setMessage({ type: 'error', message: error.Code + ': ' + error.Message }));
    }
  }

  // Generic API boilerplate
  private api = (
    request: () => any,
    success: string,
    getAction?: (response: any) => any,
    errorAction?: (error: any) => any,
  ) => {
    const props = this.props;
    request()
      .then((response: any) => {
        if (getAction) props.dispatch(getAction(response));
        props.dispatch(setMessage({ type: 'success', message: success }));
      })
      .catch((error: any) => {
        if (errorAction) props.dispatch(errorAction(error));
        this.handleError(error);
      });
  }

  private checkJobStatus = (pretend: number = 0) => {
    const props = this.props;
    this.updateStatus((status: any) => {
      if (pretend) {
        status.jobState = 'Running';    // pretend
        status.totalCraftingTime = pretend;  // pretend 60 seconds
        status.startTime = (new Date()).toISOString();
      }
      props.dispatch(gotOutputItems(status.outputItems));
      switch (status.jobState) {
        case 'Finished':
          // Job finished immediately (often does)
          props.dispatch(setMessage({ type: 'success', message: 'Job has finished, you can collect it now.' }));
          break;
        case 'Running':
          // Job in progress, work out how long left
          this.waitFinished(status);
          break;
      }
    });
  }

  private waitFinished = (status: any) => {
    const start = new Date(status.startTime);
    const end = new Date(start.valueOf() + status.totalCraftingTime * 1000);
    let seconds = ((end.valueOf() - start.valueOf()) / 1000);
    const props = this.props;
    const tick = () => {
      if (seconds <= 0) {
        this.checkJobStatus();      // allow to finish this time, no pretend (debug mode)
        return;
      }
      props.dispatch(setMessage({ type: 'success', message: 'Job will finish in ' + seconds + ' seconds.' }));
      seconds --;
      this.waitTimer = setTimeout(tick, 1000);
    };
    tick();
  }

  private stopWaiting = () => {
    if (this.waitTimer) {
      clearTimeout(this.waitTimer);
      this.waitTimer = undefined;
    }
  }

  // Crafting job modes
  private startJob = () => {
    const props = this.props;
    this.api(startVoxJob, 'Job Started', () => {
      this.checkJobStatus(5);      // pretend will take 5 seconds (debug mode)
      return startJob();
    });
  }

  private collectJob = () => {
    this.api(collectVoxJob, 'Job Collected', () => {
      this.checkJobStatus();
      return collectJob();
    });
  }

  // Clear current crafting job
  private clearJob = () => {
    this.api(clearVoxJob, 'Job Clearaed', () => {
      this.checkJobStatus();
      return clearJob();
    });
  }

  // Clear current crafting job
  private cancelJob = () => {
    this.stopWaiting();
    this.api(cancelVoxJob, 'Job Cancelled', () => {
      this.checkJobStatus();
      return clearJob();
    });
  }

  // Job properties
  private setQuality = (quality: number) => {
    this.api(() => setVoxQuality(quality), 'Quality set to: ' + quality,
      () => {
        this.checkJobStatus();
        return setQuality(quality);
      },
      () => setQuality(undefined),
    );
  }

  private setCount = (count: number) => {
    this.api(() => setVoxItemCount(count), 'Item Count set to: ' + count,
      () => {
        this.checkJobStatus();
        return setCount(count);
      },
      () => setCount(undefined),
    );
  }

  private setName = (name: string) => {
    this.api(() => setVoxName(name), 'Name set to: ' + name,
      () => {
        this.checkJobStatus();
        return setName(name);
      },
      () => setName(undefined),
    );
  }

  private setRecipe = (recipe: Recipe) => {
    this.api(() => setVoxRecipe(recipe.id), 'Recipe set to: ' + recipe.name,
      () => {
        this.checkJobStatus();
        return setRecipe(recipe);
      },
      () => setRecipe(undefined),
    );
  }

  private setTemplate = (template: Template) => {
    this.api(() => setVoxTemplate(template.id), 'Template set to: ' + template.name,
      () => {
        this.checkJobStatus();
        return setTemplate(template);
      },
      () => setTemplate(undefined),
    );
  }

  // Ingredients
  private addIngredient = (ingredient: Ingredient, qty: number) => {
    this.api(
      () => addVoxIngredient(ingredient.id, qty),
      'Added ingredient: ' + qty + ' x ' + ingredient.name,
      (response: VoxResponse) => {
        this.checkJobStatus();
        return addIngredient(ingredient, qty, response.MovedItemID);
      },
    );
  }
  private removeIngredient = (ingredient: Ingredient) => {
    this.api(() => removeVoxIngredient(ingredient.id, -1),
      'Ingredient: ' + ingredient.name + ' removed',
      () => {
        this.checkJobStatus();
        return removeIngredient(ingredient);
      },
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
