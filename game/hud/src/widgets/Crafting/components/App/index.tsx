/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-04 22:12:17
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-18 13:10:40
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {events, client, jsKeyCodes, webAPI, hasClientAPI } from 'camelot-unchained';
import {craftingTimeToString} from '../../services/util';

// Types
import { InventoryItem, Recipe, Template, Ingredient } from '../../services/types';
import { VoxIngredient, VoxTemplate, VoxRecipe, VoxResponse } from '../../services/game/crafting';
import { UIState, JobState, TemplatesState, RecipesState, GlobalState } from '../../services/session/reducer';

// Actions
import {
  setLoading, setJobType, setMessage, addIngredient, removeIngredient,
  startJob, collectJob, clearJob, cancelJob, setQuality, setStatus, setCount,
  setName, setRecipe, setTemplate, gotVoxStatus, gotVoxPossibleIngredients,
  gotOutputItems,
} from '../../services/session/job';
import { setUIMode, setRemaining, setMinimized } from '../../services/session/ui';
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
import VoxMessage from '../VoxMessage';
import Minimize from '../Minimize';
import Button from '../Button';

// Styles
import { StyleSheet, css, merge, craftingStyles, CraftingStyles } from '../../styles';

const select = (state: GlobalState): AppProps => {
  return {
    uiMode: state.ui.mode,
    job: state.job,
    minimized: state.ui.minimized,
  };
};

interface AppProps {
  dispatch?: (action: any) => void;
  job: JobState;
  uiMode: string;
  minimized: boolean;
  style?: Partial<CraftingStyles>;
}

interface AppState {
  visible: boolean;
}

class App extends React.Component<AppProps,AppState> {

  private waitTimer: any;
  private navigationHandler: any;
  private updating: boolean;

  constructor(props: AppProps) {
    super(props);
    this.state = { visible: false };
  }

  public componentDidMount() {

    // Handle keyboard events (for ESC)
    window.addEventListener('keydown', this.onKeyDown);

    // Watch for navigation events (for open/close)
    this.navigationHandler = events.on('hudnav--navigate', (name: string) => {
      const visible = !this.state.visible;
      if (name === 'crafting') {
        this.setState(() => ({ visible }));
        if (visible) this.refresh();
      }
    });

    // Captureing input on mouseover gives a terrible user experience,
    // const div: HTMLDivElement = this.refs['crafting'] as HTMLDivElement;
    // div.addEventListener('mouseenter', this.capture);
    // div.addEventListener('mouseleave', this.release);
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    if (this.navigationHandler) {
      events.off(this.navigationHandler);
      this.navigationHandler = null;
    }
    // Captureing input on mouseover gives a terrible user experience,
    // const div: HTMLDivElement = this.refs['crafting'] as HTMLDivElement;
    // div.removeEventListener('mouseenter', this.capture);
    // div.removeEventListener('mouseleave', this.release);
  }

  public render() {
    if (!this.state.visible) return null;
    const props = this.props;

    const ss = StyleSheet.create(merge({}, craftingStyles, props.style));

    if (props.minimized) {
      return this.renderMinimizedUI(ss);
    }

    return (
      <div ref='crafting' className={'app cu-window ' + css(ss.container)}>
        <div className={css(ss.minimizedIcons)}>
          <Close onClose={this.close}/>
          <Minimize onMinimize={this.minimize} minimized={false}/>
        </div>
        <VoxInfo/>
        <JobType
          mode={props.uiMode}
          changeType={this.selectType}
          clearJob={this.clearJob}
          refresh={this.refresh}
          toggle={this.toggle}
        />
        {this.renderMainUI(ss)}
      </div>
    );
  }

  private renderMainUI = (ss: CraftingStyles) => {
    const props = this.props;
    switch (props.uiMode) {
      case 'crafting':
        if (props.job.loading) {
          return <div className={css(ss.loading)}>Preparing for your performance ...</div>;
        }
        return (
          <JobDetails
            start={this.startJob}
            collect={this.collectJob}
            cancel={this.cancelJob}
            setQuality={this.setQuality}
            setCount={this.setCount}
            setRecipe={this.setRecipe}
            setName={this.setName} setTemplate={this.setTemplate}
            addIngredient={this.addIngredient}
            removeIngredient={this.removeIngredient}
          />
        );
      case 'tools':
        return <Tools/>;
    }
  }

  private renderMinimizedUI = (ss: CraftingStyles) => {
    const props = this.props;
    // const type = props.job && props.job.type;
    const { status, outputItems } = props.job;
    return (
      <div ref='crafting' className={'app cu-window ' + css(ss.container, ss.minimized)}>
        <VoxMessage/>
        <div className={css(ss.minimizedIcons)}>
          <Close onClose={this.close}/>
          <Minimize onMinimize={this.minimize} minimized={true}/>
        </div>
        { status === 'Configuring' && outputItems && outputItems.length
          ? <Button
              style={{ container: craftingStyles.minimizedButton }}
              onClick={this.startJob}>
                Start
              </Button>
          : undefined
        }
        { status === 'Running'
          ? <Button
              style={{ container: craftingStyles.minimizedButton }}
              onClick={this.cancelJob}>
                Cancel
              </Button>
          : undefined
        }
        { status === 'Finished'
          ? <Button
              style={{ container: craftingStyles.minimizedButton }}
              onClick={this.collectJob}>
                Collect
              </Button>
          : undefined
        }
      </div>
    );
  }

  private close = () => {
    events.fire('hudnav--navigate', 'crafting');
    this.release();
  }

  private minimize = () => {
    this.props.dispatch(setMinimized(!this.props.minimized));
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
      switch (status.jobState) {
        case 'Finished':
          this.stopWaiting();
          props.dispatch(setMessage({ type: 'success', message: 'Job has finished, you can collect it now' }));
          break;
        case 'Running':
          // Job in progress, work out how long left
          this.waitFinished(status);
          break;
        default:
          this.stopWaiting();
          props.dispatch(setMessage({ type: 'success', message: 'VOX Status: ' + status.jobState }));
          break;
      }
      props.dispatch(gotOutputItems(status.outputItems));
      if (status.jobType) {
        this.loadLists(status.jobType, true);
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

    // No-op?
    if (props.job.type === type) return;

    // Changing job types...
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

  private loadPossibleIngredients = (job: string) => {
    // only re-load possible ingredients if job type has changed, or we are doing a refresh
    const props = this.props;
    props.dispatch(gotVoxPossibleIngredients([], 'loading'));
    voxGetPossibleIngredients()
      .then((ingredients: VoxIngredient[]) => {
        props.dispatch(gotVoxPossibleIngredients(ingredients, job));
      })
      .catch(() => {
        props.dispatch(setMessage({ type: 'error', message: 'Failed to get vox ingredients' }));
      });
  }

  private loadLists = (job: string, refresh?: boolean) => {
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
        case 'repair':
        case 'salvage':
          // no recipes to load
          props.dispatch(setLoading(false));
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

    // Don't reload salvage list (which is huge) unless we really have to
    // but other possible ingredients lists we should reload to make sure
    // they are up to date [e.g. pick up output items]
    if (refresh || job !== 'salvage' || job !== props.job.possibleType) {
      // only re-load possible ingredients if job type has changed, or we are doing a refresh
      this.loadPossibleIngredients(job);
    }

    // and load recipes
    getRecipes();
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

  private checkJobStatus = () => {
    const props = this.props;
    this.updating = true;
    this.updateStatus((status: any) => {
      props.dispatch(gotOutputItems(status.outputItems));
      switch (status.jobState) {
        case 'Finished':
          // Job finished immediately (often does)
          this.stopWaiting();
          props.dispatch(setMessage({ type: 'success', message: 'Job has finished, you can collect it now.' }));
          props.dispatch(setRemaining(0));
          break;
        case 'Running':
          // Job in progress, work out how long left
          this.waitFinished(status);
          break;
        default:
          // all other statuses, stop any running crafting timer
          this.stopWaiting();
          break;
      }
      this.updating = false;
    });
  }

  private waitFinished = (status: any) => {
    let seconds = status.timeRemaining;
    const props = this.props;
    if (this.waitTimer) clearTimeout(this.waitTimer);
    this.waitTimer = null;
    const tick = () => {
      if (seconds < 1) {
        props.dispatch(setMessage({ type: 'success', message: 'Just finishing up...' }));
        props.dispatch(setRemaining(0));
        setTimeout(this.checkJobStatus, 1000);  // allow time for progress bar to animate (1s)
        return;
      }
      props.dispatch(setMessage({
        type: 'success',
        message: 'Job will finish in ' + craftingTimeToString(seconds | 0) + '.',
      }));
      props.dispatch(setRemaining(seconds));
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
    if (this.updating) return;
    props.dispatch(setRemaining(this.props.job.totalCraftingTime));
    this.api(startVoxJob, 'Job Started', () => {
      this.checkJobStatus();      // pretend will take 5 seconds (debug mode)
      return startJob();
    });
  }

  private collectJob = () => {
    const props = this.props;
    const type = props.job.type;
    this.api(collectVoxJob, 'Job Collected', () => {
      // automatally start same job type
      setVoxJob(type)
        .then(() => {
          props.dispatch(setJobType(type));
          props.dispatch(setStatus('Configuring'));
          this.loadPossibleIngredients(props.job.type);
          this.checkJobStatus();
        });
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
      return cancelJob();
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
}

export default connect(select)(App);
