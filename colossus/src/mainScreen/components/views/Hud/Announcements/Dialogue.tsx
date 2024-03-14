/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { parseAnnouncementText } from './Utils';
import { RootState } from '../../../../redux/store';
import { KeybindsState } from '../../../../redux/keybindsSlice';
import { DialogueEntry } from '../../../../redux/announcementsSlice';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
// wonder if I can get rid of this:
//import { CSSTransitionGroup } from 'react-transition-group';

const Container = 'Announcements-Dialogue-Container';
const DialogueBox = 'Announcements-Dialogue-DialogueBox';
const SpeakerIcon = 'Announcements-Dialogue-SpeakerIcon';
const DialogueBoxContent = 'Announcements-Dialogue-DialogueBoxContent';
const SpeakerName = 'Announcements-Dialogue-SpeakerName';
const DialogueText = 'Announcements-Dialogue-DialogueText';

interface ComponentProps {}

interface InjectedProps {
  dispatch?: Dispatch;
  dialogueQueue?: DialogueEntry[];
  usingGamepad: boolean;
  keybindsState: KeybindsState;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ComponentProps & InjectedProps;

class ADialogueQueue extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  private getDialogueBox(index: number, entry: DialogueEntry): JSX.Element {
    const speakerIcon = entry.speakerIcon ? <img className={SpeakerIcon} src={entry.speakerIcon} /> : null;
    return (
      <div className={DialogueBox} key={index}>
        {speakerIcon}
        <div className={DialogueBoxContent}>
          <p className={SpeakerName}>{entry.speakerName}</p>
          <p className={DialogueText}>
            {parseAnnouncementText(
              entry.text,
              this.props.usingGamepad,
              this.props.keybindsState,
              this.props.stringTable
            )}
          </p>
        </div>
      </div>
    );
  }

  render(): JSX.Element {
    let dialogueElements: JSX.Element[] = [];
    for (let i = 0; i < this.props.dialogueQueue.length; i++) {
      dialogueElements.push(this.getDialogueBox(i, this.props.dialogueQueue[i]));
    }

    return (
      <div id='DialogueQueueContainer_HUD' className={Container}>
        {dialogueElements}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ComponentProps): Props {
  return {
    dialogueQueue: state.announcements.dialogueQueue,
    usingGamepad: state.baseGame.usingGamepad,
    keybindsState: state.keybinds,
    stringTable: state.stringTable.stringTable
  };
}

export const DialogueQueue = connect(mapStateToProps)(ADialogueQueue);

/*
Leaving this here for when I get the time to reimplement the transitions... I want to have the proper reference material without going through the git history.
const TransitionName = 'dialogue-announcement';
const TranstionEnterSeconds = 0.25;
const TranstionLeaveSeconds = 0.25;

...

const TransitionStyles = `
.${TransitionName}-enter {
  opacity: 0.01;
  transform: translateX(10px);
}

.${TransitionName}-enter.${TransitionName}-enter-active {
  opacity: 1.0;
  transform: translateX(0px);
  transition: all ${TranstionEnterSeconds}s ease-in;
}

.${TransitionName}-leave {
  opacity: 1.0;
  transform: translateX(0px);
}

.${TransitionName}-leave.${TransitionName}-leave-active {
  opacity: 0.01;
  transform: translateX(10px);
  transition: all ${TranstionLeaveSeconds}s ease-in;
}
`;

...

<CSSTransitionGroup
  transitionName={TransitionName}
  transitionEnterTimeout={TranstionEnterSeconds * 1000}
  transitionLeaveTimeout={TranstionLeaveSeconds * 1000}>
  {dialogueElements}
  <style dangerouslySetInnerHTML={{ __html: TransitionStyles }}></style>
</CSSTransitionGroup>
*/
