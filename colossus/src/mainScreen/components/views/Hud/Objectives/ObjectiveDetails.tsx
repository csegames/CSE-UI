/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { formatDuration } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { ObjectiveDetailsList } from '../../../../redux/gameSlice';
import {
  ObjectiveDetailCategory,
  ObjectiveDetailMessageState,
  ObjectiveDetailState
} from '@csegames/library/dist/_baseGame/types/Objective';
import { game } from '@csegames/library/dist/_baseGame';
import { clamp, largeIntegerToFriendlyString } from '@csegames/library/dist/_baseGame/utils/numberUtils';

const containerClass = 'ObjectiveDetails-Container';
const objectiveGroupContainerClass = 'ObjectiveDetails-ObjectiveGroupContainer';
const objectiveContainerClass = 'ObjectiveDetails-ObjectiveContainer';
const objectiveTitleClass = 'ObjectiveDetails-ObjectiveTitle';
const objectiveStateClass = 'ObjectiveDetails-ObjectiveState';
const objectiveTextClass = 'ObjectiveDetails-ObjectiveText';

// ---- begin objective details progress bar styles ----

const objectiveDetailsProgressBarWrapClass = 'ObjectiveDetails-ObjectiveDetailsProgressBarWrap';
const objectiveCounterClass = 'ObjectiveDetails-ObjectiveCounter';
const counterValueClass = 'ObjectiveDetails-CounterValue';
const progressBarCommonClass = 'ObjectiveDetails-ProgressBarCommon';
const progressBarClass = 'ObjectiveDetails-ProgressBar';
const progressBarLabelClass = 'ObjectiveDetails-ProgressBarLabel';
const progressBarInnerClass = 'ObjectiveDetails-ProgressBarInner';
const segmentedProgressBarTableClass = 'ObjectiveDetails-SegmentedProgressBarTable';
const segmentedProgressBarSegmentClass = 'ObjectiveDetails-SegmentedProgressBarSegment';

const ProgressBarInnerWidth = (pct: number) => {
  return `calc(${Math.ceil(clamp(pct * 100, 0, 100))}% - 6px)`;
};

// ---- end objective details progress bar styles ----

export interface ObjectiveDetailsProgressBarProps {
  objective: ObjectiveDetailMessageState;
  innerClass?: string;
  scenarioRoundStartTime: number;
}

export class ObjectiveDetailsProgressBar extends React.Component<ObjectiveDetailsProgressBarProps, {}> {
  constructor(props: ObjectiveDetailsProgressBarProps) {
    super(props);
  }

  public render() {
    let counter: JSX.Element = null;
    let progress: JSX.Element = null;

    let extraClasses: string =
      this.props.objective.category == ObjectiveDetailCategory.Primary ? 'is-primary-objective' : '';
    if (this.props.innerClass) {
      extraClasses += ` ${this.props.innerClass}`;
    }

    const haveCounter: boolean = this.props.objective.maxCount > 0;
    const haveTimer: boolean = this.props.objective.totalTime > 0;
    if (!haveCounter && !haveTimer) {
      return null;
    }

    // compute timer values if we have a timer
    let currentRelativeSeconds: number = 0;
    let timerPct: number = 0;
    if (haveTimer) {
      const elapsedSeconds = game.worldTime - (this.props.scenarioRoundStartTime + this.props.objective.startTime);
      currentRelativeSeconds = clamp(
        this.props.objective.totalTime - elapsedSeconds,
        0.0,
        this.props.objective.totalTime
      );
      timerPct = clamp(currentRelativeSeconds / this.props.objective.totalTime, 0.0, 1.0);
    }

    // first, the left-hand text box
    if (haveCounter) {
      const val: number = clamp(this.props.objective.currentCount, 0, this.props.objective.maxCount);
      // only show the "current/max" format if we have less than 100 max (otherwise just show how many are remaining)
      const label: string = `${largeIntegerToFriendlyString(val)} / ${largeIntegerToFriendlyString(
        this.props.objective.maxCount
      )}`;
      const counterExtraClass: string = this.props.objective.maxCount >= 100 ? 'large-count' : '';

      counter = (
        <div className={`${objectiveCounterClass} ${extraClasses} ${counterExtraClass}`}>
          <span className={`${counterValueClass} ${extraClasses}`}>{label}</span>
        </div>
      );
    } else {
      // no counter, just show the time remaining in the counter slot
      counter = (
        <div className={`${objectiveCounterClass} ${extraClasses}`}>
          <span className={`${counterValueClass} ${extraClasses}`}>{formatDuration(currentRelativeSeconds)}</span>
        </div>
      );
    }

    // second, the progress bar
    if (haveCounter && !haveTimer) {
      // counter only
      // <= 10 items, make a segmented progress bar
      if (this.props.objective.maxCount <= 10) {
        // [Judd 6/16/22] There are several workarounds here. The version of chromium we're using has a bug where the width
        // of flex children isn't computed correctly in some cases which causes this segmented progress bar to either have
        // extra pixels on the right, or not enough pixels on the right (so the right-most segment bleeds into the right-hand
        // border). To work around this, I'm using a single-row table instead of flexbox.
        let segments: JSX.Element[] = [];
        const segmentWidth = `${1.0 / this.props.objective.maxCount}%`;
        for (let i = 0; i < this.props.objective.maxCount; i++) {
          // hide elements past our current value to keep the spacing correct
          // (we're using flex-grow to ensure each element is the correct width)
          const vis = i < this.props.objective.currentCount ? 'visible' : 'hidden';
          segments.push(
            <td
              key={i}
              className={`${segmentedProgressBarSegmentClass} ${extraClasses}`}
              style={{ width: segmentWidth, visibility: vis }}
            />
          );
        }

        // [Judd 6/16/22] The extra useless-looking wrapper div is required, because for some reason 'flex-grow: 1' doesn't
        // work correctly when applied to a table, and without that, it interprets a width of 100% literally and overflows
        // it's parent by the width of the counter. With the wrapper div, the table sees that div as it's parent and computes
        // the width correctly.
        progress = (
          <div>
            <table
              className={`${segmentedProgressBarTableClass} ${progressBarCommonClass} ${extraClasses}`}
              width='100%'
            >
              <tr>{segments}</tr>
            </table>
          </div>
        );
      } else {
        // > 10 items, smooth progress bar
        const pct = clamp(this.props.objective.currentCount / this.props.objective.maxCount, 0.0, 1.0);
        progress = (
          <div className={`${progressBarCommonClass} ${progressBarClass} ${extraClasses}`}>
            <div className={`${progressBarInnerClass} ${extraClasses}`} style={{ width: ProgressBarInnerWidth(pct) }} />
          </div>
        );
      }
    } else if (haveTimer && !haveCounter) {
      // timer only
      progress = (
        <div className={`${progressBarCommonClass} ${progressBarClass} ${extraClasses}`}>
          <div
            className={`${progressBarInnerClass} ${extraClasses}`}
            style={{ width: ProgressBarInnerWidth(timerPct) }}
          />
          <div className={`${progressBarLabelClass} ${extraClasses}`}>Time Left</div>
        </div>
      );
    } else if (haveTimer && haveCounter) {
      // both counter and timer
      // we're using the text box on the left for the counter, so shove the time remaining inside the progress bar
      progress = (
        <div className={`${progressBarCommonClass} ${progressBarClass} ${extraClasses}`}>
          <div
            className={`${progressBarInnerClass} ${extraClasses}`}
            style={{ width: ProgressBarInnerWidth(timerPct) }}
          />
          <div className={`${progressBarLabelClass} ${extraClasses}`}>
            Time Left ({formatDuration(currentRelativeSeconds)})
          </div>
        </div>
      );
    }

    return (
      <div className={`${objectiveDetailsProgressBarWrapClass} ${extraClasses}`}>
        {this.props.children}
        {counter}
        {progress}
      </div>
    );
  }
}

interface ComponentProps {}

interface InjectedProps {
  objectives: ObjectiveDetailsList;
  lastUpdatedTime: number;
  scenarioRoundStartTime: number;
}

type Props = ComponentProps & InjectedProps;

class AObjectiveDetails extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  private getObjectiveElementsList(category: ObjectiveDetailCategory): JSX.Element[] {
    const objectiveElements: JSX.Element[] = [];

    const sortedObjectiveIDs = Object.keys(this.props.objectives).sort((a, b) => {
      return a.localeCompare(b);
    });
    for (let objID of sortedObjectiveIDs) {
      const obj: ObjectiveDetailMessageState = this.props.objectives[objID];

      if (obj.category != category) {
        continue;
      }

      let state: string = '';
      let stateClass: string = '';
      if (obj.state == ObjectiveDetailState.CompletedSuccess) {
        state = String.fromCharCode(10003);
        stateClass = 'is-success';
      } else if (obj.state == ObjectiveDetailState.CompletedFailed) {
        state = String.fromCharCode(0x2717);
        stateClass = 'is-failure';
      }

      const makeObjStateIcon = (extraClass: string = ''): JSX.Element => {
        return state ? <span className={`${objectiveStateClass} ${stateClass} ${extraClass}`}>{state}</span> : null;
      };

      if (obj.title) {
        // we have a title, maybe text, and if we have a state icon it can go next to the title
        objectiveElements.push(
          <div key={obj.messageID} className={objectiveContainerClass}>
            <div className={objectiveTitleClass}>
              {makeObjStateIcon()}
              {obj.title}
            </div>
            {obj.text ? <div className={objectiveTextClass}>{obj.text}</div> : null}
            <ObjectiveDetailsProgressBar objective={obj} scenarioRoundStartTime={this.props.scenarioRoundStartTime} />
          </div>
        );
      } else if (obj.text) {
        // no title, but we have some text we can stick the state icon next to if needed
        objectiveElements.push(
          <div key={obj.messageID} className={objectiveContainerClass}>
            <div className={`${objectiveTextClass} no-title`}>
              {makeObjStateIcon()}
              {obj.text}
            </div>
            <ObjectiveDetailsProgressBar objective={obj} scenarioRoundStartTime={this.props.scenarioRoundStartTime} />
          </div>
        );
      } else {
        // edge case here - we have no title or text to stick the icon next to if we have one, so put it next to the progress bar
        objectiveElements.push(
          <div key={obj.messageID} className={objectiveContainerClass}>
            <ObjectiveDetailsProgressBar objective={obj} scenarioRoundStartTime={this.props.scenarioRoundStartTime}>
              {makeObjStateIcon('no-text')}
            </ObjectiveDetailsProgressBar>
          </div>
        );
      }
    }

    return objectiveElements;
  }

  public render() {
    const mainQuestObjectiveElements: JSX.Element[] = this.getObjectiveElementsList(ObjectiveDetailCategory.MainQuest);
    const sideQuestObjectiveElements: JSX.Element[] = this.getObjectiveElementsList(ObjectiveDetailCategory.SideQuest);

    if (mainQuestObjectiveElements.length > 0 || sideQuestObjectiveElements.length > 0) {
      return (
        <div className={containerClass}>
          {mainQuestObjectiveElements.length > 0 && (
            <div className={objectiveGroupContainerClass}>{mainQuestObjectiveElements}</div>
          )}
          {sideQuestObjectiveElements.length > 0 && (
            <div className={objectiveGroupContainerClass}>{sideQuestObjectiveElements}</div>
          )}
        </div>
      );
    } else {
      return <div />;
    }
  }
}

function mapStateToProps(state: RootState) {
  //clamping lastUpdatedTime to every second replaces the need for a seperate interval function call within the component.
  return {
    objectives: state.game.objectiveDetailsQuest,
    lastUpdatedTime: Math.floor(state.baseGame.worldTime),
    scenarioRoundStartTime: state.player.scenarioRoundStateStartTime
  };
}

export const ObjectiveDetails = connect(mapStateToProps)(AObjectiveDetails);
