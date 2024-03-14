/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { AbilityTrackFlags } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { ActiveEffectAction } from '@csegames/library/dist/_baseGame/types/ActiveEffectAction';
import { ChatMessageData } from '../../redux/chatSlice';
import { Stanza } from 'node-xmpp-client';
import { DamageTypeDefGQL } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { showToaster } from '../../redux/toastersSlice';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import StaffIconURL from '../../../images/chat/chat-icon-cse.png';

const Root = 'HUD-ChatMessage-Root';
const Copy = 'HUD-ChatMessage-Copy';
const StanzaStaffIcon = 'HUD-ChatMessage-StanzaStaffIcon';
const StanzaNickWrapper = 'HUD-ChatMessage-StanzaNickWrapper';
const StanzaNick = 'HUD-ChatMessage-StanzaNick';
const StanzaNickStaff = 'HUD-ChatMessage-StanzaNickStaff';

interface ReactProps {
  message: ChatMessageData;
}

interface InjectedProps {
  damageTypes: Dictionary<DamageTypeDefGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AChat extends React.Component<Props> {
  contentElement: HTMLDivElement | null = null;

  render(): JSX.Element {
    return (
      <div className={Root}>
        <div
          ref={(element) => {
            this.contentElement = element;
          }}
        >
          {this.renderContent()}
        </div>
        {this.contentElement && (
          <div className={Copy} onClick={this.copyToClipboard.bind(this)}>
            {this.contentElement.innerText.replace(/[\r\n]+/gm, ' ')}
          </div>
        )}
      </div>
    );
  }

  renderContent(): JSX.Element {
    return (
      <>
        {this.props.message.stanza && this.renderStanza()}
        {this.props.message.combatEvent && this.renderCombatEvent()}
        {this.props.message.consoleText && this.renderConsoleText()}
        {this.props.message.announcementText && this.renderAnnouncementText()}
      </>
    );
  }

  renderStanza(): JSX.Element {
    return (
      <span>
        <span className={StanzaNickWrapper}>
          {this.isStaff() && this.renderStanzaStaffIcon()}
          {this.renderStanzaNick()}
        </span>
        {this.renderStanzaBody()}
      </span>
    );
  }

  renderStanzaStaffIcon(): JSX.Element {
    return <img className={StanzaStaffIcon} src={StaffIconURL} />;
  }

  renderStanzaNick(): JSX.Element {
    const nickChild = (this.props.message.stanza.children as Stanza[]).find((child) => child.name === 'nick');
    const nick = nickChild.children.join('');
    return <span className={this.isStaff() ? `${StanzaNick} ${StanzaNickStaff}` : `${StanzaNick}`}>{nick}:</span>;
  }

  renderStanzaBody(): JSX.Element {
    const bodyChild = (this.props.message.stanza.children as Stanza[]).find((child) => child.name === 'body');
    const body = bodyChild.children.join('');
    return <span>{body}</span>;
  }

  renderCombatEvent(): JSX.Element {
    return (
      <span>
        {this.renderCombatEventHeader()}
        {this.props.message.combatEvent.damages && this.renderCombatEventDamages()}
        {this.props.message.combatEvent.disruption && this.renderCombatEventDisruption()}
        {this.props.message.combatEvent.heals && this.renderCombatEventHeals()}
        {this.props.message.combatEvent.resources && this.renderCombatEventResources()}
        {this.props.message.combatEvent.impulse && this.renderCombatEventImpulse()}
        {this.props.message.combatEvent.activeEffects && this.renderCombatActiveEffects()}
        {this.props.message.combatEvent.statuses && this.renderCombatStatuses()}
        {this.props.message.combatEvent.errors && this.renderCombatErrors()}
      </span>
    );
  }

  renderCombatEventHeader(): JSX.Element {
    return (
      <span>
        {`${this.props.message.combatEvent.fromName}(${Faction[this.props.message.combatEvent.fromFaction]}) > ${
          this.props.message.combatEvent.toName
        }(${Faction[this.props.message.combatEvent.toFaction]}) `}
        {'| '}
      </span>
    );
  }

  renderCombatEventDamages(): JSX.Element {
    return (
      <span>
        {this.props.message.combatEvent.damages.map((damage): string => {
          return `${damage.received.toFixed(0)}(${Math.abs(damage.sent - damage.received).toFixed(0)}) ${
            this.props.damageTypes[damage.type]?.name ?? ''
          } `;
        })}
        {'| '}
      </span>
    );
  }

  renderCombatEventDisruption(): JSX.Element {
    return (
      <span>
        {`${this.props.message.combatEvent.disruption.received.toFixed(0)}(${Math.abs(
          this.props.message.combatEvent.disruption.sent - this.props.message.combatEvent.disruption.received
        ).toFixed(0)}) DISRUPTION ${this.props.message.combatEvent.disruption.source} `}
        {this.props.message.combatEvent.disruption.tracksInterrupted !== AbilityTrackFlags.None &&
          `${AbilityTrackFlags[this.props.message.combatEvent.disruption.tracksInterrupted]} INTERRUPTED `}
        {'| '}
      </span>
    );
  }

  renderCombatEventHeals(): JSX.Element {
    return (
      <span>
        {this.props.message.combatEvent.heals.map(
          (heal): string => `HEALED ${heal.received.toFixed(0)}(${Math.abs(heal.sent - heal.received).toFixed(0)}) | `
        )}
      </span>
    );
  }

  renderCombatEventResources(): JSX.Element {
    return (
      <span>
        {this.props.message.combatEvent.resources.map(
          (resource): string =>
            `${resource.received.toFixed(0)}(${Math.abs(resource.sent - resource.received).toFixed(0)}) ${
              resource.type
            } | `
        )}
      </span>
    );
  }

  renderCombatEventImpulse(): JSX.Element {
    return (
      <span>
        {`${this.props.message.combatEvent.impulse.received.toFixed(0)}(${Math.abs(
          this.props.message.combatEvent.impulse.sent - this.props.message.combatEvent.impulse.received
        ).toFixed(0)}) IMPULSE `}
        {'| '}
      </span>
    );
  }

  renderCombatActiveEffects(): JSX.Element {
    return (
      <span>
        {this.props.message.combatEvent.activeEffects.map((activeEffect, activeEffectIndex) => (
          <span key={activeEffectIndex}>
            {`${activeEffect.name} ${ActiveEffectAction[activeEffect.action]} `}
            {activeEffect.action === ActiveEffectAction.Applied && `${activeEffect.duration} `}
          </span>
        ))}
        {'| '}
      </span>
    );
  }

  renderCombatStatuses(): JSX.Element {
    return (
      <span>
        {this.props.message.combatEvent.statuses.map(
          (eventStatus): string => `${eventStatus.action ? '-' : '+'}${eventStatus.name} | `
        )}
      </span>
    );
  }

  renderCombatErrors(): JSX.Element {
    return <span>{this.props.message.combatEvent.errors.map((error): string => `${error.msg} | `)}</span>;
  }

  renderConsoleText(): JSX.Element {
    return <span>{this.props.message.consoleText}</span>;
  }

  renderAnnouncementText(): JSX.Element {
    return <span>{this.props.message.announcementText}</span>;
  }

  isStaff(): boolean {
    const cseflagsChild = (this.props.message.stanza.children as Stanza[]).find((child) => child.name === 'cseflags');
    return (cseflagsChild?.attrs?.cse ?? false) as boolean;
  }

  copyToClipboard(e: React.MouseEvent<HTMLDivElement>): void {
    const range = document.createRange();
    range.selectNode(e.currentTarget);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    const isCopySuccessful = document.execCommand('copy');
    if (isCopySuccessful) {
      this.props.dispatch(
        showToaster({
          content: {
            title: 'Message copied to clipboard',
            message: e.currentTarget.innerText
          }
        })
      );
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    damageTypes: state.gameDefs.damageTypes,
    ...ownProps
  };
};

export const ChatMessage = connect(mapStateToProps)(AChat);
