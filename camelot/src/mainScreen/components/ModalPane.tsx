/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { CSSKey, getCSSVariable } from '../MainScreen-Styles-Variables';
import { hideModal, ModalParams } from '../redux/modalsSlice';
import { RootState } from '../redux/store';
import { FooterButtonData } from './menu/menuData';
import { Menu } from './menu/Menu';

// Styles.
const Root = 'HUD-ModalPane-Root';
const PreviousWrapper = 'HUD-ModalPane-PreviousModalWrapper';
const CurrentWrapper = 'HUD-ModalPane-CurrentModalWrapper';
const MessageText = 'HUD-ModalPane-MessageText';

interface State {
  shouldShow: boolean;
  // Stash the displayed modals so we can animate between modals if multiple are queued.
  currentModal: ModalParams | null;
  prevModal: ModalParams | null;
}

interface ReactProps {}

interface InjectedProps {
  modals: ModalParams[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ModalPane extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      shouldShow: false,
      currentModal: null,
      prevModal: null
    };
  }

  public render(): React.ReactNode {
    const modalClass = this.state.shouldShow ? 'show' : '';
    return (
      <div className={`${Root} ${modalClass}`}>
        <div className={PreviousWrapper} key={`Prev${this.state.prevModal?.id ?? 'None'}`}>
          {this.renderModal(this.state.prevModal && { ...this.state.prevModal, escapable: false })}
        </div>
        <div className={CurrentWrapper} key={`Curr${this.state.currentModal?.id ?? 'None'}`}>
          {this.renderModal(this.state.currentModal)}
        </div>
      </div>
    );
  }

  private renderModal(modal: ModalParams | null): React.ReactNode {
    if (!modal) {
      return null;
    }
    const getFooterButtons = (): FooterButtonData[] => {
      const footerButtons: FooterButtonData[] = [];
      if (modal.content.buttons) {
        for (const extraButton of modal.content.buttons) {
          footerButtons.push({
            onClick: extraButton.onClick,
            text: extraButton.text
          });
        }
      }
      return footerButtons;
    };
    const closeSelf = (): void => {
      modal.onClose?.();
      this.onEscape();
    };
    return (
      <>
        <Menu
          menuID={`modalPane-${modal.id}`}
          title={modal.content.title}
          closeSelf={closeSelf.bind(this)}
          escapable={modal.escapable}
          hideCloseButton={modal.hideCloseButton}
          getFooterButtons={getFooterButtons.bind(this)}
        >
          <>
            {modal.content.message && <div className={MessageText}>{modal.content.message}</div>}
            {modal.content.body}
          </>
        </Menu>
      </>
    );
  }

  private onEscape(): void {
    // Hiding the modal will
    this.props.dispatch(hideModal());
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If content of current modal has changed, update state
    if (
      this.props.modals[0] &&
      this.state.currentModal &&
      prevState.currentModal &&
      this.props.modals[0].id === this.state.currentModal.id &&
      this.props.modals[0].content !== prevState.currentModal.content
    ) {
      this.setState({ currentModal: { ...this.state.currentModal, content: this.props.modals[0].content } });
    }
    // If the current modal has changed, update state.
    if (this.props.modals[0]?.id != this.state.currentModal?.id) {
      this.setState({ currentModal: this.props.modals[0], prevModal: this.state.currentModal });
      if (this.props.modals.length > 0) {
        if (!this.state.shouldShow) {
          this.setState({ shouldShow: true });
        }
      } else {
        window.setTimeout(() => {
          this.setState({ shouldShow: false, prevModal: null });
        }, this.getFadeDurationMillis());
      }
    }
  }

  private getFadeDurationMillis(): number {
    // Get rid of anything non-numeric so we can convert safely.
    const stringDuration = getCSSVariable(CSSKey.ModalFadeDuration).replace(/[^0-9\.]+/g, '');
    const duration = +stringDuration * 1000;
    return duration;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { modals } = state.modals;

  return {
    ...ownProps,
    modals
  };
}

export default connect(mapStateToProps)(ModalPane);
