/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import {
  EventAdvertisementPanelMessageData,
  setEventAdvertisementPanelModalMessage
} from '../../../redux/notificationsSlice';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { Overlay, navigateTo, showOverlay } from '../../../redux/navigationSlice';
import { updateSelectedChampion } from '../../../redux/championInfoSlice';
import { ChampionInfo } from '@csegames/library/dist/hordetest/graphql/schema';

const Container = 'Shared-EventAdvertisementPanel-Container';
const Slide = 'Shared-EventAdvertisementPanel-Slide';
const Shadow = 'Shared-EventAdvertisementPanel-Shadow';
const Text = 'Shared-EventAdvertisementPanel-Text';
const SecondaryText = 'Shared-EventAdvertisementPanel-SecondaryText';
const Time = 'Shared-EventAdvertisementPanel-Time';
const Dots = 'Shared-EventAdvertisementPanel-Dots';
const Dot = 'Shared-EventAdvertisementPanel-Dot';

interface ReactProps {}

interface InjectedProps {
  eventAdvertisementPanelMessagesData: EventAdvertisementPanelMessageData[];
  champions: ChampionInfo[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  currentMessageIndex: number;
}

class AEventAdvertisementPanel extends React.Component<Props, State> {
  private interval: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      currentMessageIndex: 0
    };
  }

  public render() {
    const currentMessage = this.props.eventAdvertisementPanelMessagesData[this.state.currentMessageIndex];
    if (!currentMessage) {
      // If there are no messages to display, we hide the container.
      // However, we still maintain the empty space for positioning purposes.
      return <div className={`${Container} hidden`} />;
    } else {
      return (
        <div className={Container}>
          {this.props.eventAdvertisementPanelMessagesData.map((message) => {
            const classNames = [Slide];
            if (message === currentMessage) {
              classNames.push('active');
            }
            if (message.champion || message.link || message.modal || message.lobbyView) {
              classNames.push('clickable');
            }
            return (
              <div
                style={{ backgroundImage: `url(${message.image})` }}
                className={classNames.join(' ')}
                key={message.id}
                onClick={() => {
                  if (message.link) {
                    clientAPI.openBrowser(message.link);
                  }
                  if (message.modal) {
                    this.props.dispatch(setEventAdvertisementPanelModalMessage(message));
                    this.props.dispatch(showOverlay(Overlay.EventAdvertisementModal));
                  }
                  if (message.lobbyView) {
                    this.props.dispatch(navigateTo(message.lobbyView));
                  }
                  if (message.champion) {
                    this.props.dispatch(
                      updateSelectedChampion(this.props.champions.find((champion) => champion.id === message.champion))
                    );
                  }
                }}
              >
                <div className={Shadow}>
                  <div className={Text}>{message.text}</div>
                  {message.secondaryText && <div className={SecondaryText}>{message.secondaryText}</div>}
                  {message.showTime && <div className={Time}>{message.time}</div>}
                </div>
              </div>
            );
          })}
          {this.props.eventAdvertisementPanelMessagesData.length > 1 && (
            <div className={Dots}>
              {this.props.eventAdvertisementPanelMessagesData.map((message, messageIndex) => (
                <div
                  className={message === currentMessage ? `${Dot} active` : Dot}
                  key={message.id}
                  onClick={() => {
                    this.startInterval();
                    this.setState({ currentMessageIndex: messageIndex });
                  }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
  }

  public componentDidMount(): void {
    this.startInterval();
  }

  public componentWillUnmount(): void {
    this.stopInterval();
  }

  public componentDidUpdate(): void {
    // Do not allow an out of bounds current slide index
    if (
      this.state.currentMessageIndex !== 0 &&
      this.state.currentMessageIndex >= this.props.eventAdvertisementPanelMessagesData.length
    ) {
      this.setState({ currentMessageIndex: 0 });
    }
  }

  private goToNextSlide(): void {
    if (this.props.eventAdvertisementPanelMessagesData.length > 1) {
      this.setState((state) => ({
        currentMessageIndex: (state.currentMessageIndex + 1) % this.props.eventAdvertisementPanelMessagesData.length
      }));
    }
  }

  private startInterval(): void {
    this.stopInterval();
    this.interval = window.setInterval(this.goToNextSlide.bind(this), 10000);
  }

  private stopInterval(): void {
    if (this.interval) {
      window.clearInterval(this.interval);
      this.interval = null;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { eventAdvertisementPanelMessagesData } = state.notifications;
  const { champions } = state.championInfo;
  return { ...ownProps, eventAdvertisementPanelMessagesData, champions };
}

export const EventAdvertisementPanel = connect(mapStateToProps)(AEventAdvertisementPanel);
