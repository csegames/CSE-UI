/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { hideModal, ModalButtonModel, ModalParams } from '../redux/modalsSlice';
import { RootState } from '../redux/store';
import { CSETransition } from './CSETransition';
import { BasicBorder } from './BasicBorder';
import { GenericButton } from './GenericButton';

// Styles.
const Root = 'ModalPane-Root';
const ModalRoot = 'ModalPane-ModalRoot';
const Veil = 'ModalPane-Veil';
const Wrapper = 'ModalPane-Wrapper';
const DefaultModalContainer = 'ModalPane-DefaultModalContainer';
const ContentRoot = 'ModalPane-ContentRoot';
const BodyRoot = 'ModalPane-BodyRoot';
const MessageText = 'ModalPane-MessageText';
const ButtonsSection = 'ModalPane-ButtonsSection';
const Button = 'ModalPane-Button';

interface State {
  shownModals: ModalParams[];
  exitingModals: ModalParams[];
}

interface ReactProps {}

interface InjectedProps {
  modals: ModalParams[];
}

type Props = ReactProps & InjectedProps;

class ModalPane extends React.Component<Props & DispatchProp, State> {
  constructor(props: Props & DispatchProp) {
    super(props);

    this.state = {
      shownModals: props.modals,
      exitingModals: []
    };
  }

  public render(): React.ReactNode {
    const shouldShow = this.props.modals.length + this.state.exitingModals.length > 0;

    // Weird quirk of React: it treats each .map() call as a separate hierarchy for DOM-replication purposes.
    // That means that if we want old modals to be reused, we have to combine these arrays and only use a
    // single .map() call, rather than mapping from each array sequentially.
    const modals = [...this.props.modals, ...this.state.exitingModals];

    return <div className={`${Root}${shouldShow ? ' show' : ''}`}>{modals.map(this.renderModal.bind(this))}</div>;
  }

  public static getDerivedStateFromProps(props: Props, state: State): State {
    if (props.modals !== state.shownModals) {
      // If the list of modals is shorter, we want to retain the exiting modals until they animate out.
      if (props.modals.length < state.shownModals.length) {
        const newExitingModals = state.shownModals.slice(props.modals.length);
        const exitingModals = [...newExitingModals, ...state.exitingModals];
        return { shownModals: props.modals, exitingModals };
      }

      return { shownModals: props.modals, exitingModals: state.exitingModals };
    }

    return state;
  }

  private buildWrapperStyle(params: ModalParams): React.CSSProperties {
    const style: React.CSSProperties = {};

    if ((params?.maxWidth?.length ?? 0) > 0) {
      style.maxWidth = params?.maxWidth;
    }

    return style;
  }

  private renderModal(modal: ModalParams | null, index: number): React.ReactNode {
    if (!modal) {
      return null;
    }

    const globalIndex = index + (this.state.exitingModals.includes(modal) ? this.props.modals.length : 0);

    // Show the veil if it is the top modal that should be shown right now.
    // You are that top modal only if you are the top modal in the stack from props.
    const isTopVeil = globalIndex === this.props.modals.length - 1;
    // The modal itself should show only if props wants it.
    const isRetained = globalIndex < this.props.modals.length;

    return (
      <div className={ModalRoot} key={`ModalRoot${modal.id}`}>
        <CSETransition show={isTopVeil} key={`Veil${modal.id}`}>
          <div className={Veil}></div>
        </CSETransition>
        <div className={Wrapper} style={this.buildWrapperStyle(modal)} key={`Wrapper${modal.id}`}>
          <CSETransition
            key={`Content${modal.id}`}
            show={isRetained}
            onExitComplete={() => {
              // Only an exiting modal will trigger this event.  Would love to fire them off individually,
              // but if multiple happen to finish exiting on the same frame, state won't update properly.
              // So instead we take the risk of some disappearing a fraction of a second early.
              this.state.exitingModals.forEach((params) => {
                params.onClose?.();
              });
              this.setState({ exitingModals: [] });
            }}
          >
            {this.renderModalContent(modal)}
          </CSETransition>
        </div>
      </div>
    );
  }

  private renderModalContent(modal: ModalParams): React.ReactNode {
    if (typeof modal.content === 'function') {
      return modal.content(modal);
    } else {
      const buttonModels =
        modal.content.buttons && modal.content.buttons.length > 0
          ? modal.content.buttons
          : this.getDefaultButtonModels();
      return (
        <BasicBorder className={DefaultModalContainer} key={`modalPane-${modal.id}`}>
          <div className={ContentRoot}>
            {modal.content.message && <div className={MessageText}>{modal.content.message}</div>}
            {modal.content.body && <div className={BodyRoot}>{modal.content.body}</div>}
            <div className={ButtonsSection}>
              {buttonModels.map((model, index) => {
                return (
                  <GenericButton
                    className={Button}
                    key={`FooterButton${index}`}
                    disabled={model.isDisabled}
                    onClick={model.onClick}
                  >
                    {model.text}
                  </GenericButton>
                );
              })}
            </div>
          </div>
        </BasicBorder>
      );
    }
  }

  private getDefaultButtonModels(): ModalButtonModel[] {
    return [
      {
        text: 'Okay',
        onClick: () => this.props.dispatch(hideModal())
      }
    ];
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
