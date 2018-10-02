/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { craftingTimeToString } from '../services/util';
import { expandError } from '../services/game/crafting/errors';


// Types
import { Recipe, Ingredient } from '../services/types';
import {
  VoxRecipe,
  VoxResponse,
  voxGetStatus, voxGetRecipesFor, voxGetPossibleItemSlots,
  setVoxJob, startVoxJob, collectVoxJob, clearVoxJob, cancelVoxJob,
  setVoxQuality, setVoxItemCount, setVoxName, setVoxRecipe,
  addVoxIngredient, removeVoxIngredient,
  voxGetPossibleIngredientsForSlot, VoxIngredient,
} from '../services/game/crafting';
import { JobState, GlobalState } from '../services/session/reducer';

// Actions
import {
  setLoading, setJobType, setMessage, addIngredient, removeIngredient,
  startJob, collectJob, clearJob, cancelJob, setQuality, setStatus, setCount,
  setName, setRecipe, gotVoxStatus,
  gotOutputItems, gotPossibleItemSlots, gotVoxPossibleIngredientsForSlot,
  removePossibleIngredientForSlot, restorePossibleIngredientForSlot,
} from '../services/session/job';
import {
  setUIMode,
  setRemaining,
  // setMinimized
} from '../services/session/ui';
import { gotVoxRecipes } from '../services/session/recipes';


// Components
import JobType from './JobType';
import JobDetails from './JobDetails';
// import VoxInfo from './VoxInfo';
import Tools from './Tools';
import Close from './Close';
// import VoxMessage from './VoxMessage';
// import Minimize from './Minimize';
import Button from './Button';

// Styles
import { StyleSheet, cssAphrodite, merge, app, AppStyles } from '../styles';

const select = (state: GlobalState) => {
  return {
    uiMode: state.ui.mode,
    job: state.job,
    minimized: state.ui.minimized,
  };
};

interface AppProps {
  dispatch: (action: any) => void;
  job: JobState;
  uiMode: string;
  minimized: boolean;
  style?: Partial<AppStyles>;
}

interface AppState {
  visible: boolean;
}

class App extends React.Component<AppProps, AppState> {

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
    this.navigationHandler = game.on('hudnav--navigate', (name: string) => {
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
      game.off(this.navigationHandler);
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

    const ss = StyleSheet.create(merge({}, app, props.style));

    if (props.minimized) {
      return this.renderMinimizedUI(ss);
    }

    return (
      <div ref='crafting' className={'cu-window ' + cssAphrodite(ss.app)}>
        <div className={cssAphrodite(ss.minimizedIcons)}>
          <Close onClose={this.close}/>
          {/* <Minimize onMinimize={this.minimize} minimized={false}/> */}
        </div>
        {/* <VoxInfo/> */}
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

  private renderMainUI = (ss: AppStyles) => {
    const props = this.props;
    switch (props.uiMode) {
      case 'crafting':
        if (props.job.loading) {
          return (
            <div className={cssAphrodite(ss.loading)}>
              {/* Loading... */}
            </div>
          );
        }
        return (
          <JobDetails
            start={this.startJob}
            collect={this.collectJob}
            cancel={this.cancelJob}
            setQuality={this.setQuality}
            setCount={this.setCount}
            setRecipe={this.setRecipe}
            setName={this.setName}
            addIngredient={this.addIngredient}
            removeIngredient={this.removeIngredient}
            selectSlot={this.selectSlot}
          />
        );
      case 'tools':
        return <Tools refresh={this.refresh}/>;
    }
  }

  private renderMinimizedUI = (ss: AppStyles) => {
    const props = this.props;
    // const type = props.job && props.job.type;
    const { status, outputItems } = props.job;
    return (
      <div ref='crafting' className={'cu-window ' + cssAphrodite(ss.app, ss.minimized)}>
        {/* <VoxMessage/> */}
        <div className={cssAphrodite(ss.minimizedIcons)}>
          <Close onClose={this.close}/>
          {/* <Minimize onMinimize={this.minimize} minimized={true}/> */}
        </div>
        { status === 'Configuring' && outputItems && outputItems.length
          ? <Button
              style={{ button: app.minimizedButton }}
              disableSound={true}
              onClick={this.startJob}>
                Start
              </Button>
          : undefined
        }
        { status === 'Running'
          ? <Button
              style={{ button: app.minimizedButton }}
              disableSound={true}
              onClick={this.cancelJob}>
                Cancel
              </Button>
          : undefined
        }
        { status === 'Finished'
          ? <Button
              style={{ button: app.minimizedButton }}
              disableSound={true}
              onClick={this.collectJob}>
                Collect
              </Button>
          : undefined
        }
      </div>
    );
  }

  private close = () => {
    if (this.state.visible) {
      game.trigger('hudnav--navigate', 'crafting');
      this.release();
    }
  }

  // private minimize = () => {
  //   this.props.dispatch(setMinimized(!this.props.minimized));
  // }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key.toUpperCase() === 'ESCAPE') {
      this.close();
    }
  }

  private release = () => {
  }

  private refresh = () => {
    const props = this.props;

    // GraphQL: get vox status
    voxGetStatus().then((status: any) => {
      props.dispatch(gotVoxStatus(status));
      const type = status.jobType && status.jobType.toLowerCase();
      switch (status.jobState) {
        case 'Finished':
          this.stopWaiting();
          props.dispatch(setMessage({ type: 'success', message: 'Job has finished, you can collect it now' }));
          break;
        case 'Configuring':
          // Job is being defined. If there is a recipe selected, we need to load possible slots
          if (type) {
            this.loadLists(type, true);
          }
          if (status.recipeID) {
            this.loadPossibleSlots();
          }
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
      if (type && type !== 'invalid') {
        this.loadLists(type, true);
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

    // TODO COHERENT missing PLAY_UI_VOX_GENERICBUTTON sound event
    // game.playGameSound(SoundEvent.PLAY_UI_VOX_GENERICBUTTON);

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

  private playTypeSound = (type: string) => {
    switch (type) {
      case 'grind': {
        // TODO COHERENT missing PLAY_UI_VOX_START_GRIND sound event
        // game.playGameSound(SoundEvent.PLAY_UI_VOX_START_GRIND);
        break;
      }
      case 'purify': {
        // TODO COHERENT missing PLAY_UI_VOX_START_PURIFY sound event
        // game.playGameSound(SoundEvent.PLAY_UI_VOX_START_PURIFY);
        break;
      }
      case 'shape': {
        // TODO COHERENT missing PLAY_UI_VOX_START_SHAPE sound event
        // game.playGameSound(SoundEvent.PLAY_UI_VOX_START_SHAPE);
        break;
      }
      case 'block': {
        // TODO COHERENT missing PLAY_UI_VOX_START_BLOCK sound event
        // game.playGameSound(SoundEvent.PLAY_UI_VOX_START_BLOCK);
        break;
      }
      case 'make': {
        // TODO COHERENT missing PLAY_UI_VOX_START_MAKE sound event
        // game.playGameSound(SoundEvent.PLAY_UI_VOX_START_MAKE);
        break;
      }
      case 'repair': {
        // TODO COHERENT missing PLAY_UI_VOX_START_REPAIR sound event
        // game.playGameSound(SoundEvent.PLAY_UI_VOX_START_REPAIR);
        break;
      }
      case 'salvage': {
        // TODO COHERENT missing PLAY_UI_VOX_START_SALVAGE sound event
        // game.playGameSound(SoundEvent.PLAY_UI_VOX_START_SALVAGE);
        break;
      }
    }
  }

  private loadLists = (job: string, refresh?: boolean) => {
    const props = this.props;

    // and load recipes
    switch (job) {
      case 'repair':
      case 'salvage':
        // no recipes to load
        this.loadPossibleSlots();
        break;
      case 'shape':
        this.loadPossibleSlots();
        // nobreak
      default:  // purify, grind, shape, block, make
        voxGetRecipesFor(job)
          .then((recipes: VoxRecipe[]) => {
            props.dispatch(gotVoxRecipes(job, recipes));
          })
          .catch(() => {
            props.dispatch(setMessage({ type: 'error', message: `Could not load ${job} recipes` }));
          });
        break;
    }
  }

  // Handle webAPI error
  private handleError = (error: any) => {
    const props = this.props;
    if (error.FieldCodes) {
      props.dispatch(setMessage({
        type: 'error',
        message: error.FieldCodes[0].Code + ': ' + expandError(error.FieldCodes[0].Message),
      }));
    } else {
      props.dispatch(setMessage({
        type: 'error',
        message: (error.Code ? error.Code + ': ' : '') + expandError(error.Message),
      }));
    }
  }

  // Generic API boilerplate
  private api = (
    request: () => any,
    success: string,
    getAction?: (response: any) => any,
    errorAction?: (error: any) => any,
    andFinally?: () => void,
  ) => {
    const props = this.props;
    request()
      .then((response: any) => {
        if (getAction) props.dispatch(getAction(response));
        props.dispatch(setMessage({ type: 'success', message: success }));
        if (andFinally) andFinally();
      })
      .catch((error: any) => {
        if (errorAction) props.dispatch(errorAction(JSON.parse(error)));
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
    this.playTypeSound(this.props.job.type);
    props.dispatch(setRemaining(this.props.job.totalCraftingTime));
    this.api(startVoxJob, 'Job Started', () => {
      this.checkJobStatus();      // pretend will take 5 seconds (debug mode)
      return startJob();
    });
  }

  private collectJob = () => {
    const props = this.props;
    const type = props.job.type;
    // TODO COHERENT missing PLAY_UI_VOX_COLLECT sound event
    // game.playGameSound(SoundEvent.PLAY_UI_VOX_COLLECT);
    this.api(collectVoxJob, 'Job Collected', () => {
      // automatally start same job type
      setVoxJob(type)
        .then(() => {
          props.dispatch(setJobType(type));
          props.dispatch(setStatus('Configuring'));
          this.checkJobStatus();
        });
      return collectJob();
    });
  }

  // Clear current crafting job
  private clearJob = () => {

    if (!this.props.job || this.props.job.type === 'invalid') return;

    // TODO COHERENT missing PLAY_UI_VOX_CLEAR sound event
    // game.playGameSound(SoundEvent.PLAY_UI_VOX_CLEAR);
    this.api(clearVoxJob, 'Job Cleared', () => {
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
  /* tslint:disable:member-ordering */
  private setQuality = _.debounce((quality: number) => {
    this.api(() => setVoxQuality(quality), 'Quality set to: ' + quality,
      () => {
        this.checkJobStatus();
        return setQuality(quality);
      },
      () => setQuality(undefined),
    );
  },600);

  /* tslint:disable:member-ordering */
  private setCount = _.debounce((count: number) => {
    this.api(() => setVoxItemCount(count), 'Item Count set to: ' + count,
      () => {
        this.checkJobStatus();
        return setCount(count);
      },
      () => setCount(undefined),
    );
  },600);

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
    this.api(() => setVoxRecipe(recipe.id), 'Output set to: ' + recipe.name,
      () => {
        this.checkJobStatus();
        this.loadPossibleSlots();
        return setRecipe(recipe);
      },
      () => setRecipe(undefined),
    );
  }

  private selectSlot = (slot: string) => {
    const props = this.props;
    props.dispatch(gotVoxPossibleIngredientsForSlot(undefined, slot));
    voxGetPossibleIngredientsForSlot(slot)
    .then((ingredients: VoxIngredient[]) => {
      props.dispatch(gotVoxPossibleIngredientsForSlot(ingredients, slot));
    })
    .catch(() => {
      props.dispatch(gotVoxPossibleIngredientsForSlot([], slot));
      props.dispatch(setMessage({ type: 'error', message: 'No suitable ingredients found' }));
    });
  }

  // Ingredients
  private addIngredient = (ingredient: Ingredient, qty: number) => {
    const props = this.props;
    const slot = this.props.job.slot;
    this.api(
      () => addVoxIngredient(ingredient.id, qty),
      'Added ingredient: ' + qty + ' x ' + ingredient.name,
      (response: VoxResponse) => {
        this.checkJobStatus();
        /*
        // will trigger updating of possible ingredients
        // (note we could work this out client side by updating the possibleIngredientsForSlot
        // in our global state, rather than requerying but I am being lazy)
        if (slot) this.selectSlot(slot);
        */
        props.dispatch(removePossibleIngredientForSlot(slot, ingredient, qty));
        return addIngredient(ingredient, qty, response.MovedItemID);
      },
      (e: any) => {
        props.dispatch(setMessage({
          type: 'error',
          message: e.Message + (e.FieldCodes && e.FieldCodes.length ? ': ' + e.FieldCodes[0].Message : ''),
        }));
      },
    );
  }
  private removeIngredient = (ingredient: Ingredient) => {
    const props = this.props;
    const slot = this.props.job.slot;
    this.api(() => removeVoxIngredient(ingredient.id, -1),
      'Ingredient: ' + ingredient.name + ' removed',
      () => {
        this.checkJobStatus();
        /*
        // will trigger updating of possible ingredients
        // (note we could work this out client side by updating the possibleIngredientsForSlot
        // in our global state, rather than requerying but I am being lazy)
        if (slot) this.selectSlot(slot);
        */
        props.dispatch(restorePossibleIngredientForSlot(slot, ingredient));
        return removeIngredient(ingredient);
      },
    );
  }

  private loadPossibleSlots = () => {
    const props = this.props;
    props.dispatch(gotPossibleItemSlots([]));
    voxGetPossibleItemSlots()
      .then((slots: string[]) => {
        props.dispatch(gotPossibleItemSlots(slots));
        if (slots.length === 1) {
          this.selectSlot(slots[0]);
        }
      })
      .catch(() => {
        props.dispatch(setMessage({ type: 'error', message: 'Failed to get recipe slots' }));
      });
  }
}

export default connect(select)(App);
