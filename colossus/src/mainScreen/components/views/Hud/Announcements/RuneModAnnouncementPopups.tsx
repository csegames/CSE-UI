/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { PerkDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { CSSTransitionGroup } from 'react-transition-group';
import { RuneType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';

const PopupBoxDisplayTimeSeconds = 7.0;
const TransitionEnterSeconds = 0.5;
const TransitionLeaveSeconds = 0.1;

const StringIDHUDRuneModUnlocked = 'HUDRuneModUnlocked';

const Container = 'Announcements-RuneModPopups-Container';
const Message = 'Announcements-RuneModPopups-Message';
const MessageTop = 'Announcements-RuneModPopups-MessageTop';
const MessageBottom = 'Announcements-RuneModPopups-MessageBottom';

interface PopupMessage {
  id: string;
  levelIndex: number;
}

interface InjectedProps {
  collectedRunes: { [key in RuneType]: number };
  runeModLevels: number[];
  stringTable: Dictionary<StringTableEntryDef>;
  selectedRuneMods: PerkDefGQL[];
}

type Props = InjectedProps;

export interface State {
  messages: PopupMessage[];
}

class ARuneModAnnouncementPopups extends React.Component<Props, State> {
  private timeouts: number[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  public render(): JSX.Element {
    return (
      <div
        id='PopupAnnouncementContainer_HUD'
        className={`${Container} ${this.state.messages.length === 0 ? 'empty' : ''}`}
      >
        <CSSTransitionGroup
          transitionName='announcement'
          transitionEnterTimeout={TransitionEnterSeconds * 1000}
          transitionLeaveTimeout={TransitionLeaveSeconds * 1000}
        >
          {this.state.messages.map((message) => (
            <div className={Message} key={message.id}>
              <div className={MessageTop}>
                {getTokenizedStringTableValue(StringIDHUDRuneModUnlocked, this.props.stringTable, {
                  LEVEL: String(message.levelIndex + 1)
                })}
              </div>
              <div className={MessageBottom}>
                {this.props.selectedRuneMods && this.props.selectedRuneMods[message.levelIndex].name}
              </div>
            </div>
          ))}
        </CSSTransitionGroup>
      </div>
    );
  }

  public componentDidUpdate(prevProps: Readonly<InjectedProps>): void {
    const collected = this.props.collectedRunes[RuneType.CharacterMod];
    const prevCollected = prevProps.collectedRunes[RuneType.CharacterMod];
    if (collected !== prevCollected) {
      const reverseRuneModLevels = [...this.props.runeModLevels].reverse();
      const levelReverseIndex = reverseRuneModLevels.findIndex((level) => collected >= level);
      const prevLevelReverseIndex = reverseRuneModLevels.findIndex((level) => prevCollected >= level);
      const levelIndex = levelReverseIndex === -1 ? -1 : this.props.runeModLevels.length - levelReverseIndex - 1;
      const previousIndex =
        prevLevelReverseIndex === -1 ? -1 : this.props.runeModLevels.length - prevLevelReverseIndex - 1;
      if (levelIndex !== previousIndex) {
        const messages = [...this.state.messages];
        for (let i: number = previousIndex + 1; i <= levelIndex; i++) {
          const id = genID();
          messages.unshift({
            id,
            levelIndex: i
          });
          this.timeouts.push(
            window.setTimeout(() => {
              this.setState({ messages: this.state.messages.filter((box) => box.id !== id) });
              this.timeouts.shift();
            }, PopupBoxDisplayTimeSeconds * 1000)
          );
        }
        this.setState({
          messages
        });
      }
    }
  }

  public componentWillUnmount(): void {
    this.timeouts.forEach((timeout) => {
      window.clearTimeout(timeout);
    });
  }
}

function mapStateToProps(state: RootState): Props {
  const { collectedRunes, runeModLevels } = state.runes;
  const { selectedRuneMods } = state.profile;
  const { characterClassDefs } = state.game;
  const { classID } = state.player;
  const classDef = characterClassDefs[classID];
  const selectedRuneModsFromChamp = selectedRuneMods && classDef ? selectedRuneMods[classDef.stringID] : null;

  return {
    collectedRunes,
    runeModLevels,
    stringTable: state.stringTable.stringTable,
    selectedRuneMods: selectedRuneModsFromChamp
  };
}

export const RuneModAnnouncementPopups = connect(mapStateToProps)(ARuneModAnnouncementPopups);
